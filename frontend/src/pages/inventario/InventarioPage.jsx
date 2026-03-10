import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Icon from '../../components/common/Icon'
import { useAuth } from '../../hooks/useAuth'
import { usePermissions } from '../../hooks/usePermissions'
import './ModulePage.css'

const API = '/api'

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
    if (user?.role !== 'admin' && user?.role !== 'recepcionista') {
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
    if (user?.role !== 'admin') {
      setError('No tienes permiso para reabastecer')
      return
    }

    const result = await Swal.fire({
      title: '¿Reabastecer?',
      text: '¿Reabastecerá la habitación ' + habitacionesAgrupadas[habitacion_id]?.numero_habitacion + ' completamente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reabastecer',
      cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) {
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
      'amenidades': '#95E1D3'
    }
    return colores[tipo] || '#8B9DC3'
  }

  const getTipoLabel = (tipo) => {
    const labels = {
      'sabanas': 'Sábanas',
      'toallas': 'Toallas',
      'limpieza': 'Limpieza',
      'amenities': 'Amenidades'
    }
    return labels[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1)
  }

  const getEstadoColor = (necesitaReabastecimiento) => {
    return necesitaReabastecimiento ? '#FF6B6B' : '#2196F3'
  }
  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Icon name="box" size={32} className="primary" />
          <h1 style={{ margin: 0 }}>Inventario por Habitación</h1>
        </div>
        <p className="page-subtitle">Gestiona suministros: sábanas, toallas, limpieza, amenidades</p>

        {error && (
          <div style={{ 
            color: 'var(--color-error)', 
            marginBottom: '20px', 
            padding: '12px', 
            backgroundColor: 'rgba(239, 83, 80, 0.1)', 
            borderRadius: '4px',
            border: '1px solid var(--color-error)'
          }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{ 
            color: 'var(--color-success)', 
            marginBottom: '20px', 
            padding: '12px', 
            backgroundColor: 'rgba(76, 175, 80, 0.1)', 
            borderRadius: '4px',
            border: '1px solid var(--color-success)'
          }}>
            {successMessage}
          </div>
        )}

        {/* SELECTOR DE HABITACIONES */}
        {!loading && Object.keys(habitacionesAgrupadas).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-text)' }}>
              Selecciona una habitación:
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
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
                        border: selectedHabitacion === habId ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: selectedHabitacion === habId ? 'rgba(33, 150, 243, 0.1)' : 'var(--color-background-secondary)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: selectedHabitacion === habId ? 'bold' : 'normal',
                        color: tieneReabastecimiento ? 'var(--color-error)' : 'var(--color-text)',
                        fontFamily: 'inherit'
                      }}
                    >
                      <div>Hab. {hab.numero_habitacion}</div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>
                        {hab.tipo_habitacion}
                      </div>
                    </button>
                  )
                })}
            </div>
          </div>
        )}

        {/* CONTENIDO DE HABITACIÓN SELECCIONADA */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
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
                    backgroundColor: 'var(--color-card-background)',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h2 style={{ margin: '0 0 4px 0', color: 'var(--color-text)' }}>
                        Habitación {habActual.numero_habitacion}
                      </h2>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        {habActual.tipo_habitacion} • {habActual.estado_habitacion}
                      </p>
                    </div>
                    {can('INVENTARIO_EDIT') && user?.role === 'admin' && (
                      <button
                        onClick={() => handleReabastecimiento(selectedHabitacion)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontFamily: 'inherit'
                        }}
                      >
                        ✓ Reabastecer
                      </button>
                    )}
                  </div>

                  {/* TABLA */}
                  <div style={{
                    backgroundColor: 'var(--color-card-background)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--color-background-secondary)', borderBottom: '2px solid var(--color-border)' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: 'var(--color-text)' }}>Suministro</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: 'var(--color-text)' }}>Tipo</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text)' }}>Actual</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text)' }}>Estándar</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text)' }}>Estado</th>
                          {(user?.role === 'admin' || user?.role === 'recepcionista') && (
                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-text)' }}>Acciones</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {habActual.suministros.map((suministro) => (
                          <tr 
                            key={suministro.id}
                            style={{
                              borderBottom: '1px solid var(--color-border)',
                              backgroundColor: 'var(--color-card-background)'
                            }}
                          >
                            <td style={{ padding: '12px', color: 'var(--color-text)', fontWeight: 'bold' }}>
                              {suministro.suministro_nombre}
                            </td>
                            <td style={{ padding: '12px', color: 'var(--color-text)' }}>
                              <span 
                                style={{
                                  display: 'inline-block',
                                  padding: '3px 6px',
                                  backgroundColor: getTipoColor(suministro.tipo),
                                  color: '#fff',
                                  borderRadius: '3px',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {getTipoLabel(suministro.tipo)}
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', color: 'var(--color-text)' }}>
                              {editingId === suministro.id ? (
                                <input
                                  type="number"
                                  value={editingCantidad}
                                  onChange={(e) => setEditingCantidad(e.target.value)}
                                  min="0"
                                  style={{
                                    width: '50px',
                                    padding: '4px',
                                    border: '1px solid var(--color-primary)',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                    backgroundColor: 'var(--color-background)',
                                    color: 'var(--color-text)',
                                    fontFamily: 'inherit'
                                  }}
                                />
                              ) : (
                                <strong>{suministro.cantidad_actual}</strong>
                              )}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', color: 'var(--color-text)' }}>
                              {suministro.cantidad_estandar}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <span 
                                style={{
                                  display: 'inline-block',
                                  padding: '3px 8px',
                                  backgroundColor: suministro.necesita_reabastecimiento ? '#FF6B6B' : '#4CAF50',
                                  color: '#fff',
                                  borderRadius: '3px',
                                  fontSize: '11px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {suministro.necesita_reabastecimiento ? 'Necesita' : 'OK'}
                              </span>
                            </td>
                            {(user?.role === 'admin' || user?.role === 'recepcionista') && (
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
          !loading && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
            <p>No hay datos disponibles</p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
            <p>Cargando inventario...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
