import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/common/Icon'
import logo from '../../assets/images/logo.svg'
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
  
  // Estado para fortaleza de contraseña
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  // Hook para navegar a otras páginas
  const navigate = useNavigate()
  
  // Obtener la función login del contexto de autenticación
  const { login } = useAuth()

  const validatePasswordStrength = (password) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }

    if (checks.length) strength += 20
    if (checks.uppercase) strength += 20
    if (checks.lowercase) strength += 20
    if (checks.number) strength += 20
    if (checks.special) strength += 20

    return { strength, checks }
  }

  const getPasswordStrengthLabel = (strength) => {
    if (strength < 40) return 'Muy débil'
    if (strength < 60) return 'Débil'
    if (strength < 80) return 'Normal'
    if (strength < 100) return 'Fuerte'
    return 'Muy fuerte'
  }

  const getPasswordStrengthColor = (strength) => {
    if (strength < 40) return '#f44336'
    if (strength < 60) return '#ff9800'
    if (strength < 80) return '#ffc107'
    if (strength < 100) return '#8bc34a'
    return '#4caf50'
  }

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

    // Calcular fortaleza de contraseña si es el campo de password
    if (name === 'password') {
      const { strength } = validatePasswordStrength(value)
      setPasswordStrength(strength)
    }
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

    // VALIDACIÓN: Verificar que la contraseña tenga mínimo 8 caracteres
    if (formData.password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres')
      setLoading(false)
      return
    }

    try {
      // Llamar al backend
      const response = await fetch('http://localhost/RoomMaster_Prueba/backend/login.php', {
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
        
        console.log('Login exitoso - Datos del usuario:', userData)
        console.log('Backend retornó:', data.datos)
        
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
      <button className="back-to-home" onClick={() => navigate('/')} title="Volvera a inicio">
        ←
      </button>
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-box-left">
            <img src={logo} alt="RoomMaster" className="auth-logo" />
            <h1>RoomMaster</h1>
            <p>Gestión completa para tu hotel. Controla todo desde un solo lugar.</p>
            <div className="auth-features">
              <div className="auth-feature">
                <Icon name="chart" size={20} className="white" />
                <p className="auth-feature-text">Dashboard en tiempo real</p>
              </div>
              <div className="auth-feature">
                <Icon name="hotel" size={20} className="white" />
                <p className="auth-feature-text">Gestión de reservas y huéspedes</p>
              </div>
              <div className="auth-feature">
                <Icon name="credit-card" size={20} className="white" />
                <p className="auth-feature-text">Facturación automática</p>
              </div>
              <div className="auth-feature">
                <Icon name="package" size={20} className="white" />
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
                {formData.password && (
                  <>
                    <div className="password-strength-bar">
                      <div 
                        className="password-strength-fill"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor(passwordStrength)
                        }}
                      ></div>
                    </div>
                    <p className="password-strength-label" style={{ color: getPasswordStrengthColor(passwordStrength) }}>
                      Fortaleza: {getPasswordStrengthLabel(passwordStrength)}
                    </p>

                    <div className="password-requirements">
                      {(() => {
                        const { checks: passwordChecks } = validatePasswordStrength(formData.password)
                        return (
                          <>
                            <div className={`requirement ${passwordChecks.length ? 'valid' : 'invalid'}`}>
                              <span>{passwordChecks.length ? '✓' : '✗'}</span>
                              <span>Mínimo 8 caracteres</span>
                            </div>
                            <div className={`requirement ${passwordChecks.uppercase ? 'valid' : 'invalid'}`}>
                              <span>{passwordChecks.uppercase ? '✓' : '✗'}</span>
                              <span>Al menos una mayúscula</span>
                            </div>
                            <div className={`requirement ${passwordChecks.lowercase ? 'valid' : 'invalid'}`}>
                              <span>{passwordChecks.lowercase ? '✓' : '✗'}</span>
                              <span>Al menos una minúscula</span>
                            </div>
                            <div className={`requirement ${passwordChecks.number ? 'valid' : 'invalid'}`}>
                              <span>{passwordChecks.number ? '✓' : '✗'}</span>
                              <span>Al menos un número</span>
                            </div>
                            <div className={`requirement ${passwordChecks.special ? 'valid' : 'invalid'}`}>
                              <span>{passwordChecks.special ? '✓' : '✗'}</span>
                              <span>Carácter especial (opcional)</span>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </>
                )}
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
