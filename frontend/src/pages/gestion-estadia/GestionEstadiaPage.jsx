import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import './ModulePage.css'

const API = 'http://localhost/roommaster/backend'

export default function GestionEstadiaPage() {
  const [stays, setStays] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingStay, setEditingStay] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    cliente_id: '',
    habitacion_id: '',
    fecha_entrada: '',
    fecha_salida: '',
    numero_huespedes: '',
    estado: 'activa',
  })

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'cliente_id', label: 'Cliente ID' },
    { key: 'habitacion_id', label: 'Habitación' },
    { key: 'fecha_entrada', label: 'Entrada' },
    { key: 'fecha_salida', label: 'Salida' },
    { key: 'estado', label: 'Estado' },
  ]

  useEffect(() => {
    cargarEstadias()
  }, [])

  async function cargarEstadias() {
    try {
      setLoading(true)
      const res = await fetch(`${API}/estadias.php`)
      const data = await res.json()
      if (data.success) setStays(data.datos)
    } catch (err) {
      alert('Error al cargar estadías')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      cliente_id: '',
      habitacion_id: '',
      fecha_entrada: '',
      fecha_salida: '',
      numero_huespedes: '',
      estado: 'activa',
    })
    setIsEditMode(false)
    setEditingStay(null)
  }

  const handleOpenAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleEdit = (stay) => {
    setEditingStay(stay)
    setFormData({
      cliente_id: stay.cliente_id,
      habitacion_id: stay.habitacion_id,
      fecha_entrada: stay.fecha_entrada,
      fecha_salida: stay.fecha_salida,
      numero_huespedes: stay.numero_huespedes,
      estado: stay.estado,
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const handleSaveStay = async () => {
    if (!formData.cliente_id || !formData.habitacion_id || !formData.fecha_entrada || !formData.fecha_salida) {
      alert('Completa todos los campos requeridos')
      return
    }

    setSaving(true)
    try {
      if (isEditMode && editingStay) {
        // Actualizar
        const res = await fetch(`${API}/estadias.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingStay.id, ...formData })
        })
        const data = await res.json()
        if (data.success) {
          cargarEstadias()
          alert('✓ Estadía actualizada')
        } else {
          alert(data.mensaje)
        }
      } else {
        // Crear
        const res = await fetch(`${API}/estadias.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        const data = await res.json()
        if (data.success) {
          cargarEstadias()
          alert('✓ Estadía creada')
        } else {
          alert(data.mensaje)
        }
      }
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      alert('Error al guardar')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (stay) => {
    if (!confirm('¿Estás seguro?')) return
    try {
      const res = await fetch(`${API}/estadias.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: stay.id })
      })
      const data = await res.json()
      if (data.success) {
        cargarEstadias()
        alert('✓ Eliminada')
      } else {
        alert(data.mensaje)
      }
    } catch (err) {
      alert('Error al eliminar')
      console.error(err)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Gestión de Estadía</h1>
        <p className="page-subtitle">Administra y controla todas las estadías y reservas</p>
        
        <div className="page-header">
          <div></div>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            + Nueva Estadía
          </button>
        </div>

        {loading ? <p>Cargando...</p> : (
          <Table
            columns={columns}
            data={stays}
            onEdit={handleEdit}
            onDelete={handleDelete}
            actions={true}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          title={isEditMode ? 'Editar Estadía' : '+ Nueva Estadía'}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          onConfirm={handleSaveStay}
          confirmText={saving ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Cliente ID</label>
              <input 
                type="number" 
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleFormChange}
                placeholder="ID del cliente" 
                required
              />
            </div>
            <div className="form-group">
              <label>Habitación ID</label>
              <input
                type="number"
                name="habitacion_id"
                value={formData.habitacion_id}
                onChange={handleFormChange}
                placeholder="ID habitación"
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha Entrada</label>
              <input 
                type="date" 
                name="fecha_entrada"
                value={formData.fecha_entrada}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha Salida</label>
              <input 
                type="date" 
                name="fecha_salida"
                value={formData.fecha_salida}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Número de Huéspedes</label>
              <input 
                type="number" 
                name="numero_huespedes"
                value={formData.numero_huespedes}
                onChange={handleFormChange}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleFormChange}
              >
                <option value="activa">Activa</option>
                <option value="pendiente">Pendiente</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
