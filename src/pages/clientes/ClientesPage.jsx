import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import './ModulePage.css'

export default function ClientesPage() {
  const [clients, setClients] = useState([
    { id: 1, nombre: 'Carlos López', email: 'carlos@email.com', telefono: '+34 600 123 456', pais: 'España' },
    { id: 2, nombre: 'María García', email: 'maria@email.com', telefono: '+34 600 789 012', pais: 'España' },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)

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

        <Table
          columns={columns}
          data={clients}
          onEdit={(client) => console.log('Editar:', client)}
          onDelete={(client) => console.log('Eliminar:', client)}
        />

        <Modal
          isOpen={isModalOpen}
          title="Nuevo Cliente"
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => setIsModalOpen(false)}
          confirmText="Guardar"
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" placeholder="Nombre completo" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="correo@email.com" />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input type="tel" placeholder="+34 600 000 000" />
            </div>
            <div className="form-group">
              <label>País</label>
              <input type="text" placeholder="País" />
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
