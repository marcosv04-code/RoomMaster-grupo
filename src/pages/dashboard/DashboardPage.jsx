import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import './DashboardPage.css'
import { roomService } from '../../services/index'

export default function DashboardPage() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      // Simulación de datos (reemplazar con llamada real)
      const mockRooms = [
        { id: 1, numero: 101, tipo: 'Doble', estado: 'Disponible', precio: 120 },
        { id: 2, numero: 102, tipo: 'Simple', estado: 'Ocupada', precio: 80 },
        { id: 3, numero: 103, tipo: 'Suite', estado: 'Disponible', precio: 200 },
        { id: 4, numero: 104, tipo: 'Doble', estado: 'Mantenimiento', precio: 120 },
      ]
      setRooms(mockRooms)
    } catch (error) {
      console.error('Error al cargar habitaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'numero', label: 'Habitación' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'estado', label: 'Estado' },
    { 
      key: 'precio', 
      label: 'Precio',
      render: (value) => `$${value}` 
    },
  ]

  const handleEdit = (room) => {
    console.log('Editar:', room)
  }

  const handleDelete = (room) => {
    console.log('Eliminar:', room)
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <h1>Dashboard Principal</h1>

        {/* Cards de estadísticas */}
        <div className="stats-grid">
          <Card 
            title="Habitaciones Disponibles" 
            value="8" 
            icon="🏨"
            subtitle="de 15 habitaciones"
          />
          <Card 
            title="Huéspedes Activos" 
            value="7" 
            icon="👥"
            subtitle="en el hotel"
          />
          <Card 
            title="Ingresos Hoy" 
            value="$1,250" 
            icon="💰"
            subtitle="hasta el momento"
          />
          <Card 
            title="Ocupación" 
            value="53%" 
            icon="📊"
            subtitle="del total"
          />
        </div>

        {/* Tabla de habitaciones */}
        <div className="dashboard-section">
          <h2>Estado de Habitaciones</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <Table
              columns={columns}
              data={rooms}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
