import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Card from '../../components/common/Card'
import Icon from '../../components/common/Icon'
import { formatCOP, formatCOPWithDecimals } from '../../utils/currency'
import './ModulePage.css'

const API = 'http://localhost/RoomMaster-grupo/backend'

export default function ReportesPage() {
  const [period, setPeriod] = useState('mes')
  const [reportData, setReportData] = useState({
    dashboard: { 
      huespedes_actuales: 0, 
      habitaciones_disponibles: 0, 
      ingresos_mes: 0, 
      pendiente_cobro: 0 
    },
    ingresos_por_estado: [],
    ocupacion_por_tipo: [],
    productos_vendidos: [],
    clientes_frecuentes: []
  })
  const [loading, setLoading] = useState(true)

  // Cargar reportes al montar
  useEffect(() => {
    fetchReportes()
  }, [period])

  async function fetchReportes() {
    try {
      setLoading(true)
      const res = await fetch(`${API}/reportes.php?tipo=general&periodo=${period}`)
      const data = await res.json()
      if (data.exito) {
        setReportData(data.datos)
      }
    } catch (error) {
      console.error('Error al cargar reportes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular estadísticas desde ingresos por estado
  const calcularEstadisticas = () => {
    const ingresos = reportData.ingresos_por_estado || []
    const pagadas = ingresos.find(i => i.estado === 'Pagada')
    const pendientes = ingresos.find(i => i.estado === 'Pendiente')
    
    const totalFacturas = ingresos.reduce((sum, i) => sum + (i.cantidad || 0), 0)
    const totalIngresos = ingresos.reduce((sum, i) => sum + (parseFloat(i.total) || 0), 0)
    
    return {
      totalFacturas,
      totalIngresos,
      pagadas: {
        cantidad: pagadas?.cantidad || 0,
        total: parseFloat(pagadas?.total) || 0
      },
      pendientes: {
        cantidad: pendientes?.cantidad || 0,
        total: parseFloat(pendientes?.total) || 0
      }
    }
  }

  const stats = calcularEstadisticas()

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Reportes</h1>
        <p className="page-subtitle">Análisis del desempeño de tu hotel</p>

        {/* FILTRO DE PERÍODO */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '12px' }}>
          <button
            className={`btn ${period === 'dia' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPeriod('dia')}
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Icon name="calendar" size={14} /> Hoy
          </button>
          <button
            className={`btn ${period === 'semana' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPeriod('semana')}
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Icon name="activity" size={14} /> Esta Semana
          </button>
          <button
            className={`btn ${period === 'mes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPeriod('mes')}
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Icon name="chart" size={14} /> Este Mes
          </button>
        </div>

        {/* MÉTRICAS PRINCIPALES */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Cargando reportes...</p>
        ) : (
          <>
            <div className="stats-grid" style={{ marginBottom: '40px' }}>
              <Card
                title="Huéspedes Activos"
                value={reportData.dashboard?.huespedes_actuales || 0}
                icon="users"
                subtitle="Estadías activas"
              />
              <Card
                title="Habitaciones Disponibles"
                value={reportData.dashboard?.habitaciones_disponibles || 0}
                icon="hotel"
                subtitle="Listas para ocupar"
              />
              <Card
                title="Ingresos del Período"
                value={formatCOP(reportData.dashboard?.ingresos_mes || 0)}
                icon="money"
                subtitle="Facturas pagadas"
              />
              <Card
                title="Pendiente de Cobro"
                value={formatCOP(reportData.dashboard?.pendiente_cobro || 0)}
                icon="activity"
                subtitle="Por cobrar"
              />
            </div>

            {/* REPORTE 1: OCUPACIÓN POR TIPO DE HABITACIÓN */}
            <div className="dashboard-section" style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '24px' }}>🏩 Ocupación por Tipo de Habitación</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Total, disponibles y ocupadas por tipo
              </p>
              {reportData.ocupacion_por_tipo && reportData.ocupacion_por_tipo.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  {reportData.ocupacion_por_tipo.map((room, idx) => {
                    const total = parseInt(room.total) || 0
                    const disponibles = parseInt(room.disponibles) || 0
                    const ocupadas = total - disponibles
                    const porcentaje = total > 0 ? Math.round((ocupadas / total) * 100) : 0
                    
                    return (
                      <div key={idx} style={{
                        padding: '20px',
                        background: '#f8f9fb',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${['#2196F3', '#4CAF50', '#FF9800', '#E91E63'][idx % 4]}`
                      }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                          {room.tipo || 'Tipo Habitación'}
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                            Total disponibles en hotel
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: '600', color: '#2196F3' }}>
                            {total} habitaciones
                          </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                            Actualmente disponibles
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '600', color: '#4CAF50' }}>
                            {disponibles} / {total}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                            Tasa de Ocupación
                          </div>
                          <div style={{
                            background: '#e3f2fd',
                            height: '8px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            marginBottom: '8px'
                          }}>
                            <div style={{
                              background: '#2196F3',
                              height: '100%',
                              width: `${porcentaje}%`,
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#2196F3' }}>
                            {porcentaje}%
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>No hay datos de ocupación disponibles</p>
              )}
            </div>

            {/* REPORTE 2: PRODUCTOS MÁS VENDIDOS */}
            <div className="dashboard-section" style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '24px' }}>📦 Productos Más Vendidos</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Top 5 productos por ingresos generados
              </p>
              {reportData.productos_vendidos && reportData.productos_vendidos.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reportData.productos_vendidos.slice(0, 5).map((producto, idx) => {
                    const maxIngresos = Math.max(...reportData.productos_vendidos.map(p => parseFloat(p.ingresos_totales) || 0))
                    const porcentajeIngreso = maxIngresos > 0 ? Math.round((parseFloat(producto.ingresos_totales) || 0) / maxIngresos * 100) : 0
                    
                    return (
                      <div key={idx} style={{
                        padding: '16px',
                        background: '#f8f9fb',
                        borderRadius: '8px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                              {idx + 1}. {producto.producto_nombre || 'Producto'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                              Vendido {producto.cantidad_total || 0} veces
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#4CAF50' }}>
                              {formatCOP(parseFloat(producto.ingresos_totales) || 0)}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          background: '#e8f5e9',
                          height: '6px',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            background: '#4CAF50',
                            height: '100%',
                            width: `${porcentajeIngreso}%`,
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>No hay datos de productos disponibles</p>
              )}
            </div>

            {/* REPORTE 3: CLIENTES FRECUENTES */}
            <div className="dashboard-section" style={{ marginBottom: '40px' }}>
              <h2 style={{ marginBottom: '24px' }}>👥 Clientes Frecuentes</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Top 5 clientes por número de reservaciones
              </p>
              {reportData.clientes_frecuentes && reportData.clientes_frecuentes.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {reportData.clientes_frecuentes.slice(0, 5).map((cliente, idx) => (
                    <div key={idx} style={{
                      padding: '20px',
                      background: '#f8f9fb',
                      borderRadius: '8px',
                      borderTop: `4px solid ${['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0'][idx % 5]}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '700' }}>
                            {cliente.cliente_nombre || 'Cliente'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                            #{idx + 1} Cliente más frecuente
                          </div>
                        </div>
                        <div style={{ fontSize: '20px' }}>⭐</div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                            Total de reservas
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: '600', color: '#2196F3' }}>
                            {cliente.cantidad_estadias || 0}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                            Noches totales
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: '600', color: '#4CAF50' }}>
                            {cliente.noches_totales || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#999' }}>No hay datos de clientes disponibles</p>
              )}
            </div>

            {/* RESUMEN DE INGRESOS */}
            <div className="dashboard-section">
              <h2 style={{ marginBottom: '24px' }}>💰 Resumen de Ingresos</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Estado de facturas y análisis de ingresos
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <Card
                  title="Total Facturas"
                  value={stats.totalFacturas}
                  icon="file-text"
                  subtitle="Todas las facturas emitidas"
                />
                <Card
                  title="Total Ingresos"
                  value={formatCOP(stats.totalIngresos)}
                  icon="money"
                  subtitle="De todas las facturas"
                />
                <Card
                  title="Facturas Pagadas"
                  value={stats.pagadas.cantidad}
                  icon="check-circle"
                  subtitle={formatCOP(stats.pagadas.total)}
                />
                <Card
                  title="Facturas Pendientes"
                  value={stats.pendientes.cantidad}
                  icon="alert-circle"
                  subtitle={formatCOP(stats.pendientes.total)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
