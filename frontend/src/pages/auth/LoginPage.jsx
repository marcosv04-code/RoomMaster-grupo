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
  
  // Estado para guardar el rol seleccionado (admin o receptionist)
  const [role, setRole] = useState('admin')
  
  // Estado para mostrar mensajes de error
  const [error, setError] = useState('')
  
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
   * Maneja el cambio del selector de rol
   * Permite cambiar entre Administrador y Recepcionista
   * 
   * @param {Event} e - Evento del input radio
   */
  const handleRoleChange = (e) => {
    setRole(e.target.value)
  }

  /**
   * Maneja el envío del formulario de login
   * Valida datos, crea usuario y redirige al dashboard
   * 
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault()  // Prevenir que la página se recargue
    
    // VALIDACIÓN: Verificar que los campos estén completos
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos')
      return
    }

    // NOTA: Este es un sistema de demostración (mock)
    // En una aplicación real, aquí harías una llamada HTTP a tu servidor
    try {
      // Crear nombre según el rol seleccionado
      const userName = role === 'admin' ? 'Administrador' : 'Recepcionista'
      
      // Crear objeto de usuario con los datos actuales
      const userData = {
        id: 1,
        name: userName,
        email: formData.email,
        role: role  // 'admin' o 'receptionist'
      }
      
      // Llamar la función login del contexto
      login(userData)
      
      // Guardar token falso (reemplazar con token real del servidor)
      localStorage.setItem('token', 'fake-jwt-token-' + Date.now())
      
      // Redirigir al dashboard
      navigate('/dashboard')
    } catch (err) {
      setError('Error al iniciar sesión')
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

              <div className="form-group">
                <label>Tipo de usuario</label>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={handleRoleChange}
                      style={{ marginRight: '8px' }}
                    />
                    <span>🔑 Administrador</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="role"
                      value="receptionist"
                      checked={role === 'receptionist'}
                      onChange={handleRoleChange}
                      style={{ marginRight: '8px' }}
                    />
                    <span>👤 Recepcionista</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Iniciar Sesión
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
