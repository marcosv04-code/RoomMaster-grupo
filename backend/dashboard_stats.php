<?php
require_once 'cors.php';
require_once 'config.php';

$stats = [];

// Habitaciones disponibles
$res = $cnx->query("SELECT COUNT(*) as total FROM habitaciones WHERE estado = 'disponible'");
$stats['habitaciones_disponibles'] = $res->fetch_assoc()['total'] ?? 0;

// Habitaciones ocupadas
$res = $cnx->query("SELECT COUNT(*) as total FROM habitaciones WHERE estado = 'ocupada'");
$stats['habitaciones_ocupadas'] = $res->fetch_assoc()['total'] ?? 0;

// Clientes activos
$res = $cnx->query("SELECT COUNT(*) as total FROM clientes WHERE estado = 'activo'");
$stats['clientes_totales'] = $res->fetch_assoc()['total'] ?? 0;

// Estadías activas
$res = $cnx->query("SELECT COUNT(*) as total FROM estadias WHERE estado = 'activa'");
$stats['estadias_activas'] = $res->fetch_assoc()['total'] ?? 0;

// Facturas pendientes
$res = $cnx->query("SELECT COUNT(*) as total FROM facturas WHERE estado = 'Pendiente'");
$stats['facturas_pendientes'] = $res->fetch_assoc()['total'] ?? 0;

// Total de ingresos del mes
$res = $cnx->query("SELECT COALESCE(SUM(total), 0) as total FROM facturas WHERE MONTH(fecha_factura) = MONTH(NOW()) AND YEAR(fecha_factura) = YEAR(NOW()) AND estado = 'Pagada'");
$stats['ingresos_mes'] = $res->fetch_assoc()['total'] ?? 0;

// Productos en stock bajo
$res = $cnx->query("SELECT COUNT(*) as total FROM productos WHERE stock < 10 AND estado = 'activo'");
$stats['productos_bajo_stock'] = $res->fetch_assoc()['total'] ?? 0;

// Personal activo
$res = $cnx->query("SELECT COUNT(*) as total FROM usuarios WHERE rol = 'recepcionista' OR rol = 'gerente' OR rol = 'limpieza'");
$stats['personal_activo'] = $res->fetch_assoc()['total'] ?? 0;

http_response_code(200);
echo json_encode(['success' => true, 'datos' => $stats]);
?>
