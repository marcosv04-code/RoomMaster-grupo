import './LandingPage.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <h1 className="app-logo">RoomMaster</h1>
          <nav className="header-nav">
            <a href="#features">Características</a>
            <a href="#pricing">Precios</a>
            <a href="#contact">Contacto</a>
            {isAuthenticated ? (
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Ir al Dashboard
              </button>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => navigate('/login')}>
                  Iniciar sesión
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/register')}>
                  Registrarse
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Gestión Integral de Hoteles</h2>
          <p>Sistema administrativo profesional para optimizar la operación de tu hotel</p>
          {!isAuthenticated && (
            <button 
              className="btn btn-primary btn-large" 
              onClick={() => navigate('/register')}
            >
              Comienza Ahora
            </button>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <h2>Características Principales</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🏨</span>
            <h3>Gestión de Estadía</h3>
            <p>Control completo de reservas y registros de huéspedes</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Dashboard Inteligente</h3>
            <p>Reportes y estadísticas en tiempo real</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💳</span>
            <h3>Facturación Automática</h3>
            <p>Cobros y facturas de forma simplificada</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📦</span>
            <h3>Inventario</h3>
            <p>Control de habitaciones e inventario por sala</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 RoomMaster. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
