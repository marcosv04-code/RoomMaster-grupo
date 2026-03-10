<?php
/**
 * ============================================
 * CONFIGURACIÓN DE CONEXIÓN A LA BASE DE DATOS
 * Backend RoomMaster
 * ============================================
 */

// Detectar el ambiente (LOCAL o PRODUCCIÓN)
$es_local = ($_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1' || strpos($_SERVER['HTTP_HOST'], 'localhost:') === 0);

if ($es_local) {
    // ===== CONFIGURACIÓN LOCAL (XAMPP) =====
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', '');                    // Vacío por defecto en XAMPP
    define('DB_NAME', 'roommaster_db');       // Del script SQL
} else {
    // ===== CONFIGURACIÓN HOSTINGER (PRODUCCIÓN) =====
    define('DB_HOST', 'localhost');
    define('DB_USER', 'u754245691_usr_90IMt5ZM');
    define('DB_PASS', 'RoomMaster2024!@');
    define('DB_NAME', 'u754245691_db_90IMt5ZM');
}

// Crear conexión
$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexión
if ($conexion->connect_error) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'mensaje' => 'Error de conexión a la base de datos: ' . $conexion->connect_error,
        'debug' => [
            'host' => DB_HOST,
            'user' => DB_USER,
            'database' => DB_NAME,
            'ambiente' => $es_local ? 'LOCAL (XAMPP)' : 'PRODUCCIÓN (Hostinger)'
        ]
    ]));
}

// Configurar charset UTF-8
$conexion->set_charset("utf8");

// NO usar report_mode para evitar excepciones no capturadas
// Si necesitas debugging, usa error_log() en su lugar
?>
