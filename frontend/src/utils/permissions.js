/**
 * ============================================
 * SISTEMA DE PERMISOS POR ROL
 * ============================================
 * 
 * Define qué funciones puede hacer cada rol:
 * - admin: Administrador (acceso completo)
 * - receptionist: Recepcionista (acceso limitado)
 */

export const ROLES = {
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
  RECEPCION: 'recepcion' // Alias para recepcionista (como se guarda en BD)
}

export const PERMISSIONS = {
  // DASHBOARD - Solo lectura para ambos
  DASHBOARD_VIEW: ['admin', 'receptionist', 'recepcion'],
  
  // GESTIÓN DE ESTADIA
  ESTADIA_VIEW: ['admin', 'receptionist', 'recepcion'],
  ESTADIA_CREATE: ['admin', 'receptionist', 'recepcion'], // Admin y recepcionista pueden crear check-in
  ESTADIA_EDIT: ['admin'], // Solo admin puede modificar
  ESTADIA_DELETE: ['admin'], // Solo admin puede eliminar
  ESTADIA_CANCEL: ['admin', 'receptionist', 'recepcion'], // Admin y recepcionista pueden cancelar
  
  // FACTURACIÓN
  FACTURACION_VIEW: ['admin', 'receptionist', 'recepcion'],
  FACTURACION_CREATE: ['receptionist', 'recepcion'], // Recepcionista genera facturas
  FACTURACION_MARK_PAID: ['receptionist', 'recepcion'], // Recepcionista marca como pagada
  FACTURACION_EDIT: ['admin'], // Solo admin puede editar
  FACTURACION_DELETE: ['admin'], // Solo admin puede eliminar
  
  // TIENDA / VENTAS
  TIENDA_VIEW: ['admin', 'receptionist', 'recepcion'],
  TIENDA_CREATE: ['receptionist', 'recepcion'], // Recepcionista vende productos
  TIENDA_EDIT: ['admin'], // Solo admin puede editar
  TIENDA_DELETE: ['admin'], // Solo admin puede eliminar
  
  // CLIENTES
  CLIENTES_VIEW: ['admin', 'receptionist', 'recepcion'],
  CLIENTES_CREATE: ['receptionist', 'recepcion'], // Recepcionista puede registrar clientes
  CLIENTES_EDIT: ['admin'], // Solo admin puede editar información
  CLIENTES_DELETE: ['admin'], // Solo admin puede eliminar
  
  // INVENTARIO
  INVENTARIO_VIEW: ['admin', 'receptionist', 'recepcion'],
  INVENTARIO_EDIT: ['admin'], // Solo admin puede modificar inventario
  INVENTARIO_DELETE: ['admin'], // Solo admin puede eliminar productos
  
  // REPORTES - Solo admin
  REPORTES_VIEW: ['admin'],
  
  // PERFIL
  PERFIL_EDIT_SELF: ['admin', 'receptionist', 'recepcion'], // Cada usuario edita su perfil
  PERFIL_EDIT_OTHERS: ['admin'], // Admin puede editar otros perfiles
  PERFIL_DELETE: ['admin'], // Solo admin puede eliminar usuarios
}

/**
 * Función para verificar si un usuario tiene permiso
 * @param {string} userRole - Rol del usuario (admin, receptionist)
 * @param {string} permission - Permiso a verificar (ej: ESTADIA_CREATE)
 * @returns {boolean} True si tiene permiso
 */
export const hasPermission = (userRole, permission) => {
  const allowedRoles = PERMISSIONS[permission] || []
  return allowedRoles.includes(userRole)
}

/**
 * Función para obtener el label del rol
 * @param {string} role - Rol del usuario
 * @returns {string} Label legible
 */
export const getRoleLabel = (role) => {
  const labels = {
    admin: '👨‍💼 Administrador',
    receptionist: '📞 Recepcionista',
    recepcion: '📞 Recepcionista' // Alias BD
  }
  return labels[role] || role
}

/**
 * RESUMEN DE PERMISOS POR ROL
 * ============================================
 * 
 * ADMINISTRADOR:
 * ✅ Dashboard: Ver estadísticas
 * ✅ Gestión Estadia: Ver, crear, editar, eliminar, cancelar
 * ✅ Facturación: Ver, crear, marcar pagada, editar, eliminar
 * ✅ Tienda: Ver, crear, editar, eliminar
 * ✅ Clientes: Ver, crear, editar, eliminar
 * ✅ Inventario: Ver, editar, eliminar
 * ✅ Reportes: Ver análisis completo
 * ✅ Perfil: Editar su perfil, editar otros, eliminar usuarios
 * 
 * RECEPCIONISTA:
 * ✅ Dashboard: Ver estadísticas
 * ✅ Gestión Estadia: Ver, crear, cancelar (check-in/checkout)
 * ✅ Facturación: Ver, crear facturas automáticas, marcar pagada
 * ✅ Tienda: Ver, vender productos
 * ✅ Clientes: Ver, crear nuevos clientes
 * ✅ Inventario: Ver solo (consulta)
 * ❌ Reportes: Sin acceso
 * ⚠️ Perfil: Solo editar el suyo
 */
