import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/common/Icon'
import logo from '../../assets/images/logo.svg'
import './AuthPage.css'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [role, setRole] = useState('admin')
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'password') {
      const { strength } = validatePasswordStrength(value)
      setPasswordStrength(strength)
    }
  }

  const handleRoleChange = (e) => {
    setRole(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos')
      return
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      // Enviar solicitud al backend
      const response = await fetch('http://localhost/RoomMaster_Prueba/backend/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.name,
          email: formData.email,
          contraseña: formData.password,
          rol: role
        })
      })
      
      const data = await response.json()

      if (data.exito) {
        // Guardar datos en localStorage
        localStorage.setItem('token', data.datos.token)
        
        const userData = {
          id: data.datos.id,
          name: data.datos.nombre,
          email: data.datos.email,
          role: data.datos.rol
        }
        
        // Hacer login automático
        login(userData)
        
        // Redirigir al dashboard
        navigate('/dashboard')
      } else {
        setError(data.mensaje || 'Error al registrarse')
      }
    } catch (err) {
      setError('Error de conexión. Verifica que el backend está activo.')
      console.error(err)
    }
  }

  const { checks: passwordChecks } = formData.password ? validatePasswordStrength(formData.password) : {
    checks: { length: false, uppercase: false, lowercase: false, number: false, special: false }
  }

  return (
    <div className="auth-page">
      <button className="back-to-home" onClick={() => navigate('/')} title="Volver a inicio">
        ←
      </button>
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-box-left">
            <img src={logo} alt="RoomMaster" className="auth-logo" />
            <h1>RoomMaster</h1>
            <p>Únete a los hoteles que ya optimizan su gestión con nosotros.</p>
            <div className="auth-features">
              <div className="auth-feature">
                <Icon name="lightning" size={20} className="white" />
                <p className="auth-feature-text">Comienza gratis</p>
              </div>
              <div className="auth-feature">
                <Icon name="rocket" size={20} className="white" />
                <p className="auth-feature-text">Implementación rápida</p>
              </div>
              <div className="auth-feature">
                <Icon name="users" size={20} className="white" />
                <p className="auth-feature-text">Soporte profesional</p>
              </div>
              <div className="auth-feature">
                <Icon name="lock" size={20} className="white" />
                <p className="auth-feature-text">100% seguro</p>
              </div>
            </div>
          </div>

          <div className="auth-box-right">
            <h2>Crear Cuenta</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
              </div>

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
                <label>Tipo de usuario</label>
                <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={handleRoleChange}
                      style={{ marginRight: '6px' }}
                    />
                    <span>🔑 Administrador</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="radio"
                      name="role"
                      value="receptionist"
                      checked={role === 'receptionist'}
                      onChange={handleRoleChange}
                      style={{ marginRight: '6px' }}
                    />
                    <span>👤 Recepcionista</span>
                  </label>
                </div>
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
                    </div>
                  </>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Registrarse
              </button>
            </form>

            <p className="auth-link">
              ¿Ya tienes cuenta? <a onClick={() => navigate('/login')}>Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
