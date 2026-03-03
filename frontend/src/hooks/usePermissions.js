import { useAuth } from './useAuth'
import { hasPermission } from '../utils/permissions'

/**
 * Hook personalizado para verificar permisos
 * 
 * @example
 * const { can, isAdmin, isReceptionist } = usePermissions()
 * 
 * if (can('ESTADIA_EDIT')) {
 *   // Mostrar botón editar
 * }
 */
export function usePermissions() {
  const { user } = useAuth()
  
  const userRole = user?.role || 'guest'
  
  return {
    // Verificar un permiso específico
    can: (permission) => hasPermission(userRole, permission),
    
    // Utilidades de rol
    isAdmin: userRole === 'admin',
    isReceptionist: userRole === 'receptionist' || userRole === 'recepcion',
    role: userRole,
    
    // Verificaciones rápidas por módulo
    canViewReportes: hasPermission(userRole, 'REPORTES_VIEW'),
    canManageUsers: userRole === 'admin',
    canCheckIn: hasPermission(userRole, 'ESTADIA_CREATE'),
    canGenerateInvoice: hasPermission(userRole, 'FACTURACION_CREATE'),
    canMarkPaid: hasPermission(userRole, 'FACTURACION_MARK_PAID'),
    canSellProducts: hasPermission(userRole, 'TIENDA_CREATE'),
  }
}
