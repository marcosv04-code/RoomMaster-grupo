import { useState } from 'react'
import './Modal.css'

/**
 * Modal: Componente reutilizable para diálogos emergentes
 * 
 * Este componente se usa para:
 * - Formularios de creación/edición
 * - Confirmaciones de acciones
 * - Mensajes importantes del usuario
 * 
 * Props:
 * - isOpen: Boolean - ¿Mostrar el modal?
 * - title: String - Título del modal
 * - children: React elements - Contenido del modal (formulario, etc)
 * - onClose: Function - Callback cuando se cierra el modal
 * - onConfirm: Function - Callback cuando se hace click en el botón principal
 * - confirmText: String - Texto del botón de confirmar (default: "Guardar")
 * - cancelText: String - Texto del botón de cancelar (default: "Cancelar")
 * - showConfirmButton: Boolean - Mostrar el footer con botones (default: true)
 * 
 * Ejemplo de uso:
 * <Modal
 *   isOpen={isOpen}
 *   title="Crear Cliente"
 *   onClose={handleClose}
 *   onConfirm={handleSave}
 *   confirmText="Guardar"
 * >
 *   <form>... formulario aquí ...</form>
 * </Modal>
 * 
 * Ejemplo sin footer (para formularios que tienen su propio botón submit):
 * <Modal
 *   isOpen={isOpen}
 *   title="Registrar Usuario"
 *   onClose={handleClose}
 *   showConfirmButton={false}
 * >
 *   <UserRegisterForm onSubmit={handleSubmit} />
 * </Modal>
 */
export default function Modal({ isOpen, title, children, onClose, onConfirm, confirmText = 'Guardar', cancelText = 'Cancelar', showConfirmButton = true }) {
  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null

  return (
    // OVERLAY: Fondo oscuro que cubre la pantalla
    <div className="modal-overlay" onClick={onClose}>
      
      {/* CONTAINER: Caja del modal */}
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* HEADER: Título y botón cerrar */}
        <div className="modal-header">
          <h2>{title}</h2>
          {/* Botón X para cerrar el modal */}
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        {/* BODY: Contenido del modal (formularios, etc) */}
        <div className="modal-body">
          {children}
        </div>
        
        {/* FOOTER: Botones de acción (solo si showConfirmButton es true) */}
        {showConfirmButton && (
          <div className="modal-footer">
            {/* Botón Cancelar */}
            <button className="btn btn-secondary" onClick={onClose}>
              {cancelText}
            </button>
            
            {/* Botón de acción principal (Guardar, Confirmar, etc) */}
            <button className="btn btn-primary" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
