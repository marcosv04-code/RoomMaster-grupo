import './Navbar.css'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h2>Bienvenido a RoomMaster</h2>
        </div>
        <div className="navbar-right">
          <div className="user-section">
            <span className="user-name">{user?.name || 'Usuario'}</span>
            <span className="user-role">{user?.role || 'Guest'}</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
