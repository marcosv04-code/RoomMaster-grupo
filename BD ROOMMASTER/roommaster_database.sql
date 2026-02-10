-- ============================================
-- BASE DE DATOS ROOMMASTER
-- Sistema de Gestión Hotelera - SENA
-- ============================================
-- Este script crea la base de datos y las tablas
-- para el sistema RoomMaster de forma sencilla y coherente
-- con el frontend en React + Vite


-- 1. CREAR LA BASE DE DATOS
-- ============================================
CREATE DATABASE IF NOT EXISTS roommaster_db;
USE roommaster_db;


-- 2. TABLA DE USUARIOS (Administradores y Personal)
-- ============================================
-- Almacena a todos los usuarios del hotel
-- Roles: admin, gerente, recepcionista
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contraseña VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL DEFAULT 'recepcionista', -- 'admin', 'gerente', 'recepcionista'
  telefono VARCHAR(20),
  hotel VARCHAR(100),
  estado VARCHAR(20) DEFAULT 'activo', -- 'activo', 'inactivo'
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 3. TABLA DE CLIENTES/HUÉSPEDES
-- ============================================
-- Información de los huéspedes que llegan al hotel
CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  documento_identidad VARCHAR(50),
  tipo_documento VARCHAR(20), -- 'cedula', 'pasaporte', 'nit'
  pais VARCHAR(50),
  ciudad VARCHAR(50),
  direccion VARCHAR(200),
  estado VARCHAR(20) DEFAULT 'activo',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- 4. TABLA DE HABITACIONES
-- ============================================
-- Registro de todas las habitaciones del hotel
-- Estados: disponible, ocupada, mantenimiento, limpieza
CREATE TABLE habitaciones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero_habitacion VARCHAR(20) UNIQUE NOT NULL, -- 101, 102, etc
  piso INT, -- piso del hotel
  tipo VARCHAR(50) NOT NULL, -- 'simple', 'doble', 'suite', 'deluxe'
  capacidad INT NOT NULL, -- número de personas que pueden dormir
  precio_noche DECIMAL(10, 2) NOT NULL, -- precio por noche
  amenidades VARCHAR(255), -- TV, AC, WiFi, etc
  estado VARCHAR(20) DEFAULT 'disponible', -- 'disponible', 'ocupada', 'mantenimiento', 'limpieza'
  descripcion TEXT,
  activa BOOLEAN DEFAULT TRUE,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- 5. TABLA DE ESTADÍAS (RESERVAS/HOSPEDAJES)
-- ============================================
-- Cada vez que alguien se hospeda en el hotel
-- se crea un registro aquí
CREATE TABLE estadias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT NOT NULL,
  habitacion_id INT NOT NULL,
  fecha_entrada DATE NOT NULL,
  fecha_salida DATE NOT NULL,
  numero_huespedes INT NOT NULL, -- cuántas personas en la habitación
  estado VARCHAR(20) DEFAULT 'activa', -- 'activa', 'completada', 'cancelada'
  notas TEXT,
  precio_total DECIMAL(10, 2), -- se calcula al finalizar
  numero_noches INT, -- se calcula automáticamente
  fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Relaciones (conectan con otras tablas)
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id) ON DELETE CASCADE
);


-- 6. TABLA DE FACTURAS
-- ============================================
-- Cada factura corresponde a un hospedaje
-- Formato de numeración: FAC-001, FAC-002, FAC-003, etc
CREATE TABLE facturas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero_factura VARCHAR(50) UNIQUE NOT NULL, -- FAC-001, FAC-002, etc
  estadia_id INT NOT NULL,
  cliente_id INT NOT NULL,
  fecha_factura DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_vencimiento DATE,
  
  -- Detalles del dinero
  subtotal DECIMAL(10, 2) NOT NULL,
  impuesto DECIMAL(10, 2) DEFAULT 0, -- IVA o similares
  descuento DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Control
  estado VARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'Pagada', 'Cancelada', 'Vencida'
  metodo_pago VARCHAR(50), -- 'efectivo', 'tarjeta', 'transferencia', 'cheque'
  descripcion TEXT,
  
  -- Auditoría
  usuario_id INT, -- quién creó la factura
  fecha_pago DATETIME,
  
  FOREIGN KEY (estadia_id) REFERENCES estadias(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);


