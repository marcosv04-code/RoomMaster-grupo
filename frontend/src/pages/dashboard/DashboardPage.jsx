import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import './DashboardPage.css'
import { roomService } from '../../services/index'

export default function DashboardPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      // Simulación de datos (reemplazar con llamada real)
      const mockRooms = [
        { id: 1, numero: 101, tipo: 'Doble', estado: 'Disponible', precio: 120 },
        { id: 2, numero: 102, tipo: 'Simple', estado: 'Ocupada', precio: 80 },
        { id: 3, numero: 103, tipo: 'Suite', estado: 'Disponible', precio: 200 },
        { id: 4, numero: 104, tipo: 'Doble', estado: 'Mantenimiento', precio: 120 },
      ]
      setRooms(mockRooms)
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
      numero: room.numero,
      tipo: room.tipo,
      estado: room.estado,
      precio: room.precio,
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingRoom) return

    setSaving(true)
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300))
    
    try {
      // Actualizar la lista local
      setRooms(rooms.map(r => 
        r.id === editingRoom.id ? { ...r, ...editForm } : r
      ))
      
      setIsEditModalOpen(false)
      setEditingRoom(null)
      setEditForm({})
      
      setSaving(false)
      alert('✓ Habitación actualizada correctamente')
    } catch (error) {
      console.error('Error al actualizar habitación:', error)
      setSaving(false)
      alert('Error al actualizar la habitación')
    }
  }

  const handleDelete = async (room) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la habitación ${room.numero}?`
    )

    if (!confirmDelete) return

    try {
      // Realizar la eliminación en la API
      await roomService.delete(room.id)
      
      // Actualizar la lista local
      setRooms(rooms.filter(r => r.id !== room.id))
      
      alert('Habitación eliminada exitosamente')
    } catch (error) {
      console.error('Error al eliminar habitación:', error)
      alert('Error al eliminar la habitación')
    }
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>📊 Dashboard Principal</h1>
          <p className="dashboard-subtitle" style={{ fontSize: '15px', color: '#666' }}>Resumen del estado de tu hotel hoy</p>
        </div>

        {/* MÉTRICAS PRINCIPALES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <Card 
            title="🏨 Habitaciones Disponibles" 
            value="8" 
            icon="🏨"
            subtitle="de 15 habitaciones"
          />
          <Card 
            title="👥 Huéspedes Activos" 
            value="7" 
            icon="👥"
            subtitle="en el hotel"
          />
          <Card 
            title="💰 Ingresos Hoy" 
            value="$1,250" 
            icon="💰"
            subtitle="hasta el momento"
          />
          <Card 
            title="📈 Ocupación" 
            value="53%" 
            icon="📊"
            subtitle="del total"
          />
        </div>

        {/* RESUMEN RÁPIDO DE ESTADOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          <div style={{ padding: '16px', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4CAF50' }}>
            <div style={{ fontSize: '12px', color: '#2e7d32', fontWeight: '600', marginBottom: '4px' }}>✓ DISPONIBLES</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1b5e20' }}>8</div>
            <div style={{ fontSize: '12px', color: '#558b2f', marginTop: '4px' }}>Listas para huéspedes</div>
          </div>

          <div style={{ padding: '16px', background: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #FF9800' }}>
            <div style={{ fontSize: '12px', color: '#e65100', fontWeight: '600', marginBottom: '4px' }}>🏃 OCUPADAS</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#bf360c' }}>7</div>
            <div style={{ fontSize: '12px', color: '#d84315', marginTop: '4px' }}>Con huéspedes alojados</div>
          </div>

          <div style={{ padding: '16px', background: '#f3e5f5', borderRadius: '8px', borderLeft: '4px solid #9C27B0' }}>
            <div style={{ fontSize: '12px', color: '#6a1b9a', fontWeight: '600', marginBottom: '4px' }}>🔧 MANTENIMIENTO</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#4a148c' }}>1</div>
            <div style={{ fontSize: '12px', color: '#7b1fa2', marginTop: '4px' }}>En reparación o limpieza</div>
          </div>

          <div style={{ padding: '16px', background: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #2196F3' }}>
            <div style={{ fontSize: '12px', color: '#1565c0', fontWeight: '600', marginBottom: '4px' }}>📞 PENDIENTE</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#003d82' }}>0</div>
            <div style={{ fontSize: '12px', color: '#1976d2', marginTop: '4px' }}>Pendiente de asignación</div>
          </div>
        </div>

        {/* ESTADO DE HABITACIONES */}
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>🛏️ Estado de Habitaciones</h2>
            <span style={{ fontSize: '13px', color: '#999', fontWeight: '500' }}>Total: 15 habitaciones</span>
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
                        case 'Disponible': return { bg: '#e8f5e9', text: '#1b5e20', icon: '✓' }
                        case 'Ocupada': return { bg: '#fff3e0', text: '#bf360c', icon: '🏃' }
                        case 'Mantenimiento': return { bg: '#f3e5f5', text: '#4a148c', icon: '🔧' }
                        default: return { bg: '#e3f2fd', text: '#003d82', icon: '⏳' }
                      }
                    }
                    const stateColor = getStateColor(room.estado)
                    
                    return (
                      <tr key={room.id} style={{ 
                        borderBottom: '1px solid #f0f0f0', 
                        background: idx % 2 === 0 ? '#fafafa' : 'white',
                        transition: 'background 0.2s'
                      }} onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4f8'} onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#fafafa' : 'white'}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>#{room.numero}</td>
                        <td style={{ padding: '12px', color: '#666' }}>{room.tipo}</td>
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
                            {stateColor.icon} {room.estado}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontWeight: '600', color: '#2196F3' }}>${room.precio}</td>
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
          title={`✏️ Editar Habitación #${editingRoom?.numero}`}
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
              <label htmlFor="numero">🏠 Número de Habitación</label>
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
              <label htmlFor="tipo">🛏️ Tipo de Habitación</label>
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
              <label htmlFor="estado">📊 Estado</label>
              <select
                id="estado"
                name="estado"
                value={editForm.estado || ''}
                onChange={handleEditFormChange}
              >
                <option value="">Selecciona un estado</option>
                <option value="Disponible">✓ Disponible</option>
                <option value="Ocupada">🏃 Ocupada</option>
                <option value="Mantenimiento">🔧 Mantenimiento</option>
                <option value="Limpieza">🧹 Limpieza</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="precio">💰 Precio por Noche</label>
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
      </div>
    </DashboardLayout>
  )
}
