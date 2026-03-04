-- =====================================================
-- SCRIPT DE DATOS INICIALES - RoomMaster en Hostinger
-- =====================================================
-- Ejecuta esto en phpMyAdmin DESPUÉS de importar roommaster_database.sql

-- 1. Insertar Usuario Admin
INSERT INTO usuarios (nombre, email, telefono, hotel, contraseña, rol, estado) 
VALUES ('Administrador', 'admin@roommaster.site', '3001234567', 'RoomMaster Hotel', 'admin123', 'admin', 'activo');

-- 2. Insertar un ejemplo de Recepcionista
INSERT INTO usuarios (nombre, email, telefono, hotel, contraseña, rol, estado) 
VALUES ('María García', 'maria@roommaster.site', '3009876543', 'RoomMaster - Centro', 'recep123', 'recepcion', 'activo');

-- 3. Insertar algunas habitaciones de ejemplo
INSERT INTO habitaciones (numero_habitacion, piso, tipo, capacidad, precio_noche, amenidades, estado) 
VALUES 
  ('101', 1, 'Simple', 1, 80000, 'WiFi, TV, AC', 'disponible'),
  ('102', 1, 'Doble', 2, 120000, 'WiFi, TV, AC, Minibar', 'disponible'),
  ('103', 1, 'Suite', 3, 180000, 'WiFi, TV, AC, Jacuzzi, Minibar', 'disponible'),
  ('201', 2, 'Doble', 2, 130000, 'WiFi, TV, AC, Balcón', 'disponible'),
  ('202', 2, 'Suite', 4, 200000, 'WiFi, TV, AC, Sala, Cocina', 'disponible');

-- 4. Insertar algunos clientes de ejemplo
INSERT INTO clientes (nombre, email, telefono, documento_identidad, tipo_documento, ciudad, estado) 
VALUES 
  ('Juan Pérez', 'juan@example.com', '3015551234', '12345678', 'cedula', 'Bogotá', 'activo'),
  ('Laura Rodríguez', 'laura@example.com', '3015555678', '87654321', 'cedula', 'Medellín', 'activo'),
  ('Carlos López', 'carlos@example.com', '3015559999', '11223344', 'pasaporte', 'New York', 'activo');

-- 5. Insertar algunos productos para la tienda
INSERT INTO productos (nombre, descripcion, precio, stock) 
VALUES 
  ('Agua Embotellada', 'Botella de 500ml', 5000, 50),
  ('Café Premium', 'Café gourmet 250g', 25000, 20),
  ('Té Variado', 'Caja de 20 sobres', 15000, 15),
  ('Snacks Mix', 'Mezcla de frutos secos', 18000, 30),
  ('Chocolate Artesanal', 'Barra 100g', 12000, 25);

-- 6. Verificar datos insertados
SELECT '=== USUARIOS ===' as info;
SELECT id, nombre, email, rol, estado FROM usuarios;

SELECT '=== HABITACIONES ===' as info;
SELECT numero_habitacion, tipo, capacidad, precio_noche, estado FROM habitaciones;

SELECT '=== CLIENTES ===' as info;
SELECT id, nombre, email, ciudad FROM clientes;

SELECT '=== PRODUCTOS ===' as info;
SELECT nombre, precio, stock FROM productos;

-- =====================================================
-- CREDENCIALES PARA LOGIN INICIAL:
-- Admin:
--   Email: admin@roommaster.site
--   Contraseña: admin123
-- 
-- Recepcionista:
--   Email: maria@roommaster.site
--   Contraseña: recep123
-- =====================================================
