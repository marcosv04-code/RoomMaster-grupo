import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../hooks/useAuth'
import './ModulePage.css'

const API = 'http://localhost/RoomMaster_Prueba/backend'

/**
 * ClientesPage: Gestión completa de clientes
 * 
 * Este módulo permite:
 * - Ver lista de todos los clientes desde BD
 * - Crear nuevo cliente
 * - Editar cliente existente
 * - Eliminar cliente
 * 
 * Conectado a: /backend/clientes.php
 */
export default function ClientesPage() {
  const { user } = useAuth()
  
  // ============ ESTADOS ============
  
  // Lista de clientes desde la BD
  const [clients, setClients] = useState([])
  
  // Control de modal
  const [isModalOpen, setIsModalOpen] = useState(false)        // ¿Está abierto el modal?
  const [isEditMode, setIsEditMode] = useState(false)          // ¿Estamos editando o creando?
  const [editingClient, setEditingClient] = useState(null)     // Cliente que se está editando
  const [saving, setSaving] = useState(false)                  // ¿Se está guardando?
  const [loading, setLoading] = useState(true)                 // Cargando datos
  
  // Datos del formulario (se limpian al cancelar)
  const [formData, setFormData] = useState({
    nombre: '',
    documento_identidad: '',
    email: '',
    telefono: '',
    ciudad: '',
  })

  // ============ CARGAR DATOS ============
  
  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/clientes.php`)
      const data = await res.json()
      if (data.success) {
        setClients(data.datos || [])
      } else {
        console.error('Error:', data.mensaje)
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============ CONFIGURACIÓN ============
  
  /**
   * Columnas que se mostrarán en la tabla
   */
  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'documento_identidad', label: 'Documento' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'ciudad', label: 'Ciudad' },
  ]

  // ============ FUNCIONES AUXILIARES ============
  
  /**
   * Limpia todos los campos del formulario
   * Se usa cuando se cancela o se guarda
   */
  const resetForm = () => {
    setFormData({
      nombre: '',
      documento_identidad: '',
      email: '',
      telefono: '',
      ciudad: '',
    })
    setIsEditMode(false)
    setEditingClient(null)
  }

  // ============ FUNCIONES CRUD ============
  
  /**
   * Abre el modal para crear un nuevo cliente
   */
  const handleOpenAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  /**
   * Abre el modal para editar un cliente existente
   * Carga los datos del cliente en el formulario
   * 
   * @param {Object} client - Datos del cliente a editar
   */
  const handleEdit = (client) => {
    setEditingClient(client)
    setFormData({
      nombre: client.nombre || '',
      documento_identidad: client.documento_identidad || '',
      email: client.email || '',
      telefono: client.telefono || '',
      ciudad: client.ciudad || '',
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  // Guardar o actualizar cliente
  const handleSaveClient = async () => {
    if (!formData.nombre || !formData.documento_identidad || !formData.email) {
      alert('Por favor completa los campos requeridos: Nombre, Documento y Email')
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingresa un email válido')
      return
    }

    setSaving(true)
    try {
      if (isEditMode && editingClient) {
        // Actualizar cliente existente
        const res = await fetch(`${API}/clientes.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingClient.id,
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono
          })
        })
        const data = await res.json()
        if (data.success) {
          alert('✓ Cliente actualizado exitosamente')
          fetchClientes()
        } else {
          alert('Error: ' + data.mensaje)
        }
      } else {
        // Agregar nuevo cliente
        const res = await fetch(`${API}/clientes.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.nombre,
            documento_identidad: formData.documento_identidad,
            email: formData.email,
            telefono: formData.telefono,
            ciudad: formData.ciudad
          })
        })
        const data = await res.json()
        if (data.success) {
          alert('✓ Cliente agregado exitosamente')
          fetchClientes()
        } else {
          alert('Error: ' + data.mensaje)
        }
      }
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error al guardar cliente:', error)
      alert('Error al guardar el cliente')
    } finally {
      setSaving(false)
    }
  }

  // Eliminar cliente
  const handleDelete = async (client) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al cliente ${client.nombre}?`
    )

    if (!confirmDelete) return

    try {
      const res = await fetch(`${API}/clientes.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: client.id })
      })
      const data = await res.json()
      if (data.success) {
        alert('✓ Cliente eliminado exitosamente')
        fetchClientes()
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      alert('Error al eliminar el cliente')
    }
  }

  // Manejar cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Icon name="users" size={32} className="primary" />
          <h1 style={{ margin: 0 }}>Gestión de Clientes</h1>
        </div>
        <p className="page-subtitle">Mantén un registro completo de todos tus clientes y huéspedes</p>
        
        <div className="page-header">
          <div>
            <p className="clients-count">Total: {loading ? '...' : clients.length} cliente(s)</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAddModal} disabled={loading}>
            + Nuevo Cliente
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Cargando clientes...</p>
        ) : clients.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No hay clientes registrados</p>
        ) : (
          <Table
            columns={columns}
            data={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Modal para agregar/editar cliente */}
        <Modal
          isOpen={isModalOpen}
          title={isEditMode ? `Editar: ${editingClient?.nombre}` : 'Nuevo Cliente'}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          onConfirm={handleSaveClient}
          confirmText={saving ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
        >
          <form className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo *</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="documento_identidad">Número de Documento *</label>
              <input
                id="documento_identidad"
                type="text"
                name="documento_identidad"
                placeholder="Ej: 12345678A"
                value={formData.documento_identidad}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="correo@email.com"
                value={formData.email}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="tel"
                name="telefono"
                placeholder="+34 600 000 000"
                value={formData.telefono}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ciudad">Ciudad</label>
              <input
                id="ciudad"
                type="text"
                name="ciudad"
                placeholder="Ej: Madrid"
                value={formData.ciudad}
                onChange={handleFormChange}
              />
            </div>
          </form>
          <p className="form-note">* Campos requeridos</p>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
