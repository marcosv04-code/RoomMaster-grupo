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
    
    $sql = "SELECT e.*, c.nombre as cliente_nombre, h.numero_habitacion, h.tipo as tipo_habitacion, h.precio_noche FROM estadias e 
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
    $notas = escapar($conexion, $datos['notas'] ?? '');
    $estado = escapar($conexion, $datos['estado'] ?? 'activa');
    
    // Calcular noches
    $diff = strtotime($fecha_salida) - strtotime($fecha_entrada);
    $numero_noches = ceil($diff / (60 * 60 * 24));
    
    if ($numero_noches <= 0) {
        responder(false, 'La fecha de salida debe ser posterior a la de entrada', null, 400);
    }
    
    // Validar que la habitación esté disponible
    $verificar = $conexion->query("SELECT estado, precio_noche FROM habitaciones WHERE id = $habitacion_id");
    $hab = $verificar->fetch_assoc();
    
    if (!$hab) {
        responder(false, 'La habitación no existe', null, 400);
    }
    
    if ($hab['estado'] === 'ocupada') {
        responder(false, 'La habitación está ocupada', null, 400);
    }
    
    // Calcular precio total
    $precio_total = $hab['precio_noche'] * $numero_noches;
    
    $sql = "INSERT INTO estadias (cliente_id, habitacion_id, fecha_entrada, fecha_salida, numero_huespedes, numero_noches, estado, notas, precio_total) 
            VALUES ($cliente_id, $habitacion_id, '$fecha_entrada', '$fecha_salida', $numero_huespedes, $numero_noches, '$estado', '$notas', $precio_total)";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    // Marcar habitación como ocupada si la estadía es activa
    if ($estado === 'activa') {
        $sql_hab = "UPDATE habitaciones SET estado = 'ocupada' WHERE id = $habitacion_id";
        $conexion->query($sql_hab);
    }
    
    responder(true, 'Estadía creada exitosamente', ['id' => $resultado['id']], 201);
}

// PUT - Actualizar estadía (finalizar o cambiar estado)
else if ($metodo === 'PUT') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    $campos = [];
    
    if (isset($datos['estado'])) {
        $campos[] = "estado = '" . escapar($conexion, $datos['estado']) . "'";
    }
    if (isset($datos['notas'])) {
        $campos[] = "notas = '" . escapar($conexion, $datos['notas']) . "'";
    }
    if (isset($datos['numero_huespedes'])) {
        $campos[] = "numero_huespedes = " . intval($datos['numero_huespedes']);
    }
    if (isset($datos['precio_total'])) {
        $campos[] = "precio_total = " . floatval($datos['precio_total']);
    }
    
    if (empty($campos)) {
        responder(false, 'No hay campos para actualizar', null, 400);
    }
    
    // Obtener info actual de la estadía
    $est = $conexion->query("SELECT habitacion_id, estado FROM estadias WHERE id = $id");
    $est_fila = $est->fetch_assoc();
    $habitacion_id = $est_fila['habitacion_id'];
    $estado_anterior = $est_fila['estado'];
    
    $sql = "UPDATE estadias SET " . implode(', ', $campos) . " WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    // Manejo del estado para actualizar disponibilidad de habitaciones
    $nuevo_estado = $datos['estado'] ?? $estado_anterior;
    
    if ($nuevo_estado === 'completada' && $estado_anterior === 'activa') {
        // Al completar, marcar habitación como disponible
        $sql_hab = "UPDATE habitaciones SET estado = 'disponible' WHERE id = $habitacion_id";
        $conexion->query($sql_hab);
    } else if ($nuevo_estado === 'activa' && $estado_anterior !== 'activa') {
        // Si vuelve a activa, marcar como ocupada
        $sql_hab = "UPDATE habitaciones SET estado = 'ocupada' WHERE id = $habitacion_id";
        $conexion->query($sql_hab);
    } else if ($nuevo_estado === 'cancelada' && $estado_anterior === 'activa') {
        // Si se cancela, marcar como disponible
        $sql_hab = "UPDATE habitaciones SET estado = 'disponible' WHERE id = $habitacion_id";
        $conexion->query($sql_hab);
    }
    
    responder(true, 'Estadía actualizada exitosamente');
}

// DELETE - Eliminar estadía
else if ($metodo === 'DELETE') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    
    // Obtener info de la estadía
    $est = $conexion->query("SELECT habitacion_id, estado FROM estadias WHERE id = $id");
    $est_fila = $est->fetch_assoc();
    
    if (!$est_fila) {
        responder(false, 'La estadía no existe', null, 404);
    }
    
    $habitacion_id = $est_fila['habitacion_id'];
    $estado = $est_fila['estado'];
    
    $sql = "DELETE FROM estadias WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    // Si la estadía era activa, marcar habitación como disponible
    if ($estado === 'activa') {
        $sql_hab = "UPDATE habitaciones SET estado = 'disponible' WHERE id = $habitacion_id";
        $conexion->query($sql_hab);
    }
    
    responder(true, 'Estadía eliminada exitosamente');
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
