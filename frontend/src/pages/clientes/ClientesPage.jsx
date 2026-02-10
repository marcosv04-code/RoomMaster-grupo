import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import './ModulePage.css'

/**
 * ClientesPage: Gestión completa de clientes
 * 
 * Este módulo permite:
 * - Ver lista de todos los clientes
 * - Crear nuevo cliente
 * - Editar cliente existente
 * - Eliminar cliente
 * 
 * Patrones utilizados:
 * - CRUD (Create, Read, Update, Delete)
 * - React Hooks (useState)
 * - Componentes reutilizables (Table, Modal)
 */
export default function ClientesPage() {
  // ============ ESTADOS ============
  
  // Lista de clientes (inicialmente con datos de ejemplo)
  const [clients, setClients] = useState([
    { 
      id: 1, 
      nombre: 'Carlos López', 
      documento: '12345678A',
      email: 'carlos@email.com', 
      telefono: '+34 600 123 456', 
      direccion: 'Calle Principal 123',
      ciudad: 'Madrid',
      pais: 'España',
      codigoPostal: '28001'
    },
    { 
      id: 2, 
      nombre: 'María García', 
      documento: '87654321B',
      email: 'maria@email.com', 
      telefono: '+34 600 789 012', 
      direccion: 'Avenida Central 456',
      ciudad: 'Barcelona',
      pais: 'España',
      codigoPostal: '08002'
    },
  ])
  
  // Control de modal
  const [isModalOpen, setIsModalOpen] = useState(false)        // ¿Está abierto el modal?
  const [isEditMode, setIsEditMode] = useState(false)          // ¿Estamos editando o creando?
  const [editingClient, setEditingClient] = useState(null)     // Cliente que se está editando
  const [saving, setSaving] = useState(false)                  // ¿Se está guardando?
  
  // Datos del formulario (se limpian al cancelar)
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    codigoPostal: '',
  })

  // ============ CONFIGURACIÓN ============
  
  /**
   * Columnas que se mostrarán en la tabla
   * Cada objeto define qué campo mostrar y cómo etiquetarlo
   */
  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'documento', label: 'Documento' },
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
      documento: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: '',
      codigoPostal: '',
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
      nombre: client.nombre,
      documento: client.documento,
      email: client.email,
      telefono: client.telefono,
      direccion: client.direccion,
      ciudad: client.ciudad,
      pais: client.pais,
      codigoPostal: client.codigoPostal,
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  // Guardar o actualizar cliente
  const handleSaveClient = async () => {
    if (!formData.nombre || !formData.documento || !formData.email) {
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
        setClients(clients.map(client =>
          client.id === editingClient.id
            ? { ...client, ...formData }
            : client
        ))
        alert('Cliente actualizado exitosamente')
      } else {
        // Agregar nuevo cliente
        const newClient = {
          id: Math.max(...clients.map(c => c.id), 0) + 1,
          ...formData,
        }
        setClients([...clients, newClient])
        alert('Cliente agregado exitosamente')
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
      setClients(clients.filter(c => c.id !== client.id))
      alert('Cliente eliminado exitosamente')
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
        <h1>Gestión de Clientes</h1>
        <p className="page-subtitle">Mantén un registro completo de todos tus clientes y huéspedes</p>
        
        <div className="page-header">
          <div>
            <p className="clients-count">Total: {clients.length} cliente(s)</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            + Nuevo Cliente
          </button>
        </div>

        <Table
          columns={columns}
          data={clients}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

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
              <label htmlFor="documento">Número de Documento *</label>
              <input
                id="documento"
                type="text"
                name="documento"
                placeholder="Ej: 12345678A"
                value={formData.documento}
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
              <label htmlFor="direccion">Dirección</label>
              <input
                id="direccion"
                type="text"
                name="direccion"
                placeholder="Calle Principal 123"
                value={formData.direccion}
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

            <div className="form-group">
              <label htmlFor="codigoPostal">Código Postal</label>
              <input
                id="codigoPostal"
                type="text"
                name="codigoPostal"
                placeholder="Ej: 28001"
                value={formData.codigoPostal}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pais">País</label>
              <input
                id="pais"
                type="text"
                name="pais"
                placeholder="Ej: España"
                value={formData.pais}
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
