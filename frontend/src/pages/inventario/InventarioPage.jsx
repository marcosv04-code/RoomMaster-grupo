import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../hooks/useAuth'
import './ModulePage.css'

export default function InventarioPage() {
  const { user } = useAuth()
  // Habitaciones disponibles
  const [rooms] = useState([
    { id: 1, numero: 101 },
    { id: 2, numero: 102 },
    { id: 3, numero: 103 },
    { id: 4, numero: 104 },
  ])

  // Items del inventario con asociación a habitaciones
  const [items, setItems] = useState([
    { id: 1, nombre: 'Sábanas', cantidad: 45, unidad: 'piezas', estado: 'Normal', habitacionId: 1 },
    { id: 2, nombre: 'Toallas', cantidad: 80, unidad: 'piezas', estado: 'Normal', habitacionId: 1 },
    { id: 3, nombre: 'Almohadas', cantidad: 12, unidad: 'piezas', estado: 'Bajo', habitacionId: 1 },
    { id: 4, nombre: 'Sábanas', cantidad: 35, unidad: 'piezas', estado: 'Normal', habitacionId: 2 },
    { id: 5, nombre: 'Toallas', cantidad: 50, unidad: 'piezas', estado: 'Normal', habitacionId: 2 },
    { id: 6, nombre: 'Almohadas', cantidad: 8, unidad: 'piezas', estado: 'Bajo', habitacionId: 3 },
  ])

  // Estados del componente
  const [viewMode, setViewMode] = useState('por-habitacion') // 'por-habitacion' o 'global'
  const [selectedRoomId, setSelectedRoomId] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    unidad: 'piezas',
  })
  const [saving, setSaving] = useState(false)
  
  // Estados para seleccionar habitación en vista global
  const [isSelectingRoom, setIsSelectingRoom] = useState(false)
  const [selectingAction, setSelectingAction] = useState(null) // 'edit' o 'delete'
  const [currentGroupedItem, setCurrentGroupedItem] = useState(null)

  // Función para calcular el estado basado en la cantidad
  const calculateStatus = (cantidad) => {
    const num = parseInt(cantidad) || 0
    if (num <= 10) return 'Bajo'
    if (num <= 30) return 'Normal'
    return 'Alto'
  }

  // Limpiar formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      cantidad: '',
      unidad: 'piezas',
    })
    setIsEditMode(false)
    setEditingItem(null)
  }

  // Abrir modal para agregar item
  const handleOpenAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  // Abrir modal para editar item
  const handleEdit = (item) => {
    // En vista global con múltiples items agrupados, mostrar selector
    if (viewMode === 'global' && item.originalItems && item.originalItems.length > 1) {
      setCurrentGroupedItem(item)
      setSelectingAction('edit')
      setIsSelectingRoom(true)
      return
    }

    // Obtener el item original para editar
    const itemToEdit = viewMode === 'global' && item.originalItems 
      ? item.originalItems[0] 
      : item

    setEditingItem(itemToEdit)
    setFormData({
      nombre: itemToEdit.nombre,
      cantidad: itemToEdit.cantidad,
      unidad: itemToEdit.unidad,
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  // Proceder con la edición después de seleccionar habitación
  const handleProceedEditFromGlobal = (room) => {
    const itemToEdit = currentGroupedItem.originalItems.find(i => i.habitacionId === room.id)
    if (itemToEdit) {
      setEditingItem(itemToEdit)
      setFormData({
        nombre: itemToEdit.nombre,
        cantidad: itemToEdit.cantidad,
        unidad: itemToEdit.unidad,
      })
      setIsEditMode(true)
      setIsSelectingRoom(false)
      setCurrentGroupedItem(null)
      setSelectingAction(null)
      setIsModalOpen(true)
    }
  }

  // Eliminar item
  const handleDelete = async (item) => {
    // En vista global con múltiples items agrupados, mostrar selector
    if (viewMode === 'global' && item.originalItems && item.originalItems.length > 1) {
      setCurrentGroupedItem(item)
      setSelectingAction('delete')
      setIsSelectingRoom(true)
      return
    }

    const itemToDelete = viewMode === 'global' && item.originalItems 
      ? item.originalItems[0] 
      : item

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar "${itemToDelete.nombre}"?`
    )

    if (!confirmDelete) return

    try {
      setItems(items.filter(i => i.id !== itemToDelete.id))
      alert('Item eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar item:', error)
      alert('Error al eliminar el item')
    }
  }

  // Proceder con la eliminación después de seleccionar habitación
  const handleProceedDeleteFromGlobal = (room) => {
    const itemToDelete = currentGroupedItem.originalItems.find(i => i.habitacionId === room.id)
    if (itemToDelete) {
      const confirmDelete = window.confirm(
        `¿Estás seguro de que deseas eliminar "${itemToDelete.nombre}" de la habitación ${room.numero}?`
      )

      if (!confirmDelete) return

      try {
        setItems(items.filter(i => i.id !== itemToDelete.id))
        setIsSelectingRoom(false)
        setCurrentGroupedItem(null)
        setSelectingAction(null)
        alert('Item eliminado exitosamente')
      } catch (error) {
        console.error('Error al eliminar item:', error)
        alert('Error al eliminar el item')
      }
    }
  }

  // Guardar o actualizar item
  const handleSaveItem = async () => {
    if (!formData.nombre || !formData.cantidad) {
      alert('Por favor completa todos los campos')
      return
    }

    setSaving(true)
    try {
      if (isEditMode && editingItem) {
        // Actualizar item existente con estado calculado
        const updatedFormData = {
          ...formData,
          estado: calculateStatus(formData.cantidad)
        }
        setItems(items.map(item =>
          item.id === editingItem.id
            ? { ...item, ...updatedFormData }
            : item
        ))
        alert('Item actualizado exitosamente')
      } else {
        // Agregar nuevo item con estado calculado
        const newItem = {
          id: Math.max(...items.map(i => i.id), 0) + 1,
          ...formData,
          estado: calculateStatus(formData.cantidad),
          habitacionId: selectedRoomId,
        }
        setItems([...items, newItem])
        alert('Item agregado exitosamente')
      }
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error al guardar item:', error)
      alert('Error al guardar el item')
    } finally {
      setSaving(false)
    }
  }

  // Handles para el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Filtrar y agrupar items según el modo de vista
  const displayedItems = viewMode === 'por-habitacion'
    ? items.filter(item => item.habitacionId === selectedRoomId)
    : (() => {
        // Agrupar items por nombre y sumar cantidades en vista global
        const grouped = {}
        items.forEach(item => {
          if (!grouped[item.nombre]) {
            grouped[item.nombre] = {
              id: item.id,
              nombre: item.nombre,
              cantidad: item.cantidad,
              unidad: item.unidad,
              estado: item.estado,
              originalItems: [item],
            }
          } else {
            grouped[item.nombre].cantidad += item.cantidad
            grouped[item.nombre].originalItems.push(item)
          }
        })
        return Object.values(grouped)
      })()

  // Columnas de la tabla
  const columns = viewMode === 'por-habitacion'
    ? [
        { key: 'nombre', label: 'Artículo' },
        { key: 'cantidad', label: 'Cantidad' },
      ]
    : [
        { key: 'nombre', label: 'Artículo' },
        { key: 'cantidad', label: 'Cantidad' },
        { key: 'estado', label: 'Estado' },
      ]

  const selectedRoom = rooms.find(r => r.id === selectedRoomId)

  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Icon name="package" size={32} className="primary" />
          <h1 style={{ margin: 0 }}>Inventario</h1>
        </div>
        <p className="page-subtitle">Registra y controla el inventario de cada habitación del hotel</p>

        {/* Toggle de vista */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'por-habitacion' ? 'active' : ''}`}
            onClick={() => setViewMode('por-habitacion')}
          >
            Por Habitación
          </button>
          <button
            className={`toggle-btn ${viewMode === 'global' ? 'active' : ''}`}
            onClick={() => setViewMode('global')}
          >
            Vista Global
          </button>
        </div>

        {/* Selector de habitación - solo se muestra en vista por habitación */}
        {viewMode === 'por-habitacion' && (
          <div className="room-selector">
            <label htmlFor="room-select">Seleccionar Habitación:</label>
            <select
              id="room-select"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(Number(e.target.value))}
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  Habitación {room.numero}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="page-header">
          <div>
            {viewMode === 'por-habitacion' && selectedRoom && (
              <p className="room-items-count">
                {displayedItems.length} item(s) en Habitación {selectedRoom.numero}
              </p>
            )}
            {viewMode === 'global' && (
              <p className="room-items-count">
                {displayedItems.length} item(s) en total
              </p>
            )}
          </div>
          {user?.role === 'admin' && (
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              + Agregar Item
            </button>
          )}
        </div>

        <Table
          columns={columns}
          data={displayedItems}
          onEdit={user?.role === 'admin' ? handleEdit : null}
          onDelete={user?.role === 'admin' ? handleDelete : null}
          actions={user?.role === 'admin'}
        />

        {/* Modal para seleccionar habitación en vista global */}
        <Modal
          isOpen={isSelectingRoom}
          title={selectingAction === 'edit' ? 'Seleccionar Habitación para Editar' : 'Seleccionar Habitación para Eliminar'}
          onClose={() => {
            setIsSelectingRoom(false)
            setCurrentGroupedItem(null)
            setSelectingAction(null)
          }}
          confirmText={selectingAction === 'edit' ? 'Editar' : 'Eliminar'}
          onConfirm={() => {}}
        >
          <div className="room-selection-grid">
            {currentGroupedItem?.originalItems.map((item) => {
              const room = rooms.find(r => r.id === item.habitacionId)
              return (
                <div key={item.id} className="room-selection-item">
                  <div className="room-info">
                    <h4>Habitación {room?.numero}</h4>
                    <p>Cantidad: {item.cantidad}</p>
                  </div>
                  <button
                    className={`btn ${selectingAction === 'edit' ? 'btn-primary' : 'btn-danger'}`}
                    onClick={() => {
                      if (selectingAction === 'edit') {
                        handleProceedEditFromGlobal(room)
                      } else {
                        handleProceedDeleteFromGlobal(room)
                      }
                    }}
                  >
                    {selectingAction === 'edit' ? 'Editar' : 'Eliminar'}
                  </button>
                </div>
              )
            })}
          </div>
        </Modal>

        {/* Modal para agregar/editar item */}
        <Modal
          isOpen={isModalOpen}
          title={isEditMode ? `Editar: ${editingItem?.nombre}` : 'Agregar Item al Inventario'}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          onConfirm={handleSaveItem}
          confirmText={saving ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Agregar'}
        >
          <form className="form-grid">
            {viewMode === 'por-habitacion' && (
              <div className="form-group">
                <label>Habitación</label>
                <input
                  type="text"
                  value={`Habitación ${selectedRoom?.numero || ''}`}
                  disabled
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Artículo</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Ej: Sábanas"
                value={formData.nombre}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="cantidad">Cantidad</label>
              <input
                id="cantidad"
                type="number"
                name="cantidad"
                placeholder="0"
                value={formData.cantidad}
                onChange={handleFormChange}
                min="0"
              />
            </div>
            {viewMode === 'global' && (
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <input
                  id="estado"
                  type="text"
                  value={calculateStatus(formData.cantidad) || 'No definido'}
                  disabled
                  placeholder="Se calcula automáticamente"
                />
              </div>
            )}
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
