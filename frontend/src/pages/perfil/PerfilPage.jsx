import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useTheme } from '../../hooks/useTheme'
import './ModulePage.css'

export default function PerfilPage() {
  const { isDarkMode, toggleTheme } = useTheme()
  
  const [userProfile, setUserProfile] = useState({
    nombre: 'Carlos Rodríguez',
    email: 'carlos@roommaster.com',
    hotel: 'Hotel Grand Plaza',
    telefono: '+57 (1) 555-0123',
    ciudad: 'Bogotá, Colombia',
    direccion: 'Calle 45 #23-67, Bogotá',
  })

  const [editProfile, setEditProfile] = useState(false)
  const [formData, setFormData] = useState(userProfile)

  const [passwordData, setPasswordData] = useState({
    actual: '',
    nueva: '',
    confirmar: '',
  })

  const [settings, setSettings] = useState({
    notificacionesEmail: true,
    notificacionesPush: true,
    backupAutomatico: true,
    dosFactores: false,
  })

  const [savedMessage, setSavedMessage] = useState('')

  const handleSaveProfile = () => {
    if (!formData.nombre.trim() || !formData.email.trim()) {
      alert('Nombre y email son requeridos')
      return
    }
    setUserProfile(formData)
    setEditProfile(false)
    setSavedMessage('✓ Perfil actualizado correctamente')
    setTimeout(() => setSavedMessage(''), 3000)
  }

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
    if (passwordData.nueva.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres')
      return
    }
    setPasswordData({ actual: '', nueva: '', confirmar: '' })
    setSavedMessage('✓ Contraseña actualizada correctamente')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const handleToggleSetting = (setting) => {
    if (setting === 'temaOscuro') {
      toggleTheme()
      setSavedMessage('✓ Tema actualizado')
    } else {
      setSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }))
      setSavedMessage('✓ Configuración actualizada')
    }
    setTimeout(() => setSavedMessage(''), 2000)
  }

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Perfil y Configuración</h1>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>👤 Información Personal</h2>
            {!editProfile && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setEditProfile(true)
                  setFormData(userProfile)
                }}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Editar
              </button>
            )}
          </div>

          {!editProfile ? (
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
                  👤
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{userProfile.nombre}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{userProfile.email}</div>
                  <div style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>{userProfile.hotel}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#f8f9fb', borderRadius: '8px', borderLeft: '4px solid #2196F3' }}>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>📧 CORREO ELECTRÓNICO</div>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{userProfile.email}</div>
                </div>

                <div style={{ padding: '16px', background: '#f8f9fb', borderRadius: '8px', borderLeft: '4px solid #4CAF50' }}>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>📞 TELÉFONO</div>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{userProfile.telefono}</div>
                </div>

                <div style={{ padding: '16px', background: '#f8f9fb', borderRadius: '8px', borderLeft: '4px solid #FF9800' }}>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>🏨 HOTEL</div>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{userProfile.hotel}</div>
                </div>

                <div style={{ padding: '16px', background: '#f8f9fb', borderRadius: '8px', borderLeft: '4px solid #9C27B0' }}>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>📍 CIUDAD</div>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{userProfile.ciudad}</div>
                </div>

                <div style={{ gridColumn: 'span 1', padding: '16px', background: '#f8f9fb', borderRadius: '8px', borderLeft: '4px solid #00BCD4' }}>
                  <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>🏠 DIRECCIÓN</div>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{userProfile.direccion}</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Nombre del Hotel</label>
                  <input
                    type="text"
                    value={formData.hotel}
                    onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                    placeholder="Nombre de tu hotel"
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="+57 (1) 555-0000"
                  />
                </div>

                <div className="form-group">
                  <label>Ciudad</label>
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    placeholder="Tu ciudad"
                  />
                </div>

                <div className="form-group">
                  <label>Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Dirección completa"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button className="btn btn-primary" onClick={handleSaveProfile}>
                  Guardar Cambios
                </button>
                <button className="btn btn-secondary" onClick={() => setEditProfile(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECCIÓN 2: SEGURIDAD */}
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2>🔒 Seguridad de la Cuenta</h2>

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
                ℹ️ La contraseña debe tener al menos 8 caracteres
              </div>

              <button type="submit" className="btn btn-primary">
                Actualizar Contraseña
              </button>
            </form>
          </div>

          <div style={{ marginTop: '24px' }}>
            <div style={{ padding: '16px', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4CAF50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>🔐 Autenticación de Dos Factores</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Añade una capa extra de seguridad a tu cuenta</div>
              </div>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.dosFactores}
                  onChange={() => handleToggleSetting('dosFactores')}
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: NOTIFICACIONES */}
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2>🔔 Notificaciones</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div style={{ padding: '16px', background: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196F3', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>📧 Notificaciones por Email</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Recibe alertas por correo</div>
              </div>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notificacionesEmail}
                  onChange={() => handleToggleSetting('notificacionesEmail')}
                  style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                />
              </label>
            </div>

            <div style={{ padding: '16px', background: '#f3e5f5', borderRadius: '8px', borderLeft: '4px solid #9C27B0', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>🔔 Notificaciones Push</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Alertas en tiempo real</div>
              </div>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.notificacionesPush}
                  onChange={() => handleToggleSetting('notificacionesPush')}
                  style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                />
              </label>
            </div>

            <div style={{ padding: '16px', background: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #FF9800', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>💾 Backup Automático</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Respaldo diario de datos</div>
              </div>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.backupAutomatico}
                  onChange={() => handleToggleSetting('backupAutomatico')}
                  style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: APARIENCIA */}
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2>🎨 Apariencia</h2>

          <div style={{ padding: '16px', background: isDarkMode ? '#2a2a2a' : '#f0f4f8', borderRadius: '8px', borderLeft: `4px solid ${isDarkMode ? '#FFC107' : '#2196F3'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>🌙 Tema Oscuro</div>
              <div style={{ fontSize: '12px', color: isDarkMode ? '#aaa' : '#666' }}>
                {isDarkMode ? 'Modo oscuro activo' : 'Activa el modo oscuro para la noche'}
              </div>
            </div>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => handleToggleSetting('temaOscuro')}
                style={{ cursor: 'pointer', width: '20px', height: '20px' }}
              />
            </label>
          </div>
        </div>

        {/* SECCIÓN 5: ACERCA DE */}
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
