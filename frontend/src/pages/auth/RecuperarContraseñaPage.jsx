import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Icon from '../../components/common/Icon'
import './AuthPage.css'

const API = '/backend'

export default function RecuperarContraseñaPage() {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1) // 1: verificar, 2: cambiar contraseña
  const [loading, setLoading] = useState(false)
  
  // Paso 1: Verificar email y teléfono
  const [formVerificacion, setFormVerificacion] = useState({
    email: '',
    telefono: ''
  })
  
  // Paso 2: Nueva contraseña
  const [formContraseña, setFormContraseña] = useState({
    nueva_contrasena: '',
    confirmar_contrasena: ''
  })
  
  const [usuarioVerificado, setUsuarioVerificado] = useState(null)

  // Paso 1: Verificar email y teléfono
  const handleVerificar = async (e) => {
    e.preventDefault()
    
    if (!formVerificacion.email || !formVerificacion.telefono) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa email y teléfono',
        confirmButtonColor: '#2196F3'
      })
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`${API}/recuperar_contrasena.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paso: 1,
          email: formVerificacion.email,
          telefono: formVerificacion.telefono
        })
      })
      
      const data = await response.json()
      
      if (data.exito) {
        setUsuarioVerificado(data.datos)
        setPaso(2)
        Swal.fire({
          icon: 'success',
          title: 'Verificación exitosa',
          text: `¡Hola ${data.datos.nombre}! Ahora ingresa tu nueva contraseña`,
          confirmButtonColor: '#2196F3'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'Email o teléfono no coinciden',
          confirmButtonColor: '#2196F3'
        })
      }
    } catch (error) {
      console.error('Error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al verificar datos',
        confirmButtonColor: '#2196F3'
      })
    } finally {
      setLoading(false)
    }
  }

  // Paso 2: Cambiar contraseña
  const handleCambiarContraseña = async (e) => {
    e.preventDefault()
    
    if (!formContraseña.nueva_contrasena || !formContraseña.confirmar_contrasena) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa ambas contraseñas',
        confirmButtonColor: '#2196F3'
      })
      return
    }
    
    if (formContraseña.nueva_contrasena.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña débil',
        text: 'La contraseña debe tener al menos 6 caracteres',
        confirmButtonColor: '#2196F3'
      })
      return
    }
    
    if (formContraseña.nueva_contrasena !== formContraseña.confirmar_contrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        text: 'Verifica que ambas sean iguales',
        confirmButtonColor: '#2196F3'
      })
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`${API}/recuperar_contrasena.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paso: 2,
          usuario_id: usuarioVerificado.usuario_id,
          nueva_contrasena: formContraseña.nueva_contrasena
        })
      })
      
      const data = await response.json()
      
      if (data.exito) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Contraseña cambiada correctamente',
          confirmButtonColor: '#2196F3'
        }).then(() => {
          navigate('/login')
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'Error al cambiar contraseña',
          confirmButtonColor: '#2196F3'
        })
      }
    } catch (error) {
      console.error('Error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cambiar contraseña',
        confirmButtonColor: '#2196F3'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '8px' }}>
            <Icon name="lock" size={40} className="primary" />
          </div>
          <h1 style={{ margin: '0 0 8px 0' }}>Recuperar Contraseña</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            {paso === 1 ? 'Verifica tu identidad con email y teléfono' : 'Ingresa tu nueva contraseña'}
          </p>
        </div>

        {/* Formulario Paso 1 - Verificación */}
        {paso === 1 && (
          <form onSubmit={handleVerificar} className="auth-form">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={formVerificacion.email}
                onChange={(e) => setFormVerificacion(prev => ({ ...prev, email: e.target.value }))}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                placeholder="Ej: 3001234567"
                value={formVerificacion.telefono}
                onChange={(e) => setFormVerificacion(prev => ({ ...prev, telefono: e.target.value }))}
                disabled={loading}
                required
              />
              <small style={{ color: 'var(--color-text-secondary)' }}>Ingresa el teléfono registrado en tu perfil</small>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Verificar Identidad'}
            </button>
          </form>
        )}

        {/* Formulario Paso 2 - Nueva Contraseña */}
        {paso === 2 && usuarioVerificado && (
          <form onSubmit={handleCambiarContraseña} className="auth-form">
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid rgba(76, 175, 80, 0.3)'
            }}>
              <p style={{ margin: 0, color: '#2e7d32', fontSize: '14px', fontWeight: '600' }}>
                ✓ Usuario verificado: {usuarioVerificado.nombre}
              </p>
            </div>

            <div className="form-group">
              <label>Nueva Contraseña *</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formContraseña.nueva_contrasena}
                onChange={(e) => setFormContraseña(prev => ({ ...prev, nueva_contrasena: e.target.value }))}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirmar Contraseña *</label>
              <input
                type="password"
                placeholder="Repite la contraseña"
                value={formContraseña.confirmar_contrasena}
                onChange={(e) => setFormContraseña(prev => ({ ...prev, confirmar_contrasena: e.target.value }))}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-full"
              onClick={() => {
                setPaso(1)
                setUsuarioVerificado(null)
                setFormContraseña({ nueva_contrasena: '', confirmar_contrasena: '' })
              }}
              disabled={loading}
            >
              Volver
            </button>
          </form>
        )}

        {/* Link para volver al login */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            ← Volver al login
          </button>
        </div>
      </div>
    </div>
  )
}
