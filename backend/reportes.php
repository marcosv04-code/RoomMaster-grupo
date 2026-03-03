<?php
/**
 * ============================================
 * ENDPOINT DE REPORTES / DASHBOARD
 * GET /backend/reportes.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $tipo = $_GET['tipo'] ?? 'general';
    $periodo = $_GET['periodo'] ?? 'mes'; // dia, semana, mes
    
    // Construir el filtro de fecha según el período
    $fecha_inicio = '';
    switch ($periodo) {
        case 'dia':
            $fecha_inicio = "DATE(NOW())";
            break;
        case 'semana':
            $fecha_inicio = "DATE_SUB(NOW(), INTERVAL 7 DAY)";
            break;
        case 'mes':
        default:
            $fecha_inicio = "DATE_SUB(NOW(), INTERVAL 30 DAY)";
            break;
    }
    
    $reportes = [];
    
    // Reporte general
    if ($tipo === 'general' || $tipo === 'dashboard') {
        // Huéspedes actuales
        $huespedes = $conexion->query("SELECT COUNT(*) as cantidad FROM estadias WHERE estado = 'activa'");
        $huespedes_fila = $huespedes->fetch_assoc();
        
        // Habitaciones disponibles
        $habitaciones = $conexion->query("SELECT COUNT(*) as cantidad FROM habitaciones WHERE estado = 'disponible'");
        $habitaciones_fila = $habitaciones->fetch_assoc();
        
        // Ingresos del período seleccionado
        $ingresos = $conexion->query("SELECT SUM(total) as cantidad FROM facturas WHERE estado = 'Pagada' AND fecha_factura >= $fecha_inicio");
        $ingresos_fila = $ingresos->fetch_assoc();
        
        // Pendiente de cobro
        $pendiente = $conexion->query("SELECT SUM(total) as cantidad FROM facturas WHERE estado = 'Pendiente'");
        $pendiente_fila = $pendiente->fetch_assoc();
        
        $reportes['dashboard'] = [
            'huespedes_actuales' => intval($huespedes_fila['cantidad']),
            'habitaciones_disponibles' => intval($habitaciones_fila['cantidad']),
            'ingresos_mes' => floatval($ingresos_fila['cantidad'] ?? 0),
            'pendiente_cobro' => floatval($pendiente_fila['cantidad'] ?? 0)
        ];
    }
    
    // Reporte de ingresos
    if ($tipo === 'ingresos' || $tipo === 'general') {
        $ingresos_por_estado = ejecutarConsulta($conexion, 
            "SELECT estado, COUNT(*) as cantidad, SUM(total) as total FROM facturas WHERE fecha_factura >= $fecha_inicio GROUP BY estado"
        );
        $reportes['ingresos_por_estado'] = $ingresos_por_estado;
    }
    
    // Reporte de ocupación
    if ($tipo === 'ocupacion' || $tipo === 'general') {
        $ocupacion = ejecutarConsulta($conexion, 
            "SELECT tipo, COUNT(*) as total, 
            SUM(CASE WHEN estado = 'disponible' THEN 1 ELSE 0 END) as disponibles,
            SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) as ocupadas
            FROM habitaciones GROUP BY tipo"
        );
        $reportes['ocupacion_por_tipo'] = $ocupacion;
    }
    
    // Reporte de productos más vendidos
    if ($tipo === 'productos' || $tipo === 'general') {
        $productos_vendidos = ejecutarConsulta($conexion, 
            "SELECT p.nombre as producto_nombre, COUNT(v.id) as cantidad_total, SUM(v.subtotal) as ingresos_totales
            FROM productos p
            LEFT JOIN ventas v ON p.id = v.producto_id
            WHERE p.estado = 'activo' AND v.fecha_venta >= $fecha_inicio
            GROUP BY p.id
            ORDER BY cantidad_total DESC
            LIMIT 5"
        );
        $reportes['productos_vendidos'] = $productos_vendidos;
    }
    
    // Reporte de clientes
    if ($tipo === 'clientes' || $tipo === 'general') {
        $clientes_frecuentes = ejecutarConsulta($conexion, 
            "SELECT c.nombre as cliente_nombre, COUNT(e.id) as cantidad_estadias, SUM(e.numero_noches) as noches_totales
            FROM clientes c
            LEFT JOIN estadias e ON c.id = e.cliente_id
            WHERE e.fecha_entrada >= $fecha_inicio
            GROUP BY c.id
            ORDER BY cantidad_estadias DESC
            LIMIT 5"
        );
        $reportes['clientes_frecuentes'] = $clientes_frecuentes;
    }
    
    responder(true, 'Reportes obtenidos', $reportes);
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
