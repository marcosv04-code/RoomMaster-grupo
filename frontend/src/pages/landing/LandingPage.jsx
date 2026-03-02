import './LandingPage.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/common/Icon'
import logo from '../../assets/images/logo.svg'
import facturacionImage from '../../assets/images/Facturacion.jpg'

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
            <a href="#inicio" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'auto' }) }}>Inicio</a>
            <a href="#features">Características</a>
            <a href="#contact">Contacto</a>
            {isAuthenticated ? (
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Ir al Dashboard
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Iniciar sesión
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="hero-section" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564437170735-528793f62a2b?w=1200&h=600&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2>Software de Gestión Hotelera Completo</h2>
          <p>Controla facturación, inventario y estadías en una única plataforma. Automatiza procesos, aumenta eficiencia y mejora la experiencia de tus huéspedes con RoomMaster.</p>
          {!isAuthenticated && (
            <button 
              className="btn btn-primary btn-large" 
              onClick={() => navigate('/login')}
            >
              Acceder
            </button>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <h2>Características Principales</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop)' }}></div>
            <Icon name="hotel" size={48} className="primary" />
            <h3>Gestión de Estadía</h3>
            <p>Control completo de registros de huéspedes y estadías</p>
          </div>
          <div className="feature-card">
            <div className="feature-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop)' }}></div>
            <Icon name="chart" size={48} className="primary" />
            <h3>Dashboard Inteligente</h3>
            <p>Reportes y estadísticas en tiempo real</p>
          </div>
          <div className="feature-card">
            <div className="feature-image" style={{ backgroundImage: `url(${facturacionImage})` }}></div>
            <Icon name="credit-card" size={48} className="primary" />
            <h3>Facturación Automática</h3>
            <p>Cobros y facturas de forma simplificada</p>
          </div>
          <div className="feature-card">
            <div className="feature-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop)' }}></div>
            <Icon name="package" size={48} className="primary" />
            <h3>Inventario</h3>
            <p>Control de habitaciones e inventario por sala</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2>Lo que dicen nuestros clientes</h2>
          <p className="testimonials-subtitle">Descubre cómo RoomMaster ha transformado la gestión de hoteles</p>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">MC</div>
                <div className="testimonial-info">
                  <h4>María Contreras</h4>
                  <p>Gerenta, Hotel Luna Azul</p>
                </div>
              </div>
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <p className="testimonial-text">"RoomMaster ha revolucionado la forma en que gestionamos nuestro hotel. Los reportes en tiempo real nos han ayudado a aumentar la ocupación en un 25%. Altamente recomendado."</p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">JR</div>
                <div className="testimonial-info">
                  <h4>Jorge Ramírez</h4>
                  <p>Propietario, Hostal Colinas</p>
                </div>
              </div>
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <p className="testimonial-text">"La facturación automática me ahorró horas de trabajo administrativo cada semana. El soporte del equipo es excepcional y muy receptivo a nuestras necesidades."</p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">SP</div>
                <div className="testimonial-info">
                  <h4>Sandra Pérez</h4>
                  <p>Administradora, Resort Paraíso</p>
                </div>
              </div>
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <p className="testimonial-text">"La integración con nuestros sistemas existentes fue sin problemas. Ahora todo el equipo puede acceder a la información desde cualquier lugar. ¡Excelente producto!"</p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">CA</div>
                <div className="testimonial-info">
                  <h4>Carlos Andrade</h4>
                  <p>Director de Operaciones, Hotel Premium</p>
                </div>
              </div>
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <p className="testimonial-text">"Desde que usamos RoomMaster, reducimos errores administrativos en un 90%. El dashboard intuitivo hace que el equipo sea más productivo."</p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">LM</div>
                <div className="testimonial-info">
                  <h4>Laura Moreno</h4>
                  <p>Jefa de Recepción, Hotel Ejecutivo</p>
                </div>
              </div>
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star empty-star">★</span>
              </div>
              <p className="testimonial-text">"Muy buena herramienta. La interfaz es amigable y el equipo de soporte responde rápidamente. Mi única sugerencia sería agregar más reportes personalizados."</p>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">RF</div>
                <div className="testimonial-info">
                  <h4>Roberto Fuentes</h4>
                  <p>Gerente General, Cadena Hotelera Sur</p>
                </div>
              </div>
              <div className="testimonial-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <p className="testimonial-text">"Para una pequeña cadena como la nuestra, RoomMaster es perfecto. Manejo de múltiples propiedades se volvió mucho más simple. Excelente relación precio-valor."</p>
            </div>
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
                <Icon name="email" size={32} className="primary" />
                <div>
                  <h4>Email</h4>
                  <p>soporte@roommaster.com</p>
                </div>
              </div>
              <div className="contact-item">
                <Icon name="phone" size={32} className="primary" />
                <div>
                  <h4>Teléfono</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item">
                <Icon name="location" size={32} className="primary" />
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
