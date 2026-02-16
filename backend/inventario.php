<?php
/**
 * ============================================
 * ENDPOINT DE INVENTARIO
 * GET, POST, PUT, DELETE /backend/inventario.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener inventario
if ($metodo === 'GET') {
    $producto_id = $datos['producto_id'] ?? null;
    
    $sql = "SELECT i.id, i.producto_id, p.nombre as nombre_producto, p.categoria,
            i.cantidad_actual, i.cantidad_minima, i.cantidad_maxima, 
            i.ubicacion, i.ultimo_reabastecimiento
            FROM inventario i
            INNER JOIN productos p ON i.producto_id = p.id
            WHERE p.estado = 'activo'";
    
    if ($producto_id) {
        $producto_id = intval($producto_id);
        $sql .= " AND i.producto_id = $producto_id";
    }
    
    $sql .= " ORDER BY p.nombre ASC";
    
    $resultado = ejecutarConsulta($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Inventario obtenido', $resultado);
}

// POST - Crear registro de inventario
else if ($metodo === 'POST') {
    $error = validarCampos($datos, ['producto_id', 'cantidad_actual']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $producto_id = intval($datos['producto_id']);
    $cantidad_actual = intval($datos['cantidad_actual']);
    $cantidad_minima = intval($datos['cantidad_minima'] ?? 10);
    $cantidad_maxima = intval($datos['cantidad_maxima'] ?? 100);
    $ubicacion = escapar($conexion, $datos['ubicacion'] ?? 'Almacén general');
    
    // Verificar que el producto exista
    $verificar = $conexion->query("SELECT id FROM productos WHERE id = $producto_id");
    if (!$verificar || $verificar->num_rows === 0) {
        responder(false, 'Producto no encontrado', null, 400);
    }
    
    // Verificar que no exista inventario para este producto
    $verificar = $conexion->query("SELECT id FROM inventario WHERE producto_id = $producto_id");
    if ($verificar && $verificar->num_rows > 0) {
        responder(false, 'Ya existe inventario para este producto', null, 400);
    }
    
    $sql = "INSERT INTO inventario (producto_id, cantidad_actual, cantidad_minima, cantidad_maxima, ubicacion, ultimo_reabastecimiento)
            VALUES ($producto_id, $cantidad_actual, $cantidad_minima, $cantidad_maxima, '$ubicacion', NOW())";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Inventario creado', ['id' => $resultado['id']], 201);
}

// PUT - Actualizar inventario
else if ($metodo === 'PUT') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    $cantidad_actual = intval($datos['cantidad_actual'] ?? 0);
    $cantidad_minima = intval($datos['cantidad_minima'] ?? 10);
    $cantidad_maxima = intval($datos['cantidad_maxima'] ?? 100);
    $ubicacion = escapar($conexion, $datos['ubicacion'] ?? '');
    $accion = escapar($conexion, $datos['accion'] ?? ''); // 'agregar', 'restar', 'actualizar'
    
    // Obtener inventario actual
    $resultado_actual = $conexion->query("SELECT cantidad_actual FROM inventario WHERE id = $id");
    if (!$resultado_actual || $resultado_actual->num_rows === 0) {
        responder(false, 'Inventario no encontrado', null, 400);
    }
    
    $fila = $resultado_actual->fetch_assoc();
    $cantidad_anterior = $fila['cantidad_actual'];
    
    // Calcular nueva cantidad
    if ($accion === 'agregar') {
        $cantidad_actual = $cantidad_anterior + $cantidad_actual;
    } elseif ($accion === 'restar') {
        $cantidad_actual = $cantidad_anterior - $cantidad_actual;
        if ($cantidad_actual < 0) {
            responder(false, 'No hay suficiente stock', null, 400);
        }
    }
    // Si es 'actualizar', usar el valor directo
    
    $sql = "UPDATE inventario SET 
            cantidad_actual = $cantidad_actual,
            cantidad_minima = $cantidad_minima,
            cantidad_maxima = $cantidad_maxima";
    
    if (!empty($ubicacion)) {
        $sql .= ", ubicacion = '$ubicacion'";
    }
    
    $sql .= ", ultimo_reabastecimiento = NOW()
             WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Inventario actualizado');
}

// DELETE - Eliminar registro de inventario
else if ($metodo === 'DELETE') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    
    $sql = "DELETE FROM inventario WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Inventario eliminado');
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
