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
    
    $reportes = [];
    
    // Reporte general
    if ($tipo === 'general' || $tipo === 'dashboard') {
        // Huéspedes actuales
        $huespedes = $conexion->query("SELECT COUNT(*) as cantidad FROM estadias WHERE estado = 'activa'");
        $huespedes_fila = $huespedes->fetch_assoc();
        
        // Habitaciones disponibles
        $habitaciones = $conexion->query("SELECT COUNT(*) as cantidad FROM habitaciones WHERE estado = 'disponible'");
        $habitaciones_fila = $habitaciones->fetch_assoc();
        
        // Ingresos del mes
        $ingresos = $conexion->query("SELECT SUM(total) as cantidad FROM facturas WHERE estado = 'Pagada' AND MONTH(fecha_factura) = MONTH(NOW()) AND YEAR(fecha_factura) = YEAR(NOW())");
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
            "SELECT estado, COUNT(*) as cantidad, SUM(total) as total FROM facturas GROUP BY estado"
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
            "SELECT p.nombre, COUNT(v.id) as veces_vendido, SUM(v.subtotal) as ingresos
            FROM productos p
            LEFT JOIN ventas v ON p.id = v.producto_id
            WHERE p.estado = 'activo'
            GROUP BY p.id
            ORDER BY veces_vendido DESC
            LIMIT 5"
        );
        $reportes['productos_vendidos'] = $productos_vendidos;
    }
    
    // Reporte de clientes
    if ($tipo === 'clientes' || $tipo === 'general') {
        $clientes_frecuentes = ejecutarConsulta($conexion, 
            "SELECT c.nombre, COUNT(e.id) as total_reservas, SUM(e.numero_noches) as total_noches
            FROM clientes c
            LEFT JOIN estadias e ON c.id = e.cliente_id
            GROUP BY c.id
            ORDER BY total_reservas DESC
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
