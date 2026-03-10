<?php
/**
 * ============================================
 * ENDPOINT DE REGISTRO
 * POST /backend/register.php
 * ============================================
 */

header('Content-Type: application/json; charset=utf-8');

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'POST') {
    try {
        $datos = obtenerDatos();
        
        // Validar campos
        $error = validarCampos($datos, ['nombre', 'email', 'telefono', 'hotel', 'contraseña', 'rol']);
        if ($error) {
            responder(false, $error, null, 400);
        }
        
        $nombre = escapar($conexion, $datos['nombre']);
        $email = escapar($conexion, $datos['email']);
        $telefono = escapar($conexion, $datos['telefono']);
        $hotel = escapar($conexion, $datos['hotel']);
        $contraseña = escapar($conexion, $datos['contraseña']);
        $rol = escapar($conexion, $datos['rol']);
        
        // Verificar que el email no exista
        $sql = "SELECT id FROM usuarios WHERE email = '$email'";
        $resultado = $conexion->query($sql);
        
        if (!$resultado) {
            responder(false, 'Error en consulta: ' . $conexion->error, null, 500);
        }
        
        if ($resultado->num_rows > 0) {
            responder(false, 'El email ya está registrado', null, 400);
        }
        
        // Crear nuevo usuario
        $sql = "INSERT INTO usuarios (nombre, email, contraseña, telefono, hotel, rol, estado) 
                VALUES ('$nombre', '$email', '$contraseña', '$telefono', '$hotel', '$rol', 'activo')";
        
        if (!$conexion->query($sql)) {
            responder(false, 'Error al crear usuario: ' . $conexion->error, null, 500);
        }
        
        // Obtener datos del usuario creado
        $sql = "SELECT id, nombre, email, telefono, hotel, rol FROM usuarios WHERE email = '$email'";
        $resultado = $conexion->query($sql);
        
        if (!$resultado || $resultado->num_rows === 0) {
            responder(false, 'Error al obtener datos del usuario', null, 500);
        }
        
        $usuario = $resultado->fetch_assoc();
        $token = bin2hex(random_bytes(32));
        
        responder(true, 'Registro exitoso', [
            'token' => $token,
            'id' => $usuario['id'],
            'nombre' => $usuario['nombre'],
            'email' => $usuario['email'],
            'telefono' => $usuario['telefono'],
            'hotel' => $usuario['hotel'],
            'rol' => $usuario['rol']
        ]);
    } catch (Exception $e) {
        responder(false, 'Error del servidor: ' . $e->getMessage(), null, 500);
    }
} else {
    responder(false, 'Método no permitido', null, 405);
}

?>
