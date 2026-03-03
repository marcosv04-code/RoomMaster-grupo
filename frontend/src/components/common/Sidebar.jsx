import './Sidebar.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePermissions } from '../../hooks/usePermissions'
import Icon from './Icon'
import logo from '../../assets/images/logo.svg'

/**
 * Sidebar: Barra de navegación lateral
 * 
 * Este componente muestra:
 * - Logo y nombre de la aplicación
 * - Menú de navegación con módulos según el rol
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
  
  // Hook para verificar permisos
  const { can, isAdmin, isReceptionist } = usePermissions()

  /**
   * Lista de todos los módulos disponibles
   * Cada item tiene:
   * - label: nombre mostrado en el menú
   * - path: ruta a la que navega
   * - icon: nombre del icono SVG a usar
   * - permission: permiso necesario para ver este módulo
   */
  const allMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'chart', permission: 'DASHBOARD_VIEW' },
    { label: 'Gestión de Estadía', path: '/gestion-estadia', icon: 'hotel', permission: 'ESTADIA_VIEW' },
    { label: 'Facturación', path: '/facturacion', icon: 'credit-card', permission: 'FACTURACION_VIEW' },
    { label: 'Tienda', path: '/tienda', icon: 'money', permission: 'TIENDA_VIEW' },
    { label: 'Clientes', path: '/clientes', icon: 'users', permission: 'CLIENTES_VIEW' },
    { label: 'Inventario', path: '/inventario', icon: 'package', permission: 'INVENTARIO_VIEW' },
    { label: 'Reportes', path: '/reportes', icon: 'trending', permission: 'REPORTES_VIEW' },
    { label: 'Perfil', path: '/perfil', icon: 'user', permission: 'PERFIL_EDIT_SELF' },
  ]

  // Filtrar items según los permisos del usuario
  const menuItems = allMenuItems.filter(item => can(item.permission))

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
          <div className="user-avatar" style={{ 
            background: isAdmin ? '#FF6B6B' : '#4ECDC4',
            fontSize: '0.9rem'
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <p className="user-name">{user?.name || 'Usuario'}</p>
            <p className="user-role" style={{ 
              color: isAdmin ? '#FF6B6B' : '#4ECDC4',
              fontWeight: '600'
            }}>
              {isAdmin ? '👨‍💼 Administrador' : '📞 Recepcionista'}
            </p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
