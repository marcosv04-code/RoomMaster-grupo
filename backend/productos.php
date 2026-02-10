<?php
/**
 * ============================================
 * ENDPOINT DE PRODUCTOS (TIENDA)
 * GET, POST, PUT, DELETE /backend/productos.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener productos
if ($metodo === 'GET') {
    $categoria = $datos['categoria'] ?? null;
    
    $sql = "SELECT p.*, i.cantidad_actual as stock FROM productos p 
            LEFT JOIN inventario i ON p.id = i.producto_id 
            WHERE p.estado = 'activo'";
    
    if ($categoria) {
        $categoria = escapar($conexion, $categoria);
        $sql .= " AND p.categoria = '$categoria'";
    }
    
    $sql .= " ORDER BY p.categoria, p.nombre";
    
    $resultado = ejecutarConsulta($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Productos obtenidos', $resultado);
}

// POST - Crear producto
else if ($metodo === 'POST') {
    $error = validarCampos($datos, ['nombre', 'precio', 'categoria']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $nombre = escapar($conexion, $datos['nombre']);
    $precio = floatval($datos['precio']);
    $categoria = escapar($conexion, $datos['categoria']);
    $descripcion = escapar($conexion, $datos['descripcion'] ?? '');
    $stock = intval($datos['stock'] ?? 0);
    
    $sql = "INSERT INTO productos (nombre, precio, categoria, descripcion, stock, estado) 
            VALUES ('$nombre', $precio, '$categoria', '$descripcion', $stock, 'activo')";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    // Crear registro en inventario
    $producto_id = $resultado['id'];
    $sql_inv = "INSERT INTO inventario (producto_id, cantidad_actual) VALUES ($producto_id, $stock)";
    $conexion->query($sql_inv);
    
    responder(true, 'Producto creado exitosamente', ['id' => $producto_id], 201);
}

// PUT - Actualizar producto
else if ($metodo === 'PUT') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    $nombre = escapar($conexion, $datos['nombre'] ?? '');
    $precio = floatval($datos['precio'] ?? 0);
    $stock = intval($datos['stock'] ?? 0);
    
    $sql = "UPDATE productos SET nombre = '$nombre', precio = $precio WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    // Actualizar inventario
    $sql_inv = "UPDATE inventario SET cantidad_actual = $stock WHERE producto_id = $id";
    $conexion->query($sql_inv);
    
    responder(true, 'Producto actualizado exitosamente');
}

// DELETE - Eliminar producto
else if ($metodo === 'DELETE') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    
    $sql = "UPDATE productos SET estado = 'inactivo' WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Producto eliminado exitosamente');
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