-- 7. TABLA DE PRODUCTOS/SERVICIOS (TIENDA)
-- ============================================
-- Productos que vende el hotel: bebidas, comidas, servicios
-- Se pueden vender a los huéspedes durante su estadía
CREATE TABLE productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0, -- cantidad disponible
  categoria VARCHAR(50) NOT NULL, -- 'bebidas', 'comidas', 'servicios', 'amenities'
  codigo_producto VARCHAR(50), -- código interno del producto
  proveedor VARCHAR(100),
  
  -- Imágenes o referencias
  imagen_url VARCHAR(255),
  
  estado VARCHAR(20) DEFAULT 'activo', -- 'activo', 'inactivo', 'descontinuado'
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categoria (categoria)
);


-- 8. TABLA DE VENTAS (DETALLE DE PRODUCTOS VENDIDOS)
-- ============================================
-- Registro de cada venta individual de productos
-- Un cliente puede comprar varios productos en una estadía
CREATE TABLE ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  factura_id INT,
  estadia_id INT NOT NULL,
  producto_id INT NOT NULL,
  
  -- Información de la venta
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL, -- cantidad * precio_unitario
  
  -- Datos del huésped
  huésped VARCHAR(100), -- nombre quien compró
  notas TEXT,
  
  -- Auditoría
  fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT, -- quién registró la venta
  
  FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE SET NULL,
  FOREIGN KEY (estadia_id) REFERENCES estadias(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);


-- 9. TABLA DE INVENTARIO (CONTROL DE STOCK)
-- ============================================
-- Control de existencias de cada producto
-- Ayuda a saber cuándo reordenar
CREATE TABLE inventario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  producto_id INT NOT NULL UNIQUE,
  cantidad_actual INT NOT NULL DEFAULT 0,
  cantidad_minima INT DEFAULT 5, -- cantidad mínima antes de alertar
  cantidad_maxima INT DEFAULT 100, -- cantidad máxima a tener
  ubicacion VARCHAR(100), -- dónde está guardado (bodega, mostrador, etc)
  
  -- Auditoría
  ultimo_reabastecimiento DATETIME,
  próximo_reabastecimiento DATETIME,
  
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- 10. TABLA DE ACTIVIDADES/LOG (PARA REPORTES Y AUDITORÍA)
-- ============================================
-- Registro de todas las acciones importantes del sistema
-- Útil para generar reportes y estadísticas
CREATE TABLE actividades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tipo VARCHAR(50), -- 'entrada_huésped', 'salida_huésped', 'venta', 'factura', etc
  usuario_id INT,
  descripcion TEXT,
  tabla_afectada VARCHAR(50), -- qué tabla se modificó
  registro_id INT, -- ID del registro modificado
  datos_anteriores JSON, -- datos antes del cambio
  datos_nuevos JSON, -- datos después del cambio
  fecha_actividad DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_usuario VARCHAR(45)
);




-- Insertar un usuario administrador de ejemplo
INSERT INTO usuarios (nombre, email, contraseña, rol, telefono, hotel) VALUES
('Carlos Rodriguez', 'admin@roommaster.com', 'admin123', 'admin', '+57 (1) 555-0123', 'Hotel Grand Plaza'),
('María García', 'maria@roommaster.com', 'maria123', 'gerente', '+57 (1) 555-0124', 'Hotel Grand Plaza'),
('Juan López', 'juan@roommaster.com', 'juan123', 'recepcionista', '+57 (1) 555-0125', 'Hotel Grand Plaza');

-- Insertar clientes/huéspedes
INSERT INTO clientes (nombre, email, telefono, documento_identidad, tipo_documento, ciudad) VALUES
('Juan Pérez', 'juan@email.com', '3001234567', '1234567890', 'cedula', 'Bogotá'),
('María González', 'maria@email.com', '3001234568', '0987654321', 'cedula', 'Medellín'),
('Carlos López', 'carlos@email.com', '3001234569', '1111111111', 'cedula', 'Cali'),
('Ana Martínez', 'ana@email.com', '3001234570', '2222222222', 'cedula', 'Barranquilla');

