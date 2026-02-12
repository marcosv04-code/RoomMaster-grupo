import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Card from '../../components/common/Card'
import Icon from '../../components/common/Icon'
import './ModulePage.css'

export default function ReportesPage() {
  const [period, setPeriod] = useState('month')

  // Datos simulados por período
  const dataByPeriod = {
    week: {
      occupancyData: [
        { mes: 'Lun', ocupacion: 72, ingresos: 2850 },
        { mes: 'Mar', ocupacion: 75, ingresos: 2950 },
        { mes: 'Mié', ocupacion: 78, ingresos: 3050 },
        { mes: 'Jue', ocupacion: 85, ingresos: 3350 },
        { mes: 'Vie', ocupacion: 92, ingresos: 3650 },
        { mes: 'Sab', ocupacion: 98, ingresos: 3950 },
        { mes: 'Dom', ocupacion: 88, ingresos: 3450 },
      ],
      totalGuests: 245,
      occupancyRate: 84,
      revenuePerRoom: 391,
      newGuests: 120,
      repeatGuests: 125,
    },
    month: {
      occupancyData: [
        { mes: 'Ene', ocupacion: 65, ingresos: 12500 },
        { mes: 'Feb', ocupacion: 72, ingresos: 14200 },
        { mes: 'Mar', ocupacion: 78, ingresos: 15800 },
        { mes: 'Abr', ocupacion: 85, ingresos: 17500 },
        { mes: 'May', ocupacion: 88, ingresos: 18900 },
      ],
      totalGuests: 1250,
      occupancyRate: 78,
      revenuePerRoom: 185,
      newGuests: 935,
      repeatGuests: 315,
    },
    year: {
      occupancyData: [
        { mes: '2022', ocupacion: 58, ingresos: 125000 },
        { mes: '2023', ocupacion: 68, ingresos: 165000 },
        { mes: '2024', ocupacion: 75, ingresos: 195000 },
        { mes: '2025', ocupacion: 82, ingresos: 235000 },
        { mes: '2026', ocupacion: 88, ingresos: 265000 },
      ],
      totalGuests: 8950,
      occupancyRate: 74,
      revenuePerRoom: 1850,
      newGuests: 5320,
      repeatGuests: 3630,
    },
  }

  const currentData = dataByPeriod[period]

  const roomTypeRevenue = [
    { tipo: 'Simple', ingresos: 8500, reservas: 45, ocupacion: '65%' },
    { tipo: 'Doble', ingresos: 15200, reservas: 52, ocupacion: '85%' },
    { tipo: 'Suite', ingresos: 12800, reservas: 28, ocupacion: '92%' },
  ]

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Reportes</h1>
        <p className="page-subtitle">Análisis del desempeño de tu hotel</p>

        {/* FILTRO DE PE­RÍODO */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '12px' }}>
          <button
            className={`btn ${period === 'week' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPeriod('week')}
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Icon name="activity" size={14} /> Esta Semana
          </button>
          <button
            className={`btn ${period === 'month' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPeriod('month')}
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Icon name="chart" size={14} /> Este Mes
          </button>
          <button
            className={`btn ${period === 'year' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPeriod('year')}
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Icon name="trending" size={14} /> Este Año
          </button>
        </div>

        {/* MÉTRICAS PRINCIPALES */}
        <div className="stats-grid" style={{ marginBottom: '40px' }}>
          <Card
            title="Huéspedes"
            value={currentData.totalGuests}
            icon="users"
            subtitle={`Total en el período`}
          />
          <Card
            title="Ocupación"
            value={`${currentData.occupancyRate}%`}
            icon="hotel"
            subtitle="Tasa promedio"
          />
          <Card
            title="Ingresos Promedio"
            value={`$${currentData.revenuePerRoom}`}
            icon="money"
            subtitle="Por habitación"
          />
          <Card
            title="Huéspedes Nuevos"
            value={currentData.newGuests}
            icon="user"
            subtitle={`${((currentData.newGuests / currentData.totalGuests) * 100).toFixed(1)}% del total`}
          />
        </div>

        {/* REPORTE 1: OCUPACIÓN E INGRESOS */}
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Icon name="chart" size={24} className="primary" />
            <h2 style={{ margin: 0 }}>Tendencia de Ocupación e Ingresos</h2>
          </div>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Visualiza cómo han variado los niveles de ocupación y los ingresos en el período seleccionado
          </p>
          <div style={{ marginTop: '20px' }}>
            {currentData.occupancyData.map((data, idx) => (
              <div key={idx} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{data.mes}</span>
                    <span style={{ color: '#999', fontSize: '12px', marginLeft: '12px' }}>Ocupación</span>
                  </div>
                  <span style={{ fontWeight: '600', color: '#2196F3', fontSize: '14px' }}>{data.ocupacion}%</span>
                </div>
                <div style={{
                  background: '#e3f2fd',
                  height: '6px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    background: `linear-gradient(90deg, #2196F3 0%, #1565c0 100%)`,
                    height: '100%',
                    width: `${data.ocupacion}%`,
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#999', fontSize: '12px' }}>Ingresos</span>
                  <span style={{ fontWeight: '600', color: '#4CAF50', fontSize: '14px' }}>${data.ingresos.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REPORTE 2: INGRESOS POR TIPO DE HABITACIÓN */}
        <div className="dashboard-section" style={{ marginBottom: '32px' }}>
          <h2>🏩 Desempeño por Tipo de Habitación</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Ingresos, reservas y ocupación de cada tipo de habitación
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {roomTypeRevenue.map((room, idx) => (
              <div key={idx} style={{ 
                padding: '20px', 
                background: '#f8f9fb', 
                borderRadius: '8px',
                borderLeft: `4px solid ${['#2196F3', '#4CAF50', '#FF9800'][idx]}`
              }}>
                <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>{room.tipo}</div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Ingresos Totales</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#2196F3' }}>${room.ingresos.toLocaleString()}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Reservas</div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{room.reservas} reservas</div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Ocupación</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#4CAF50' }}>{room.ocupacion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REPORTE 3: ANÁLISIS DE HUÉSPEDES */}
        <div className="dashboard-section">
          <h2>👥 Análisis de Huéspedes</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Desglose de huéspedes nuevos vs. recurrentes y tasa de retorno
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
            <div style={{ 
              padding: '24px', 
              background: '#e8f5e9', 
              borderRadius: '8px', 
              textAlign: 'center',
              borderTop: '4px solid #4CAF50'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#2E7D32', marginBottom: '8px' }}>
                {currentData.repeatGuests}
              </div>
              <div style={{ fontSize: '14px', color: '#555', fontWeight: '600' }}>Huéspedes Recurrentes</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {((currentData.repeatGuests / currentData.totalGuests) * 100).toFixed(1)}% del total
              </div>
            </div>

            <div style={{ 
              padding: '24px', 
              background: '#e3f2fd', 
              borderRadius: '8px', 
              textAlign: 'center',
              borderTop: '4px solid #2196F3'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#1565c0', marginBottom: '8px' }}>
                {currentData.newGuests}
              </div>
              <div style={{ fontSize: '14px', color: '#555', fontWeight: '600' }}>Huéspedes Nuevos</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                {((currentData.newGuests / currentData.totalGuests) * 100).toFixed(1)}% del total
              </div>
            </div>

            <div style={{ 
              padding: '24px', 
              background: '#fff3e0', 
              borderRadius: '8px', 
              textAlign: 'center',
              borderTop: '4px solid #FF9800'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#E65100', marginBottom: '8px' }}>
                {((currentData.repeatGuests / currentData.totalGuests) * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '14px', color: '#555', fontWeight: '600' }}>Tasa de Retorno</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                Clientes que vuelven
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
