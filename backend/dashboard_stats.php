<?php
require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

try {
    $stats = [];

    // Habitaciones disponibles
    $res = $conexion->query("SELECT COUNT(*) as total FROM habitaciones WHERE estado = 'disponible' AND activa = TRUE");
    if ($res) {
        $stats['habitaciones_disponibles'] = $res->fetch_assoc()['total'] ?? 0;
    }

    // Habitaciones ocupadas
    $res = $conexion->query("SELECT COUNT(*) as total FROM habitaciones WHERE estado = 'ocupada' AND activa = TRUE");
    if ($res) {
        $stats['habitaciones_ocupadas'] = $res->fetch_assoc()['total'] ?? 0;
    }

    // Clientes activos
    $res = $conexion->query("SELECT COUNT(*) as total FROM clientes WHERE estado = 'activo'");
    if ($res) {
        $stats['clientes_totales'] = $res->fetch_assoc()['total'] ?? 0;
    }

    // Estadías activas
    $res = $conexion->query("SELECT COUNT(*) as total FROM estadias WHERE estado = 'activa'");
    if ($res) {
        $stats['estadias_activas'] = $res->fetch_assoc()['total'] ?? 0;
    }

    // Facturas pendientes
    $res = $conexion->query("SELECT COUNT(*) as total FROM facturas WHERE estado = 'Pendiente'");
    if ($res) {
        $stats['facturas_pendientes'] = $res->fetch_assoc()['total'] ?? 0;
    }

    // Total de ingresos del mes
    $res = $conexion->query("SELECT COALESCE(SUM(total), 0) as total FROM facturas WHERE MONTH(fecha_factura) = MONTH(NOW()) AND YEAR(fecha_factura) = YEAR(NOW()) AND estado = 'Pagada'");
    if ($res) {
        $stats['ingresos_mes'] = $res->fetch_assoc()['total'] ?? 0;
    }

    // Productos en stock bajo
    $res = $conexion->query("SELECT COUNT(*) as total FROM productos WHERE stock < 10 AND estado = 'activo'");
    if ($res) {
        $stats['productos_bajo_stock'] = $res->fetch_assoc()['total'] ?? 0;
    }

    // Personal activo
    $res = $conexion->query("SELECT COUNT(*) as total FROM usuarios WHERE (rol = 'recepcionista' OR rol = 'gerente' OR rol = 'limpieza') AND estado = 'activo'");
    if ($res) {
        $stats['personal_activo'] = $res->fetch_assoc()['total'] ?? 0;
    }

    responder(true, 'Estadísticas obtenidas', $stats);
} catch (Exception $e) {
    error_log("Error en dashboard_stats: " . $e->getMessage());
    responder(false, 'Error al obtener estadísticas', null, 500);
}
?>
