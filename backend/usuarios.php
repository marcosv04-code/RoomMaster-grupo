<?php
/**
 * ============================================
 * ENDPOINT DE USUARIOS
 * GET, PUT /backend/usuarios.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener información de usuario
if ($metodo === 'GET') {
    $id = $datos['id'] ?? null;
    
    if (!$id) {
        responder(false, 'Usuario no especificado', null, 400);
    }
    
    $id = intval($id);
    $sql = "SELECT id, nombre, email, rol, hotel, estado, fecha_creacion FROM usuarios WHERE id = $id";
    
    $resultado = ejecutarConsulta($conexion, $sql);
    
    if (isset($resultado['error']) || empty($resultado)) {
        responder(false, 'Usuario no encontrado', null, 404);
    }
    
    responder(true, 'Usuario obtenido', $resultado[0]);
}

// PUT - Actualizar contraseña o nombre de usuario
else if ($metodo === 'PUT') {
    $user_id = $datos['user_id'] ?? null;
    
    if (!$user_id) {
        responder(false, 'Usuario no especificado', null, 400);
    }
    
    $user_id = intval($user_id);
    
    // Actualizaciones simples (sin validación de contraseña actual)
    if (isset($datos['nombre'])) {
        $nombre = trim($datos['nombre']);
        
        if (empty($nombre) || strlen($nombre) < 2) {
            responder(false, 'El nombre debe tener al menos 2 caracteres', null, 400);
        }
        
        if (strlen($nombre) > 255) {
            responder(false, 'El nombre es demasiado largo', null, 400);
        }
        
        $nombre = $conexion->real_escape_string($nombre);
        $sql = "UPDATE usuarios SET nombre = '$nombre' WHERE id = $user_id";
        
        $resultado = ejecutarAccion($conexion, $sql);
        
        if (isset($resultado['error'])) {
            responder(false, 'Error al actualizar nombre', null, 500);
        }
        
        responder(true, 'Nombre actualizado exitosamente', null);
    }
    
    // Cambio de contraseña (requiere contraseña actual)
    $contraseña_actual = $datos['contraseña_actual'] ?? '';
    $contraseña_nueva = $datos['contraseña_nueva'] ?? '';
    
    if ($contraseña_actual && $contraseña_nueva) {
        if (!$contraseña_actual || !$contraseña_nueva) {
            responder(false, 'Faltan datos requeridos', null, 400);
        }
        
        // Verificar contraseña actual
        $sql_verify = "SELECT id FROM usuarios WHERE id = $user_id AND contraseña = '$contraseña_actual' AND estado = 'activo'";
        $resultado_verify = $conexion->query($sql_verify);
        
        if (!$resultado_verify || $resultado_verify->num_rows === 0) {
            responder(false, 'Contraseña actual incorrecta', null, 403);
        }
        
        // Validar longitud de nueva contraseña
        if (strlen($contraseña_nueva) < 6) {
            responder(false, 'La nueva contraseña debe tener al menos 6 caracteres', null, 400);
        }
        
        // Actualizar contraseña
        $sql = "UPDATE usuarios SET contraseña = '$contraseña_nueva' WHERE id = $user_id";
        
        $resultado = ejecutarAccion($conexion, $sql);
        
        if (isset($resultado['error'])) {
            responder(false, 'Error al actualizar contraseña', null, 500);
        }
        
        responder(true, 'Contraseña actualizada exitosamente', null);
    }
    
    responder(false, 'No se especificó qué actualizar', null, 400);
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
