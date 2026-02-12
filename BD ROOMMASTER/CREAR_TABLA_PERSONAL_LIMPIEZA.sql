-- ============================================
-- TABLA DE PERSONAL DE LIMPIEZA
-- Personal encargado de la limpieza del hotel
-- ============================================

CREATE TABLE IF NOT EXISTS personal_limpieza (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  documento_identidad VARCHAR(50),
  turno VARCHAR(20) DEFAULT 'Diurno', -- 'Diurno', 'Nocturno', 'Mixto'
  estado VARCHAR(20) DEFAULT 'activo', -- 'activo', 'inactivo'
  fecha_contratacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar personal de limpieza de ejemplo
INSERT INTO personal_limpieza (nombre, email, telefono, documento_identidad, turno, estado) VALUES
('Rosa María Pérez', 'rosa@roommaster.com', '3001234567', '1234567890', 'Diurno', 'activo');
