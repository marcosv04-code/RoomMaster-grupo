import './Sidebar.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import logo from '../../assets/images/logo.svg'

/**
 * Sidebar: Barra de navegación lateral
 * 
 * Este componente muestra:
 * - Logo y nombre de la aplicación
 * - Menú de navegación con todos los módulos
 * - Información del usuario autenticado
 * - Botón para cerrar sesión
 * 
 * El menú se filtra según el rol del usuario:
 * - Admin: ve todos los módulos
 * - Recepcionista: ve solo módulos permitidos
 */
export default function Sidebar() {
  // Hook para navegar entre páginas
  const navigate = useNavigate()
  
  // Obtener datos del usuario y función logout
  const { user, logout } = useAuth()

  /**
   * Lista de todos los módulos disponibles
   * Cada item tiene:
   * - label: nombre mostrado en el menú
   * - path: ruta a la que navega
   * - icon: emoji usado como icono
   */
  const allMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Gestión de Estadía', path: '/gestion-estadia', icon: '🏨' },
    { label: 'Inventario', path: '/inventario', icon: '📦' },
    { label: 'Clientes', path: '/clientes', icon: '👥' },
    { label: 'Tienda', path: '/tienda', icon: '🛍️' },
    { label: 'Reportes', path: '/reportes', icon: '📈' },
    { label: 'Facturación', path: '/facturacion', icon: '💳' },
    { label: 'Perfil', path: '/perfil', icon: '⚙️' },
  ]

  // Mostrar todos los items para ambos roles
  // (En futuro aquí se podrían filtrar según el rol)
  const menuItems = allMenuItems

  /**
   * Maneja el cierre de sesión
   * Limpia los datos del usuario y redirige al login
   */
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* ENCABEZADO: Logo y nombre de la aplicación */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          {/* Logo de la aplicación - clickeable */}
          <img 
            src={logo} 
            alt="RoomMaster" 
            className="logo-img" 
            style={{ width: '40px', height: '40px', cursor: 'pointer' }} 
            onClick={() => navigate('/dashboard')} 
          />
          {/* Nombre de la aplicación */}
          <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700', color: '#ffffff', lineHeight: 1 }}>
            RoomMaster
          </h1>
        </div>
        {/* Subtítulo */}
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.95, fontWeight: '500', color: 'white', marginLeft: '50px' }}>
          Hotel Management
        </p>
      </div>

      {/* NAVEGACIÓN: Menú con los módulos */}
      <nav className="sidebar-nav">
        <ul className="menu-list">
          {/* Recorrer cada item del menú y crear un botón para cada uno */}
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                className="menu-item"
                onClick={() => navigate(item.path)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <p className="user-name">{user?.name || 'Usuario'}</p>
            <p className="user-role">{user?.role === 'admin' ? 'Administrador' : 'Recepcionista'}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
