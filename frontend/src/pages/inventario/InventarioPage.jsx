import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Card from '../../components/common/Card'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../hooks/useAuth'
import './ModulePage.css'

const API = 'http://localhost/RoomMaster_Prueba/backend'

export default function InventarioPage() {
  const { user } = useAuth()
  
  // DATOS
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  
  // ESTADOS UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('') // 'add', 'agregar', 'restar', 'editar'
  const [editingItem, setEditingItem] = useState(null)
  
  // FORMULARIO
  const [formData, setFormData] = useState({
    producto_id: '',
    cantidad_actual: '',
    cantidad_minima: '',
    cantidad_maxima: '',
    ubicacion: '',
    accion: 'actualizar' // 'agregar', 'restar', 'actualizar'
  })

  // CARGAR DATOS AL MONTAR
  useEffect(() => {
    cargarInventario()
    cargarProductos()
  }, [])

  // FUNCIONES DE CARGA
  async function cargarInventario() {
    try {
      setLoading(true)
      const res = await fetch(`${API}/inventario.php`)
      const data = await res.json()
      if (data.exito) {
        setInventory(data.datos || [])
      } else {
        setError(data.mensaje)
      }
    } catch (err) {
      setError('Error al cargar inventario: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function cargarProductos() {
    try {
      const res = await fetch(`${API}/productos.php`)
      const data = await res.json()
      if (data.exito) {
        setProducts(data.datos || [])
      }
    } catch (err) {
      console.error('Error al cargar productos:', err)
    }
  }

  // FUNCIONES CRUD
  const resetForm = () => {
    setFormData({
      producto_id: '',
      cantidad_actual: '',
      cantidad_minima: '',
      cantidad_maxima: '',
      ubicacion: '',
      accion: 'actualizar'
    })
    setEditingItem(null)
  }

  const handleOpenModal = (type, item = null) => {
    resetForm()
    setModalType(type)
    
    if (type === 'add') {
      setEditingItem(null)
      setFormData({ ...formData, accion: 'actualizar' })
    } else if (type === 'agregar' || type === 'restar') {
      setEditingItem(item)
      setFormData({
        ...formData,
        producto_id: item.producto_id,
        cantidad_actual: '',
        accion: type
      })
    } else if (type === 'editar') {
      setEditingItem(item)
      setFormData({
        producto_id: item.producto_id,
        cantidad_actual: item.cantidad_actual,
        cantidad_minima: item.cantidad_minima,
        cantidad_maxima: item.cantidad_maxima,
        ubicacion: item.ubicacion,
        accion: 'actualizar'
      })
    }
    
    setIsModalOpen(true)
  }

  const handleSaveInventory = async () => {
    if (modalType === 'add') {
      if (!formData.producto_id || !formData.cantidad_actual) {
        alert('Por favor completa: Producto y Cantidad')
        return
      }
    } else {
      if (!formData.cantidad_actual) {
        alert('Por favor ingresa una cantidad')
        return
      }
    }

    try {
      if (modalType === 'add') {
        // Crear nuevo inventario
        const res = await fetch(`${API}/inventario.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            producto_id: parseInt(formData.producto_id),
            cantidad_actual: parseInt(formData.cantidad_actual),
            cantidad_minima: parseInt(formData.cantidad_minima) || 10,
            cantidad_maxima: parseInt(formData.cantidad_maxima) || 100,
            ubicacion: formData.ubicacion || 'Almacén general'
          })
        })
        const data = await res.json()
        if (data.exito) {
          alert('✓ Inventario creado')
          cargarInventario()
        } else {
          alert('Error: ' + data.mensaje)
        }
      } else {
        // Actualizar (agregar, restar o editar)
        const res = await fetch(`${API}/inventario.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            cantidad_actual: parseInt(formData.cantidad_actual),
            cantidad_minima: parseInt(formData.cantidad_minima) || editingItem.cantidad_minima,
            cantidad_maxima: parseInt(formData.cantidad_maxima) || editingItem.cantidad_maxima,
            ubicacion: formData.ubicacion || editingItem.ubicacion,
            accion: formData.accion
          })
        })
        const data = await res.json()
        if (data.exito) {
          const acciones = {
            'agregar': '✓ Stock agregado',
            'restar': '✓ Stock restado',
            'actualizar': '✓ Inventario actualizado'
          }
          alert(acciones[formData.accion])
          cargarInventario()
        } else {
          alert('Error: ' + data.mensaje)
        }
      }
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      alert('Error: ' + err.message)
      console.error(err)
    }
  }

  const handleDelete = async (item) => {
    if (!confirm('¿Eliminar inventario de ' + item.nombre_producto + '?')) return
    try {
      const res = await fetch(`${API}/inventario.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      })
      const data = await res.json()
      if (data.exito) {
        alert('✓ Eliminado')
        cargarInventario()
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  // CALCULAR ESTADÍSTICAS
  const totalProductos = inventory.length
  const stockBajo = inventory.filter(i => i.cantidad_actual <= i.cantidad_minima).length
  const stockAlto = inventory.filter(i => i.cantidad_actual >= i.cantidad_maxima).length

  // COLUMNAS DE TABLA
  const columns = [
    { key: 'nombre_producto', label: 'Producto' },
    { key: 'categoria', label: 'Categoría' },
    { 
      key: 'cantidad_actual', 
      label: 'Cantidad Actual',
      render: (v, row) => {
        const color = v <= row.cantidad_minima ? 'red' : v >= row.cantidad_maxima ? 'green' : 'orange'
        return <span style={{ color }}>{v}</span>
      }
    },
    { key: 'cantidad_minima', label: 'Mínimo' },
    { key: 'cantidad_maxima', label: 'Máximo' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'ultimo_reabastecimiento', label: 'Ult. Reabastecimiento', render: (v) => new Date(v).toLocaleDateString() }
  ]

  // MODAL DINÁMICO
  const getModalTitle = () => {
    const titles = {
      'add': 'Crear Inventario',
      'agregar': 'Agregar Stock',
      'restar': 'Restar Stock',
      'editar': 'Editar Inventario'
    }
    return titles[modalType] || 'Inventario'
  }

  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Icon name="package" size={32} className="primary" />
          <h1 style={{ margin: 0 }}>Gestión de Inventario</h1>
        </div>
        <p className="page-subtitle">Control de stock de productos del hotel</p>

        {error && <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}

        {/* TARJETAS ESTADÍSTICAS */}
        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <Card
            title="Total de Productos"
            value={totalProductos}
            icon="package"
            subtitle="en inventario"
          />
          <Card
            title="Stock Bajo"
            value={stockBajo}
            icon="trending"
            subtitle="por debajo del mínimo"
          />
          <Card
            title="Stock Alto"
            value={stockAlto}
            icon="rocket"
            subtitle="en o sobre el máximo"
          />
        </div>

        {/* BOTÓN NUEVO INVENTARIO */}
        <div className="page-header" style={{ marginBottom: '20px' }}>
          <div></div>
          {(user?.role === 'admin' || user?.role === 'gerente') && (
            <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
              + Crear Inventario
            </button>
          )}
        </div>

        {/* TABLA */}
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Table
            columns={columns}
            data={inventory.map(item => ({
              ...item,
              __actions: (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => handleOpenModal('agregar', item)} 
                    className="btn btn-small"
                    style={{ backgroundColor: '#4CAF50', color: 'white', padding: '4px 8px' }}
                    title="Agregar stock"
                  >
                    ➕
                  </button>
                  <button 
                    onClick={() => handleOpenModal('restar', item)} 
                    className="btn btn-small"
                    style={{ backgroundColor: '#FF9800', color: 'white', padding: '4px 8px' }}
                    title="Restar stock"
                  >
                    ➖
                  </button>
                  <button 
                    onClick={() => handleOpenModal('editar', item)} 
                    className="btn btn-small"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    className="btn btn-danger btn-small"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              )
            }))}
            actions={true}
          />
        )}

        {/* MODAL */}
        <Modal
          isOpen={isModalOpen}
          title={getModalTitle()}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSaveInventory}
          confirmText="Guardar"
        >
          <form className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* PRODUCTO */}
            {modalType === 'add' && (
              <div className="form-group">
                <label>Producto *</label>
                <select
                  value={formData.producto_id}
                  onChange={(e) => setFormData({ ...formData, producto_id: e.target.value })}
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Seleccionar producto</option>
                  {products.map(prod => {
                    // Verificar si ya existe en inventario
                    const existe = inventory.some(i => i.producto_id === prod.id)
                    return (
                      <option key={prod.id} value={prod.id} disabled={existe}>
                        {prod.nombre} {existe ? '(Ya en inventario)' : ''}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}

            {/* CANTIDAD */}
            <div className="form-group">
              <label>
                {modalType === 'agregar' ? 'Cantidad a Agregar' : modalType === 'restar' ? 'Cantidad a Restar' : 'Cantidad Actual'} *
              </label>
              <input
                type="number"
                value={formData.cantidad_actual}
                onChange={(e) => setFormData({ ...formData, cantidad_actual: e.target.value })}
                placeholder="0"
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                required
              />
            </div>

            {/* MÍNIMO Y MÁXIMO */}
            {(modalType === 'add' || modalType === 'editar') && (
              <>
                <div className="form-group">
                  <label>Cantidad Mínima</label>
                  <input
                    type="number"
                    value={formData.cantidad_minima}
                    onChange={(e) => setFormData({ ...formData, cantidad_minima: e.target.value })}
                    placeholder="10"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div className="form-group">
                  <label>Cantidad Máxima</label>
                  <input
                    type="number"
                    value={formData.cantidad_maxima}
                    onChange={(e) => setFormData({ ...formData, cantidad_maxima: e.target.value })}
                    placeholder="100"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    placeholder="Almacén general"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
              </>
            )}
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
