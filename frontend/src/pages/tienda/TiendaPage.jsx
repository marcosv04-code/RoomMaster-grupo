import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Card from '../../components/common/Card'
import { useAuth } from '../../hooks/useAuth'
import './ModulePage.css'

export default function TiendaPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState([
    { id: 1, nombre: 'Botella de Agua Premium', precio: 8, stock: 120, categoria: 'Bebidas', descripcion: 'Botella reutilizable de 1L', vendidas: 450 },
    { id: 2, nombre: 'Kit de Aseo (Champo + Jabón)', precio: 12, stock: 95, categoria: 'Aseo', descripcion: 'Conjunto de higiene personal', vendidas: 320 },
    { id: 3, nombre: 'Toalla de Microfibra', precio: 25, stock: 45, categoria: 'Textiles', descripcion: 'Toalla absorbente y secado rápido', vendidas: 120 },
    { id: 4, nombre: 'Desodorante de Ambiente', precio: 15, stock: 60, categoria: 'Aromatizantes', descripcion: 'Spray para ambientes', vendidas: 200 },
    { id: 5, nombre: 'Chocolates Variados', precio: 18, stock: 80, categoria: 'Alimentos', descripcion: 'Caja de chocolates surtidos', vendidas: 350 },
  ])

  const [sales, setSales] = useState([
    { id: 1, producto: 'Botella de Agua Premium', cantidad: 3, total: 24, fecha: '2026-02-15', huésped: 'María García' },
    { id: 2, producto: 'Kit de Aseo', cantidad: 1, total: 12, fecha: '2026-02-15', huésped: 'Carlos López' },
    { id: 3, producto: 'Chocolates Variados', cantidad: 2, total: 36, fecha: '2026-02-14', huésped: 'Ana Martínez' },
    { id: 4, producto: 'Desodorante de Ambiente', cantidad: 1, total: 15, fecha: '2026-02-14', huésped: 'Jorge Rodríguez' },
  ])

  // Estados para productos
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productSaving, setProductSaving] = useState(false)
  const [productForm, setProductForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    descripcion: '',
  })

  // Estados para ventas
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [isEditSaleMode, setIsEditSaleMode] = useState(false)
  const [editingSale, setEditingSale] = useState(null)
  const [saleSaving, setSaleSaving] = useState(false)
  const [saleForm, setSaleForm] = useState({
    producto: '',
    cantidad: '',
    huésped: '',
  })

  // Columnas
  const productColumns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { 
      key: 'precio', 
      label: 'Precio',
      render: (value) => `$${value}`
    },
    { key: 'stock', label: 'Stock' },
    { key: 'vendidas', label: 'Vendidas' },
  ]

  const saleColumns = [
    { key: 'producto', label: 'Producto' },
    { key: 'cantidad', label: 'Cantidad' },
    { 
      key: 'total', 
      label: 'Total',
      render: (value) => `$${value}`
    },
    { key: 'fecha', label: 'Fecha' },
    { key: 'huésped', label: 'Huésped' },
  ]

  // ==== FUNCIONES PARA PRODUCTOS ====

  const resetProductForm = () => {
    setProductForm({
      nombre: '',
      precio: '',
      stock: '',
      categoria: '',
      descripcion: '',
    })
    setIsEditMode(false)
    setEditingProduct(null)
  }

  const handleOpenAddProductModal = () => {
    resetProductForm()
    setIsProductModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      nombre: product.nombre,
      precio: product.precio.toString(),
      stock: product.stock.toString(),
      categoria: product.categoria,
      descripcion: product.descripcion,
    })
    setIsEditMode(true)
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = async () => {
    if (!productForm.nombre || !productForm.precio || !productForm.stock) {
      alert('Por favor completa los campos requeridos: Nombre, Precio y Stock')
      return
    }

    setProductSaving(true)
    try {
      if (isEditMode && editingProduct) {
        // Actualizar producto existente
        setProducts(products.map(product =>
          product.id === editingProduct.id
            ? { 
                ...product, 
                nombre: productForm.nombre,
                precio: parseInt(productForm.precio),
                stock: parseInt(productForm.stock),
                categoria: productForm.categoria,
                descripcion: productForm.descripcion,
              }
            : product
        ))
        alert('Producto actualizado exitosamente')
      } else {
        // Agregar nuevo producto
        const newProduct = {
          id: Math.max(...products.map(p => p.id), 0) + 1,
          nombre: productForm.nombre,
          precio: parseInt(productForm.precio),
          stock: parseInt(productForm.stock),
          categoria: productForm.categoria,
          descripcion: productForm.descripcion,
          vendidas: 0,
        }
        setProducts([...products, newProduct])
        alert('Producto agregado exitosamente')
      }
      setIsProductModalOpen(false)
      resetProductForm()
    } catch (error) {
      console.error('Error al guardar producto:', error)
      alert('Error al guardar el producto')
    } finally {
      setProductSaving(false)
    }
  }

  const handleDeleteProduct = async (product) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el producto "${product.nombre}"?`
    )

    if (!confirmDelete) return

    try {
      setProducts(products.filter(p => p.id !== product.id))
      alert('Producto eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      alert('Error al eliminar el producto')
    }
  }

  const handleProductFormChange = (e) => {
    const { name, value } = e.target
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ==== FUNCIONES PARA VENTAS ====

  const resetSaleForm = () => {
    setSaleForm({
      producto: '',
      cantidad: '',
      huésped: '',
    })
    setIsEditSaleMode(false)
    setEditingSale(null)
  }

  const handleOpenAddSaleModal = () => {
    resetSaleForm()
    setIsSaleModalOpen(true)
  }

  const handleEditSale = (sale) => {
    setEditingSale(sale)
    setSaleForm({
      producto: sale.producto,
      cantidad: sale.cantidad.toString(),
      huésped: sale.huésped,
    })
    setIsEditSaleMode(true)
    setIsSaleModalOpen(true)
  }

  const handleSaveSale = async () => {
    if (!saleForm.producto || !saleForm.cantidad || !saleForm.huésped) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    const product = products.find(p => p.nombre === saleForm.producto)
    if (!product) {
      alert('Producto no encontrado')
      return
    }

    const cantidad = parseInt(saleForm.cantidad)

    if (isEditSaleMode && editingSale) {
      // Validar stock cuando se actualiza
      const diferencia = cantidad - editingSale.cantidad
      if (diferencia > 0 && product.stock < diferencia) {
        alert('Stock insuficiente para esta cantidad')
        return
      }
    } else {
      // Validar stock para nueva venta
      if (product.stock < cantidad) {
        alert('Stock insuficiente para esta cantidad')
        return
      }
    }

    setSaleSaving(true)
    try {
      if (isEditSaleMode && editingSale) {
        // Actualizar venta
        const diferencia = cantidad - editingSale.cantidad
        setSales(sales.map(sale =>
          sale.id === editingSale.id
            ? { 
                ...sale,
                producto: saleForm.producto,
                cantidad: cantidad,
                total: product.precio * cantidad,
                huésped: saleForm.huésped,
              }
            : sale
        ))
        // Ajustar stock
        setProducts(products.map(p =>
          p.id === product.id
            ? { 
                ...p, 
                stock: p.stock - diferencia,
                vendidas: p.vendidas + diferencia
              }
            : p
        ))
        alert('Venta actualizada exitosamente')
      } else {
        // Agregar nueva venta
        const newSale = {
          id: Math.max(...sales.map(s => s.id), 0) + 1,
          producto: saleForm.producto,
          cantidad: cantidad,
          total: product.precio * cantidad,
          fecha: new Date().toISOString().split('T')[0],
          huésped: saleForm.huésped,
        }
        setSales([...sales, newSale])
        // Restar del stock
        setProducts(products.map(p =>
          p.id === product.id
            ? { 
                ...p, 
                stock: p.stock - cantidad,
                vendidas: p.vendidas + cantidad
              }
            : p
        ))
        alert('Venta registrada exitosamente')
      }
      setIsSaleModalOpen(false)
      resetSaleForm()
    } catch (error) {
      console.error('Error al guardar venta:', error)
      alert('Error al guardar la venta')
    } finally {
      setSaleSaving(false)
    }
  }

  const handleDeleteSale = async (sale) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar esta venta de ${sale.cantidad} unidad(es) de ${sale.producto}?`
    )

    if (!confirmDelete) return

    try {
      const product = products.find(p => p.nombre === sale.producto)
      // Devolver al stock
      if (product) {
        setProducts(products.map(p =>
          p.id === product.id
            ? { 
                ...p, 
                stock: p.stock + sale.cantidad,
                vendidas: p.vendidas - sale.cantidad
              }
            : p
        ))
      }
      setSales(sales.filter(s => s.id !== sale.id))
      alert('Venta eliminada exitosamente')
    } catch (error) {
      console.error('Error al eliminar venta:', error)
      alert('Error al eliminar la venta')
    }
  }

  const handleSaleFormChange = (e) => {
    const { name, value } = e.target
    setSaleForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ==== CÁLCULOS ====
  const totalVentas = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalProductos = products.reduce((sum, prod) => sum + prod.stock, 0)
  const productosVendidos = products.reduce((sum, prod) => sum + prod.vendidas, 0)

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Tienda</h1>
        <p className="page-subtitle">Gestiona inventario de productos y ventas adicionales</p>

        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          <Card
            title="Ingresos por Tienda"
            value={`$${totalVentas}`}
            icon="💰"
            subtitle="De ventas adicionales"
          />
          <Card
            title="Stock Total"
            value={totalProductos}
            icon="📦"
            subtitle="Unidades disponibles"
          />
          <Card
            title="Productos Vendidos"
            value={productosVendidos}
            icon="🛒"
            subtitle="Este período"
          />
          <Card
            title="Categorías"
            value={new Set(products.map(p => p.categoria)).size}
            icon="🏷️"
            subtitle="Tipos de productos"
          />
        </div>

        {/* Sección de Productos */}
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2>Productos en Stock</h2>
              <p className="products-count">{products.length} producto(s)</p>
            </div>
            {user?.role === 'admin' && (
              <button className="btn btn-primary" onClick={handleOpenAddProductModal}>
                + Nuevo Producto
              </button>
            )}
          </div>
          <Table
            columns={productColumns}
            data={products}
            onEdit={user?.role === 'admin' ? handleEditProduct : (user?.role === 'receptionist' ? null : handleEditProduct)}
            onDelete={user?.role === 'admin' ? handleDeleteProduct : (user?.role === 'receptionist' ? null : handleDeleteProduct)}
            actions={user?.role === 'admin'}
          />
        </div>

        {/* Sección de Ventas */}
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2>Registro de Ventas</h2>
              <p className="products-count">{sales.length} venta(s)</p>
            </div>
            {(user?.role === 'admin' || user?.role === 'receptionist') && (
              <button className="btn btn-primary" onClick={handleOpenAddSaleModal}>
                + Nueva Venta
              </button>
            )}
          </div>
          <Table
            columns={saleColumns}
            data={sales}
            onEdit={user?.role !== 'receptionist' ? handleEditSale : handleEditSale}
            onDelete={user?.role !== 'receptionist' ? handleDeleteSale : handleDeleteSale}
            actions={true}
          />
        </div>

        {/* Modal para agregar/editar producto */}
        <Modal
          isOpen={isProductModalOpen}
          title={isEditMode ? `Editar: ${editingProduct?.nombre}` : 'Nuevo Producto'}
          onClose={() => {
            setIsProductModalOpen(false)
            resetProductForm()
          }}
          onConfirm={handleSaveProduct}
          confirmText={productSaving ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
        >
          <form className="form-grid">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Producto *</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                placeholder="Ej: Botella de Agua"
                value={productForm.nombre}
                onChange={handleProductFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <input
                id="descripcion"
                type="text"
                name="descripcion"
                placeholder="Ej: Botella reutilizable de 1L"
                value={productForm.descripcion}
                onChange={handleProductFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="precio">Precio ($) *</label>
              <input
                id="precio"
                type="number"
                name="precio"
                placeholder="Ej: 10"
                value={productForm.precio}
                onChange={handleProductFormChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                id="stock"
                type="number"
                name="stock"
                placeholder="Ej: 50"
                value={productForm.stock}
                onChange={handleProductFormChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                name="categoria"
                value={productForm.categoria}
                onChange={handleProductFormChange}
              >
                <option value="">Selecciona categoría</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Aseo">Aseo</option>
                <option value="Textiles">Textiles</option>
                <option value="Aromatizantes">Aromatizantes</option>
                <option value="Alimentos">Alimentos</option>
              </select>
            </div>
          </form>
          <p className="form-note">* Campos requeridos</p>
        </Modal>

        {/* Modal para agregar/editar venta */}
        <Modal
          isOpen={isSaleModalOpen}
          title={isEditSaleMode ? 'Editar Venta' : 'Registrar Nueva Venta'}
          onClose={() => {
            setIsSaleModalOpen(false)
            resetSaleForm()
          }}
          onConfirm={handleSaveSale}
          confirmText={saleSaving ? 'Guardando...' : isEditSaleMode ? 'Actualizar' : 'Registrar'}
        >
          <form className="form-grid">
            <div className="form-group">
              <label htmlFor="producto">Producto *</label>
              <select
                id="producto"
                name="producto"
                value={saleForm.producto}
                onChange={handleSaleFormChange}
              >
                <option value="">Selecciona un producto</option>
                {products.map(p => (
                  <option key={p.id} value={p.nombre}>
                    {p.nombre} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cantidad">Cantidad *</label>
              <input
                id="cantidad"
                type="number"
                name="cantidad"
                placeholder="Ej: 2"
                value={saleForm.cantidad}
                onChange={handleSaleFormChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="huésped">Nombre del Huésped *</label>
              <input
                id="huésped"
                type="text"
                name="huésped"
                placeholder="Ej: Juan García"
                value={saleForm.huésped}
                onChange={handleSaleFormChange}
              />
            </div>
          </form>
          <p className="form-note">* Campos requeridos</p>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
