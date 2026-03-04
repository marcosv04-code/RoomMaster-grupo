<?php
/**
 * ============================================
 * SISTEMA DE PERMISOS POR ROL (BACKEND)
 * ============================================
 * 
 * Define qué funciones puede hacer cada rol:
 * - admin: Administrador (acceso completo)
 * - receptionist: Recepcionista (acceso limitado)
 */

define('ROLE_ADMIN', 'admin');
define('ROLE_RECEPTIONIST', 'receptionist');
define('ROLE_RECEPCION', 'recepcion'); // Alias para recepcionista (como se guarda en BD)

/**
 * Array de permisos por rol
 * Estructura: 'PERMISO' => ['admin', 'receptionist', ...]
 */
$permisos = [
    // DASHBOARD - Solo lectura
    'DASHBOARD_VIEW' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],
    
    // ESTADÍAS
    'ESTADIA_VIEW' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],
    'ESTADIA_CREATE' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],  // Admin y recepcionista crean check-in
    'ESTADIA_EDIT' => [ROLE_ADMIN],           // Solo admin puede modificar
    'ESTADIA_DELETE' => [ROLE_ADMIN],         // Solo admin puede eliminar
    'ESTADIA_CANCEL' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],  // Admin y recepcionista pueden cancelar
    
    // FACTURACIÓN
    'FACTURACION_VIEW' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],
    'FACTURACION_CREATE' => [ROLE_RECEPTIONIST, ROLE_RECEPCION],      // Recepcionista genera facturas
    'FACTURACION_MARK_PAID' => [ROLE_RECEPTIONIST, ROLE_RECEPCION],   // Recepcionista marca como pagada
    'FACTURACION_EDIT' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],        // Admin y recepcionista pueden editar
    'FACTURACION_DELETE' => [ROLE_ADMIN],             // Solo admin puede eliminar
    
    // VENTAS / TIENDA
    'TIENDA_VIEW' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],
    'TIENDA_CREATE' => [ROLE_RECEPTIONIST, ROLE_RECEPCION],  // Recepcionista vende productos
    'TIENDA_EDIT' => [ROLE_ADMIN],           // Solo admin puede editar
    'TIENDA_DELETE' => [ROLE_ADMIN],         // Solo admin puede eliminar
    
    // CLIENTES
    'CLIENTES_VIEW' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],
    'CLIENTES_CREATE' => [ROLE_RECEPTIONIST, ROLE_RECEPCION],  // Recepcionista registra clientes
    'CLIENTES_EDIT' => [ROLE_ADMIN],           // Solo admin puede editar
    'CLIENTES_DELETE' => [ROLE_ADMIN],         // Solo admin puede eliminar
    
    // INVENTARIO
    'INVENTARIO_VIEW' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],
    'INVENTARIO_EDIT' => [ROLE_ADMIN],    // Solo admin puede modificar
    'INVENTARIO_DELETE' => [ROLE_ADMIN],  // Solo admin puede eliminar
    
    // HABITACIONES
    'HABITACIONES_VIEW' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],
    'HABITACIONES_CREATE' => [ROLE_ADMIN],        // Solo admin crea habitaciones
    'HABITACIONES_EDIT' => [ROLE_ADMIN, ROLE_RECEPTIONIST, ROLE_RECEPCION],    // Admin y recepcionista pueden editar estado
    'HABITACIONES_DELETE' => [ROLE_ADMIN],        // Solo admin elimina habitaciones
    
    // PERSONAL DE LIMPIEZA
    'PERSONAL_CREATE' => [ROLE_ADMIN],            // Solo admin
    'PERSONAL_EDIT' => [ROLE_ADMIN],              // Solo admin
    'PERSONAL_DELETE' => [ROLE_ADMIN],            // Solo admin
    
    // REPORTES - Solo admin
    'REPORTES_VIEW' => [ROLE_ADMIN],
    
    // USUARIOS / ADMINISTRACIÓN - Solo admin
    'USUARIOS_MANAGE' => [ROLE_ADMIN],
];

/**
 * Función para verificar si un rol tiene un permiso
 * 
 * @param string $rol - Rol del usuario
 * @param string $permiso - Permiso a verificar
 * @return bool - True si tiene permiso
 */
function tienePermiso($rol, $permiso) {
    global $permisos;
    
    // Normalizar el rol a minúsculas y sin espacios
    $rol = strtolower(trim($rol));
    
    // Si el rol no existe en los permisos, denegar acceso
    if (!isset($permisos[$permiso])) {
        return false;
    }
    
    // Verificar si el rol está en la lista de roles permitidos
    return in_array($rol, $permisos[$permiso]);
}

/**
 * Función para obtener el rol del usuario actual
 * Se obtiene de la sesión o del token JWT
 * 
 * @return string - Rol del usuario actual
 */
function obtenerRolActual() {
    // Por ahora retornar el rol de la sesión
    // En producción, esto verificaría un JWT token
    session_start();
    if (isset($_SESSION['user_role'])) {
        return $_SESSION['user_role'];
    }
    return null;
}

/**
 * Función para verificar permiso y retornar error si no tiene
 * 
 * @param string $permiso - Permiso a verificar
 * @param string|null $rol - Rol a verificar (si no se especifica, usa el del usuario actual)
 * @return bool - True si tiene permiso
 */
function verificarPermisoOAbortar($permiso, $rol = null) {
    if ($rol === null) {
        $rol = obtenerRolActual();
    }
    
    if (!tienePermiso($rol, $permiso)) {
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'exito' => false,
            'mensaje' => 'No tienes permiso para realizar esta acción',
            'permiso_requerido' => $permiso,
            'rol_actual' => $rol
        ]);
        exit();
    }
    
    return true;
}

/**
 * RESUMEN DE PERMISOS POR ROL
 * ============================================
 * 
 * ADMINISTRADOR (admin):
 * ✅ Dashboard: Ver estadísticas
 * ✅ Estadías: Ver, crear, editar, eliminar, cancelar
 * ✅ Facturación: Ver, crear, marcar pagada, editar, eliminar
 * ✅ Tienda: Ver, crear, editar, eliminar
 * ✅ Clientes: Ver, crear, editar, eliminar
 * ✅ Inventario: Ver, editar, eliminar
 * ✅ Reportes: Ver análisis completo
 * ✅ Usuarios: Crear, editar, eliminar
 * 
 * RECEPCIONISTA (receptionist):
 * ✅ Dashboard: Ver estadísticas
 * ✅ Estadías: Ver, crear (check-in), cancelar
 * ✅ Facturación: Ver, crear, marcar pagada
 * ✅ Tienda: Ver, vender productos
 * ✅ Clientes: Ver, crear nuevos
 * ✅ Inventario: Ver solo (consulta)
 * ❌ Reportes: Sin acceso
 * ❌ Usuarios: Sin acceso
 */
?>
