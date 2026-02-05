import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './AuthPage.css'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validación simple
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos')
      return
    }

    // Simulación de login (reemplazar con llamada real a API)
    try {
      const userData = {
        id: 1,
        name: 'Juan Pérez',
        email: formData.email,
        role: 'Administrador'
      }
      
      login(userData)
      localStorage.setItem('token', 'fake-jwt-token-' + Date.now())
      navigate('/dashboard')
    } catch (err) {
      setError('Error al iniciar sesión')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <h1>RoomMaster</h1>
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
  )
}
