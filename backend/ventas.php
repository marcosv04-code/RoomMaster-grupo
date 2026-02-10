<?php
/**
 * ============================================
 * ENDPOINT DE VENTAS
 * GET, POST /backend/ventas.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener ventas
if ($metodo === 'GET') {
    $estadia_id = $datos['estadia_id'] ?? null;
    
    $sql = "SELECT v.*, p.nombre as producto_nombre FROM ventas v 
            INNER JOIN productos p ON v.producto_id = p.id";
    
    if ($estadia_id) {
        $estadia_id = intval($estadia_id);
        $sql .= " WHERE v.estadia_id = $estadia_id";
    }
    
    $sql .= " ORDER BY v.fecha_venta DESC";
    
    $resultado = ejecutarConsulta($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Ventas obtenidas', $resultado);
}

// POST - Registrar venta
else if ($metodo === 'POST') {
    $error = validarCampos($datos, ['estadia_id', 'producto_id', 'cantidad']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $estadia_id = intval($datos['estadia_id']);
    $producto_id = intval($datos['producto_id']);
    $cantidad = intval($datos['cantidad']);
    $factura_id = intval($datos['factura_id'] ?? 0);
    $huésped = escapar($conexion, $datos['huésped'] ?? '');
    
    // Obtener precio del producto
    $prod = $conexion->query("SELECT precio FROM productos WHERE id = $producto_id");
    $prod_fila = $prod->fetch_assoc();
    $precio_unitario = floatval($prod_fila['precio']);
    $subtotal = $precio_unitario * $cantidad;
    
    // Verificar stock
    $inv = $conexion->query("SELECT cantidad_actual FROM inventario WHERE producto_id = $producto_id");
    $inv_fila = $inv->fetch_assoc();
    
    if ($inv_fila['cantidad_actual'] < $cantidad) {
        responder(false, 'Stock insuficiente', null, 400);
    }
    
    // Registrar venta
    $factura_id_sql = $factura_id > 0 ? $factura_id : 'NULL';
    $sql = "INSERT INTO ventas (factura_id, estadia_id, producto_id, cantidad, precio_unitario, subtotal, huésped) 
            VALUES ($factura_id_sql, $estadia_id, $producto_id, $cantidad, $precio_unitario, $subtotal, '$huésped')";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    // Rebajar stock
    $sql_stock = "UPDATE inventario SET cantidad_actual = cantidad_actual - $cantidad WHERE producto_id = $producto_id";
    $conexion->query($sql_stock);
    
    responder(true, 'Venta registrada exitosamente', ['id' => $resultado['id']], 201);
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
