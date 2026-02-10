import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Card from '../../components/common/Card'
import { useAuth } from '../../hooks/useAuth'
import './ModulePage.css'

const API = 'http://localhost/roommaster/backend'

export default function FacturacionPage() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ estadia_id: '', cliente_id: '', subtotal: '', impuesto: '', total: '' })

  // Cargar facturas
  useEffect(() => {
    cargarFacturas()
  }, [])

  async function cargarFacturas() {
    try {
      setLoading(true)
      const res = await fetch(`${API}/facturas.php`)
      const data = await res.json()
      if (data.success) {
        setInvoices(data.datos)
      }
    } catch (err) {
      setError('Error al cargar facturas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = async () => {
    if (!formData.cliente_id || !formData.total) {
      alert('Por favor completa todos los campos')
      return
    }

    try {
      const res = await fetch(`${API}/facturas.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estadia_id: formData.estadia_id || 1,
          cliente_id: formData.cliente_id,
          subtotal: parseFloat(formData.subtotal || 0),
          impuesto: parseFloat(formData.impuesto || 0),
          total: parseFloat(formData.total)
        })
      })
      const data = await res.json()
      if (data.success) {
        cargarFacturas()
        setFormData({ estadia_id: '', cliente_id: '', subtotal: '', impuesto: '', total: '' })
        setIsModalOpen(false)
      } else {
        alert(data.mensaje)
      }
    } catch (err) {
      alert('Error al crear factura')
      console.error(err)
    }
  }

  const handleDeleteInvoice = async (id) => {
    if (!confirm('¿Estás seguro?')) return
    try {
      const res = await fetch(`${API}/facturas.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const data = await res.json()
      if (data.success) {
        cargarFacturas()
      } else {
        alert(data.mensaje)
      }
    } catch (err) {
      alert('Error al eliminar')
      console.error(err)
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'cliente_id', label: 'Cliente ID' },
    { key: 'total', label: 'Total', render: (value) => `$${value}` },
    { key: 'impuesto', label: 'Impuesto', render: (value) => `$${value}` },
    { key: 'estado', label: 'Estado' },
    { key: 'fecha_creacion', label: 'Fecha' },
  ]

  const totalIngresos = invoices.reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0)
  const totalPagado = invoices.filter(inv => inv.estado === 'Pagada').reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0)
  const pendiente = invoices.filter(inv => inv.estado === 'Pendiente').reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0)

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Facturación y Cobro</h1>
        <p className="page-subtitle">Crea facturas, registra cobros y gestiona la contabilidad de tu hotel</p>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <Card
            title="Ingresos Totales"
            value={`$${totalIngresos.toFixed(2)}`}
            icon="💰"
            subtitle={`${invoices.length} facturas`}
          />
          <Card
            title="Ingresos Pagados"
            value={`$${totalPagado.toFixed(2)}`}
            icon="✅"
            subtitle="Cobrados"
          />
          <Card
            title="Pendiente de Pago"
            value={`$${pendiente.toFixed(2)}`}
            icon="⏳"
            subtitle="Por cobrar"
          />
        </div>

        <div className="page-header">
          <div></div>
          {(user?.role === 'admin' || user?.role === 'receptionist') && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              + Nueva Factura
            </button>
          )}
        </div>

        {loading ? <p>Cargando...</p> : (
          <Table
            columns={columns}
            data={invoices}
            onEdit={(invoice) => console.log('Editar:', invoice)}
            onDelete={(invoice) => handleDeleteInvoice(invoice.id)}
            actions={true}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          title="Nueva Factura"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCreateInvoice}
          confirmText="Crear Factura"
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Cliente ID</label>
              <input
                type="number"
                placeholder="ID del cliente"
                value={formData.cliente_id}
                onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Subtotal</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Impuesto</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.impuesto}
                onChange={(e) => setFormData({ ...formData, impuesto: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Total</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                required
              />
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

