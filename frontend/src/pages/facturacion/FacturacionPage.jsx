import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Card from '../../components/common/Card'
import { useAuth } from '../../hooks/useAuth'
import './ModulePage.css'

export default function FacturacionPage() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([
    { id: 1, numero: 'FAC-001', cliente: 'Carlos López', monto: 450, estado: 'Pagada', fecha: '2026-02-01' },
    { id: 2, numero: 'FAC-002', cliente: 'María García', monto: 320, estado: 'Pendiente', fecha: '2026-02-03' },
    { id: 3, numero: 'FAC-003', cliente: 'Juan Pérez', monto: 280, estado: 'Cancelada', fecha: '2026-02-04' },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ cliente: '', monto: '', descripcion: '' })

  const columns = [
    { key: 'numero', label: 'N° Factura' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'monto', label: 'Monto', render: (value) => `$${value}` },
    { key: 'fecha', label: 'Fecha' },
    { key: 'estado', label: 'Estado' },
  ]

  const handleCreateInvoice = () => {
    if (formData.cliente && formData.monto) {
      const newInvoice = {
        id: invoices.length + 1,
        numero: `FAC-${String(invoices.length + 1).padStart(3, '0')}`,
        cliente: formData.cliente,
        monto: parseInt(formData.monto),
        estado: 'Pendiente',
        fecha: new Date().toISOString().split('T')[0],
      }
      setInvoices([...invoices, newInvoice])
      setFormData({ cliente: '', monto: '', descripcion: '' })
      setIsModalOpen(false)
    }
  }

  const totalIngresos = invoices.reduce((sum, inv) => sum + inv.monto, 0)
  const totalPagado = invoices.filter(inv => inv.estado === 'Pagada').reduce((sum, inv) => sum + inv.monto, 0)
  const pendiente = invoices.filter(inv => inv.estado === 'Pendiente').reduce((sum, inv) => sum + inv.monto, 0)

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Facturación y Cobro</h1>
        <p className="page-subtitle">Crea facturas, registra cobros y gestiona la contabilidad de tu hotel</p>

        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <Card
            title="Ingresos Totales"
            value={`$${totalIngresos}`}
            icon="💰"
            subtitle={`${invoices.length} facturas`}
          />
          <Card
            title="Ingresos Pagados"
            value={`$${totalPagado}`}
            icon="✅"
            subtitle="Cobrados"
          />
          <Card
            title="Pendiente de Pago"
            value={`$${pendiente}`}
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

        <Table
          columns={columns}
          data={invoices}
          onEdit={(invoice) => console.log('Editar:', invoice)}
          onDelete={(invoice) => setInvoices(invoices.filter(i => i.id !== invoice.id))}
          actions={true}
        />

        <Modal
          isOpen={isModalOpen}
          title="Nueva Factura"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCreateInvoice}
          confirmText="Crear Factura"
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Cliente</label>
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Monto</label>
              <input
                type="number"
                placeholder="Monto de la factura"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Descripción</label>
              <textarea
                placeholder="Descripción de la factura"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
