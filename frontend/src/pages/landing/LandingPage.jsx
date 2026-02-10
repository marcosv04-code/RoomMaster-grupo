import './LandingPage.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import logo from '../../assets/images/logo.svg'

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <img src={logo} alt="RoomMaster" style={{ width: '50px', height: '50px' }} />
            <h1 className="app-logo" style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1565c0' }}>RoomMaster</h1>
          </div>
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
          <h2>Software de Gestión Hotelera Completo</h2>
          <p>Controla reservas, facturación, inventario y estadías en una única plataforma. Automatiza procesos, aumenta eficiencia y mejora la experiencia de tus huéspedes con RoomMaster.</p>
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

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <h2>Nuestros Planes</h2>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Básico</h3>
              <p className="pricing-description">Para hoteles pequeños</p>
            </div>
            <div className="pricing-amount">
              <span className="price">$99</span>
              <span className="period">/mes</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Hasta 20 habitaciones</li>
              <li>✓ Gestión de reservas</li>
              <li>✓ Dashboard básico</li>
              <li>✓ Reportes simples</li>
              <li>✗ Facturación avanzada</li>
              <li>✗ API integrada</li>
            </ul>
            <button className="btn btn-secondary btn-block">Seleccionar Plan</button>
          </div>

          <div className="pricing-card pricing-card-featured">
            <div className="pricing-badge">Más Popular</div>
            <div className="pricing-header">
              <h3>Profesional</h3>
              <p className="pricing-description">Para hoteles medianos</p>
            </div>
            <div className="pricing-amount">
              <span className="price">$249</span>
              <span className="period">/mes</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Hasta 100 habitaciones</li>
              <li>✓ Gestión completa de reservas</li>
              <li>✓ Dashboard avanzado</li>
              <li>✓ Reportes detallados</li>
              <li>✓ Facturación automática</li>
              <li>✓ Soporte prioritario</li>
            </ul>
            <button className="btn btn-primary btn-block">Seleccionar Plan</button>
          </div>

          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Empresarial</h3>
              <p className="pricing-description">Para cadenas hoteleras</p>
            </div>
            <div className="pricing-amount">
              <span className="price">$499</span>
              <span className="period">/mes</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Ilimitadas habitaciones</li>
              <li>✓ Multi-propiedad</li>
              <li>✓ Dashboard personalizado</li>
              <li>✓ Reportes en tiempo real</li>
              <li>✓ Facturación avanzada</li>
              <li>✓ API completa integrada</li>
            </ul>
            <button className="btn btn-secondary btn-block">Contactar Ventas</button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <h2>Contáctanos</h2>
          <p className="contact-subtitle">¿Preguntas? Nuestro equipo está listo para ayudarte</p>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <h4>Email</h4>
                  <p>soporte@roommaster.com</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div>
                  <h4>Teléfono</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Ubicación</h4>
                  <p>123 Av. Principal, Santiago, Chile</p>
                </div>
              </div>
            </div>

            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Tu nombre" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Tu email" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Tu mensaje" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Enviar Mensaje</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>RoomMaster</h3>
            <p>Sistema administrativo profesional para la gestión integral de hoteles. Optimiza tu operación con tecnología de punta.</p>
            <div className="social-links">
              <a href="#" title="Facebook">f</a>
              <a href="#" title="Twitter">𝕏</a>
              <a href="#" title="LinkedIn">in</a>
              <a href="#" title="Instagram">📷</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Producto</h4>
            <ul>
              <li><a href="#features">Características</a></li>
              <li><a href="#pricing">Precios</a></li>
              <li><a href="#contact">Contacto</a></li>
              <li><a href="/login">Iniciar Sesión</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Empresa</h4>
            <ul>
              <li><a href="#">Nosotros</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Carreras</a></li>
              <li><a href="#">Prensa</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Soporte</h4>
            <ul>
              <li><a href="#">Centro de Ayuda</a></li>
              <li><a href="#">Documentación</a></li>
              <li><a href="#">Comunidad</a></li>
              <li><a href="#">Estado del Servidor</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-info">
            <p><strong>RoomMaster</strong> v1.0.0 © 2026. Todos los derechos reservados.</p>
            <p className="footer-description">Desarrollado con ❤️ para hoteleros. Hecho en Colombia.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
