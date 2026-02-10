import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Card from '../../components/common/Card'
import { useAuth } from '../../hooks/useAuth'
import './ModulePage.css'

const API = 'http://localhost/roommaster/backend'

export default function TiendaPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Modal productos
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productForm, setProductForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
  })

  // Modal ventas
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [saleForm, setSaleForm] = useState({
    producto_id: '',
    cantidad: '',
  })

  // Cargar datos
  useEffect(() => {
    cargarProductos()
    cargarVentas()
  }, [])

  async function cargarProductos() {
    try {
      const res = await fetch(`${API}/productos.php`)
      const data = await res.json()
      if (data.success) setProducts(data.datos)
    } catch (err) {
      console.error(err)
    }
  }

  async function cargarVentas() {
    try {
      const res = await fetch(`${API}/ventas.php`)
      const data = await res.json()
      if (data.success) setSales(data.datos)
    } catch (err) {
      console.error(err)
    }
  }

  async function crearProducto() {
    if (!productForm.nombre || !productForm.precio || !productForm.stock) {
      alert('Completa todos los campos')
      return
    }
    try {
      const res = await fetch(`${API}/productos.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: productForm.nombre,
          precio: parseFloat(productForm.precio),
          stock: parseInt(productForm.stock),
          categoria: productForm.categoria,
        })
      })
      const data = await res.json()
      if (data.success) {
        cargarProductos()
        setProductForm({ nombre: '', precio: '', stock: '', categoria: '' })
        setIsProductModalOpen(false)
      } else {
        alert(data.mensaje)
      }
    } catch (err) {
      alert('Error al crear producto')
    }
  }

  async function crearVenta() {
    if (!saleForm.producto_id || !saleForm.cantidad) {
      alert('Completa todos los campos')
      return
    }
    try {
      const res = await fetch(`${API}/ventas.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id: parseInt(saleForm.producto_id),
          cantidad: parseInt(saleForm.cantidad),
        })
      })
      const data = await res.json()
      if (data.success) {
        cargarVentas()
        cargarProductos()
        setSaleForm({ producto_id: '', cantidad: '' })
        setIsSaleModalOpen(false)
      } else {
        alert(data.mensaje)
      }
    } catch (err) {
      alert('Error al registrar venta')
    }
  }

  async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro?')) return
    try {
      const res = await fetch(`${API}/productos.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const data = await res.json()
      if (data.success) cargarProductos()
    } catch (err) {
      alert('Error al eliminar')
    }
  }

  async function eliminarVenta(id) {
    if (!confirm('¿Estás seguro?')) return
    try {
      const res = await fetch(`${API}/ventas.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const data = await res.json()
      if (data.success) {
        cargarVentas()
        cargarProductos()
      }
    } catch (err) {
      alert('Error al eliminar')
    }
  }

  const productColumns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'precio', label: 'Precio', render: (v) => `$${v}` },
    { key: 'stock', label: 'Stock' },
  ]

  const saleColumns = [
    { key: 'id', label: 'ID' },
    { key: 'producto_id', label: 'Producto ID' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'fecha_venta', label: 'Fecha' },
  ]

  const totalVentas = sales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0)
  const stockTotal = products.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0)

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Tienda</h1>
        <p className="page-subtitle">Gestiona inventario de productos y ventas</p>

        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          <Card
            title="Ingresos"
            value={`$${totalVentas.toFixed(2)}`}
            icon="💰"
            subtitle="Total de ventas"
          />
          <Card
            title="Stock Total"
            value={stockTotal}
            icon="📦"
            subtitle="Unidades"
          />
          <Card
            title="Productos"
            value={products.length}
            icon="🏷️"
            subtitle="Diferentes tipos"
          />
          <Card
            title="Ventas"
            value={sales.length}
            icon="🛒"
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
            onDelete={user?.role === 'admin' ? (p) => eliminarProducto(p.id) : null}
            actions={user?.role === 'admin'}
          />
        </div>

        {/* VENTAS */}
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Registro de Ventas</h2>
            {(user?.role === 'admin' || user?.role === 'receptionist') && (
              <button className="btn btn-primary" onClick={() => setIsSaleModalOpen(true)}>
                + Nueva Venta
              </button>
            )}
          </div>
          <Table
            columns={saleColumns}
            data={sales}
            onDelete={(s) => eliminarVenta(s.id)}
            actions={true}
          />
        </div>

        {/* Modal Producto */}
        <Modal
          isOpen={isProductModalOpen}
          title="Nuevo Producto"
          onClose={() => setIsProductModalOpen(false)}
          onConfirm={crearProducto}
          confirmText="Guardar"
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Nombre del producto"
                value={productForm.nombre}
                onChange={(e) => setProductForm({ ...productForm, nombre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={productForm.precio}
                onChange={(e) => setProductForm({ ...productForm, precio: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                placeholder="0"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <input
                type="text"
                placeholder="Ej: Bebidas"
                value={productForm.categoria}
                onChange={(e) => setProductForm({ ...productForm, categoria: e.target.value })}
              />
            </div>
          </form>
        </Modal>

        {/* Modal Venta */}
        <Modal
          isOpen={isSaleModalOpen}
          title="Registrar Venta"
          onClose={() => setIsSaleModalOpen(false)}
          onConfirm={crearVenta}
          confirmText="Registrar"
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Producto</label>
              <select
                value={saleForm.producto_id}
                onChange={(e) => setSaleForm({ ...saleForm, producto_id: e.target.value })}
              >
                <option value="">Selecciona un producto</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Cantidad</label>
              <input
                type="number"
                placeholder="0"
                value={saleForm.cantidad}
                onChange={(e) => setSaleForm({ ...saleForm, cantidad: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
