import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import './ModulePage.css'

/**
 * GestionEstadiaPage: Gestión de estadías y reservas
 * 
 * Permite administrar:
 * - Crear nueva estadía (reserva)
 * - Ver todas las estadías
 * - Editar estadía existente
 * - Eliminar estadía
 * 
 * Es el módulo principal para recepcionistas
 */
export default function GestionEstadiaPage() {
  // ============ ESTADOS ============
  
  // Lista de estadías (reservas de huéspedes)
  const [stays, setStays] = useState([
    { id: 1, cliente: 'Carlos López', habitacion: '101', fechaEntrada: '2026-02-05', fechaSalida: '2026-02-10', estado: 'Activa' },
    { id: 2, cliente: 'María García', habitacion: '102', fechaEntrada: '2026-02-03', fechaSalida: '2026-02-05', estado: 'Pendiente' },
  ])
  
  // Control de modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingStay, setEditingStay] = useState(null)
  const [saving, setSaving] = useState(false)
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    cliente: '',
    habitacion: '',
    fechaEntrada: '',
    fechaSalida: '',
    estado: 'Pendiente',
  })

  // ============ CONFIGURACIÓN ============
  
  /**
   * Columnas que se mostrarán en la tabla de estadías
   */
  const columns = [
    { key: 'cliente', label: 'Cliente' },
    { key: 'habitacion', label: 'Habitación' },
    { key: 'fechaEntrada', label: 'Entrada' },
    { key: 'fechaSalida', label: 'Salida' },
    { key: 'estado', label: 'Estado' },
  ]

  // ============ FUNCIONES AUXILIARES ============
  
  /**
   * Limpia los datos del formulario
   */
  const resetForm = () => {
    setFormData({
      cliente: '',
      habitacion: '',
      fechaEntrada: '',
      fechaSalida: '',
      estado: 'Pendiente',
    })
    setIsEditMode(false)
    setEditingStay(null)
  }

  // ============ FUNCIONES CRUD ============
  
  /**
   * Abre el modal para crear una nueva estadía
   */
  const handleOpenAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  /**
   * Abre el modal para editar una estadía existente
   * Carga los datos en el formulario
   * 
   * @param {Object} stay - Datos de la estadía a editar
   */
  const handleEdit = (stay) => {
    setEditingStay(stay)
    setFormData({
      cliente: stay.cliente,
      habitacion: stay.habitacion,
      fechaEntrada: stay.fechaEntrada,
      fechaSalida: stay.fechaSalida,
      estado: stay.estado,
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  /**
   * Guarda una estadía nueva o actualiza una existente
   * Validaciones:
   * - Todos los campos son requeridos
   * - Se muestra confirmación al usuario
   */
  const handleSaveStay = async () => {
    // VALIDACIÓN: Verificar que todos los campos estén completos
    if (!formData.cliente || !formData.habitacion || !formData.fechaEntrada || !formData.fechaSalida) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    setSaving(true)
    try {
      if (isEditMode && editingStay) {
        // ACTUALIZACIÓN: Modificar estadía existente
        setStays(stays.map(stay =>
          stay.id === editingStay.id ? { ...stay, ...formData } : stay
        ))
        alert('✓ Estadía actualizada exitosamente')
      } else {
        // CREACIÓN: Agregar nueva estadía
        const newStay = {
          id: Math.max(...stays.map(s => s.id), 0) + 1,  // ID auto-incrementado
          ...formData,
        }
        setStays([...stays, newStay])
        alert('✓ Estadía agregada exitosamente')
      }
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error al guardar estadía:', error)
      alert('Error al guardar la estadía')
    } finally {
      setSaving(false)
    }
  }

  /**
   * Elimina una estadía después de confirmar
   * 
   * @param {Object} stay - Estadía a eliminar
   */
  const handleDelete = (stay) => {
    // CONFIRMACIÓN: Pedir autorización al usuario
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la estadía de ${stay.cliente}?`
    )

    if (!confirmDelete) return

    try {
      // ELIMINACIÓN: Filtrar la estadía de la lista
      setStays(stays.filter(s => s.id !== stay.id))
      alert('✓ Estadía eliminada exitosamente')
    } catch (error) {
      console.error('Error al eliminar estadía:', error)
      alert('Error al eliminar la estadía')
    }
  }

  /**
   * Actualiza los campos del formulario cuando se escriben
   * Facilita el flujo de datos de forma controlada
   * 
   * @param {Event} e - Evento del input
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target
    // Mantener otros campos intactos usando spread operator
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Gestión de Estadía</h1>
        <p className="page-subtitle">Administra y controla todas las estadías y reservas de tus huéspedes</p>
        
        {/* ENCABEZADO: Botón para agregar nueva estadía */}
        <div className="page-header">
          <div></div>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            + Nueva Estadía
          </button>
        </div>

        {/* TABLA: Mostrar todas las estadías */}
        <Table
          columns={columns}
          data={stays}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* MODAL: Formulario para crear/editar estadía */}
        <Modal
          isOpen={isModalOpen}
          title={isEditMode ? `✏️ Editar Estadía: ${editingStay?.cliente}` : '+ Nueva Estadía'}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          onConfirm={handleSaveStay}
          confirmText={saving ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
        >
          <form className="form-grid">
            <div className="form-group">
              <label>👤 Cliente</label>
              <input 
                type="text" 
                name="cliente"
                value={formData.cliente}
                onChange={handleFormChange}
                placeholder="Nombre del cliente" 
              />
            </div>
            <div className="form-group">
              <label>🏨 Habitación</label>
              <select
                name="habitacion"
                value={formData.habitacion}
                onChange={handleFormChange}
              >
                <option value="">Selecciona una habitación</option>
                <option value="101">101</option>
                <option value="102">102</option>
                <option value="103">103</option>
                <option value="104">104</option>
              </select>
            </div>
            <div className="form-group">
              <label>📅 Fecha Entrada</label>
              <input 
                type="date" 
                name="fechaEntrada"
                value={formData.fechaEntrada}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>📅 Fecha Salida</label>
              <input 
                type="date" 
                name="fechaSalida"
                value={formData.fechaSalida}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>📊 Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleFormChange}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Activa">Activa</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
