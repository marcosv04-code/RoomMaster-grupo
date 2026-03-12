import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Card from '../../components/common/Card'
import Icon from '../../components/common/Icon'
import { formatCOP } from '../../utils/currency'
import './ModulePage.css'

const API = '/backend'

// Función auxiliar para formatear fechas de manera segura
const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha'
  try {
    let date
    
    if (dateString.includes('-')) {
      // Formato YYYY-MM-DD
      const [year, month, day] = dateString.split('T')[0].split('-')
      date = new Date(year, month - 1, day)
    } else if (dateString.includes('/')) {
      // Formato DD/MM/YYYY o similar
      date = new Date(dateString.split(' ')[0])
    } else {
      date = new Date(dateString)
    }
    
    if (isNaN(date.getTime())) {
      return dateString.split(' ')[0] // Devolver solo la parte de fecha si no se puede parsear
    }
    
    return date.toLocaleDateString('es-CO')
  } catch (err) {
    return dateString.split(' ')[0] // Devolver solo la fecha sin hora
  }
}

export default function ReportesPage() {
  const [stays, setStays] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState('mes')
  const [viewMode, setViewMode] = useState('reports') // 'reports' or 'stay' or 'invoice'
  const [selectedStay, setSelectedStay] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [period])

  async function cargarDatos() {
    setLoading(true)
    try {
      const [staysRes, invoicesRes] = await Promise.all([
        fetch(`${API}/estadias.php`),
        fetch(`${API}/facturas.php`)
      ])

      const staysData = await staysRes.json()
      const invoicesData = await invoicesRes.json()

      if (staysData.exito) setStays(staysData.datos || [])
      if (invoicesData.exito) setInvoices(invoicesData.datos || [])
    } catch (err) {
      console.error('Error cargando reportes:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los reportes'
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar por período
  const getFilteredData = (data) => {
    const now = new Date()
    return data.filter(item => {
      const itemDate = new Date(item.fecha_entrada || item.fecha_venta || item.fecha || new Date())
      const diffTime = Math.abs(now - itemDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (period) {
        case 'dia':
          return diffDays <= 1
        case 'semana':
          return diffDays <= 7
        case 'mes':
          return diffDays <= 30
        default:
          return true
      }
    })
  }

  // ===== DATOS FILTRADOS =====
  const filteredStays = getFilteredData(stays)
  const completedStays = filteredStays.filter(s => s.estado === 'completada')
  const cancelledStays = filteredStays.filter(s => s.estado === 'cancelada')
  const activeStays = filteredStays.filter(s => s.estado === 'activa')

  const totalGuests = filteredStays.reduce((sum, s) => sum + (parseInt(s.numero_huespedes) || 0), 0)
  const avgGuestsByStay = filteredStays.length > 0 ? Math.round(totalGuests / filteredStays.length) : 0

  // ===== FACTURAS =====
  const filteredInvoices = getFilteredData(invoices)
  const paidInvoices = filteredInvoices.filter(f => f.estado === 'Pagada')
  const pendingInvoices = filteredInvoices.filter(f => f.estado === 'Pendiente')

  const totalPaid = paidInvoices.reduce((sum, f) => sum + (parseFloat(f.total) || 0), 0)
  const totalPending = pendingInvoices.reduce((sum, f) => sum + (parseFloat(f.total) || 0), 0)
  const totalInvoiced = filteredInvoices.reduce((sum, f) => sum + (parseFloat(f.total) || 0), 0)

  // ===== COLUMNAS DE TABLAS =====
  const staysColumns = [
    { key: 'id', label: 'ID' },
    { key: 'cliente_nombre', label: 'Cliente' },
    { key: 'numero_habitacion', label: 'Habitación' },
    { key: 'fecha_entrada', label: 'Entrada', render: (v) => formatDate(v) },
    { key: 'fecha_salida', label: 'Salida', render: (v) => formatDate(v) },
    { key: 'numero_huespedes', label: 'Huéspedes' },
    { key: 'estado', label: 'Estado', render: (v) => <span style={{ textTransform: 'capitalize', fontWeight: '600', color: v === 'completada' ? '#4CAF50' : v === 'activa' ? '#2196F3' : '#f44336' }}>{v}</span> },
    { 
      key: 'acciones', 
      label: 'Acciones', 
      render: (v, row) => (
        <button
          onClick={() => handleViewStay(row)}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          Ver Detalle
        </button>
      )
    },
  ]

  const invoicesColumns = [
    { key: 'id', label: 'ID' },
    { key: 'numero_factura', label: 'Número' },
    { key: 'cliente_nombre', label: 'Cliente' },
    { key: 'total', label: 'Total', render: (v) => formatCOP(v) },
    { key: 'estado', label: 'Estado', render: (v) => <span style={{ fontWeight: '600', color: v === 'Pagada' ? '#4CAF50' : v === 'Pendiente' ? '#FF9800' : '#999' }}>{v}</span> },
    { key: 'fecha_factura', label: 'Fecha', render: (v) => formatDate(v) },
    { 
      key: 'acciones', 
      label: 'Acciones', 
      render: (v, row) => (
        <button
          onClick={() => handleViewInvoice(row)}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          Ver Factura
        </button>
      )
    },
  ]

  // Funciones para visualizar detalles
  const handleViewStay = (stay) => {
    setSelectedStay(stay)
    setViewMode('stay')
  }

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setViewMode('invoice')
  }

  const handleCloseView = () => {
    setViewMode('reports')
    setSelectedStay(null)
    setSelectedInvoice(null)
  }

  return (
    <DashboardLayout>
      <div className="module-page">
        
        {/* ===== VISTA DE DETALLE DE ESTADÍA ===== */}
        {viewMode === 'stay' && selectedStay && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'var(--color-card-background)',
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, color: 'var(--color-text)' }}>Detalle de Estadía</h2>
                <button 
                  onClick={handleCloseView}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>CLIENTE</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>{selectedStay.cliente_nombre}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>HABITACIÓN</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>{selectedStay.numero_habitacion}</p>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>ESTADO</p>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: '700', 
                    margin: 0,
                    color: selectedStay.estado === 'completada' ? '#4CAF50' : selectedStay.estado === 'activa' ? '#2196F3' : '#f44336',
                    textTransform: 'uppercase'
                  }}>
                    {selectedStay.estado}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--color-text)', marginTop: 0, marginBottom: '15px' }}>Fechas</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>ENTRADA</p>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', margin: 0 }}>
                      {formatDate(selectedStay.fecha_entrada)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>SALIDA</p>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', margin: 0 }}>
                      {formatDate(selectedStay.fecha_salida)}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--color-text)', marginTop: 0, marginBottom: '15px' }}>Huéspedes</h3>
                <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', margin: 0 }}>
                  {selectedStay.numero_huespedes} {parseInt(selectedStay.numero_huespedes) === 1 ? 'persona' : 'personas'}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--color-text)', marginTop: 0, marginBottom: '15px' }}>Observaciones</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text)', margin: 0, padding: '12px', backgroundColor: 'var(--color-background-secondary)', borderRadius: '6px', minHeight: '60px' }}>
                  {selectedStay.observaciones || 'Sin observaciones'}
                </p>
              </div>

              <button
                onClick={handleCloseView}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* ===== VISTA DE DETALLE DE FACTURA ===== */}
        {viewMode === 'invoice' && selectedInvoice && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'var(--color-card-background)',
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, color: 'var(--color-text)' }}>Factura</h2>
                <button 
                  onClick={handleCloseView}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>NÚMERO DE FACTURA</p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>{selectedInvoice.numero_factura}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>ESTADO</p>
                    <p style={{ 
                      fontSize: '16px', 
                      fontWeight: '700', 
                      margin: 0,
                      color: selectedInvoice.estado === 'Pagada' ? '#4CAF50' : '#FF9800'
                    }}>
                      {selectedInvoice.estado}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--color-text)', marginTop: 0, marginBottom: '15px' }}>Cliente</h3>
                <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', margin: 0 }}>
                  {selectedInvoice.cliente_nombre}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--color-text)', marginTop: 0, marginBottom: '15px' }}>Fechas</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>EMISIÓN</p>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)', margin: 0 }}>
                      {formatDate(selectedInvoice.fecha_factura)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>PAGO</p>
                    <p style={{ fontSize: '16px', fontWeight: '600', color: selectedInvoice.fecha_pago ? '#4CAF50' : '#FF9800', margin: 0 }}>
                      {selectedInvoice.fecha_pago ? formatDate(selectedInvoice.fecha_pago) : 'Pendiente'}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--color-background-secondary)',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '2px solid var(--color-border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text)' }}>TOTAL</span>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)' }}>
                    {formatCOP(selectedInvoice.total)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <button
                  onClick={handleCloseView}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Icon name="chart" size={32} className="primary" />
          <h1 style={{ margin: 0 }}>Reportes</h1>
        </div>
        <p className="page-subtitle">Análisis y resumen del desempeño del hotel</p>

        {/* FILTRO DE PERÍODO */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { value: 'dia', label: '📅 Hoy' },
            { value: 'semana', label: '📊 Esta Semana' },
            { value: 'mes', label: '📈 Este Mes' },
          ].map(btn => (
            <button
              key={btn.value}
              className={`btn ${period === btn.value ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPeriod(btn.value)}
              style={{ padding: '10px 16px', fontSize: '14px' }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>Cargando reportes...</p>
        ) : (
          <>
            {/* ===== SECCIÓN 1: ESTADÍSTICAS DE ESTADÍAS ===== */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '20px', color: 'var(--color-text)' }}>📌 Estadías</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <Card
                  title="Completadas"
                  value={completedStays.length}
                  icon="check"
                  subtitle="Estadías completadas"
                />
                <Card
                  title="Canceladas"
                  value={cancelledStays.length}
                  icon="activity"
                  subtitle="Estadías anuladas"
                />
                <Card
                  title="Activas"
                  value={activeStays.length}
                  icon="users"
                  subtitle="En curso"
                />
                <Card
                  title="Huéspedes Totales"
                  value={totalGuests}
                  icon="users"
                  subtitle={`${avgGuestsByStay} promedio por estadía`}
                />
              </div>

              {/* Tabla de Estadías */}
              <div style={{ backgroundColor: 'var(--color-card-background)', borderRadius: '8px', padding: '20px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ marginTop: 0, color: 'var(--color-text)' }}>Detalle de Estadías</h3>
                {filteredStays.length > 0 ? (
                  <Table
                    columns={staysColumns}
                    data={filteredStays}
                    actions={false}
                    showEdit={false}
                    showDelete={false}
                  />
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No hay estadías en este período</p>
                )}
              </div>
            </div>

            {/* ===== SECCIÓN 2: ESTADÍSTICAS DE FACTURAS ===== */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '20px', color: 'var(--color-text)' }}>💰 Facturación</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <Card
                  title="Total Facturado"
                  value={formatCOP(totalInvoiced)}
                  icon="money"
                  subtitle={`${filteredInvoices.length} facturas`}
                />
                <Card
                  title="Pagadas"
                  value={formatCOP(totalPaid)}
                  icon="check"
                  subtitle={`${paidInvoices.length} facturas`}
                />
                <Card
                  title="Pendientes"
                  value={formatCOP(totalPending)}
                  icon="activity"
                  subtitle={`${pendingInvoices.length} facturas`}
                />
                <Card
                  title="% Cobrado"
                  value={`${totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0}%`}
                  icon="chart"
                  subtitle="Del total facturado"
                />
              </div>

              {/* Tabla de Facturas */}
              <div style={{ backgroundColor: 'var(--color-card-background)', borderRadius: '8px', padding: '20px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ marginTop: 0, color: 'var(--color-text)' }}>Detalle de Facturas</h3>
                {filteredInvoices.length > 0 ? (
                  <Table
                    columns={invoicesColumns}
                    data={filteredInvoices}
                    actions={false}
                    showEdit={false}
                    showDelete={false}
                  />
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No hay facturas en este período</p>
                )}
              </div>
            </div>

            {/* ===== SECCIÓN 3: RESUMEN FINANCIERO ===== */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '20px', color: 'var(--color-text)' }}>📊 Resumen Financiero</h2>
              <div style={{
                backgroundColor: 'var(--color-card-background)',
                borderRadius: '8px',
                padding: '24px',
                border: '1px solid var(--color-border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px'
              }}>
                <div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: '0 0 8px 0' }}>Ingresos Confirmados</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#4CAF50', margin: 0 }}>{formatCOP(totalPaid)}</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', margin: '4px 0 0 0' }}>De {paidInvoices.length} facturas pagadas</p>
                </div>

                <div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: '0 0 8px 0' }}>Ingresos Pendientes</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#FF9800', margin: 0 }}>{formatCOP(totalPending)}</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', margin: '4px 0 0 0' }}>De {pendingInvoices.length} facturas por cobrar</p>
                </div>

                <div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: '0 0 8px 0' }}>Ingreso Total Potencial</p>
                  <p style={{ fontSize: '28px', fontWeight: '700', color: '#2196F3', margin: 0 }}>{formatCOP(totalInvoiced)}</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', margin: '4px 0 0 0' }}>De {filteredInvoices.length} facturas totales</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
