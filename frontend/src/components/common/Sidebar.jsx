import './Sidebar.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import logo from '../../assets/images/logo.svg'

export default function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Gestión de Estadía', path: '/gestion-estadia', icon: '🏨' },
    { label: 'Inventario', path: '/inventario', icon: '📦' },
    { label: 'Clientes', path: '/clientes', icon: '👥' },
    { label: 'Tienda', path: '/tienda', icon: '🛍️' },
    { label: 'Reportes', path: '/reportes', icon: '📈' },
    { label: 'Facturación', path: '/facturacion', icon: '💳' },
    { label: 'Perfil', path: '/perfil', icon: '⚙️' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <img src={logo} alt="RoomMaster" className="logo-img" style={{ width: '40px', height: '40px', cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
          <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700', color: '#ffffff', lineHeight: 1 }}>RoomMaster</h1>
        </div>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.95, fontWeight: '500', color: 'white', marginLeft: '50px' }}>Hotel Management</p>
      </div>

      <nav className="sidebar-nav">
        <ul className="menu-list">
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
            <p className="user-role">{user?.role || 'Guest'}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
