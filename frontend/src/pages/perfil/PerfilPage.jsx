import { useState } from 'react'
import Swal from 'sweetalert2'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../hooks/useAuth'
import { usePermissions } from '../../hooks/usePermissions'
import './ModulePage.css'

const API = '/backend'

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
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#2196F3'
      })
      return
    }
    if (passwordData.nueva !== passwordData.confirmar) {
      Swal.fire({
        icon: 'error',
        title: 'Las contraseñas no coinciden',
        text: 'Verifica que ambas contraseñas sean iguales',
        confirmButtonColor: '#2196F3'
      })
      return
    }
    if (passwordData.nueva.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña débil',
        text: 'La contraseña debe tener al menos 6 caracteres',
        confirmButtonColor: '#2196F3'
      })
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
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Contraseña actualizada correctamente',
          confirmButtonColor: '#2196F3'
        })
        setSavedMessage('Contraseña actualizada correctamente')
        setTimeout(() => setSavedMessage(''), 3000)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'Error al cambiar la contraseña',
          confirmButtonColor: '#2196F3'
        })
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cambiar la contraseña',
        confirmButtonColor: '#2196F3'
      })
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
      Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'El nombre no puede estar vacío',
        confirmButtonColor: '#2196F3'
      })
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
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Nombre actualizado correctamente',
          confirmButtonColor: '#2196F3'
        })
        setSavedMessage('Nombre actualizado correctamente')
        setTimeout(() => setSavedMessage(''), 3000)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'Error al actualizar nombre',
          confirmButtonColor: '#2196F3'
        })
      }
    } catch (error) {
      console.error('Error al actualizar nombre:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar el nombre',
        confirmButtonColor: '#2196F3'
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Icon name="user" size={32} className="primary" />
          <h1 style={{ margin: 0 }}>Perfil</h1>
        </div>
        <p className="page-subtitle">Gestiona tu información personal</p>

        {savedMessage && (
          <div style={{
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            color: 'var(--color-success)',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid var(--color-success)'
          }}>
            {savedMessage}
          </div>
        )}

        {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--color-text)', marginBottom: '16px' }}>Información Personal</h2>

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
                fontSize: '40px',
                color: 'white'
              }}>
                👤
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
                        border: '1px solid var(--color-primary)',
                        borderRadius: '4px',
                        flex: 1,
                        maxWidth: '300px',
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text)',
                        fontFamily: 'inherit'
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
                        background: 'var(--color-success)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        fontFamily: 'inherit'
                      }}
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEditName}
                      style={{
                        padding: '6px 12px',
                        background: 'var(--color-error)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        fontFamily: 'inherit'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text)' }}>
                      {userProfile.nombre}
                    </div>
                  </div>
                )}
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  {userProfile.email}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                  Rol: {userProfile.rol}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: 'var(--color-card-background)',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                borderLeft: '3px solid var(--color-primary)'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '600', marginBottom: '4px' }}>
                  EMAIL
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>
                  {userProfile.email}
                </div>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: 'var(--color-card-background)',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                borderLeft: '3px solid #FF9800'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '600', marginBottom: '4px' }}>
                  ROL
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', textTransform: 'capitalize' }}>
                  {userProfile.rol}
                </div>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: 'var(--color-card-background)',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                borderLeft: '3px solid var(--color-success)'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '600', marginBottom: '4px' }}>
                  ESTADO
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>
                  Activo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: SEGURIDAD - Solo para administrador */}
        {isAdmin && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: 'var(--color-text)', marginBottom: '16px' }}>Cambiar Contraseña</h2>

            <form onSubmit={handleChangePassword} style={{
              backgroundColor: 'var(--color-card-background)',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text)' }}>Contraseña Actual</label>
                  <input
                    type="password"
                    placeholder="Tu contraseña actual"
                    value={passwordData.actual}
                    onChange={(e) => setPasswordData({ ...passwordData, actual: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text)' }}>Nueva Contraseña</label>
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={passwordData.nueva}
                    onChange={(e) => setPasswordData({ ...passwordData, nueva: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text)' }}>Confirmar Contraseña</label>
                  <input
                    type="password"
                    placeholder="Confirma la contraseña"
                    value={passwordData.confirmar}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmar: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text)',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Mínimo 6 caracteres
              </div>

              <button type="submit" style={{
                padding: '8px 16px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'inherit'
              }}>
                Actualizar Contraseña
              </button>
            </form>
          </div>
        )}

        {/* SECCIÓN 3: CONFIGURACIÓN */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--color-text)', marginBottom: '16px' }}>Configuración</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <label style={{
              padding: '12px',
              backgroundColor: 'var(--color-card-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={settings.notificacionesEmail}
                onChange={() => handleToggleSetting('notificacionesEmail')}
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--color-text)' }}>Email</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Alertas por correo</div>
              </div>
            </label>

            <label style={{
              padding: '12px',
              backgroundColor: 'var(--color-card-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={settings.notificacionesPush}
                onChange={() => handleToggleSetting('notificacionesPush')}
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--color-text)' }}>Push</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Alertas en tiempo real</div>
              </div>
            </label>

            <label style={{
              padding: '12px',
              backgroundColor: 'var(--color-card-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={settings.backupAutomatico}
                onChange={() => handleToggleSetting('backupAutomatico')}
                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--color-text)' }}>Backup</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Respaldos automáticos</div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
