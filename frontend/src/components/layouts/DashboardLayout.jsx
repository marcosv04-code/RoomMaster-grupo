import Sidebar from '../common/Sidebar'
import Navbar from '../common/Navbar'
import './DashboardLayout.css'

/**
 * DashboardLayout: Layout principal de la aplicación
 * 
 * Este componente envuelve todas las páginas del dashboard.
 * Proporciona estructura consistente en toda la aplicación:
 * - Sidebar: Menú de navegación izquierdo
 * - Navbar: Barra superior con información del usuario
 * - Main content: Área principal donde va el contenido
 * 
 * Estructura visual:
 * ┌─────────────────────────────┐
 * │         NAVBAR              │
 * ├──────────┬──────────────────┤
 * │          │                  │
 * │ SIDEBAR  │   CONTENIDO      │
 * │          │     (children)   │
 * │          │                  │
 * └──────────┴──────────────────┘
 * 
 * Uso:
 * <DashboardLayout>
 *   <MiComponente />
 * </DashboardLayout>
 */
export default function DashboardLayout({ children }) {
  return (
    // Contenedor principal del layout
    <div className="dashboard-layout">
      
      {/* SIDEBAR: Menú de navegación */}
      <Sidebar />
      
      {/* CONTENEDOR DE CONTENIDO: Navbar + Main */}
      <div className="layout-content">
        
        {/* NAVBAR: Barra superior con info del usuario */}
        <Navbar />
        
        {/* CONTENIDO PRINCIPAL: Donde va el contenido específico */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
