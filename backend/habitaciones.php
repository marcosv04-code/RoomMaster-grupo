<?php
/**
 * ============================================
 * ENDPOINT DE HABITACIONES
 * GET, POST, PUT, DELETE /backend/habitaciones.php
 * ============================================\n */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';
require_once 'permissions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener habitaciones
if ($metodo === 'GET') {
    $estado = $datos['estado'] ?? null;
    
    $sql = "SELECT id, numero_habitacion, piso, tipo, capacidad, precio_noche, amenidades, estado 
            FROM habitaciones 
            WHERE activa = TRUE";
    
    if ($estado) {
        $estado = escapar($conexion, $estado);
        $sql .= " AND estado = '$estado'";
    }
    
    $sql .= " ORDER BY numero_habitacion ASC";
    
    $resultado = ejecutarConsulta($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Habitaciones obtenidas', $resultado);
}

// POST - Crear habitación
else if ($metodo === 'POST') {
    $rol = strtolower(trim($datos['rol'] ?? $_POST['rol'] ?? $_GET['rol'] ?? 'usuario'));
    verificarPermisoOAbortar('HABITACIONES_CREATE', $rol);
    
    $error = validarCampos($datos, ['numero_habitacion', 'tipo', 'capacidad', 'precio_noche']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $numero_habitacion = escapar($conexion, $datos['numero_habitacion']);
    
    // Verificar si ya existe una habitación con ese número
    $sql_check = "SELECT id FROM habitaciones WHERE numero_habitacion = '$numero_habitacion' AND activa = TRUE";
    $resultado_check = $conexion->query($sql_check);
    
    if ($resultado_check && $resultado_check->num_rows > 0) {
        responder(false, 'Ya existe una habitación con ese número', null, 400);
    }
    
    $piso = intval($datos['piso'] ?? 1);
    $tipo = escapar($conexion, $datos['tipo']);
    $capacidad = intval($datos['capacidad']);
    $precio_noche = floatval($datos['precio_noche']);
    $amenidades = escapar($conexion, $datos['amenidades'] ?? '');
    $descripcion = escapar($conexion, $datos['descripcion'] ?? '');
    $estado = escapar($conexion, $datos['estado'] ?? 'disponible');
    
    $sql = "INSERT INTO habitaciones (numero_habitacion, piso, tipo, capacidad, precio_noche, amenidades, descripcion, estado) 
            VALUES ('$numero_habitacion', $piso, '$tipo', $capacidad, $precio_noche, '$amenidades', '$descripcion', '$estado')";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 400);
    }
    
    responder(true, 'Habitación creada', ['id' => $resultado['id']]);
}

// PUT - Actualizar habitación
else if ($metodo === 'PUT') {
    $rol = strtolower(trim($datos['rol'] ?? $_POST['rol'] ?? $_GET['rol'] ?? 'usuario'));
    verificarPermisoOAbortar('HABITACIONES_EDIT', $rol);
    
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    $campos = [];
    
    if (isset($datos['numero_habitacion'])) {
        $campos[] = "numero_habitacion = '" . escapar($conexion, $datos['numero_habitacion']) . "'";
    }
    if (isset($datos['tipo'])) {
        $campos[] = "tipo = '" . escapar($conexion, $datos['tipo']) . "'";
    }
    if (isset($datos['capacidad'])) {
        $campos[] = "capacidad = " . intval($datos['capacidad']);
    }
    if (isset($datos['precio_noche'])) {
        $campos[] = "precio_noche = " . floatval($datos['precio_noche']);
    }
    if (isset($datos['estado'])) {
        $campos[] = "estado = '" . escapar($conexion, $datos['estado']) . "'";
    }
    if (isset($datos['amenidades'])) {
        $campos[] = "amenidades = '" . escapar($conexion, $datos['amenidades']) . "'";
    }
    
    if (empty($campos)) {
        responder(false, 'No hay campos para actualizar', null, 400);
    }
    
    $sql = "UPDATE habitaciones SET " . implode(', ', $campos) . ", fecha_creacion = CURRENT_TIMESTAMP WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 400);
    }
    
    responder(true, 'Habitación actualizada', null);
}

// DELETE - Eliminar habitación
else if ($metodo === 'DELETE') {
    $rol = strtolower(trim($datos['rol'] ?? $_POST['rol'] ?? $_GET['rol'] ?? 'usuario'));
    verificarPermisoOAbortar('HABITACIONES_DELETE', $rol);
    
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    
    $sql = "UPDATE habitaciones SET activa = FALSE WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 400);
    }
    
    responder(true, 'Habitación eliminada', null);
}

else {
    responder(false, 'Método no permitido', null, 405);
}
