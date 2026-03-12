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
require_once 'permissions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener información de usuario(s)
if ($metodo === 'GET') {
    $id = $datos['id'] ?? null;
    
    if ($id) {
        // Obtener un usuario específico
        $id = intval($id);
        $sql = "SELECT id, nombre, email, telefono, rol, hotel, estado, contraseña, fecha_creacion FROM usuarios WHERE id = $id";
        
        $resultado = ejecutarConsulta($conexion, $sql);
        
        if (isset($resultado['error']) || empty($resultado)) {
            responder(false, 'Usuario no encontrado', null, 404);
        }
        
        responder(true, 'Usuario obtenido', $resultado[0]);
    } else {
        // Obtener todos los usuarios
        $sql = "SELECT id, nombre, email, telefono, hotel, rol, estado, contraseña, fecha_creacion FROM usuarios WHERE rol != 'admin' ORDER BY nombre ASC";
        
        $resultado = ejecutarConsulta($conexion, $sql);
        
        if (isset($resultado['error'])) {
            responder(false, 'Error al obtener usuarios', null, 500);
        }
        
        responder(true, 'Usuarios obtenidos', $resultado ?? []);
    }
}

// PUT - Actualizar contraseña o nombre de usuario
else if ($metodo === 'PUT') {
    $user_id = $datos['user_id'] ?? null;
    $rol = strtolower(trim($datos['rol'] ?? $_POST['rol'] ?? $_GET['rol'] ?? 'usuario'));
    $requesting_user_id = $datos['requesting_user_id'] ?? null;
    
    if (!$user_id) {
        responder(false, 'Usuario no especificado', null, 400);
    }
    
    // Validar que el usuario pueda hacer cambios
    // Solo puede cambiar su propia info, O ser admin para cambiar otra info
    if ($user_id !== $requesting_user_id && $rol !== 'admin') {
        responder(false, 'No puedes modificar datos de otros usuarios', null, 403);
    }
    
    // Si no es su propia info, requiere permisos admin
    if ($user_id !== $requesting_user_id) {
        verificarPermisoOAbortar('USUARIOS_MANAGE', $rol);
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
    // Solo admin puede cambiar contraseñas
    $contraseña_actual = $datos['contraseña_actual'] ?? '';
    $contraseña_nueva = $datos['contraseña_nueva'] ?? '';
    
    if ($contraseña_actual && $contraseña_nueva) {
        // Validar que solo admin pueda cambiar contraseña
        verificarPermisoOAbortar('USUARIOS_MANAGE', $rol);
        
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

// PATCH - Actualizar estado de usuario
else if ($metodo === 'PATCH') {
    $rol = strtolower(trim($datos['rol'] ?? $_POST['rol'] ?? $_GET['rol'] ?? 'usuario'));
    verificarPermisoOAbortar('USUARIOS_MANAGE', $rol);
    
    $user_id = $datos['user_id'] ?? null;
    $estado = $datos['estado'] ?? null;
    
    if (!$user_id || !$estado) {
        responder(false, 'Usuario o estado no especificado', null, 400);
    }
    
    // Validar que estado sea válido
    if (!in_array($estado, ['activo', 'inactivo'])) {
        responder(false, 'Estado inválido. Debe ser activo o inactivo', null, 400);
    }
    
    $user_id = intval($user_id);
    $estado = $conexion->real_escape_string($estado);
    
    // No permitir desactivar al admin
    $sql_check = "SELECT rol FROM usuarios WHERE id = $user_id";
    $resultado_check = $conexion->query($sql_check);
    
    if (!$resultado_check || $resultado_check->num_rows === 0) {
        responder(false, 'Usuario no encontrado', null, 404);
    }
    
    $usuario = $resultado_check->fetch_assoc();
    if ($usuario['rol'] === 'admin' && $estado === 'inactivo') {
        responder(false, 'No se puede desactivar la cuenta de administrador', null, 403);
    }
    
    // Actualizar estado
    $sql = "UPDATE usuarios SET estado = '$estado' WHERE id = $user_id";
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, 'Error al actualizar estado', null, 500);
    }
    
    responder(true, 'Estado actualizdo exitosamente', null);
}

// DELETE - Eliminar un usuario
else if ($metodo === 'DELETE') {
    $rol = strtolower(trim($datos['rol'] ?? $_POST['rol'] ?? $_GET['rol'] ?? 'usuario'));
    verificarPermisoOAbortar('USUARIOS_MANAGE', $rol);
    
    $id = $datos['id'] ?? null;
    
    if (!$id) {
        responder(false, 'Usuario no especificado', null, 400);
    }
    
    $id = intval($id);
    
    // No permitir eliminar al admin
    $sql_check = "SELECT rol FROM usuarios WHERE id = $id";
    $resultado_check = $conexion->query($sql_check);
    
    if (!$resultado_check || $resultado_check->num_rows === 0) {
        responder(false, 'Usuario no encontrado', null, 404);
    }
    
    $usuario = $resultado_check->fetch_assoc();
    if ($usuario['rol'] === 'admin') {
        responder(false, 'No se puede eliminar la cuenta de administrador', null, 403);
    }
    
    // Eliminar el usuario
    $sql = "DELETE FROM usuarios WHERE id = $id";
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, 'Error al eliminar usuario', null, 500);
    }
    
    responder(true, 'Usuario eliminado exitosamente', null);
}
else {
    responder(false, 'Método no permitido', null, 405);
}

?>
