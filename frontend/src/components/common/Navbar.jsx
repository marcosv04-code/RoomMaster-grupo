import './Navbar.css'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          {/* Header removido */}
        </div>
        <div className="navbar-right">
          {/* Sección de usuario removida - se mostrará dentro de cada módulo */}
        </div>
      </div>
    </nav>
  )
}
