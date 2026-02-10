import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Hook useAuth: Accede a la información de autenticación
 * 
 * Este es un "custom hook" que simplifica el acceso al contexto de autenticación.
 * En lugar de usar useContext(AuthContext) en cada componente,
 * solo necesitas usar este hook.
 * 
 * Retorna un objeto con:
 * - user: datos del usuario actual
 * - login: función para iniciar sesión
 * - logout: función para cerrar sesión
 * - loading: si está cargando
 * - isAuthenticated: si está autenticado
 * 
 * Ejemplo de uso:
 * const { user, logout } = useAuth()
 * 
 * @throws Error si se usa fuera del AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  
  // Validación: verificar que se use dentro del proveedor
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  
  return context
}
