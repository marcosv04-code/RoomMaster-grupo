import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Icon from '../../components/common/Icon'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import { usePermissions } from '../../hooks/usePermissions'
import './ModulePage.css'

const API = `${window.location.origin}/backend`

export default function PerfilPage() {
  const { user } = useAuth()
  const { isAdmin } = usePermissions()
  
  const [userProfile, setUserProfile] = useState({
    nombre: user?.name || 'Usuario',
    email: user?.email || '',
    rol: user?.role || '',
  })

  const [editingName, setEditingName] = useState(false)
  const [editNameValue, setEditNameValue] = useState(userProfile.nombre)

  const [passwordData, setPasswordData] = useState({
    actual: '',
    nueva: '',
    confirmar: '',
  })

  const [settings, setSettings] = useState({
    notificacionesEmail: true,
    notificacionesPush: true,
    backupAutomatico: true,
  })

  const [savedMessage, setSavedMessage] = useState('')

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (!passwordData.actual || !passwordData.nueva || !passwordData.confirmar) {
      alert('Por favor completa todos los campos')
      return
    }
    if (passwordData.nueva !== passwordData.confirmar) {
      alert('Las contraseñas no coinciden')
      return
    }
    if (passwordData.nueva.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return
    }

    // Cambiar contraseña en el backend
    cambiarContraseña()
  }

  async function cambiarContraseña() {
    try {
      const res = await fetch(`${API}/usuarios.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          requesting_user_id: user?.id,
          rol: user?.role,
          contraseña_actual: passwordData.actual,
          contraseña_nueva: passwordData.nueva
        })
      })
      const data = await res.json()
      if (data.exito) {
        setPasswordData({ actual: '', nueva: '', confirmar: '' })
        setSavedMessage('Contraseña actualizada correctamente')
        setTimeout(() => setSavedMessage(''), 3000)
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      alert('Error al cambiar la contraseña')
    }
  }

  const handleToggleSetting = (setting) => {
    if (setting === 'notificacionesEmail' || setting === 'notificacionesPush' || setting === 'backupAutomatico') {
      setSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }))
      setSavedMessage('Configuración actualizada')
    }
    setTimeout(() => setSavedMessage(''), 2000)
  }

  const handleEditName = () => {
    setEditingName(true)
    setEditNameValue(userProfile.nombre)
  }

  const handleCancelEditName = () => {
    setEditingName(false)
    setEditNameValue(userProfile.nombre)
  }

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadingPhoto(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64Photo = event.target.result
        localStorage.setItem(`profilePhoto_${user?.id}`, base64Photo)
        setUserProfile(prev => ({
          ...prev,
          foto: base64Photo
        }))
        setSavedMessage('Foto de perfil actualizada')
        setTimeout(() => setSavedMessage(''), 2000)
        setUploadingPhoto(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    localStorage.removeItem(`profilePhoto_${user?.id}`)
    setUserProfile(prev => ({
      ...prev,
      foto: null
    }))
    setSavedMessage('Foto de perfil removida')
    setTimeout(() => setSavedMessage(''), 2000)
  }

  const handleSaveName = async () => {
    if (!editNameValue.trim()) {
      alert('El nombre no puede estar vacío')
      return
    }

    try {
      const res = await fetch(`${API}/usuarios.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          requesting_user_id: user?.id,
          rol: user?.role,
          nombre: editNameValue.trim()
        })
      })
      const data = await res.json()
      if (data.exito) {
        setUserProfile(prev => ({
          ...prev,
          nombre: editNameValue.trim()
        }))
        setEditingName(false)
        setSavedMessage('Nombre actualizado correctamente')
        setTimeout(() => setSavedMessage(''), 3000)
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (error) {
      console.error('Error al actualizar nombre:', error)
      alert('Error al actualizar el nombre')
    }
  }

  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Icon name="user" size={32} className="primary" />
          <h1 style={{ margin: 0 }}>Perfil y Configuración</h1>
        </div>
        <p className="page-subtitle">Gestiona tu información personal y preferencias</p>

        {savedMessage && (
          <div style={{
            background: '#4caf50',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {savedMessage}
          </div>
        )}

        {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Icon name="user" size={32} className="primary" />
            <h2 style={{ marginBottom: 0 }}>Información Personal</h2>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2196F3, #1565c0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px'
              }}>
              </div>
              <div style={{ flex: 1 }}>
                {editingName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '16px',
                        fontWeight: '700',
                        border: '2px solid #2196F3',
                        borderRadius: '4px',
                        flex: 1,
                        maxWidth: '300px'
                      }}
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSaveName()
                      }}
                    />
                    <button
                      onClick={handleSaveName}
                      style={{
                        padding: '6px 12px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEditName}
                      style={{
                        padding: '6px 12px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{userProfile.nombre}</div>
                    <button
                      onClick={handleEditName}
                      style={{
                        padding: '4px 8px',
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      Editar
                    </button>
                  </div>
                )}
                <div style={{ fontSize: '14px', color: '#666' }}>{userProfile.email}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Rol: {userProfile.rol}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#f8f9fb', borderRadius: '8px', borderLeft: '4px solid #2196F3' }}>
                <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>CORREO ELÓTRÓNICO</div>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>{userProfile.email}</div>
              </div>

              <div style={{ padding: '16px', background: '#f8f9fb', borderRadius: '8px', borderLeft: '4px solid #FF9800' }}>
                <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>ROL</div>
                <div style={{ fontSize: '15px', fontWeight: '600', textTransform: 'capitalize' }}>{userProfile.rol}</div>
              </div>

              <div style={{ padding: '16px', background: '#f8f9fb', borderRadius: '8px', borderLeft: '4px solid #4CAF50' }}>
                <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>ESTADO</div>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>Activo</div>
              </div>
            </div>

            <p style={{ color: '#999', fontSize: '12px', marginTop: '16px' }}>La información personal la administra el personal de administración. Contacta a tu gestor para cambios.</p>
          </div>
        </div>

        {/* SECCIÓN 2: SEGURIDAD - Solo para administrador */}
        {isAdmin && (
          <div className="dashboard-section" style={{ marginBottom: '32px' }}>
            <h2>Seguridad de la Cuenta</h2>

            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Cambiar Contraseña</h3>
              <form onSubmit={handleChangePassword} style={{ background: '#f8f9fb', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #F44336' }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Contraseña Actual</label>
                    <input
                      type="password"
                      placeholder="Ingresa tu contraseña actual"
                      value={passwordData.actual}
                      onChange={(e) => setPasswordData({ ...passwordData, actual: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input
                      type="password"
                      placeholder="Crea una nueva contraseña"
                      value={passwordData.nueva}
                      onChange={(e) => setPasswordData({ ...passwordData, nueva: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirmar Contraseña</label>
                    <input
                      type="password"
                      placeholder="Confirma la nueva contraseña"
                      value={passwordData.confirmar}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmar: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px', fontSize: '12px', color: '#999', marginBottom: '16px' }}>
                  La contraseña debe tener al menos 6 caracteres
                </div>

                <button type="submit" className="btn btn-primary">
                  Actualizar Contraseña
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: CONFIGURACIÓN */}
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2>Configuración</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div style={{ padding: '16px', background: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196F3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Notificaciones por Email</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Recibe alertas por correo</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notificacionesEmail}
                onChange={() => handleToggleSetting('notificacionesEmail')}
                style={{ cursor: 'pointer', width: '20px', height: '20px' }}
              />
            </div>

            <div style={{ padding: '16px', background: '#f3e5f5', borderRadius: '8px', borderLeft: '4px solid #9C27B0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>🔔 Notificaciones Push</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Alertas en tiempo real</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notificacionesPush}
                onChange={() => handleToggleSetting('notificacionesPush')}
                style={{ cursor: 'pointer', width: '20px', height: '20px' }}
              />
            </div>

            <div style={{ padding: '16px', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4CAF50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>💾 Backup Automático</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Respaldar datos automáticamente</div>
              </div>
              <input
                type="checkbox"
                checked={settings.backupAutomatico}
                onChange={() => handleToggleSetting('backupAutomatico')}
                style={{ cursor: 'pointer', width: '20px', height: '20px' }}
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: ACERCA DE */}
        <div className="dashboard-section">
          <h2>ℹ️ Acerca de RoomMaster</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div style={{ padding: '16px', background: '#e1f5fe', borderRadius: '8px', borderLeft: '4px solid #00BCD4' }}>
              <div style={{ fontSize: '12px', color: '#006580', fontWeight: '600', marginBottom: '4px' }}>VERSIÓN</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#004d7a' }}>1.0.0</div>
            </div>

            <div style={{ padding: '16px', background: '#f1f8e9', borderRadius: '8px', borderLeft: '4px solid #8BC34A' }}>
              <div style={{ fontSize: '12px', color: '#558b2f', fontWeight: '600', marginBottom: '4px' }}>ÚLTIMA ACTUALIZACIÓN</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#33691e' }}>Febrero 2026</div>
            </div>

            <div style={{ padding: '16px', background: '#fce4ec', borderRadius: '8px', borderLeft: '4px solid #E91E63' }}>
              <div style={{ fontSize: '12px', color: '#880e4f', fontWeight: '600', marginBottom: '4px' }}>DESARROLLADO EN</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#ad1457' }}>Colombia 🇨🇴</div>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '16px', background: '#f8f9fb', borderRadius: '8px', fontSize: '13px', color: '#666', textAlign: 'center' }}>
            <div style={{ marginBottom: '8px' }}>Gracias por usar <strong>RoomMaster</strong></div>
            <div>Tu sistema de gestión hotelera inteligente</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
