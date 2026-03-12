import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../hooks/useAuth'
import { filterDocumentId, filterPhone, filterName } from '../../utils/validation'
import './ModulePage.css'

const API = '/backend'

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
  const [searchTerm, setSearchTerm] = useState('')             // Búsqueda de clientes
  
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
    direccion: '',
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
      if (data.exito) {
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
    { key: 'direccion', label: 'Dirección' },
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
      direccion: '',
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
      direccion: client.direccion || '',
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  // Guardar o actualizar cliente
  const handleSaveClient = async () => {
    if (!formData.nombre || !formData.documento_identidad || !formData.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa: Nombre, Documento y Email',
        confirmButtonColor: '#667eea'
      })
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email inválido',
        text: 'Por favor ingresa un email válido',
        confirmButtonColor: '#667eea'
      })
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
            telefono: formData.telefono,
            ciudad: formData.ciudad,
            direccion: formData.direccion,
            rol: user?.role
          })
        })
        const data = await res.json()
        if (data.exito) {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Cliente actualizado exitosamente',
            confirmButtonColor: '#667eea'
          })
          fetchClientes()
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.mensaje || 'Error al actualizar',
            confirmButtonColor: '#667eea'
          })
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
            ciudad: formData.ciudad,
            direccion: formData.direccion
          })
        })
        const data = await res.json()
        if (data.exito) {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Cliente agregado exitosamente',
            confirmButtonColor: '#667eea'
          })
          fetchClientes()
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.mensaje || 'Error al agregar',
            confirmButtonColor: '#667eea'
          })
        }
      }
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error al guardar cliente:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar el cliente',
        confirmButtonColor: '#667eea'
      })
    } finally {
      setSaving(false)
    }
  }

  // Eliminar cliente
  const handleDelete = async (client) => {
    Swal.fire({
      title: '¿Eliminar cliente?',
      text: `Se eliminará al cliente ${client.nombre}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return
      handleDeleteConfirmed(client)
    })
  }

  const handleDeleteConfirmed = async (client) => {

    try {
      const res = await fetch(`${API}/clientes.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: client.id, rol: user?.role })
      })
      const data = await res.json()
      if (data.exito) {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Cliente eliminado exitosamente',
          confirmButtonColor: '#667eea'
        })
        fetchClientes()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'Error al eliminar',
          confirmButtonColor: '#667eea'
        })
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al eliminar el cliente',
        confirmButtonColor: '#667eea'
      })
    }
  }

  // Manejar cambios en el formulario con validación
  const handleFormChange = (e) => {
    const { name, value } = e.target
    
    // Aplicar filtros según el campo
    let filteredValue = value
    if (name === 'nombre') {
      filteredValue = filterName(value)
    } else if (name === 'documento_identidad') {
      filteredValue = filterDocumentId(value)
    } else if (name === 'telefono') {
      filteredValue = filterPhone(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }))
  }

  // Filtrar clientes por búsqueda
  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase()
    return (
      client.nombre.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.documento_identidad.includes(searchTerm) ||
      client.telefono.includes(searchTerm) ||
      client.ciudad.toLowerCase().includes(searchLower)
    )
  })

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
            <p className="clients-count">Total: {loading ? '...' : filteredClients.length} cliente(s)</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <Icon name="search" size={20} style={{ color: 'var(--color-text-secondary)' }} />
              <input
                type="text"
                placeholder="Buscar por nombre, email, documento, teléfono o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  maxWidth: '300px',
                  background: 'var(--color-input-background)',
                  color: 'var(--color-text-primary)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAddModal} disabled={loading}>
            + Nuevo Cliente
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Cargando clientes...</p>
        ) : filteredClients.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            {searchTerm ? 'No se encontraron clientes que coincidan con tu búsqueda' : 'No hay clientes registrados'}
          </p>
        ) : (
          <Table
            columns={columns}
            data={filteredClients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showEdit={true}
            showDelete={user?.role === 'admin'}
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
                placeholder="Ej: 12345678"
                maxLength="20"
                value={formData.documento_identidad}
                onChange={handleFormChange}
              />
              <small style={{ color: '#999' }}>Solo números (máx 20 dígitos)</small>
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
                placeholder="600000000"
                maxLength="15"
                value={formData.telefono}
                onChange={handleFormChange}
              />
              <small style={{ color: '#999' }}>Solo números (máx 15 dígitos)</small>
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

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="direccion">Dirección</label>
              <input
                id="direccion"
                type="text"
                name="direccion"
                placeholder="Ej: Calle Principal 123, Apto 4B"
                value={formData.direccion}
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
