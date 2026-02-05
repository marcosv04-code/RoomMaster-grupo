// Ejemplos de uso de componentes principales

// ============================================
// 1. USEAUTH HOOK
// ============================================
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  return (
    <div>
      {isAuthenticated && <p>Bienvenido, {user.name}</p>}
    </div>
  )
}

// ============================================
// 2. PROTECTED ROUTE
// ============================================
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  )
}

// ============================================
// 3. DASHBOARD LAYOUT
// ============================================
import DashboardLayout from '@/components/layouts/DashboardLayout'

function MyPage() {
  return (
    <DashboardLayout>
      <h1>Mi Página</h1>
      <p>Contenido con sidebar y navbar automáticos</p>
    </DashboardLayout>
  )
}

// ============================================
// 4. CARD COMPONENT
// ============================================
import Card from '@/components/common/Card'

function Dashboard() {
  return (
    <div className="stats-grid">
      <Card 
        title="Habitaciones Disponibles" 
        value="8" 
        icon="🏨"
        subtitle="de 15 habitaciones"
        className="success"
      />
      <Card 
        title="Ocupación" 
        value="53%" 
        icon="📊"
        className="warning"
      />
    </div>
  )
}

// ============================================
// 5. TABLE COMPONENT
// ============================================
import Table from '@/components/common/Table'
import { useState, useEffect } from 'react'

function ClientesPage() {
  const [clients, setClients] = useState([])

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value) => <span className={`badge ${value}`}>{value}</span>
    },
  ]

  const handleEdit = (client) => {
    console.log('Editar cliente:', client)
  }

  const handleDelete = (client) => {
    console.log('Eliminar cliente:', client)
  }

  return (
    <Table
      columns={columns}
      data={clients}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}

// ============================================
// 6. MODAL COMPONENT
// ============================================
import Modal from '@/components/common/Modal'

function ClientesPageWithModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSave = () => {
    // Lógica para guardar
    setIsModalOpen(false)
  }

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>+ Nuevo Cliente</button>
      
      <Modal
        isOpen={isModalOpen}
        title="Nuevo Cliente"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSave}
        confirmText="Guardar"
        cancelText="Cancelar"
      >
        <form>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" placeholder="Nombre completo" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="email@example.com" />
          </div>
        </form>
      </Modal>
    </>
  )
}

// ============================================
// 7. API SERVICES
// ============================================
import { roomService, clientService, stayService } from '@/services'

async function fetchRooms() {
  try {
    const rooms = await roomService.getAll()
    console.log('Habitaciones:', rooms)
  } catch (error) {
    console.error('Error al cargar habitaciones:', error)
  }
}

async function createRoom(data) {
  try {
    const newRoom = await roomService.create({
      numero: 105,
      tipo: 'Doble',
      precio: 150
    })
    console.log('Habitación creada:', newRoom)
  } catch (error) {
    console.error('Error:', error)
  }
}

async function updateRoom(id, data) {
  try {
    const updated = await roomService.update(id, data)
    console.log('Habitación actualizada:', updated)
  } catch (error) {
    console.error('Error:', error)
  }
}

// ============================================
// 8. FULL PAGE EXAMPLE
// ============================================
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import Table from '@/components/common/Table'
import Card from '@/components/common/Card'
import Modal from '@/components/common/Modal'
import { clientService } from '@/services'

export default function ClientesCompleto() {
  const [clients, setClients] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' })

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const data = await clientService.getAll()
      setClients(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await clientService.create(formData)
      setFormData({ nombre: '', email: '', telefono: '' })
      setIsModalOpen(false)
      loadClients()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (client) => {
    console.log('Editar:', client)
  }

  const handleDelete = async (client) => {
    try {
      await clientService.delete(client.id)
      loadClients()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'pais', label: 'País' },
  ]

  return (
    <DashboardLayout>
      <div className="module-page">
        <div className="page-header">
          <h1>Gestión de Clientes</h1>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + Nuevo Cliente
          </button>
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Table
            columns={columns}
            data={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          title="Nuevo Cliente"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCreate}
          confirmText="Crear"
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              />
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
