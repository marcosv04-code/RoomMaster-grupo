import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Card from '../../components/common/Card'
import Icon from '../../components/common/Icon'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import { usePermissions } from '../../hooks/usePermissions'
import { useAuth } from '../../hooks/useAuth'
import './ModulePage.css'

const API = '/backend'

export default function GestionEstadiaPage() {
  const { user } = useAuth()
  const [stays, setStays] = useState([])
  const [clients, setClients] = useState([])
  const [rooms, setRooms] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingStay, setEditingStay] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Verificar permisos
  const { can, isAdmin } = usePermissions()
  
  const [formData, setFormData] = useState({
    cliente_id: '',
    habitacion_id: '',
    fecha_entrada: '',
    fecha_salida: '',
    numero_huespedes: '',
    estado: 'activa',
    notas: '',
  })

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'cliente_nombre', label: 'Cliente' },
    { key: 'numero_habitacion', label: 'Habitación' },
    { key: 'fecha_entrada', label: 'Entrada' },
    { key: 'fecha_salida', label: 'Salida' },
    { key: 'numero_huespedes', label: 'Huéspedes' },
    { key: 'estado', label: 'Estado', render: (val) => <span style={{ textTransform: 'capitalize', fontWeight: '600', color: val === 'activa' ? '#4CAF50' : val === 'completada' ? '#2196F3' : val === 'cancelada' ? '#f44336' : '#999' }}>{val}</span> },
  ]

  useEffect(() => {
    cargarEstadias()
    cargarClientes()
    cargarHabitaciones()
  }, [])

  async function cargarEstadias() {
    try {
      setLoading(true)
      const res = await fetch(`${API}/estadias.php`)
      const data = await res.json()
      if (data.exito) setStays(data.datos)
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar estadías'
      })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function cargarClientes() {
    try {
      const res = await fetch(`${API}/clientes.php`)
      const data = await res.json()
      if (data.exito) setClients(data.datos)
    } catch (err) {
      console.error('Error al cargar clientes:', err)
    }
  }

  async function cargarHabitaciones() {
    try {
      const res = await fetch(`${API}/habitaciones.php`)
      const data = await res.json()
      if (data.exito) setRooms(data.datos)
    } catch (err) {
      console.error('Error al cargar habitaciones:', err)
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
      notas: '',
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
      notas: stay.notas || '',
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const handleSaveStay = async () => {
    if (!formData.cliente_id || !formData.habitacion_id || !formData.fecha_entrada || !formData.fecha_salida) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos requeridos'
      })
      return
    }

    // Validar número de huéspedes
    const numHuespedes = parseInt(formData.numero_huespedes) || 0
    if (numHuespedes > 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Error de validación',
        text: 'El número máximo de huéspedes es 8'
      })
      return
    }

    setSaving(true)
    try {
      if (isEditMode && editingStay) {
        // Actualizar
        const res = await fetch(`${API}/estadias.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingStay.id, ...formData, rol: user?.role })
        })
        const data = await res.json()
        if (data.exito) {
          cargarEstadias()
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Estadía actualizada correctamente'
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.mensaje
          })
        }
      } else {
        // Crear
        const res = await fetch(`${API}/estadias.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        const data = await res.json()
        if (data.exito) {
          cargarEstadias()
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Estadía creada correctamente'
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.mensaje
          })
        }
      }
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar'
      })
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (stay) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Eliminar Estadía',
      text: '¿Estás seguro de que deseas eliminar esta estadía?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#f44336'
    })
    
    if (!result.isConfirmed) return
    
    try {
      const res = await fetch(`${API}/estadias.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: stay.id, rol: user?.role })
      })
      const data = await res.json()
      if (data.exito) {
        cargarEstadias()
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Estadía eliminada correctamente'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al eliminar'
      })
      console.error(err)
    }
  }

  const handleCancel = async (stay) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Cancelar Estadía',
      text: '¿Deseas cancelar esta estadía?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#f44336'
    })

    if (!result.isConfirmed) return

    try {
      const res = await fetch(`${API}/estadias.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: stay.id, 
          estado: 'cancelada',
          rol: user?.role
        })
      })
      const data = await res.json()
      if (data.exito) {
        cargarEstadias()
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Estadía cancelada correctamente'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cancelar'
      })
      console.error(err)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    
    // Limitar número de huéspedes a máximo 8
    if (name === 'numero_huespedes') {
      const numValue = parseInt(value) || 0
      if (numValue > 8) {
        return // No actualizar si es mayor a 8
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getAvailableRooms = () => {
    const roomsWithActiveStays = stays
      .filter(s => s.estado === 'activa')
      .map(s => s.habitacion_id)
    return rooms.filter(r => !roomsWithActiveStays.includes(r.id))
  }

  const getAvailableClients = () => {
    const clientsWithActiveStays = stays
      .filter(s => s.estado === 'activa')
      .map(s => s.cliente_id)
    return clients.filter(c => !clientsWithActiveStays.includes(c.id))
  }

  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Icon name="hotel" size={32} className="primary" />
            <h1 style={{ margin: 0 }}>Gestión de Estadías</h1>
          </div>
          <p className="page-subtitle">Administra todas las estadías y hospedajes de tu hotel</p>
        </div>

        {/* ESTADÍSTICAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <Card
            title="Estadías Activas"
            value={stays.filter(s => s.estado === 'activa').length}
            icon="chart"
            subtitle="En curso"
          />
          <Card
            title="Completadas"
            value={stays.filter(s => s.estado === 'completada').length}
            icon="check"
            subtitle="Completadas"
          />
          <Card
            title="Canceladas"
            value={stays.filter(s => s.estado === 'cancelada').length}
            icon="activity"
            subtitle="Anuladas"
          />
          <Card
            title="Total Huéspedes"
            value={stays
              .filter(s => s.estado === 'activa')
              .reduce((sum, s) => sum + (parseInt(s.numero_huespedes) || 0), 0)}
            icon="users"
            subtitle="Activos"
          />
        </div>

        {/* TABLA DE ESTADÍAS */}
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Registro de Estadías</h2>
            {/* Solo mostrar botón "Nueva Estadía" si tiene permisos */}
            {can('ESTADIA_CREATE') && (
              <button className="btn btn-primary" onClick={handleOpenAddModal}>
                + Nueva Estadía
              </button>
            )}
          </div>

          {loading ? <p>Cargando...</p> : (
            <Table
              columns={columns}
              data={stays.filter(s => s.estado === 'activa')}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCancel={handleCancel}
              actions={true}
              showEdit={isAdmin || user?.role === 'recepcionista'}
              showDelete={can('ESTADIA_DELETE')}
              showCancel={can('ESTADIA_CANCEL')}
            />
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          title={isEditMode ? '✏️ Editar Estadía' : '➕ Nueva Estadía'}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          onConfirm={handleSaveStay}
          confirmText={saving ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
        >
          <form className="form-grid">
            {!isEditMode && (
              <div className="form-group">
                <label>👤 Cliente</label>
                <select 
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Selecciona un cliente</option>
                  {getAvailableClients().map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            )}
            {!isEditMode && (
              <div className="form-group">
                <label>🏨 Habitación</label>
                <select
                  name="habitacion_id"
                  value={formData.habitacion_id}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Selecciona una habitación</option>
                  {getAvailableRooms().map(r => (
                    <option key={r.id} value={r.id}>
                      #{r.numero_habitacion} - {r.tipo} (${r.precio_noche}/noche)
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>📅 Fecha Entrada</label>
              <input 
                type="date" 
                name="fecha_entrada"
                value={formData.fecha_entrada}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>📅 Fecha Salida</label>
              <input 
                type="date" 
                name="fecha_salida"
                value={formData.fecha_salida}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="form-group">
              <label>👥 Número de Huéspedes</label>
              <input 
                type="number" 
                name="numero_huespedes"
                value={formData.numero_huespedes}
                onChange={handleFormChange}
                placeholder="0"
                min="1"
                max="8"
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
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>📝 Notas</label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleFormChange}
                placeholder="Notas adicionales sobre la estadía"
                rows="3"
              />
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
