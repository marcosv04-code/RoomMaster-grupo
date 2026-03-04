import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Card from '../../components/common/Card'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../hooks/useAuth'
import { usePermissions } from '../../hooks/usePermissions'
import './ModulePage.css'

const API = `${window.location.origin}/backend`

export default function InventarioPage() {
  const { user } = useAuth()
  const { can } = usePermissions()
  
  // DATOS
  const [inventarioHabitaciones, setInventarioHabitaciones] = useState([])
  const [habitacionesAgrupadas, setHabitacionesAgrupadas] = useState({})
  
  // ESTADOS UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingCantidad, setEditingCantidad] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedHabitacion, setSelectedHabitacion] = useState(null)

  // CARGAR DATOS AL MONTAR
  useEffect(() => {
    cargarInventario()
  }, [])

  // AGRUPAR POR HABITACIÓN
  useEffect(() => {
    if (inventarioHabitaciones.length > 0) {
      const agrupado = {}
      inventarioHabitaciones.forEach(item => {
        if (!agrupado[item.habitacion_id]) {
          agrupado[item.habitacion_id] = {
            habitacion_id: item.habitacion_id,
            numero_habitacion: item.numero_habitacion,
            tipo_habitacion: item.tipo_habitacion,
            estado_habitacion: item.estado_habitacion,
            suministros: []
          }
        }
        agrupado[item.habitacion_id].suministros.push(item)
      })
      setHabitacionesAgrupadas(agrupado)
      
      // Seleccionar la primera habitación si no hay seleccionada
      if (!selectedHabitacion && Object.keys(agrupado).length > 0) {
        setSelectedHabitacion(Object.keys(agrupado)[0])
      }
    }
  }, [inventarioHabitaciones])

  // FUNCIONES DE CARGA
  async function cargarInventario() {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API}/inventario_habitaciones.php`)
      const data = await res.json()
      if (data.exito) {
        setInventarioHabitaciones(data.datos || [])
      } else {
        setError(data.mensaje)
      }
    } catch (err) {
      setError('Error al cargar inventario: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ACTUALIZAR CANTIDAD
  const handleEditarCantidad = (id, cantidadActual) => {
    setEditingId(id)
    setEditingCantidad(cantidadActual.toString())
  }

  const handleGuardarCantidad = async (id) => {
    if (!can('INVENTARIO_EDIT')) {
      setError('No tienes permiso para editar inventario')
      return
    }

    try {
      setError('')
      const res = await fetch(`${API}/inventario_habitaciones.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
          cantidad_actual: parseInt(editingCantidad),
          rol: user.role
        })
      })
      
      const data = await res.json()
      
      if (data.exito) {
        setSuccessMessage('Cantidad actualizada correctamente')
        setTimeout(() => setSuccessMessage(''), 3000)
        cargarInventario()
        setEditingId(null)
      } else {
        setError(data.mensaje || 'Error al actualizar cantidad')
      }
    } catch (err) {
      setError('Error al guardar: ' + err.message)
    }
  }

  // REABASTECIMIENTO COMPLETO
  const handleReabastecimiento = async (habitacion_id) => {
    if (!can('INVENTARIO_EDIT')) {
      setError('No tienes permiso para editar inventario')
      return
    }

    if (!window.confirm('¿Reabastecerá la habitación ' + habitacionesAgrupadas[habitacion_id]?.numero_habitacion + ' completamente?')) {
      return
    }

    try {
      setError('')
      const res = await fetch(`${API}/inventario_habitaciones.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          habitacion_id: habitacion_id,
          rol: user.role
        })
      })
      
      const data = await res.json()
      
      if (data.exito) {
        setSuccessMessage('Habitación reabastecida correctamente')
        setTimeout(() => setSuccessMessage(''), 3000)
        cargarInventario()
      } else {
        setError(data.mensaje || 'Error al reabastecimiento')
      }
    } catch (err) {
      setError('Error: ' + err.message)
    }
  }

  const getTipoColor = (tipo) => {
    const colores = {
      'sabanas': '#FF6B6B',
      'toallas': '#4ECDC4',
      'limpieza': '#FFE66D',
      'amenities': '#95E1D3'
    }
    return colores[tipo] || '#8B9DC3'
  }

  const getEstadoColor = (necesitaReabastecimiento) => {
    return necesitaReabastecimiento ? '#FF6B6B' : '#51CF66'
  }
  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Icon name="box" size={32} className="primary" />
          <h1 style={{ margin: 0 }}>Inventario por Habitación</h1>
        </div>
        <p className="page-subtitle">Gestiona suministros de cada habitación (sábanas, toallas, limpieza, amenities)</p>

        {error && (
          <div style={{ 
            color: '#d32f2f', 
            marginBottom: '20px', 
            padding: '12px', 
            backgroundColor: '#ffebee', 
            borderRadius: '4px',
            border: '1px solid #ef5350'
          }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{ 
            color: '#388e3c', 
            marginBottom: '20px', 
            padding: '12px', 
            backgroundColor: '#e8f5e9', 
            borderRadius: '4px',
            border: '1px solid #81c784'
          }}>
            {successMessage}
          </div>
        )}

        {/* SELECTOR DE HABITACIONES */}
        {!loading && Object.keys(habitacionesAgrupadas).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
              Selecciona una habitación:
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '10px'
            }}>
              {Object.keys(habitacionesAgrupadas)
                .sort((a, b) => {
                  const numA = parseInt(habitacionesAgrupadas[a].numero_habitacion)
                  const numB = parseInt(habitacionesAgrupadas[b].numero_habitacion)
                  return numA - numB
                })
                .map(habId => {
                  const hab = habitacionesAgrupadas[habId]
                  const tieneReabastecimiento = hab.suministros.some(s => s.necesita_reabastecimiento)
                  return (
                    <button
                      key={habId}
                      onClick={() => setSelectedHabitacion(habId)}
                      style={{
                        padding: '12px',
                        border: selectedHabitacion === habId ? '2px solid #1976d2' : '1px solid #ddd',
                        backgroundColor: selectedHabitacion === habId ? '#e3f2fd' : '#f5f5f5',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: selectedHabitacion === habId ? 'bold' : 'normal',
                        transition: 'all 0.2s',
                        color: tieneReabastecimiento ? '#d32f2f' : '#000'
                      }}
                    >
                      <div>Hab. {hab.numero_habitacion}</div>
                      <div style={{ fontSize: '12px', opacity: 0.7 }}>
                        {hab.tipo_habitacion}
                        {tieneReabastecimiento && ' ⚠️'}
                      </div>
                    </button>
                  )
                })}
            </div>
          </div>
        )}

        {/* CONTENIDO DE HABITACIÓN SELECCIONADA */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <p>Cargando inventario...</p>
          </div>
        ) : selectedHabitacion && habitacionesAgrupadas[selectedHabitacion] ? (
          <div>
            {(() => {
              const habActual = habitacionesAgrupadas[selectedHabitacion]
              const tieneReabastecimiento = habActual.suministros.some(s => s.necesita_reabastecimiento)
              
              return (
                <>
                  {/* HEADER HABITACIÓN */}
                  <div style={{
                    backgroundColor: '#fff',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h2 style={{ margin: '0 0 4px 0' }}>Habitación {habActual.numero_habitacion}</h2>
                      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        Tipo: <strong>{habActual.tipo_habitacion}</strong> • 
                        Estado: <strong>{habActual.estado_habitacion}</strong>
                        {tieneReabastecimiento && <span style={{ color: '#d32f2f', marginLeft: '8px' }}>Necesita reabastecimiento</span>}
                      </p>
                    </div>
                    {can('INVENTARIO_EDIT') && (
                      <button
                        onClick={() => handleReabastecimiento(selectedHabitacion)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        ✓ Reabastecimiento Completo
                      </button>
                    )}
                  </div>

                  {/* TABLA DE SUMINISTROS */}
                  <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Suministro</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}>Tipo</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Actual</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Estándar</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Estado</th>
                          {can('INVENTARIO_EDIT') && (
                            <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Acciones</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {habActual.suministros.map((suministro, idx) => (
                          <tr 
                            key={suministro.id}
                            style={{
                              borderBottom: '1px solid #eee',
                              backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa',
                              opacity: suministro.necesita_reabastecimiento ? 1 : 1
                            }}
                          >
                            <td style={{ padding: '12px', fontSize: '14px' }}>
                              <strong>{suministro.suministro_nombre}</strong>
                              {suministro.descripcion && (
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                  {suministro.descripcion}
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '12px', fontSize: '14px' }}>
                              <span 
                                style={{
                                  display: 'inline-block',
                                  padding: '4px 8px',
                                  backgroundColor: getTipoColor(suministro.tipo),
                                  color: '#fff',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {suministro.tipo.charAt(0).toUpperCase() + suministro.tipo.slice(1)}
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                              {editingId === suministro.id ? (
                                <input
                                  type="number"
                                  value={editingCantidad}
                                  onChange={(e) => setEditingCantidad(e.target.value)}
                                  min="0"
                                  style={{
                                    width: '50px',
                                    padding: '4px',
                                    border: '1px solid #1976d2',
                                    borderRadius: '4px',
                                    textAlign: 'center'
                                  }}
                                />
                              ) : (
                                <strong>{suministro.cantidad_actual}</strong>
                              )}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                              {suministro.cantidad_estandar}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                              <span 
                                style={{
                                  display: 'inline-block',
                                  padding: '4px 8px',
                                  backgroundColor: getEstadoColor(suministro.necesita_reabastecimiento),
                                  color: '#fff',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {suministro.necesita_reabastecimiento ? 'Necesita' : 'OK'}
                              </span>
                            </td>
                            {can('INVENTARIO_EDIT') && (
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                {editingId === suministro.id ? (
                                  <>
                                    <button
                                      onClick={() => handleGuardarCantidad(suministro.id)}
                                      className="btn-save btn-save-sm"
                                    >
                                      Guardar
                                    </button>
                                    <button
                                      onClick={() => setEditingId(null)}
                                      className="btn-cancel btn-cancel-sm"
                                    >
                                      Cancelar
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleEditarCantidad(suministro.id, suministro.cantidad_actual)}
                                    className="btn-edit btn-edit-sm"
                                  >
                                    Editar
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )
            })()}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <p>No hay datos disponibles</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
