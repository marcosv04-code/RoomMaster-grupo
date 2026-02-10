import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './AuthPage.css'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()
  const { login } = useAuth()

  // Validar fortaleza de contraseña
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

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos')
      return
    }

    const { checks } = validatePasswordStrength(formData.password)
    if (!checks.length || !checks.uppercase || !checks.lowercase || !checks.number) {
      setError('La contraseña no cumple con los requisitos de seguridad')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      const userData = {
        id: 1,
        name: formData.name,
        email: formData.email,
        role: 'Administrador'
      }

      login(userData)
      localStorage.setItem('token', 'fake-jwt-token-' + Date.now())
      navigate('/dashboard')
    } catch (err) {
      setError('Error al registrarse')
    }
  }

  const { checks: passwordChecks } = formData.password ? validatePasswordStrength(formData.password) : {
    checks: { length: false, uppercase: false, lowercase: false, number: false, special: false }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-box-left">
            <h1>RoomMaster</h1>
            <p>Únete a los hoteles que ya optimizan su gestión con nosotros.</p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">⚡</span>
                <p className="auth-feature-text">Comienza gratis</p>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">🚀</span>
                <p className="auth-feature-text">Implementación rápida</p>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">👥</span>
                <p className="auth-feature-text">Soporte profesional</p>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">🔒</span>
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
                        <span>Carácter especial (opcional pero recomendado)</span>
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
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="password-mismatch">Las contraseñas no coinciden</p>
                )}
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
