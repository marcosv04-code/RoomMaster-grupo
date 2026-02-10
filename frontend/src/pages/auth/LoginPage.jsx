import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './AuthPage.css'

/**
 * LoginPage: Página de inicio de sesión
 * 
 * Permite a los usuarios iniciar sesión seleccionando:
 * - Email y contraseña
 * - Tipo de rol (Administrador o Recepcionista)
 * 
 * Nota: Este es un sistema de demostración. En producción,
 * esto debe conectarse a un servidor real de autenticación.
 */
export default function LoginPage() {
  // Estado para guardar los datos del formulario (email y contraseña)
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  })
  
  // Estado para mostrar mensajes de error
  const [error, setError] = useState('')
  
  // Estado para carga
  const [loading, setLoading] = useState(false)
  
  // Hook para navegar a otras páginas
  const navigate = useNavigate()
  
  // Obtener la función login del contexto de autenticación
  const { login } = useAuth()

  /**
   * Maneja cambios en los campos del formulario (email, password)
   * Actualiza el estado formData de manera dinámica
   * 
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    // Usar spread operator para no perder los otros campos
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /**
   * Maneja el envío del formulario de login
   * Llama al backend para autenticar al usuario
   * 
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // VALIDACIÓN: Verificar que los campos estén completos
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    try {
      // Llamar al backend
      const response = await fetch('http://localhost/roommaster_api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          contraseña: formData.password
        })
      })
      
      const data = await response.json()

      if (data.success) {
        // Guardar token en localStorage
        localStorage.setItem('token', data.datos.token)
        
        // Crear userData del contexto
        const userData = {
          id: data.datos.usuario.id,
          name: data.datos.usuario.nombre,
          email: data.datos.usuario.email,
          role: data.datos.usuario.rol
        }
        
        // Llamar login del contexto
        login(userData)
        
        // Redirigir al dashboard
        navigate('/dashboard')
      } else {
        setError(data.mensaje || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError('Error de conexión. Verifica que el backend está activo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-box-left">
            <h1>RoomMaster</h1>
            <p>Gestión completa para tu hotel. Controla todo desde un solo lugar.</p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">📊</span>
                <p className="auth-feature-text">Dashboard en tiempo real</p>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">🏨</span>
                <p className="auth-feature-text">Gestión de reservas y huéspedes</p>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">💳</span>
                <p className="auth-feature-text">Facturación automática</p>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">📦</span>
                <p className="auth-feature-text">Control de inventario</p>
              </div>
            </div>
          </div>

          <div className="auth-box-right">
            <h2>Iniciar Sesión</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <p className="auth-link">
              ¿No tienes cuenta? <a onClick={() => navigate('/register')}>Regístrate aquí</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
