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
    try {
      // Realizar la actualización en la API
      await roomService.update(editingRoom.id, editForm)
      
      // Actualizar la lista local
      setRooms(rooms.map(r => 
        r.id === editingRoom.id ? { ...editingRoom, ...editForm } : r
      ))
      
      setIsEditModalOpen(false)
      setEditingRoom(null)
      setEditForm({})
      
      alert('Habitación actualizada exitosamente')
    } catch (error) {
      console.error('Error al actualizar habitación:', error)
      alert('Error al actualizar la habitación')
    } finally {
      setSaving(false)
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
        <h1>Dashboard Principal</h1>
        <p className="dashboard-subtitle">Bienvenido de vuelta. Aquí está el resumen de tu hotel hoy.</p>

        {/* Cards de estadísticas */}
        <div className="stats-grid">
          <Card 
            title="Habitaciones Disponibles" 
            value="8" 
            icon="🏨"
            subtitle="de 15 habitaciones"
          />
          <Card 
            title="Huéspedes Activos" 
            value="7" 
            icon="👥"
            subtitle="en el hotel"
          />
          <Card 
            title="Ingresos Hoy" 
            value="$1,250" 
            icon="💰"
            subtitle="hasta el momento"
          />
          <Card 
            title="Ocupación" 
            value="53%" 
            icon="📊"
            subtitle="del total"
          />
        </div>

        {/* Tabla de habitaciones */}
        <div className="dashboard-section">
          <h2>Estado de Habitaciones</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <Table
              columns={columns}
              data={rooms}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Modal de edición */}
        <Modal
          isOpen={isEditModalOpen}
          title={`Editar Habitación ${editingRoom?.numero}`}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingRoom(null)
            setEditForm({})
          }}
          onConfirm={handleSaveEdit}
          confirmText={saving ? 'Guardando...' : 'Guardar'}
        >
          <div className="edit-form">
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
      </div>
    </DashboardLayout>
  )
}
