import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import './ModulePage.css'

export default function InventarioPage() {
  const [items, setItems] = useState([
    { id: 1, nombre: 'Sábanas', cantidad: 45, unidad: 'piezas', estado: 'Normal' },
    { id: 2, nombre: 'Toallas', cantidad: 80, unidad: 'piezas', estado: 'Normal' },
    { id: 3, nombre: 'Almohadas', cantidad: 12, unidad: 'piezas', estado: 'Bajo' },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const columns = [
    { key: 'nombre', label: 'Artículo' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'unidad', label: 'Unidad' },
    { key: 'estado', label: 'Estado' },
  ]

  return (
    <DashboardLayout>
      <div className="module-page">
        <div className="page-header">
          <h1>Inventario por Habitación</h1>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + Agregar Item
          </button>
        </div>

        <Table
          columns={columns}
          data={items}
          onEdit={(item) => console.log('Editar:', item)}
          onDelete={(item) => console.log('Eliminar:', item)}
        />

        <Modal
          isOpen={isModalOpen}
          title="Agregar Item al Inventario"
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => setIsModalOpen(false)}
          confirmText="Agregar"
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Nombre del Artículo</label>
              <input type="text" placeholder="Ej: Sábanas" />
            </div>
            <div className="form-group">
              <label>Cantidad</label>
              <input type="number" placeholder="0" />
            </div>
            <div className="form-group">
              <label>Unidad</label>
              <select>
                <option>piezas</option>
                <option>paquetes</option>
                <option>cajas</option>
              </select>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
