<?php
/**
 * ============================================
 * ENDPOINT DE AUTENTICACIÓN
 * POST /backend/login.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'POST') {
    $datos = obtenerDatos();
    
    // Validar campos
    $error = validarCampos($datos, ['email', 'contraseña']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $email = escapar($conexion, $datos['email']);
    $contraseña = escapar($conexion, $datos['contraseña']);
    
    // Buscar usuario
    $sql = "SELECT id, nombre, email, rol, hotel FROM usuarios WHERE email = '$email' AND contraseña = '$contraseña' AND estado = 'activo'";
    $resultado = $conexion->query($sql);
    
    if ($resultado->num_rows > 0) {
        $usuario = $resultado->fetch_assoc();
        
        // Generar token simple (en producción usar JWT)
        $token = bin2hex(random_bytes(32));
        
        responder(true, 'Login exitoso', [
            'token' => $token,
            'usuario' => $usuario
        ]);
    } else {
        responder(false, 'Email o contraseña incorrectos', null, 401);
    }
} else {
    responder(false, 'Método no permitido', null, 405);
}

?>
