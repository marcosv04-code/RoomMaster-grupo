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
require_once 'permissions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener ventas
if ($metodo === 'GET') {
    $estadia_id = $datos['estadia_id'] ?? null;
    
    $sql = "SELECT v.*, 
                   p.nombre as producto_nombre,
                   c.nombre as cliente_nombre,
                   e.cliente_id
            FROM ventas v 
            INNER JOIN productos p ON v.producto_id = p.id
            INNER JOIN estadias e ON v.estadia_id = e.id
            INNER JOIN clientes c ON e.cliente_id = c.id";
    
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
    $rol = strtolower(trim($datos['rol'] ?? $_POST['rol'] ?? $_GET['rol'] ?? 'usuario'));
    verificarPermisoOAbortar('TIENDA_CREATE', $rol);
    
    $error = validarCampos($datos, ['estadia_id', 'producto_id', 'cantidad']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $estadia_id = intval($datos['estadia_id']);
    $producto_id = intval($datos['producto_id']);
    $cantidad = intval($datos['cantidad']);
    $factura_id = intval($datos['factura_id'] ?? 0);
    
    // Obtener nombre del cliente desde la estadía
    $estadia_query = $conexion->query("SELECT e.cliente_id, c.nombre FROM estadias e 
                                       INNER JOIN clientes c ON e.cliente_id = c.id 
                                       WHERE e.id = $estadia_id");
    $estadia_fila = $estadia_query->fetch_assoc();
    
    if (!$estadia_fila) {
        responder(false, 'Estadía no encontrada', null, 404);
    }
    
    $cliente_nombre = escapar($conexion, $estadia_fila['nombre']);
    
    // Obtener precio del producto
    $prod = $conexion->query("SELECT precio, stock FROM productos WHERE id = $producto_id");
    $prod_fila = $prod->fetch_assoc();
    $precio_unitario = floatval($prod_fila['precio']);
    $subtotal = $precio_unitario * $cantidad;
    
    // Verificar stock - puede venir de inventario o de productos
    $inv = $conexion->query("SELECT cantidad_actual FROM inventario WHERE producto_id = $producto_id");
    $inv_fila = $inv->fetch_assoc();
    
    // Si existe en inventario usa eso, sino usa el stock de productos
    $stock_disponible = $inv_fila ? $inv_fila['cantidad_actual'] : $prod_fila['stock'];
    
    if ($stock_disponible < $cantidad) {
        responder(false, 'Stock insuficiente. Disponible: ' . $stock_disponible, null, 400);
    }
    
    // Registrar venta (el nombre del cliente se obtiene automáticamente)
    $factura_id_sql = $factura_id > 0 ? $factura_id : 'NULL';
    $sql = "INSERT INTO ventas (factura_id, estadia_id, producto_id, cantidad, precio_unitario, subtotal, huésped) 
            VALUES ($factura_id_sql, $estadia_id, $producto_id, $cantidad, $precio_unitario, $subtotal, '$cliente_nombre')";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    // Rebajar stock - en ambas tablas
    if ($inv_fila) {
        // Si existe en inventario, actualiza ahí
        $sql_stock = "UPDATE inventario SET cantidad_actual = cantidad_actual - $cantidad WHERE producto_id = $producto_id";
    } else {
        // Si no existe en inventario, actualiza en productos
        $sql_stock = "UPDATE productos SET stock = stock - $cantidad WHERE id = $producto_id";
    }
    $conexion->query($sql_stock);
    
    responder(true, 'Venta registrada exitosamente', ['id' => $resultado['id']], 201);
}

// DELETE - Eliminar venta
else if ($metodo === 'DELETE') {
    $rol = strtolower(trim($datos['rol'] ?? $_POST['rol'] ?? $_GET['rol'] ?? 'usuario'));
    verificarPermisoOAbortar('TIENDA_DELETE', $rol);
    
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    
    // Obtener datos de la venta
    $venta = $conexion->query("SELECT producto_id, cantidad FROM ventas WHERE id = $id");
    $venta_fila = $venta->fetch_assoc();
    
    if (!$venta_fila) {
        responder(false, 'Venta no encontrada', null, 404);
    }
    
    // Devolver stock - en ambas tablas
    $producto_id = $venta_fila['producto_id'];
    $cantidad = $venta_fila['cantidad'];
    
    // Verificar si existe en inventario o productos
    $inv_check = $conexion->query("SELECT id FROM inventario WHERE producto_id = $producto_id");
    $inv_exists = $inv_check->num_rows > 0;
    
    if ($inv_exists) {
        // Si existe en inventario, devuelve ahí
        $sql_stock = "UPDATE inventario SET cantidad_actual = cantidad_actual + $cantidad WHERE producto_id = $producto_id";
    } else {
        // Si no existe en inventario, devuelve en productos
        $sql_stock = "UPDATE productos SET stock = stock + $cantidad WHERE id = $producto_id";
    }
    $conexion->query($sql_stock);
    
    // Eliminar venta
    $sql = "DELETE FROM ventas WHERE id = $id";
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Venta eliminada', null, 200);
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
