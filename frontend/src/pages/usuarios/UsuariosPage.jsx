import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Table from '../../components/common/Table'
import Icon from '../../components/common/Icon'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from '../../services/api'
import './ModulePage.css'

const MySwal = withReactContent(Swal)

export default function UsuariosPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  
  console.log('UsuariosPage - user:', user)
  console.log('UsuariosPage - isAdmin:', isAdmin)
  console.log('UsuariosPage - user?.role:', user?.role)
  
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarPassword, setMostrarPassword] = useState({})

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      setCargando(true)
      const response = await api.get('/backend/usuarios.php')
      if (response.data.success) {
        setUsuarios(response.data.data)
      }
    } catch (error) {
      MySwal.fire('Error', 'No se pudieron cargar los usuarios', 'error')
    } finally {
      setCargando(false)
    }
  }

  const toggleEstado = async (fila) => {
    const nuevoEstado = fila.estado === 'activo' ? 'inactivo' : 'activo'
    
    const resultado = await MySwal.fire({
      title: '¿Cambiar estado?',
      text: `¿Deseas cambiar el estado a ${nuevoEstado}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    })

    if (!resultado.isConfirmed) return

    try {
      const response = await api.patch('/backend/usuarios.php', {
        user_id: fila.id,
        estado: nuevoEstado,
        rol: user.role
      })

      if (response.data.success) {
        setUsuarios(usuarios.map(u => 
          u.id === fila.id ? { ...u, estado: nuevoEstado } : u
        ))
        MySwal.fire('Éxito', `Usuario ${nuevoEstado}`, 'success')
      }
    } catch (error) {
      MySwal.fire('Error', 'No se pudo cambiar el estado', 'error')
    }
  }

  const eliminarUsuario = async (fila) => {
    const resultado = await MySwal.fire({
      title: '¿Eliminar usuario?',
      text: `¿Eliminar a ${fila.nombre}? No se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33'
    })

    if (!resultado.isConfirmed) return

    try {
      const response = await api.delete('/backend/usuarios.php', {
        data: {
          id: fila.id,
          rol: user.role
        }
      })

      if (response.data.success) {
        setUsuarios(usuarios.filter(u => u.id !== fila.id))
        MySwal.fire('Éxito', 'Usuario eliminado', 'success')
      }
    } catch (error) {
      MySwal.fire('Error', 'No se pudo eliminar el usuario', 'error')
    }
  }

  const toggleMostrarPassword = (usuarioId) => {
    setMostrarPassword(prev => ({
      ...prev,
      [usuarioId]: !prev[usuarioId]
    }))
  }

  if (cargando) return (
    <div className="module-page">
      <div className="page-header"><h1>Gestión de Usuarios</h1></div>
      <div style={{ textAlign: 'center', padding: '40px' }}>Cargando...</div>
    </div>
  )

  return (
    <div className="module-page">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
      </div>
      <div className="page-content">
        {usuarios.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
            No hay usuarios
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'var(--color-card-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', fontSize: '13px' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', fontSize: '13px' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', fontSize: '13px' }}>Hotel</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', fontSize: '13px' }}>Rol</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', fontSize: '13px' }}>Estado</th>
                  {isAdmin && <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', fontSize: '13px' }}>Contraseña</th>}
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', fontSize: '13px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px' }}>{u.nombre}</td>
                    <td style={{ padding: '12px' }}>{u.email}</td>
                    <td style={{ padding: '12px' }}>{u.hotel}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: u.rol === 'admin' ? '#FFE0B2' : '#E1BEE7',
                        color: u.rol === 'admin' ? '#E65100' : '#6A1B9A'
                      }}>
                        {u.rol}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: u.estado === 'activo' ? '#C8E6C9' : '#FFCDD2',
                        color: u.estado === 'activo' ? '#1B5E20' : '#B71C1C'
                      }}>
                        {u.estado}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            {mostrarPassword[u.id] ? u.contraseña : '••••••••'}
                          </span>
                          <button
                            onClick={() => toggleMostrarPassword(u.id)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}
                          >
                            <Icon name={mostrarPassword[u.id] ? 'eye' : 'eye-off'} size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {isAdmin && (
                          <button
                            onClick={() => toggleEstado(u)}
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '700',
                              border: 'none',
                              borderRadius: '6px',
                              backgroundColor: u.estado === 'activo' ? '#FF6B6B' : '#4ECDC4',
                              color: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            {u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => eliminarUsuario(u)}
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '700',
                              border: 'none',
                              borderRadius: '6px',
                              backgroundColor: '#ff4757',
                              color: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
