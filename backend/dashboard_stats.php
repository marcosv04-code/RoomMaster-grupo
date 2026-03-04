<?php
require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

// Try-catch para manejar cualquier error
try {
    // Array donde iremos guardando todas las estadísticas
    $estadisticas = [];

    // 1. Contar habitaciones disponibles
    $consulta_hab_disp = "SELECT COUNT(*) as total FROM habitaciones WHERE estado = 'disponible' AND activa = TRUE";
    $resultado_hab_disp = $conexion->query($consulta_hab_disp);
    if ($resultado_hab_disp) {
        $fila = $resultado_hab_disp->fetch_assoc();
        $cantidad_disponibles = $fila['total'] ?? 0;
        $estadisticas['habitaciones_disponibles'] = $cantidad_disponibles;
    }

    // 2. Contar habitaciones ocupadas
    $consulta_hab_ocup = "SELECT COUNT(*) as total FROM habitaciones WHERE estado = 'ocupada' AND activa = TRUE";
    $resultado_hab_ocup = $conexion->query($consulta_hab_ocup);
    if ($resultado_hab_ocup) {
        $fila = $resultado_hab_ocup->fetch_assoc();
        $cantidad_ocupadas = $fila['total'] ?? 0;
        $estadisticas['habitaciones_ocupadas'] = $cantidad_ocupadas;
    }

    // 3. Contar clientes activos
    $consulta_clientes = "SELECT COUNT(*) as total FROM clientes WHERE estado = 'activo'";
    $resultado_clientes = $conexion->query($consulta_clientes);
    if ($resultado_clientes) {
        $fila = $resultado_clientes->fetch_assoc();
        $cantidad_clientes = $fila['total'] ?? 0;
        $estadisticas['clientes_totales'] = $cantidad_clientes;
    }

    // 4. Contar estadías activas
    $consulta_estadias = "SELECT COUNT(*) as total FROM estadias WHERE estado = 'activa'";
    $resultado_estadias = $conexion->query($consulta_estadias);
    if ($resultado_estadias) {
        $fila = $resultado_estadias->fetch_assoc();
        $cantidad_estadias = $fila['total'] ?? 0;
        $estadisticas['estadias_activas'] = $cantidad_estadias;
    }

    // 5. Contar facturas pendientes de pago
    $consulta_facturas_pend = "SELECT COUNT(*) as total FROM facturas WHERE estado = 'Pendiente'";
    $resultado_facturas_pend = $conexion->query($consulta_facturas_pend);
    if ($resultado_facturas_pend) {
        $fila = $resultado_facturas_pend->fetch_assoc();
        $cantidad_pendientes = $fila['total'] ?? 0;
        $estadisticas['facturas_pendientes'] = $cantidad_pendientes;
    }

    // 6. Calcular total de ingresos del mes actual
    $consulta_ingresos = "SELECT COALESCE(SUM(total), 0) as total FROM facturas 
                          WHERE MONTH(fecha_factura) = MONTH(NOW()) 
                          AND YEAR(fecha_factura) = YEAR(NOW()) 
                          AND estado = 'Pagada'";
    $resultado_ingresos = $conexion->query($consulta_ingresos);
    if ($resultado_ingresos) {
        $fila = $resultado_ingresos->fetch_assoc();
        $total_ingresos = $fila['total'] ?? 0;
        $estadisticas['ingresos_mes'] = $total_ingresos;
    }

    // 7. Contar productos con stock bajo
    $consulta_stock_bajo = "SELECT COUNT(*) as total FROM productos WHERE stock < 10 AND estado = 'activo'";
    $resultado_stock_bajo = $conexion->query($consulta_stock_bajo);
    if ($resultado_stock_bajo) {
        $fila = $resultado_stock_bajo->fetch_assoc();
        $cantidad_bajo_stock = $fila['total'] ?? 0;
        $estadisticas['productos_bajo_stock'] = $cantidad_bajo_stock;
    }

    // 8. Contar personal activo del hotel
    $consulta_personal = "SELECT COUNT(*) as total FROM usuarios 
                          WHERE (rol = 'recepcionista' OR rol = 'gerente' OR rol = 'limpieza') 
                          AND estado = 'activo'";
    $resultado_personal = $conexion->query($consulta_personal);
    if ($resultado_personal) {
        $fila = $resultado_personal->fetch_assoc();
        $cantidad_personal = $fila['total'] ?? 0;
        $estadisticas['personal_activo'] = $cantidad_personal;
    }

    // Retornar todas las estadísticas
    responder(true, 'Estadísticas obtenidas correctamente', $estadisticas);
    
} catch (Exception $error_general) {
    // Si hay cualquier excepción, registrarla y responder con error
    $mensaje_error = "Error en dashboard_stats.php: " . $error_general->getMessage();
    error_log($mensaje_error);
    responder(false, 'Error al obtener las estadísticas', null, 500);
}
?>
