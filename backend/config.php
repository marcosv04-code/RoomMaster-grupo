<?php
/**
 * ============================================
 * CONFIGURACIÓN DE CONEXIÓN A LA BASE DE DATOS
 * Backend RoomMaster
 * ============================================
 */

// Datos de conexión (CAMBIAR SEGÚN TU CONFIGURACIÓN)
define('DB_HOST', 'localhost');      // Servidor
define('DB_USER', 'root');           // Usuario MySQL
define('DB_PASS', '');               // Contraseña (vacío por defecto en XAMPP)
define('DB_NAME', 'roommaster_db');  // Nombre de la BD

// Crear conexión
$conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexión
if ($conexion->connect_error) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'mensaje' => 'Error de conexión a la base de datos: ' . $conexion->connect_error
    ]));
}

// Configurar charset UTF-8
$conexion->set_charset("utf8");

// Configurar modo error SQL
$conexion->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;

?>
