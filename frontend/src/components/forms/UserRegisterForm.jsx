import { useState } from 'react'
import Icon from '../common/Icon'
import './UserRegisterForm.css'

export default function UserRegisterForm({ onSubmit, isLoading = false, showRoleSelection = true }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [role, setRole] = useState('recepcion')
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

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

    if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
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

    // Llamar la función onSubmit pasada como prop
    await onSubmit({
      nombre: formData.nombre,
      email: formData.email,
      contraseña: formData.password,
      rol: role
    }, setError, resetForm)
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    setRole('recepcion')
    setPasswordStrength(0)
    setError('')
  }

  const { checks: passwordChecks } = formData.password ? validatePasswordStrength(formData.password) : {
    checks: { length: false, uppercase: false, lowercase: false, number: false, special: false }
  }

  return (
    <form onSubmit={handleSubmit} className="user-register-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="nombre">Nombre Completo</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>

      {showRoleSelection && (
        <div className="form-group">
          <label>Tipo de usuario</label>
          <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="radio"
                name="role"
                value="recepcion"
                checked={role === 'recepcion'}
                onChange={handleRoleChange}
                disabled={isLoading}
                style={{ marginRight: '6px' }}
              />
              <span>👤 Recepcionista</span>
            </label>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Registrar Usuario'}
      </button>
    </form>
  )
}
