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
require_once 'permissions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener facturas
if ($metodo === 'GET') {
    $estado = $datos['estado'] ?? null;
    $action = $datos['action'] ?? null;
    
    // Acción: Generar factura automática para una estadía
    if ($action === 'generar_automatica') {
        $estadia_id = intval($datos['estadia_id'] ?? 0);
        
        if ($estadia_id === 0) {
            responder(false, 'ID de estadía requerido', null, 400);
        }
        
        // Obtener datos de la estadía
        $sql_estadia = "SELECT e.*, c.id as cliente_id, c.nombre, h.precio_noche,
                        DATEDIFF(e.fecha_salida, e.fecha_entrada) as numero_noches
                        FROM estadias e 
                        INNER JOIN clientes c ON e.cliente_id = c.id
                        INNER JOIN habitaciones h ON e.habitacion_id = h.id
                        WHERE e.id = $estadia_id";
        
        $res_estadia = $conexion->query($sql_estadia);
        $estadia = $res_estadia->fetch_assoc();
        
        if (!$estadia) {
            responder(false, 'Estadía no encontrada', null, 404);
        }
        
        // Calcular total de la estadía
        $noches = max($estadia['numero_noches'], 1); // Al menos 1 noche
        $total_estadia = $estadia['precio_noche'] * $noches;
        
        // Obtener total de ventas de esta estadía
        $sql_ventas = "SELECT COALESCE(SUM(subtotal), 0) as total_ventas 
                       FROM ventas 
                       WHERE estadia_id = $estadia_id";
        
        $res_ventas = $conexion->query($sql_ventas);
        $ventas = $res_ventas->fetch_assoc();
        $total_ventas = $ventas['total_ventas'];
        
        // Calcular totales
        $subtotal = $total_estadia + $total_ventas;
        $impuesto = $subtotal * 0.19; // IVA 19%
        $total = $subtotal + $impuesto;
        
        // Obtener siguiente número de factura
        $resultado_num = $conexion->query("SELECT COUNT(*) as cantidad FROM facturas");
        $fila = $resultado_num->fetch_assoc();
        $numero = $fila['cantidad'] + 1;
        $numero_factura = "FAC-" . str_pad($numero, 3, "0", STR_PAD_LEFT);
        
        // Crear factura
        $cliente_id = intval($estadia['cliente_id']);
        $sql_insert = "INSERT INTO facturas (numero_factura, estadia_id, cliente_id, subtotal, impuesto, total, estado) 
                       VALUES ('$numero_factura', $estadia_id, $cliente_id, $subtotal, $impuesto, $total, 'Pendiente')";
        
        $resultado = ejecutarAccion($conexion, $sql_insert);
        
        if (isset($resultado['error'])) {
            responder(false, $resultado['error'], null, 500);
        }
        
        responder(true, 'Factura generada automáticamente', [
            'id' => $resultado['id'],
            'numero_factura' => $numero_factura,
            'cliente_nombre' => $estadia['nombre'],
            'total_estadia' => $total_estadia,
            'total_ventas' => $total_ventas,
            'subtotal' => $subtotal,
            'impuesto' => $impuesto,
            'total' => $total
        ], 201);
    }
    
    // Obtener facturas normales
    $sql = "SELECT f.*, c.nombre as cliente_nombre, e.numero_noches FROM facturas f 
            INNER JOIN clientes c ON f.cliente_id = c.id
            LEFT JOIN estadias e ON f.estadia_id = e.id";
    
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
    $rol = strtolower(trim($datos['rol'] ?? $_POST['rol'] ?? $_GET['rol'] ?? 'usuario'));
    verificarPermisoOAbortar('FACTURACION_EDIT', $rol);
    
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
    
    // Si la factura se marca como pagada, actualizar la estadía a completada y la habitación a mantenimiento
    if ($estado === 'Pagada') {
        // Obtener el estadia_id y habitacion_id de la factura
        $factura_query = $conexion->query("SELECT f.estadia_id, e.habitacion_id FROM facturas f 
                                          INNER JOIN estadias e ON f.estadia_id = e.id 
                                          WHERE f.id = $id");
        $factura = $factura_query->fetch_assoc();
        
        if ($factura) {
            $estadia_id = intval($factura['estadia_id']);
            $habitacion_id = intval($factura['habitacion_id']);
            
            // Actualizar estadía a completada
            $sql_estadia = "UPDATE estadias SET estado = 'completada' WHERE id = $estadia_id";
            $conexion->query($sql_estadia);
            
            // Actualizar habitación a mantenimiento
            $sql_habitacion = "UPDATE habitaciones SET estado = 'Mantenimiento' WHERE id = $habitacion_id";
            $conexion->query($sql_habitacion);
        }
    }
    
    responder(true, 'Factura actualizada exitosamente');
}

// DELETE - Eliminar factura
else if ($metodo === 'DELETE') {
    $rol = strtolower(trim($datos['rol'] ?? $_POST['rol'] ?? $_GET['rol'] ?? 'usuario'));
    verificarPermisoOAbortar('FACTURACION_DELETE', $rol);
    
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    
    $sql = "DELETE FROM facturas WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Factura eliminada exitosamente');
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
