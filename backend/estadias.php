<?php
/**
 * ============================================
 * ENDPOINT DE ESTADÍAS
 * GET, POST, PUT /backend/estadias.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener estadías
if ($metodo === 'GET') {
    $estado = $datos['estado'] ?? null;
    
    $sql = "SELECT e.*, c.nombre as cliente_nombre, h.numero_habitacion FROM estadias e 
            INNER JOIN clientes c ON e.cliente_id = c.id 
            INNER JOIN habitaciones h ON e.habitacion_id = h.id";
    
    if ($estado) {
        $estado = escapar($conexion, $estado);
        $sql .= " WHERE e.estado = '$estado'";
    }
    
    $sql .= " ORDER BY e.fecha_entrada DESC";
    
    $resultado = ejecutarConsulta($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Estadías obtenidas', $resultado);
}

// POST - Crear estadía
else if ($metodo === 'POST') {
    $error = validarCampos($datos, ['cliente_id', 'habitacion_id', 'fecha_entrada', 'fecha_salida']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $cliente_id = intval($datos['cliente_id']);
    $habitacion_id = intval($datos['habitacion_id']);
    $fecha_entrada = escapar($conexion, $datos['fecha_entrada']);
    $fecha_salida = escapar($conexion, $datos['fecha_salida']);
    $numero_huespedes = intval($datos['numero_huespedes'] ?? 1);
    
    // Calcular noches
    $diff = strtotime($fecha_salida) - strtotime($fecha_entrada);
    $numero_noches = ceil($diff / (60 * 60 * 24));
    
    // Validar que la habitación esté disponible
    $verificar = $conexion->query("SELECT estado FROM habitaciones WHERE id = $habitacion_id");
    $hab = $verificar->fetch_assoc();
    
    if ($hab['estado'] === 'ocupada') {
        responder(false, 'La habitación sta ocupada', null, 400);
    }
    
    $sql = "INSERT INTO estadias (cliente_id, habitacion_id, fecha_entrada, fecha_salida, numero_huespedes, numero_noches, estado) 
            VALUES ($cliente_id, $habitacion_id, '$fecha_entrada', '$fecha_salida', $numero_huespedes, $numero_noches, 'activa')";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    // Marcar habitación como ocupada
    $sql_hab = "UPDATE habitaciones SET estado = 'ocupada' WHERE id = $habitacion_id";
    $conexion->query($sql_hab);
    
    responder(true, 'Estadía creada exitosamente', ['id' => $resultado['id']], 201);
}

// PUT - Actualizar estadía (finalizar)
else if ($metodo === 'PUT') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    $estado = escapar($conexion, $datos['estado'] ?? 'completada');
    $precio_total = floatval($datos['precio_total'] ?? 0);
    
    // Obtener info de la estadía
    $est = $conexion->query("SELECT habitacion_id FROM estadias WHERE id = $id");
    $est_fila = $est->fetch_assoc();
    $habitacion_id = $est_fila['habitacion_id'];
    
    $sql = "UPDATE estadias SET estado = '$estado'";
    
    if ($precio_total > 0) {
        $sql .= ", precio_total = $precio_total";
    }
    
    $sql .= " WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    // Si se completó, marcar habitación como disponible
    if ($estado === 'completada') {
        $sql_hab = "UPDATE habitaciones SET estado = 'disponible' WHERE id = $habitacion_id";
        $conexion->query($sql_hab);
    }
    
    responder(true, 'Estadía actualizada exitosamente');
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
