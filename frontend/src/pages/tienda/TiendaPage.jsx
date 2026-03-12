import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Card from '../../components/common/Card'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../hooks/useAuth'
import { filterNumbersDecimal, filterOnlyNumbers, filterName } from '../../utils/validation'
import { formatCOP, formatNumberWithThousandsSeparator } from '../../utils/currency'
import './ModulePage.css'

const API = '/backend'

export default function TiendaPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [stays, setStays] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Modal productos
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
  })

  // Modal ventas
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [selectedClientName, setSelectedClientName] = useState('')
  const [saleForm, setSaleForm] = useState({
    estadia_id: '',
    producto_id: '',
    cantidad: '',
  })

  // Cargar datos
  useEffect(() => {
    cargarProductos()
    cargarVentas()
    cargarEstadias()
  }, [])

  async function cargarProductos() {
    try {
      const res = await fetch(`${API}/productos.php`)
      const data = await res.json()
      if (data.exito) setProducts(data.datos)
    } catch (err) {
      console.error(err)
    }
  }

  async function cargarVentas() {
    try {
      const res = await fetch(`${API}/ventas.php`)
      const data = await res.json()
      if (data.exito) setSales(data.datos)
    } catch (err) {
      console.error(err)
    }
  }

  async function cargarEstadias() {
    try {
      const res = await fetch(`${API}/estadias.php`)
      const data = await res.json()
      if (data.exito) setStays(data.datos)
    } catch (err) {
      console.error(err)
    }
  }

  async function crearProducto() {
    if (!productForm.nombre || !productForm.precio || !productForm.stock) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos requeridos',
        confirmButtonColor: '#667eea'
      })
      return
    }
    try {
      const url = editingProduct ? `${API}/productos.php` : `${API}/productos.php`
      const method = editingProduct ? 'PUT' : 'POST'
      // Limpiar punto de separador de mil del precio
      const cleanPrice = productForm.precio.replace(/\./g, '')
      const body = editingProduct 
        ? {
            id: editingProduct.id,
            nombre: productForm.nombre,
            precio: parseFloat(cleanPrice),
            stock: parseInt(productForm.stock),
            categoria: productForm.categoria,
            rol: user?.role
          }
        : {
            nombre: productForm.nombre,
            precio: parseFloat(cleanPrice),
            stock: parseInt(productForm.stock),
            categoria: productForm.categoria,
            rol: user?.role
          }
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.exito) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
          confirmButtonColor: '#667eea'
        })
        cargarProductos()
        setProductForm({ nombre: '', precio: '', stock: '', categoria: '' })
        setEditingProduct(null)
        setIsProductModalOpen(false)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'Error al guardar producto',
          confirmButtonColor: '#667eea'
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar producto',
        confirmButtonColor: '#667eea'
      })
    }
  }

  function handleEditProduct(product) {
    setEditingProduct(product)
    setProductForm({
      nombre: product.nombre,
      precio: product.precio.toString(),
      stock: product.stock.toString(),
      categoria: product.categoria || ''
    })
    setIsProductModalOpen(true)
  }

  function handleProductFormChange(e) {
    const { name, value } = e.target

    if (name === 'nombre') {
      setProductForm(prev => ({ ...prev, [name]: filterName(value) }))
    } else if (name === 'precio') {
      // Remover puntos de separador de mil y filtrar solo dígitos
      const cleanValue = value.replace(/\./g, '').replace(/[^0-9]/g, '')
      // Formatear con puntos de separador
      const formattedValue = cleanValue ? formatNumberWithThousandsSeparator(cleanValue) : ''
      setProductForm(prev => ({ ...prev, [name]: formattedValue }))
    } else if (name === 'stock') {
      setProductForm(prev => ({ ...prev, [name]: filterOnlyNumbers(value) }))
    } else {
      setProductForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function handleCancelEdit() {
    setEditingProduct(null)
    setProductForm({ nombre: '', precio: '', stock: '', categoria: '' })
    setIsProductModalOpen(false)
  }

  async function crearVenta() {
    if (!saleForm.estadia_id || !saleForm.producto_id || !saleForm.cantidad) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Completa todos los campos requeridos',
        confirmButtonColor: '#667eea'
      })
      return
    }
    try {
      const res = await fetch(`${API}/ventas.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estadia_id: parseInt(saleForm.estadia_id),
          producto_id: parseInt(saleForm.producto_id),
          cantidad: parseInt(saleForm.cantidad),
          rol: user?.role
        })
      })
      const data = await res.json()
      if (data.exito) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Venta registrada correctamente',
          confirmButtonColor: '#667eea'
        })
        cargarVentas()
        cargarProductos()
        setSaleForm({ estadia_id: '', producto_id: '', cantidad: '' })
        setSelectedClientName('')
        setIsSaleModalOpen(false)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'Error al registrar venta',
          confirmButtonColor: '#667eea'
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al registrar venta',
        confirmButtonColor: '#667eea'
      })
    }
  }

  function handleStayChange(e) {
    const selectedId = e.target.value
    setSaleForm({ ...saleForm, estadia_id: selectedId })
    
    // Buscar el nombre del cliente de la estadía seleccionada
    if (selectedId) {
      const selectedStay = stays.find(s => s.id == selectedId)
      if (selectedStay) {
        setSelectedClientName(`${selectedStay.cliente_nombre || 'Cliente'} - Hab. ${selectedStay.numero_habitacion || selectedStay.habitacion_id}`)
      }
    } else {
      setSelectedClientName('')
    }
  }

  async function eliminarProducto(id) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return
      eliminarProductoConfirmed(id)
    })
  }

  async function eliminarProductoConfirmed(id) {
    try {
      const res = await fetch(`${API}/productos.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, rol: user?.role })
      })
      const data = await res.json()
      if (data.exito) {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Producto eliminado correctamente',
          timer: 1500
        })
        cargarProductos()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar producto',
          confirmButtonColor: '#667eea'
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al eliminar',
        confirmButtonColor: '#667eea'
      })
    }
  }

  async function eliminarVenta(id) {
    Swal.fire({
      title: '¿Eliminar venta?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return
      eliminarVentaConfirmed(id)
    })
  }

  async function eliminarVentaConfirmed(id) {
    try {
      const res = await fetch(`${API}/ventas.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, rol: user?.role })
      })
      const data = await res.json()
      if (data.exito) {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Venta eliminada correctamente',
          timer: 1500
        })
        cargarVentas()
        cargarProductos()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.mensaje || 'Error al eliminar venta',
          confirmButtonColor: '#667eea'
        })
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al eliminar venta: ' + err.message,
        confirmButtonColor: '#667eea'
      })
    }
  }

  const productColumns = [
    { key: 'nombre', label: 'Nombre', render: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
    { key: 'categoria', label: 'Categoría', render: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
    { key: 'precio', label: 'Precio', render: (v) => formatCOP(v) },
    { 
      key: 'stock', 
      label: 'Stock',
      render: (v) => (
        <span style={{
          display: 'inline-block',
          padding: '4px 8px',
          backgroundColor: v > 5 ? '#e8f5e9' : v > 0 ? '#fff3e0' : '#ffebee',
          color: v > 5 ? '#2e7d32' : v > 0 ? '#e65100' : '#c62828',
          borderRadius: '4px',
          fontWeight: '600',
          fontSize: '12px'
        }}>
          {v || 0}
        </span>
      )
    },
  ]

  const saleColumns = [
    { key: 'id', label: 'ID' },
    { key: 'cliente_nombre', label: 'Cliente' },
    { key: 'producto_nombre', label: 'Producto', render: (v) => v.charAt(0).toUpperCase() + v.slice(1) },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'precio_unitario', label: 'Precio Unitario', render: (v) => formatCOP(v) },
    { key: 'subtotal', label: 'Subtotal', render: (v) => formatCOP(v) },
    { key: 'fecha_venta', label: 'Fecha', render: (v) => new Date(v).toLocaleDateString('es-CO') },
  ]

  const totalVentas = sales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0)
  const stockTotal = products.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0)

  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Icon name="package" size={32} className="primary" />
          <h1 style={{ margin: 0 }}>Tienda</h1>
        </div>
        <p className="page-subtitle">Gestiona inventario de productos y ventas</p>

        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <Card
            title="Ingresos"
            value={formatCOP(totalVentas)}
            icon="money"
            subtitle="Total de ventas"
          />
          <Card
            title="Stock Total"
            value={stockTotal}
            icon="package"
            subtitle="Unidades"
          />
          <Card
            title="Productos"
            value={products.length}
            icon="trending"
            subtitle="Diferentes tipos"
          />
          <Card
            title="Ventas"
            value={sales.length}
            icon="chart"
            subtitle="Registradas"
          />
        </div>

        {/* PRODUCTOS */}
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Productos en Stock</h2>
            {user?.role === 'admin' && (
              <button className="btn btn-primary" onClick={() => setIsProductModalOpen(true)}>
                + Nuevo Producto
              </button>
            )}
          </div>
          <Table
            columns={productColumns}
            data={products}
            onEdit={user?.role === 'admin' ? (p) => handleEditProduct(p) : null}
            onDelete={user?.role === 'admin' ? (p) => eliminarProducto(p.id) : null}
            actions={user?.role === 'admin'}
          />
        </div>

        {/* VENTAS */}
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Registro de Ventas</h2>
            {(user?.role === 'admin' || user?.role === 'recepcionista') && (
              <button className="btn btn-primary" onClick={() => setIsSaleModalOpen(true)}>
                + Nueva Venta
              </button>
            )}
          </div>
          <Table
            columns={saleColumns}
            data={sales}
            onDelete={(s) => eliminarVenta(s.id)}
            showDelete={true}
            showEdit={false}
          />
        </div>

        {/* Modal Producto */}
        <Modal
          isOpen={isProductModalOpen}
          title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          onClose={handleCancelEdit}
          onConfirm={crearProducto}
          confirmText={editingProduct ? 'Actualizar' : 'Guardar'}
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del producto"
                value={productForm.nombre}
                onChange={handleProductFormChange}
              />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input
                type="text"
                name="precio"
                placeholder="0"
                maxLength="15"
                value={productForm.precio}
                onChange={handleProductFormChange}
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                placeholder="0"
                min="0"
                value={productForm.stock}
                onChange={handleProductFormChange}
              />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <input
                type="text"
                name="categoria"
                placeholder="Ej: Bebidas"
                value={productForm.categoria}
                onChange={handleProductFormChange}
              />
            </div>
          </form>
        </Modal>

        {/* Modal Venta */}
        <Modal
          isOpen={isSaleModalOpen}
          title="Registrar Venta"
          onClose={() => {
            setIsSaleModalOpen(false)
            setSelectedClientName('')
          }}
          onConfirm={crearVenta}
          confirmText="Registrar"
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Estadía del Cliente *</label>
              <select
                value={saleForm.estadia_id}
                onChange={handleStayChange}
                required
              >
                <option value="">Selecciona una estadía</option>
                {stays.filter(s => s.estado === 'activa').map(s => (
                  <option key={s.id} value={s.id}>
                    {s.cliente_nombre} - Hab. {s.numero_habitacion || s.habitacion_id}
                  </option>
                ))}
              </select>
              {selectedClientName && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px', 
                  backgroundColor: '#e3f2fd', 
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#1565c0',
                  fontWeight: '600'
                }}>
                  ✓ {selectedClientName}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Producto *</label>
              <select
                value={saleForm.producto_id}
                onChange={(e) => setSaleForm({ ...saleForm, producto_id: e.target.value })}
                required
              >
                <option value="">Selecciona un producto</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} - {formatCOP(p.precio)} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Cantidad *</label>
              <input
                type="text"
                placeholder="0"
                value={saleForm.cantidad}
                onChange={(e) => setSaleForm({ ...saleForm, cantidad: filterOnlyNumbers(e.target.value) })}
                required
              />
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
