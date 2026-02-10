<?php
/**
 * ============================================
 * ENDPOINT DE FACTURAS
 * GET, POST, PUT /backend/facturas.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener facturas
if ($metodo === 'GET') {
    $estado = $datos['estado'] ?? null;
    
    $sql = "SELECT f.*, c.nombre as cliente_nombre FROM facturas f 
            INNER JOIN clientes c ON f.cliente_id = c.id";
    
    if ($estado) {
        $estado = escapar($conexion, $estado);
        $sql .= " WHERE f.estado = '$estado'";
    }
    
    $sql .= " ORDER BY f.fecha_factura DESC";
    
    $resultado = ejecutarConsulta($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Facturas obtenidas', $resultado);
}

// POST - Crear factura
else if ($metodo === 'POST') {
    $error = validarCampos($datos, ['estadia_id', 'cliente_id', 'total']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    // Obtener siguiente número de factura
    $resultado_num = $conexion->query("SELECT COUNT(*) as cantidad FROM facturas");
    $fila = $resultado_num->fetch_assoc();
    $numero = $fila['cantidad'] + 1;
    $numero_factura = "FAC-" . str_pad($numero, 3, "0", STR_PAD_LEFT);
    
    $estadia_id = intval($datos['estadia_id']);
    $cliente_id = intval($datos['cliente_id']);
    $subtotal = floatval($datos['subtotal'] ?? $datos['total']);
    $impuesto = floatval($datos['impuesto'] ?? 0);
    $total = floatval($datos['total']);
    $estado = escapar($conexion, $datos['estado'] ?? 'Pendiente');
    $metodo_pago = escapar($conexion, $datos['metodo_pago'] ?? '');
    
    $sql = "INSERT INTO facturas (numero_factura, estadia_id, cliente_id, subtotal, impuesto, total, estado, metodo_pago) 
            VALUES ('$numero_factura', $estadia_id, $cliente_id, $subtotal, $impuesto, $total, '$estado', '$metodo_pago')";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Factura creada: ' . $numero_factura, ['id' => $resultado['id'], 'numero_factura' => $numero_factura], 201);
}

// PUT - Actualizar factura
else if ($metodo === 'PUT') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    $estado = escapar($conexion, $datos['estado'] ?? '');
    $metodo_pago = escapar($conexion, $datos['metodo_pago'] ?? '');
    
    $sql = "UPDATE facturas SET estado = '$estado'";
    
    if ($estado === 'Pagada') {
        $sql .= ", fecha_pago = NOW()";
    }
    
    if (!empty($metodo_pago)) {
        $sql .= ", metodo_pago = '$metodo_pago'";
    }
    
    $sql .= " WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Factura actualizada exitosamente');
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
