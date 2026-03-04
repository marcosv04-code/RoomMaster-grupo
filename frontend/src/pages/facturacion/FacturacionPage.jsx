import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Card from '../../components/common/Card'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../hooks/useAuth'
import { formatCOP, formatCOPWithDecimals } from '../../utils/currency'
import './ModulePage.css'

const API = `${window.location.origin}/backend`

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
            metodo_pago: formData.metodo_pago,
            rol: user?.role
          })
        })
        const data = await res.json()
        if (data.exito) {
          alert('Factura actualizada')
          cargarFacturas()
          // Si la factura se marca como pagada, recargar estadías (se actualizarán a finalizada)
          if (formData.estado === 'Pagada') {
            cargarEstadias()
          }
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
          alert('Factura creada: ' + data.datos.numero_factura)
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
        body: JSON.stringify({ id: invoice.id, rol: user?.role })
      })
      const data = await res.json()
      if (data.exito) {
        alert('Factura eliminada')
        cargarFacturas()
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const handlePrint = (invoice) => {
    // Crear contenido HTML para impresión
    const printContent = `
      <html>
        <head>
          <title>Factura ${invoice.numero_factura}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice-container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; }
            .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .invoice-header h1 { margin: 0; font-size: 28px; }
            .invoice-header p { margin: 5px 0; color: #666; }
            .invoice-details { margin-bottom: 30px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #333; }
            .detail-value { color: #666; }
            .invoice-items { margin-bottom: 30px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #333; font-weight: bold; }
            .items-table td { padding: 10px; border-bottom: 1px solid #eee; }
            .totals { margin-top: 30px; border-top: 2px solid #333; padding-top: 20px; }
            .total-row { display: flex; justify-content: space-between; font-size: 16px; margin-bottom: 10px; }
            .total-row.grand { font-size: 20px; font-weight: bold; color: #2c3e50; border-top: 1px solid #333; padding-top: 10px; }
            .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
            @media print {
              body { margin: 0; padding: 0; }
              .invoice-container { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1>ROOMMASTER</h1>
              <p>Factura de Alojamiento</p>
              <p><strong>${invoice.numero_factura}</strong></p>
            </div>

            <div class="invoice-details">
              <div class="detail-row">
                <span class="detail-label">Cliente:</span>
                <span class="detail-value">${invoice.cliente_nombre || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fecha:</span>
                <span class="detail-value">${new Date(invoice.fecha_factura).toLocaleDateString('es-CO')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Estado:</span>
                <span class="detail-value">${invoice.estado}</span>
              </div>
              ${invoice.metodo_pago ? `<div class="detail-row">
                <span class="detail-label">Método de Pago:</span>
                <span class="detail-value">${invoice.metodo_pago}</span>
              </div>` : ''}
            </div>

            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <strong>${formatCOPWithDecimals(invoice.subtotal)}</strong>
              </div>
              <div class="total-row">
                <span>Impuesto (19%):</span>
                <strong>${formatCOPWithDecimals(invoice.impuesto)}</strong>
              </div>
              <div class="total-row grand">
                <span>TOTAL:</span>
                <strong>${formatCOPWithDecimals(invoice.total)}</strong>
              </div>
            </div>

            <div class="footer">
              <p>Gracias por su hospedaje</p>
              <p>RoomMaster - Sistema de Gestión Hotelera</p>
              <p style="margin-top: 20px; font-size: 10px;">${new Date().toLocaleString('es-CO')}</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Abrir en nueva ventana
    const printWindow = window.open('', '', 'height=600,width=800')
    printWindow.document.write(printContent)
    printWindow.document.close()
    
    // Esperar a que se cargue el contenido y abrir impresión
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  // Generar factura automática desde una estadía
  async function generarFacturaAutomatica(estadiaId) {
    try {
      const res = await fetch(`${API}/facturas.php?action=generar_automatica&estadia_id=${estadiaId}`)
      const data = await res.json()
      if (data.exito) {
        alert(`Factura ${data.datos.numero_factura} creada automáticamente\n\nEstadía: ${formatCOP(data.datos.total_estadia)}\nVentas: ${formatCOP(data.datos.total_ventas)}\nTotal: ${formatCOP(data.datos.total)}`)
        cargarFacturas()
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (err) {
      alert('Error al generar factura: ' + err.message)
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
    { key: 'subtotal', label: 'Subtotal', render: (v) => formatCOPWithDecimals(v) },
    { key: 'impuesto', label: 'Impuesto', render: (v) => formatCOPWithDecimals(v) },
    { key: 'total', label: 'Total', render: (v) => formatCOPWithDecimals(v) },
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
            value={formatCOP(totalIngresos)}
            icon="money"
            subtitle={`${invoices.length} facturas`}
          />
          <Card
            title="Cobrado"
            value={formatCOP(totalPagado)}
            icon="check-circle"
            subtitle="Pagadas"
          />
          <Card
            title="Por Cobrar"
            value={formatCOP(pendiente)}
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

        {/* SECCIÓN: ESTADÍAS ACTIVAS (para generar facturas automáticas) */}
        {stays && stays.filter(s => s.estado === 'activa').length > 0 && (
          <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Icon name="users" size={24} className="primary" />
              <h3 style={{ margin: 0 }}>Estadías Activas - Generar Facturas</h3>
            </div>
            <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>Selecciona una estadía para generar su factura automáticamente (suma habitación + compras en tienda)</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {stays.filter(s => s.estado === 'activa').map(stay => (
                <div key={stay.id} style={{
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{stay.cliente_nombre || `Cliente #${stay.cliente_id}`}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      Hab. {stay.numero_habitacion || stay.habitacion_id} | {stay.fecha_entrada} a {stay.fecha_salida}
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => generarFacturaAutomatica(stay.id)}
                    style={{ padding: '6px 12px', fontSize: '13px', whiteSpace: 'nowrap' }}
                  >
                    Facturar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABLA */}
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Table
            columns={columns}
            data={invoices}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPrint={handlePrint}
            actions={true}
            showPrint={true}
            showEdit={true}
            showDelete={user?.role === 'admin'}
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
                        {stay.cliente_nombre || `Cliente #${stay.cliente_id}`} - Hab. {stay.numero_habitacion || stay.habitacion_id}
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
                  <label>Subtotal (COP)</label>
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
                  <label>Impuesto (COP)</label>
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
                  <label>Total (COP) *</label>
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
