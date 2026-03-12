<?php
/**
 * ============================================
 * ENDPOINT DE RECUPERACIÓN DE CONTRASEÑA
 * POST /backend/recuperar_contrasena.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// POST - Recuperar contraseña
if ($metodo === 'POST') {
    // Paso 1: Verificar email y teléfono
    if (isset($datos['paso']) && $datos['paso'] === 1) {
        $error = validarCampos($datos, ['email', 'telefono']);
        if ($error) {
            responder(false, $error, null, 400);
        }
        
        $email = escapar($conexion, $datos['email']);
        $telefono = escapar($conexion, $datos['telefono']);
        
        // Buscar usuario con email y teléfono coincidentes
        $sql = "SELECT id, nombre, email, telefono FROM usuarios WHERE email = '$email' AND telefono = '$telefono'";
        $resultado = $conexion->query($sql);
        
        if (!$resultado || $resultado->num_rows === 0) {
            responder(false, 'Email o teléfono no coinciden con ningún usuario', null, 400);
        }
        
        $usuario = $resultado->fetch_assoc();
        responder(true, 'Verificación exitosa', [
            'usuario_id' => $usuario['id'],
            'nombre' => $usuario['nombre'],
            'email' => $usuario['email'],
            'telefono' => $usuario['telefono']
        ]);
    }
    
    // Paso 2: Cambiar contraseña
    else if (isset($datos['paso']) && $datos['paso'] === 2) {
        $error = validarCampos($datos, ['usuario_id', 'nueva_contrasena']);
        if ($error) {
            responder(false, $error, null, 400);
        }
        
        $usuario_id = intval($datos['usuario_id']);
        $nueva_contrasena = escapar($conexion, $datos['nueva_contrasena']);
        
        // Validar contraseña
        if (strlen($datos['nueva_contrasena']) < 6) {
            responder(false, 'La contraseña debe tener al menos 6 caracteres', null, 400);
        }
        
        // Actualizar contraseña
        $sql = "UPDATE usuarios SET contraseña = '$nueva_contrasena' WHERE id = $usuario_id";
        $resultado = ejecutarAccion($conexion, $sql);
        
        if (isset($resultado['error'])) {
            responder(false, 'Error al cambiar la contraseña', null, 500);
        }
        
        responder(true, 'Contraseña cambiada exitosamente');
    }
    
    else {
        responder(false, 'Paso no válido (debe ser 1 o 2)', null, 400);
    }
}

// OPTIONS - Para CORS
else if ($metodo === 'OPTIONS') {
    http_response_code(200);
    exit();
}

else {
    http_response_code(405);
    responder(false, 'Método no permitido', null, 405);
}
?>
