<?php
/**
 * ============================================
 * ENDPOINT DE PERSONAL DE LIMPIEZA
 * GET, POST, PUT, DELETE /backend/personal_limpieza.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener personal de limpieza
if ($metodo === 'GET') {
    $estado = $datos['estado'] ?? null;
    
    $sql = "SELECT id, nombre, email, telefono, documento_identidad, turno, estado, fecha_contratacion 
            FROM personal_limpieza 
            WHERE 1=1";
    
    if ($estado) {
        $estado = escapar($conexion, $estado);
        $sql .= " AND estado = '$estado'";
    }
    
    $sql .= " ORDER BY nombre ASC";
    
    $resultado = ejecutarConsulta($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Personal obtenido', $resultado);
}

// POST - Crear personal de limpieza
else if ($metodo === 'POST') {
    $error = validarCampos($datos, ['nombre', 'email', 'telefono']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $nombre = escapar($conexion, $datos['nombre']);
    $email = escapar($conexion, $datos['email']);
    $telefono = escapar($conexion, $datos['telefono']);
    $documento = escapar($conexion, $datos['documento_identidad'] ?? '');
    $turno = escapar($conexion, $datos['turno'] ?? 'Diurno');
    $estado = escapar($conexion, $datos['estado'] ?? 'activo');
    
    // Verificar que el email no exista
    $verificar = $conexion->query("SELECT id FROM personal_limpieza WHERE email = '$email'");
    if ($verificar && $verificar->num_rows > 0) {
        responder(false, 'El email ya está registrado', null, 400);
    }
    
    $sql = "INSERT INTO personal_limpieza (nombre, email, telefono, documento_identidad, turno, estado) 
            VALUES ('$nombre', '$email', '$telefono', '$documento', '$turno', '$estado')";
    
    $resultado = $conexion->query($sql);
    
    if (!$resultado) {
        responder(false, 'Error al crear personal: ' . $conexion->error, null, 500);
    }
    
    $id_nuevo = $conexion->insert_id;
    responder(true, 'Personal creado exitosamente', ['id' => $id_nuevo], 201);
}

// PUT - Actualizar personal de limpieza
else if ($metodo === 'PUT') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    $campos = [];
    
    if (isset($datos['nombre'])) {
        $campos[] = "nombre = '" . escapar($conexion, $datos['nombre']) . "'";
    }
    if (isset($datos['email'])) {
        $campos[] = "email = '" . escapar($conexion, $datos['email']) . "'";
    }
    if (isset($datos['telefono'])) {
        $campos[] = "telefono = '" . escapar($conexion, $datos['telefono']) . "'";
    }
    if (isset($datos['turno'])) {
        $campos[] = "turno = '" . escapar($conexion, $datos['turno']) . "'";
    }
    if (isset($datos['estado'])) {
        $campos[] = "estado = '" . escapar($conexion, $datos['estado']) . "'";
    }
    
    if (empty($campos)) {
        responder(false, 'No hay campos para actualizar', null, 400);
    }
    
    $sql = "UPDATE personal_limpieza SET " . implode(', ', $campos) . " WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 400);
    }
    
    responder(true, 'Personal actualizado exitosamente', null);
}

// DELETE - Eliminar personal de limpieza
else if ($metodo === 'DELETE') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    
    $sql = "DELETE FROM personal_limpieza WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 400);
    }
    
    responder(true, 'Personal eliminado exitosamente', null);
}

else {
    responder(false, 'Método no permitido', null, 405);
}
