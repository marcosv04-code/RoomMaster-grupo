import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import './ModulePage.css'

export default function GestionEstadiaPage() {
  const [stays, setStays] = useState([
    { id: 1, cliente: 'Carlos López', habitacion: '101', fechaEntrada: '2026-02-05', fechaSalida: '2026-02-10', estado: 'Activa' },
    { id: 2, cliente: 'María García', habitacion: '102', fechaEntrada: '2026-02-03', fechaSalida: '2026-02-05', estado: 'Pendiente' },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const columns = [
    { key: 'cliente', label: 'Cliente' },
    { key: 'habitacion', label: 'Habitación' },
    { key: 'fechaEntrada', label: 'Entrada' },
    { key: 'fechaSalida', label: 'Salida' },
    { key: 'estado', label: 'Estado' },
  ]

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Gestión de Estadía</h1>
        <p className="page-subtitle">Administra y controla todas las estadías y reservas de tus huéspedes</p>
        
        <div className="page-header">
          <div></div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + Nueva Estadía
          </button>
        </div>

        <Table
          columns={columns}
          data={stays}
          onEdit={(stay) => console.log('Editar:', stay)}
          onDelete={(stay) => console.log('Eliminar:', stay)}
        />

        <Modal
          isOpen={isModalOpen}
          title="Nueva Estadía"
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => setIsModalOpen(false)}
          confirmText="Crear"
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Cliente</label>
              <input type="text" placeholder="Nombre del cliente" />
            </div>
            <div className="form-group">
              <label>Habitación</label>
              <select>
                <option>Selecciona una habitación</option>
                <option>101</option>
                <option>102</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha Entrada</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>Fecha Salida</label>
              <input type="date" />
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
