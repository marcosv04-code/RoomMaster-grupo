import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Card from '../../components/common/Card'
import Icon from '../../components/common/Icon'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import { useAuth } from '../../hooks/useAuth'
import './DashboardPage.css'
import { roomService } from '../../services/index'

const API = import.meta.env.VITE_API_URL || 'http://localhost/RoomMaster_Prueba/backend'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    habitaciones_disponibles: 0,
    habitaciones_ocupadas: 0,
    clientes_totales: 0,
    estadias_activas: 0,
    facturas_pendientes: 0,
    ingresos_mes: 0,
    productos_bajo_stock: 0,
    personal_activo: 0,
  })
  const [rooms, setRooms] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [editingStaff, setEditingStaff] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [staffForm, setStaffForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    documento_identidad: '',
    turno: 'Diurno',
    estado: 'activo',
  })
  const [newRoomForm, setNewRoomForm] = useState({
    numero: '',
    piso: '1',
    tipo: 'Simple',
    capacidad: '1',
    precio_noche: '',
    amenidades: '',
    estado: 'Disponible',
  })
  const [saving, setSaving] = useState(false)

  // Log para debugging
  useEffect(() => {
    console.log('DashboardPage - User loaded:', user)
    console.log('DashboardPage - User ID:', user?.id)
    console.log('DashboardPage - User role:', user?.role)
  }, [user])

  useEffect(() => {
    fetchStats()
    fetchRooms()
    fetchStaff()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/dashboard_stats.php`)
      const data = await res.json()
      if (data.success) setStats(data.datos)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const fetchStaff = async () => {
    try {
      const res = await fetch(`${API}/personal_limpieza.php`)
      const data = await res.json()
      if (data.success) setStaff(data.datos)
    } catch (error) {
      console.error('Error al cargar personal:', error)
    }
  }

  const handleSaveStaff = async () => {
    if (!staffForm.nombre || !staffForm.email || !staffForm.telefono) {
      alert('Completa todos los campos requeridos')
      return
    }

    setSaving(true)
    try {
      const method = editingStaff ? 'PUT' : 'POST'
      const body = editingStaff ? { ...staffForm, id: editingStaff.id } : staffForm

      const res = await fetch(`${API}/personal_limpieza.php`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (data.success) {
        fetchStaff()
        alert(editingStaff ? '✓ Personal actualizado' : '✓ Personal creado')
        setIsStaffModalOpen(false)
        resetStaffForm()
      } else {
        alert(data.mensaje)
      }
    } catch (err) {
      alert('Error al guardar personal')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteStaff = async (staff) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este personal?')) return
    
    try {
      const res = await fetch(`${API}/personal_limpieza.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: staff.id })
      })

      const data = await res.json()
      if (data.success) {
        fetchStaff()
        alert('✓ Personal eliminado')
      } else {
        alert(data.mensaje)
      }
    } catch (err) {
      alert('Error al eliminar')
      console.error(err)
    }
  }

  const resetStaffForm = () => {
    setStaffForm({
      nombre: '',
      email: '',
      telefono: '',
      documento_identidad: '',
      turno: 'Diurno',
      estado: 'activo',
    })
    setEditingStaff(null)
  }

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember)
    setStaffForm({
      nombre: staffMember.nombre,
      email: staffMember.email,
      telefono: staffMember.telefono,
      documento_identidad: staffMember.documento_identidad || '',
      turno: staffMember.turno,
      estado: staffMember.estado,
    })
    setIsStaffModalOpen(true)
  }

  const handleStaffFormChange = (e) => {
    const { name, value } = e.target
    setStaffForm(prev => ({ ...prev, [name]: value }))
  }

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API}/habitaciones.php`)
      const data = await res.json()
      if (data.success) {
        setRooms(data.datos)
      }
    } catch (error) {
      console.error('Error al cargar habitaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'numero', label: 'Habitación' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'estado', label: 'Estado' },
    { 
      key: 'precio', 
      label: 'Precio',
      render: (value) => `$${value}` 
    },
  ]

  const handleEdit = (room) => {
    setEditingRoom(room)
    setEditForm({
      numero: room.numero_habitacion,
      tipo: room.tipo,
      estado: room.estado,
      precio: room.precio_noche,
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingRoom) return

    setSaving(true)
    
    try {
      const res = await fetch(`${API}/habitaciones.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingRoom.id,
          numero_habitacion: editForm.numero,
          tipo: editForm.tipo,
          estado: editForm.estado,
          precio_noche: editForm.precio,
          user_id: user?.id,
        })
      })

      const data = await res.json()
      if (data.success) {
        fetchRooms()
        setIsEditModalOpen(false)
        setEditingRoom(null)
        setEditForm({})
        alert('✓ Habitación actualizada correctamente')
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (error) {
      console.error('Error al actualizar habitación:', error)
      alert('Error al actualizar la habitación')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (room) => {
    if (!user?.id) {
      alert('⚠️ Error: Usuario no está cargado/autenticado. Por favor recarga la página.')
      console.error('handleDelete - user object:', user)
      return
    }

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la habitación #${room.numero_habitacion}?`
    )

    if (!confirmDelete) return

    try {
      const deletePayload = { 
        id: room.id,
        user_id: user?.id,
      }
      
      console.log('Delete - User object:', user)
      console.log('Delete - User ID:', user?.id)
      console.log('Delete - Payload:', deletePayload)

      const res = await fetch(`${API}/habitaciones.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deletePayload)
      })

      const data = await res.json()
      console.log('Delete response:', data)
      
      if (data.success) {
        fetchRooms()
        alert('✓ Habitación eliminada correctamente')
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (error) {
      console.error('Error al eliminar habitación:', error)
      alert('Error al eliminar la habitación')
    }
  }

  const handleAddRoom = async () => {
    if (!newRoomForm.numero || !newRoomForm.precio_noche) {
      alert('Completa los campos requeridos (número y precio)')
      return
    }

    setSaving(true)
    
    try {
      const res = await fetch(`${API}/habitaciones.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero_habitacion: newRoomForm.numero,
          piso: parseInt(newRoomForm.piso),
          tipo: newRoomForm.tipo,
          capacidad: parseInt(newRoomForm.capacidad),
          precio_noche: parseFloat(newRoomForm.precio_noche),
          amenidades: newRoomForm.amenidades,
          estado: newRoomForm.estado,
          user_id: user?.id,
        })
      })

      const data = await res.json()
      if (data.success) {
        fetchRooms()
        setIsAddRoomModalOpen(false)
        resetNewRoomForm()
        alert('✓ Habitación agregada correctamente')
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (error) {
      console.error('Error al agregar habitación:', error)
      alert('Error al agregar la habitación')
    } finally {
      setSaving(false)
    }
  }

  const resetNewRoomForm = () => {
    setNewRoomForm({
      numero: '',
      piso: '1',
      tipo: 'Simple',
      capacidad: '1',
      precio_noche: '',
      amenidades: '',
      estado: 'Disponible',
    })
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNewRoomFormChange = (e) => {
    const { name, value } = e.target
    setNewRoomForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Icon name="chart" size={32} className="primary" />
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>Dashboard Principal</h1>
          </div>
          <p className="dashboard-subtitle" style={{ fontSize: '15px', color: '#666' }}>Resumen del estado de tu hotel hoy</p>
        </div>

        {/* MÉTRICAS PRINCIPALES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <Card 
            title="Habitaciones Disponibles" 
            value={stats.habitaciones_disponibles} 
            icon="hotel"
            subtitle="listas para huéspedes"
          />
          <Card 
            title="Estadías Activas" 
            value={stats.estadias_activas} 
            icon="users"
            subtitle="en el hotel actualmente"
          />
          <Card 
            title="Ingresos del Mes" 
            value={`$${(stats.ingresos_mes / 1000).toFixed(0)}K`} 
            icon="money"
            subtitle="pagado este mes"
          />
          <Card 
            title="Ocupación" 
            value={stats.habitaciones_ocupadas > 0 ? `${Math.round((stats.habitaciones_ocupadas / (stats.habitaciones_disponibles + stats.habitaciones_ocupadas)) * 100)}%` : '0%'} 
            icon="chart"
            subtitle="del total de habitaciones"
          />
        </div>

        {/* RESUMEN RÁPIDO DE ESTADOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          <div style={{ padding: '16px', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4CAF50', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="check-circle" size={24} />
            <div>
              <div style={{ fontSize: '12px', color: '#2e7d32', fontWeight: '600', marginBottom: '4px' }}>DISPONIBLES</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1b5e20' }}>{stats.habitaciones_disponibles}</div>
              <div style={{ fontSize: '12px', color: '#558b2f', marginTop: '4px' }}>Listas para huéspedes</div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #FF9800', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="running" size={24} />
            <div>
              <div style={{ fontSize: '12px', color: '#e65100', fontWeight: '600', marginBottom: '4px' }}>OCUPADAS</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#bf360c' }}>{stats.habitaciones_ocupadas}</div>
              <div style={{ fontSize: '12px', color: '#d84315', marginTop: '4px' }}>Con huéspedes alojados</div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#fce4ec', borderRadius: '8px', borderLeft: '4px solid #E91E63', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="phone" size={24} />
            <div>
              <div style={{ fontSize: '12px', color: '#880e4f', fontWeight: '600', marginBottom: '4px' }}>FACTURAS PENDIENTES</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#AD1457' }}>{stats.facturas_pendientes}</div>
              <div style={{ fontSize: '12px', color: '#C2185B', marginTop: '4px' }}>Por cobrar</div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196F3', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon name="package" size={24} />
            <div>
              <div style={{ fontSize: '12px', color: '#1565c0', fontWeight: '600', marginBottom: '4px' }}>BAJO STOCK</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#003d82' }}>{stats.productos_bajo_stock}</div>
              <div style={{ fontSize: '12px', color: '#1976d2', marginTop: '4px' }}>Productos por reabastecer</div>
            </div>
          </div>
        </div>

        {/* ESTADO DE HABITACIONES */}
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="hotel" size={24} className="primary" />
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Estado de Habitaciones</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => {
                    resetNewRoomForm()
                    setIsAddRoomModalOpen(true)
                  }}
                  style={{ 
                    background: '#4CAF50', 
                    color: 'white', 
                    border: 'none', 
                    padding: '8px 16px', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#388e3c'}
                  onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
                >
                  + Agregar Habitación
                </button>
              )}
              <span style={{ fontSize: '13px', color: '#999', fontWeight: '500' }}>Total: {rooms.length} habitaciones</span>
            </div>
          </div>
          
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Habitación</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Tipo</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Estado</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Precio/Noche</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, idx) => {
                    const getStateColor = (state) => {
                      switch(state) {
                        case 'Disponible': return { bg: '#e8f5e9', text: '#1b5e20', icon: 'check-circle' }
                        case 'Ocupada': return { bg: '#fff3e0', text: '#bf360c', icon: 'running' }
                        case 'Mantenimiento': return { bg: '#f3e5f5', text: '#4a148c', icon: 'wrench' }
                        default: return { bg: '#e3f2fd', text: '#003d82', icon: 'activity' }
                      }
                    }
                    const stateColor = getStateColor(room.estado)
                    
                    return (
                      <tr key={room.id} style={{ 
                        borderBottom: '1px solid #f0f0f0', 
                        background: idx % 2 === 0 ? '#fafafa' : 'white',
                        transition: 'background 0.2s'
                      }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4f8'} onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#fafafa' : 'white'}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>#{room.numero_habitacion}</td>
                        <td style={{ padding: '12px', color: '#666' }}>{room.tipo}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: stateColor.bg, 
                            color: stateColor.text,
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            <Icon name={stateColor.icon} size={14} />
                            {room.estado}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontWeight: '600', color: '#2196F3' }}>${room.precio_noche}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button 
                            onClick={() => handleEdit(room)}
                            style={{ 
                              background: '#2196F3', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 12px', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginRight: '6px',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#1976d2'}
                            onMouseLeave={(e) => e.target.style.background = '#2196F3'}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(room)}
                            style={{ 
                              background: '#f44336', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 12px', 
                              borderRadius: '4px', 
                              cursor: 'pointer',
                              fontSize: '12px',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#d32f2f'}
                            onMouseLeave={(e) => e.target.style.background = '#f44336'}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de edición */}
        <Modal
          isOpen={isEditModalOpen}
          title={`Editar Habitación #${editingRoom?.numero_habitacion}`}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingRoom(null)
            setEditForm({})
          }}
          onConfirm={handleSaveEdit}
          confirmText={saving ? 'Guardando...' : 'Guardar Cambios'}
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="numero">Número de Habitación</label>
              <input
                id="numero"
                type="number"
                name="numero"
                value={editForm.numero || ''}
                onChange={handleEditFormChange}
                placeholder="Ej: 101"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipo">Tipo de Habitación</label>
              <select
                id="tipo"
                name="tipo"
                value={editForm.tipo || ''}
                onChange={handleEditFormChange}
              >
                <option value="">Selecciona un tipo</option>
                <option value="Simple">Simple</option>
                <option value="Doble">Doble</option>
                <option value="Suite">Suite</option>
                <option value="Presidencial">Presidencial</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={editForm.estado || ''}
                onChange={handleEditFormChange}
              >
                <option value="">Selecciona un estado</option>
                <option value="Disponible">Disponible</option>
                <option value="Ocupada">Ocupada</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Limpieza">Limpieza</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio por Noche</label>
              <input
                id="precio"
                type="number"
                name="precio"
                value={editForm.precio || ''}
                onChange={handleEditFormChange}
                placeholder="Ej: 150"
                min="0"
              />
            </div>
          </div>
        </Modal>

        {/* Modal de agregar habitación */}
        <Modal
          isOpen={isAddRoomModalOpen}
          title="Agregar Nueva Habitación"
          onClose={() => {
            setIsAddRoomModalOpen(false)
            resetNewRoomForm()
          }}
          onConfirm={handleAddRoom}
          confirmText={saving ? 'Creando...' : 'Crear Habitación'}
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="add-numero">Número de Habitación *</label>
              <input
                id="add-numero"
                type="text"
                name="numero"
                value={newRoomForm.numero}
                onChange={handleNewRoomFormChange}
                placeholder="Ej: 101, 202, 303"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="add-piso">Piso</label>
              <input
                id="add-piso"
                type="number"
                name="piso"
                value={newRoomForm.piso}
                onChange={handleNewRoomFormChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="add-tipo">Tipo de Habitación</label>
              <select
                id="add-tipo"
                name="tipo"
                value={newRoomForm.tipo}
                onChange={handleNewRoomFormChange}
              >
                <option value="Simple">Simple</option>
                <option value="Doble">Doble</option>
                <option value="Suite">Suite</option>
                <option value="Presidencial">Presidencial</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="add-capacidad">Capacidad (personas)</label>
              <input
                id="add-capacidad"
                type="number"
                name="capacidad"
                value={newRoomForm.capacidad}
                onChange={handleNewRoomFormChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="add-precio">Precio por Noche ($) *</label>
              <input
                id="add-precio"
                type="number"
                name="precio_noche"
                value={newRoomForm.precio_noche}
                onChange={handleNewRoomFormChange}
                placeholder="Ej: 150000"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="add-amenidades">Amenidades</label>
              <input
                id="add-amenidades"
                type="text"
                name="amenidades"
                value={newRoomForm.amenidades}
                onChange={handleNewRoomFormChange}
                placeholder="Ej: Aire acondicionado, TV, WiFi"
              />
            </div>

            <div className="form-group">
              <label htmlFor="add-estado">Estado Inicial</label>
              <select
                id="add-estado"
                name="estado"
                value={newRoomForm.estado}
                onChange={handleNewRoomFormChange}
              >
                <option value="Disponible">Disponible</option>
                <option value="Ocupada">Ocupada</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Limpieza">Limpieza</option>
              </select>
            </div>
          </div>
        </Modal>

        {/* PERSONAL DE LIMPIEZA */}
        <div className="dashboard-section" style={{ marginTop: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="activity" size={24} className="primary" />
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Personal de Limpieza</h2>
            </div>
            {user?.role === 'admin' && (
              <button className="btn btn-primary" onClick={() => {
                resetStaffForm()
                setIsStaffModalOpen(true)
              }}>
                + Nuevo Personal
              </button>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fb', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Teléfono</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Turno</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Estado</th>
                  {(user?.role === 'admin') && (
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === 'admin' ? 6 : 5} style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
                      No hay personal registrado
                    </td>
                  </tr>
                ) : (
                  staff.map((member, idx) => {
                    const getStateColor = (state) => {
                      return state === 'activo' 
                        ? { bg: '#e8f5e9', text: '#1b5e20', icon: '✓' }
                        : { bg: '#ffebee', text: '#c62828', icon: '✕' }
                    }
                    const stateColor = getStateColor(member.estado)
                    
                    return (
                      <tr key={member.id} style={{ 
                        borderBottom: '1px solid #f0f0f0', 
                        background: idx % 2 === 0 ? '#fafafa' : 'white',
                        transition: 'background 0.2s'
                      }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4f8'} onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#fafafa' : 'white'}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>{member.nombre}</td>
                        <td style={{ padding: '12px', color: '#666' }}>{member.email}</td>
                        <td style={{ padding: '12px', color: '#666' }}>{member.telefono}</td>
                        <td style={{ padding: '12px', color: '#666' }}>{member.turno}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            display: 'inline-block',
                            background: stateColor.bg, 
                            color: stateColor.text,
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {stateColor.icon} {member.estado}
                          </span>
                        </td>
                        {user?.role === 'admin' && (
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleEditStaff(member)}
                              style={{ 
                                background: '#2196F3', 
                                color: 'white', 
                                border: 'none', 
                                padding: '6px 12px', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontSize: '12px',
                                marginRight: '6px',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#1976d2'}
                              onMouseLeave={(e) => e.target.style.background = '#2196F3'}
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteStaff(member)}
                              style={{ 
                                background: '#f44336', 
                                color: 'white', 
                                border: 'none', 
                                padding: '6px 12px', 
                                borderRadius: '4px', 
                                cursor: 'pointer',
                                fontSize: '12px',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#d32f2f'}
                              onMouseLeave={(e) => e.target.style.background = '#f44336'}
                            >
                              Eliminar
                            </button>
                          </td>
                        )}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Personal */}
        <Modal
          isOpen={isStaffModalOpen}
          title={editingStaff ? 'Editar Personal' : 'Nuevo Personal de Limpieza'}
          onClose={() => {
            setIsStaffModalOpen(false)
            resetStaffForm()
          }}
          onConfirm={handleSaveStaff}
          confirmText={saving ? 'Guardando...' : editingStaff ? 'Actualizar' : 'Crear'}
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="staff-nombre">Nombre</label>
              <input
                id="staff-nombre"
                type="text"
                name="nombre"
                value={staffForm.nombre}
                onChange={handleStaffFormChange}
                placeholder="Nombre completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="staff-email">Email</label>
              <input
                id="staff-email"
                type="email"
                name="email"
                value={staffForm.email}
                onChange={handleStaffFormChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="staff-telefono">Teléfono</label>
              <input
                id="staff-telefono"
                type="text"
                name="telefono"
                value={staffForm.telefono}
                onChange={handleStaffFormChange}
                placeholder="3001234567"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="staff-documento">Documento Identidad</label>
              <input
                id="staff-documento"
                type="text"
                name="documento_identidad"
                value={staffForm.documento_identidad}
                onChange={handleStaffFormChange}
                placeholder="1234567890"
              />
            </div>

            <div className="form-group">
              <label htmlFor="staff-turno">⏰ Turno</label>
              <select
                id="staff-turno"
                name="turno"
                value={staffForm.turno}
                onChange={handleStaffFormChange}
              >
                <option value="Diurno">Diurno</option>
                <option value="Nocturno">Nocturno</option>
                <option value="Mixto">Mixto</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="staff-estado">Estado</label>
              <select
                id="staff-estado"
                name="estado"
                value={staffForm.estado}
                onChange={handleStaffFormChange}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
