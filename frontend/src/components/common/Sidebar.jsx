import './Sidebar.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from './Icon'
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
   * - icon: nombre del icono SVG a usar
   */
  const allMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'chart' },
    { label: 'Gestión de Estadía', path: '/gestion-estadia', icon: 'hotel' },
    { label: 'Inventario', path: '/inventario', icon: 'package' },
    { label: 'Clientes', path: '/clientes', icon: 'users' },
    { label: 'Tienda', path: '/tienda', icon: 'trending' },
    { label: 'Reportes', path: '/reportes', icon: 'trending' },
    { label: 'Facturación', path: '/facturacion', icon: 'credit-card' },
    { label: 'Perfil', path: '/perfil', icon: 'user' },
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
      <div className="sidebar-header">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px' }}>
          <img 
            src={logo} 
            alt="RoomMaster" 
            className="logo-img" 
            style={{ width: '50px', height: '50px', cursor: 'pointer' }} 
            onClick={() => navigate('/dashboard')} 
          />
          <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', lineHeight: 1, textAlign: 'center' }}>
            RoomMaster
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9, fontWeight: '500', color: 'white', textAlign: 'center' }}>
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
                <Icon name={item.icon} size={20} className="white" />
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
