import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Páginas públicas
import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Páginas privadas
import DashboardPage from './pages/dashboard/DashboardPage'
import GestionEstadiaPage from './pages/gestion-estadia/GestionEstadiaPage'
import InventarioPage from './pages/inventario/InventarioPage'
import ClientesPage from './pages/clientes/ClientesPage'
import TiendaPage from './pages/tienda/TiendaPage'
import ReportesPage from './pages/reportes/ReportesPage'
import FacturacionPage from './pages/facturacion/FacturacionPage'
import PerfilPage from './pages/perfil/PerfilPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas privadas */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route 
            path="/gestion-estadia" 
            element={<ProtectedRoute><GestionEstadiaPage /></ProtectedRoute>}
          />
          <Route 
            path="/inventario" 
            element={<ProtectedRoute><InventarioPage /></ProtectedRoute>}
          />
          <Route 
            path="/clientes" 
            element={<ProtectedRoute><ClientesPage /></ProtectedRoute>}
          />
          <Route 
            path="/tienda" 
            element={<ProtectedRoute><TiendaPage /></ProtectedRoute>}
          />
          <Route 
            path="/reportes" 
            element={<ProtectedRoute><ReportesPage /></ProtectedRoute>}
          />
          <Route 
            path="/facturacion" 
            element={<ProtectedRoute><FacturacionPage /></ProtectedRoute>}
          />
          <Route 
            path="/perfil" 
            element={<ProtectedRoute><PerfilPage /></ProtectedRoute>}
          />

          {/* Ruta de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
