import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * ProtectedRoute: Componente para proteger rutas
 * 
 * Este componente es un "middleware" que verifica si el usuario está autenticado.
 * Si NO está autenticado, redirige automáticamente al login.
 * Si está autenticado, renderiza el componente (children).
 * 
 * Uso en App.jsx:
 * <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 * 
 * Flujo:
 * 1. Verificar si está cargando (loading) → mostrar "Cargando..."
 * 2. Verificar si está autenticado (isAuthenticated)
 *    - Si NO → redirigir a /login
 *    - Si SÍ → mostrar el componente protegido
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  // Mientras se carga la autenticación, mostrar mensaje de carga
  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  // Si NO está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si está autenticado, renderizar el componente protegido
  return children
}