-- Insertar habitaciones
INSERT INTO habitaciones (numero_habitacion, piso, tipo, capacidad, precio_noche, estado, amenidades) VALUES
('101', 1, 'simple', 1, 80.00, 'disponible', 'TV, AC, WiFi'),
('102', 1, 'doble', 2, 120.00, 'disponible', 'TV, AC, WiFi, Minibar'),
('103', 1, 'suite', 4, 200.00, 'disponible', 'TV, AC, WiFi, Minibar, Sala'),
('104', 2, 'deluxe', 3, 150.00, 'disponible', 'TV, AC, WiFi, Minibar, Jacuzzi'),
('105', 2, 'simple', 1, 80.00, 'ocupada', 'TV, AC, WiFi');

-- Insertar una estadía de ejemplo
INSERT INTO estadias (cliente_id, habitacion_id, fecha_entrada, fecha_salida, numero_huespedes, estado, numero_noches) VALUES
(1, 5, '2026-02-09', '2026-02-12', 1, 'activa', 3),
(2, 2, '2026-02-01', '2026-02-04', 2, 'completada', 3);

-- Insertar facturas (coinciden con el frontend: FAC-001, FAC-002, FAC-003)
INSERT INTO facturas (numero_factura, estadia_id, cliente_id, subtotal, impuesto, total, estado, metodo_pago) VALUES
('FAC-001', 2, 2, 400.00, 50.00, 450.00, 'Pagada', 'tarjeta'),
('FAC-002', 1, 1, 250.00, 70.00, 320.00, 'Pendiente', NULL),
('FAC-003', 2, 2, 280.00, 0, 280.00, 'Cancelada', 'efectivo');

-- Insertar productos para la tienda
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, codigo_producto) VALUES
('Café Expreso', 'Café recién hecho', 5.00, 50, 'bebidas', 'BEBA-001'),
('Agua Embotellada', 'Botella de 500ml', 2.00, 100, 'bebidas', 'BEBA-002'),
('Jugo Natural', 'Jugo de naranja', 6.00, 40, 'bebidas', 'BEBA-003'),
('Desayuno Continental', 'Desayuno completo', 15.00, 30, 'comidas', 'COM-001'),
('Almuerzo Ejecutivo', 'Almuerzo con proteína', 20.00, 25, 'comidas', 'COM-002'),
('Cena Especial', 'Cena a la carta', 35.00, 15, 'comidas', 'COM-003'),
('Limpieza Extra', 'Servicio de limpieza adicional', 25.00, 0, 'servicios', 'SERV-001'),
('Lavandería Express', 'Lavado de ropa en 2 horas', 30.00, 0, 'servicios', 'SERV-002');

-- Insertar inventario
INSERT INTO inventario (producto_id, cantidad_actual, cantidad_minima, ubicacion) VALUES
(1, 50, 10, 'Cocina - Cafetera'),
(2, 100, 20, 'Minibar Principal'),
(3, 40, 10, 'Cocina'),
(4, 30, 5, 'Comedor'),
(5, 25, 5, 'Comedor'),
(6, 15, 3, 'Cocina - Chef'),
(7, 0, 1, 'Servicios Generales'),
(8, 0, 1, 'Lavandería');

-- Insertar algunas ventas de ejemplo
INSERT INTO ventas (factura_id, estadia_id, producto_id, cantidad, precio_unitario, subtotal, huésped) VALUES
(1, 2, 1, 2, 5.00, 10.00, 'María González'),
(1, 2, 4, 1, 15.00, 15.00, 'María González'),
(2, 1, 2, 1, 2.00, 2.00, 'Juan Pérez'),
(3, 2, 3, 2, 6.00, 12.00, 'María González');


-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. AUTO_INCREMENT: Genera ID automáticamente (1, 2, 3...)
-- 2. PRIMARY KEY: Identifica de forma única cada registro
-- 3. FOREIGN KEY: Conecta tablas entre sí
-- 4. VARCHAR(20): Texto de hasta 20 caracteres
-- 5. INT: Números enteros
-- 6. DECIMAL(10,2): Números con 2 decimales
-- 7. DATE: Solo la fecha (sin hora)
-- 8. DATETIME: Fecha y hora completa
-- 9. DEFAULT: Valor que se usa si no se especifica otro
-- 10. UNIQUE: No puede haber dos registros iguales en ese campo
