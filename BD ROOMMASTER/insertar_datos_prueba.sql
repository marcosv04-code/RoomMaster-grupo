-- ============================================
-- DATOS DE PRUEBA PARA ROOMMASTER
-- Inserta habitaciones y usuarios de ejemplo
-- ============================================

USE roommaster_db;

-- 0. LIMPIAR DATOS PREVIOS (OPCIONAL)
-- ============================================
-- Descomenta estas líneas si necesitas empezar de cero
DELETE FROM habitaciones WHERE numero_habitacion IN ('101', '102', '103', '104', '201', '202', '203', '204', '301', '302', '303', '304', '401', '402', '403');
DELETE FROM usuarios WHERE email IN ('admin@roommaster.com', 'juan@roommaster.com', 'carlos@roommaster.com');

-- 1. INSERTAR USUARIOS DE PRUEBA
-- ============================================

INSERT INTO usuarios (nombre, email, contraseña, rol, telefono, hotel, estado) VALUES
('Admin RoomMaster', 'admin@roommaster.com', 'admin123456', 'admin', '3001234567', 'Hotel RoomMaster', 'activo'),
('Recepcionista Juan', 'juan@roommaster.com', 'juan123456', 'recepcionista', '3007654321', 'Hotel RoomMaster', 'activo'),
('Gerente Carlos', 'carlos@roommaster.com', 'carlos123456', 'gerente', '3009876543', 'Hotel RoomMaster', 'activo');


-- 2. INSERTAR HABITACIONES DE PRUEBA
-- ============================================

INSERT INTO habitaciones (numero_habitacion, piso, tipo, capacidad, precio_noche, amenidades, estado, descripcion) VALUES
-- Piso 1
('101', 1, 'Simple', 1, 80000, 'TV, Baño privado, WiFi', 'disponible', 'Habitación pequeña con cama individual'),
('102', 1, 'Doble', 2, 120000, 'TV, Aire acondicionado, WiFi, Minibar', 'disponible', 'Habitación confortable con cama doble'),
('103', 1, 'Suite', 4, 200000, 'TV 4K, Aire acondicionado, WiFi, Minibar, Jacuzzi', 'disponible', 'Suite lujosa con dos habitaciones'),
('104', 1, 'Simple', 1, 80000, 'TV, Baño privado, WiFi', 'ocupada', 'Habitación disponible'),

-- Piso 2
('201', 2, 'Doble', 2, 120000, 'TV, Aire acondicionado, WiFi', 'disponible', 'Vista a la calle'),
('202', 2, 'Suite', 4, 200000, 'TV 4K, Aire acondicionado, WiFi, Jacuzzi', 'disponible', 'Suite con vista al parque'),
('203', 2, 'Doble', 2, 120000, 'TV, Aire acondicionado, WiFi', 'mantenimiento', 'En reparación de aire acondicionado'),
('204', 2, 'Simple', 1, 80000, 'TV, Baño privado', 'disponible', 'Habitación económica'),

-- Piso 3
('301', 3, 'Suite', 6, 300000, 'TV 4K, Aire acondicionado, WiFi, Minibar, Jacuzzi, Salón', 'disponible', 'Suite presidencial'),
('302', 3, 'Doble', 2, 120000, 'TV, Aire acondicionado, WiFi, Minibar', 'disponible', 'Habitación estándar'),
('303', 3, 'Simple', 1, 80000, 'TV, Baño privado', 'disponible', 'Habitación económica'),
('304', 3, 'Doble', 2, 120000, 'TV, Aire acondicionado, WiFi', 'disponible', 'Habitación estándar'),

-- Piso 4
('401', 4, 'Suite', 4, 200000, 'TV 4K, Aire acondicionado, WiFi, Minibar', 'disponible', 'Suite Premium'),
('402', 4, 'Doble', 2, 120000, 'TV, Aire acondicionado, WiFi', 'disponible', 'Habitación confortable'),
('403', 4, 'Simple', 1, 80000, 'TV, WiFi', 'disponible', 'Habitación básica');


-- Verificar lo que se insertó
SELECT '=== USUARIOS INSERTADOS ===' as info;
SELECT id, nombre, email, rol FROM usuarios WHERE estado = 'activo';

SELECT '=== HABITACIONES INSERTADAS ===' as info;
SELECT id, numero_habitacion, piso, tipo, precio_noche, estado FROM habitaciones WHERE activa = TRUE ORDER BY piso, numero_habitacion;

SELECT CONCAT('Total de habitaciones: ', COUNT(*)) as total FROM habitaciones WHERE activa = TRUE;
