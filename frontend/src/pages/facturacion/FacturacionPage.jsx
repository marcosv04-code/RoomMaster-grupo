import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Card from '../../components/common/Card'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../hooks/useAuth'
import './ModulePage.css'

const API = 'http://localhost/RoomMaster_Prueba/backend'

export default function FacturacionPage() {
  const { user } = useAuth()
  
  // DATOS
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [stays, setStays] = useState([])
  
  // ESTADOS UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)
  
  // FORMULARIO
  const [formData, setFormData] = useState({
    estadia_id: '',
    cliente_id: '',
    subtotal: '',
    impuesto: '',
    total: '',
    estado: 'Pendiente',
    metodo_pago: ''
  })

  // CARGAR DATOS AL MONTAR
  useEffect(() => {
    cargarFacturas()
    cargarClientes()
    cargarEstadias()
  }, [])

  // FUNCIONES DE CARGA
  async function cargarFacturas() {
    try {
      setLoading(true)
      const res = await fetch(`${API}/facturas.php`)
      const data = await res.json()
      if (data.exito) {
        setInvoices(data.datos || [])
      } else {
        setError(data.mensaje)
      }
    } catch (err) {
      setError('Error al cargar facturas: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function cargarClientes() {
    try {
      const res = await fetch(`${API}/clientes.php`)
      const data = await res.json()
      if (data.exito) {
        setClients(data.datos || [])
      }
    } catch (err) {
      console.error('Error al cargar clientes:', err)
    }
  }

  async function cargarEstadias() {
    try {
      const res = await fetch(`${API}/estadias.php`)
      const data = await res.json()
      if (data.exito) {
        setStays(data.datos || [])
      }
    } catch (err) {
      console.error('Error al cargar estadías:', err)
    }
  }

  // FUNCIONES CRUD
  const resetForm = () => {
    setFormData({
      estadia_id: '',
      cliente_id: '',
      subtotal: '',
      impuesto: '',
      total: '',
      estado: 'Pendiente',
      metodo_pago: ''
    })
    setIsEditMode(false)
    setEditingInvoice(null)
  }

  const handleOpenModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice)
    setFormData({
      estadia_id: invoice.estadia_id || '',
      cliente_id: invoice.cliente_id || '',
      subtotal: invoice.subtotal || '',
      impuesto: invoice.impuesto || '',
      total: invoice.total || '',
      estado: invoice.estado || 'Pendiente',
      metodo_pago: invoice.metodo_pago || ''
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const handleSaveInvoice = async () => {
    if (!formData.cliente_id || !formData.total) {
      alert('Por favor completa: Cliente y Total')
      return
    }

    try {
      if (isEditMode && editingInvoice) {
        // Actualizar
        const res = await fetch(`${API}/facturas.php`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingInvoice.id,
            estado: formData.estado,
            metodo_pago: formData.metodo_pago
          })
        })
        const data = await res.json()
        if (data.exito) {
          alert('✓ Factura actualizada')
          cargarFacturas()
        } else {
          alert('Error: ' + data.mensaje)
        }
      } else {
        // Crear nueva
        const res = await fetch(`${API}/facturas.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            estadia_id: parseInt(formData.estadia_id) || 1,
            cliente_id: parseInt(formData.cliente_id),
            subtotal: parseFloat(formData.subtotal) || 0,
            impuesto: parseFloat(formData.impuesto) || 0,
            total: parseFloat(formData.total),
            estado: formData.estado,
            metodo_pago: formData.metodo_pago
          })
        })
        const data = await res.json()
        if (data.exito) {
          alert('✓ Factura creada: ' + data.datos.numero_factura)
          cargarFacturas()
        } else {
          alert('Error: ' + data.mensaje)
        }
      }
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      alert('Error al guardar: ' + err.message)
      console.error(err)
    }
  }

  const handleDelete = async (invoice) => {
    if (!confirm('¿Eliminar factura ' + invoice.numero_factura + '?')) return
    try {
      const res = await fetch(`${API}/facturas.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: invoice.id })
      })
      const data = await res.json()
      if (data.exito) {
        alert('✓ Factura eliminada')
        cargarFacturas()
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  // CALCULAR TOTALES
  const totalIngresos = invoices.reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0)
  const totalPagado = invoices.filter(inv => inv.estado === 'Pagada').reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0)
  const pendiente = invoices.filter(inv => inv.estado === 'Pendiente').reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0)

  // COLUMNAS DE TABLA
  const columns = [
    { key: 'numero_factura', label: 'Factura' },
    { key: 'cliente_nombre', label: 'Cliente' },
    { key: 'subtotal', label: 'Subtotal', render: (v) => `$${parseFloat(v || 0).toFixed(2)}` },
    { key: 'impuesto', label: 'Impuesto', render: (v) => `$${parseFloat(v || 0).toFixed(2)}` },
    { key: 'total', label: 'Total', render: (v) => `$${parseFloat(v || 0).toFixed(2)}` },
    { key: 'estado', label: 'Estado' },
    { key: 'metodo_pago', label: 'Método' },
    { key: 'fecha_factura', label: 'Fecha', render: (v) => new Date(v).toLocaleDateString() }
  ]

  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Icon name="money" size={32} className="primary" />
          <h1 style={{ margin: 0 }}>Facturación y Cobro</h1>
        </div>
        <p className="page-subtitle">Gestiona facturas, cobros y registra pagos</p>

        {error && <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}

        {/* TARJETAS ESTADÍSTICAS */}
        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <Card
            title="Ingresos Totales"
            value={`$${totalIngresos.toFixed(2)}`}
            icon="money"
            subtitle={`${invoices.length} facturas`}
          />
          <Card
            title="Cobrado"
            value={`$${totalPagado.toFixed(2)}`}
            icon="check-circle"
            subtitle="Pagadas"
          />
          <Card
            title="Por Cobrar"
            value={`$${pendiente.toFixed(2)}`}
            icon="activity"
            subtitle="Pendientes"
          />
        </div>

        {/* BOTÓN NUEVA FACTURA */}
        <div className="page-header" style={{ marginBottom: '20px' }}>
          <div></div>
          {(user?.role === 'admin' || user?.role === 'receptionist') && (
            <button className="btn btn-primary" onClick={handleOpenModal}>
              + Nueva Factura
            </button>
          )}
        </div>

        {/* TABLA */}
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Table
            columns={columns}
            data={invoices}
            onEdit={handleEdit}
            onDelete={handleDelete}
            actions={true}
          />
        )}

        {/* MODAL */}
        <Modal
          isOpen={isModalOpen}
          title={isEditMode ? 'Editar Factura' : 'Nueva Factura'}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSaveInvoice}
          confirmText={isEditMode ? 'Actualizar' : 'Crear Factura'}
        >
          <form className="form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {!isEditMode && (
              <>
                {/* ESTADIA */}
                <div className="form-group">
                  <label>Estadía (Opcional)</label>
                  <select
                    value={formData.estadia_id}
                    onChange={(e) => setFormData({ ...formData, estadia_id: e.target.value })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="">Seleccionar estadía</option>
                    {stays.map(stay => (
                      <option key={stay.id} value={stay.id}>
                        Estadía #{stay.id} - Cliente #{stay.cliente_id}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CLIENTE */}
                <div className="form-group">
                  <label>Cliente *</label>
                  <select
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                    required
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="">Seleccionar cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.nombre} (ID: {client.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* SUBTOTAL */}
                <div className="form-group">
                  <label>Subtotal ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.subtotal}
                    onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                    placeholder="0.00"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                {/* IMPUESTO */}
                <div className="form-group">
                  <label>Impuesto ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.impuesto}
                    onChange={(e) => setFormData({ ...formData, impuesto: e.target.value })}
                    placeholder="0.00"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>

                {/* TOTAL */}
                <div className="form-group">
                  <label>Total ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.total}
                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                    placeholder="0.00"
                    required
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
              </>
            )}

            {/* ESTADO */}
            <div className="form-group">
              <label>Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagada">Pagada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            {/* MÉTODO DE PAGO */}
            <div className="form-group">
              <label>Método de Pago</label>
              <select
                value={formData.metodo_pago}
                onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="">Seleccionar</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
