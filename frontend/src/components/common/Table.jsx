import './Table.css'

/**
 * Table: Componente reutilizable para mostrar datos en tabla
 * 
 * Este componente es GENÉRICO y se puede usar en múltiples módulos
 * (Clientes, Inventario, Tienda, etc.)
 * 
 * Props:
 * - columns: Array de objetos que define qué columnas mostrar
 * - data: Array de objetos con los datos a mostrar
 * - onEdit: Función callback cuando se hace click en "Editar"
 * - onDelete: Función callback cuando se hace click en "Eliminar"
 * - onCancel: Función callback para cancelar (estadías, etc.)
 * - actions: Boolean para mostrar u ocultar botones de acciones
 * - showEdit: Boolean para mostrar botón editar (default true)
 * - showDelete: Boolean para mostrar botón eliminar (default true)
 * - showCancel: Boolean para mostrar botón cancelar (default false)
 * 
 * Ejemplo de uso:
 * <Table
 *   columns={[...]}
 *   data={data}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   showEdit={can('EDIT')}
 *   showDelete={can('DELETE')}
 * />
 */
export default function Table({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onCancel,
  actions = true,
  showEdit = true,
  showDelete = true,
  showCancel = false
}) {
  return (
    <div className="table-container">
      <table className="data-table">
        {/* ENCABEZADO: Nombres de las columnas */}
        <thead>
          <tr>
            {/* Recorrer cada columna y crear un <th> */}
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {/* Columna de acciones si está habilitada */}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>
        
        {/* CUERPO: Datos de las filas */}
        <tbody>
          {data.length > 0 ? (
            // Si hay datos, mostrar cada fila
            data.map((row, idx) => (
              <tr key={idx}>
                {/* Recorrer cada columna y mostrar el valor */}
                {columns.map((col) => (
                  <td key={`${idx}-${col.key}`}>
                    {/* Si la columna tiene función render personalizada, usarla */}
                    {col.render 
                      ? col.render(row[col.key], row)  // Pasar tanto el valor como la fila completa
                      : row[col.key]                    // Si no, mostrar el valor directamente
                    }
                  </td>
                ))}
                
                {/* Botones de acciones */}
                {actions && (
                  <td className="actions-cell">
                    {/* Botón Editar */}
                    {showEdit && (
                      <button 
                        className="btn-edit" 
                        onClick={() => onEdit(row)}
                      >
                        Editar
                      </button>
                    )}
                    
                    {/* Botón Cancelar */}
                    {showCancel && (
                      <button 
                        className="btn-cancel" 
                        onClick={() => onCancel(row)}
                        style={{ background: '#FF9800' }}
                      >
                        Cancelar
                      </button>
                    )}
                    
                    {/* Botón Eliminar */}
                    {showDelete && (
                      <button 
                        className="btn-delete" 
                        onClick={() => onDelete(row)}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            // Si no hay datos, mostrar mensaje vacío
            <tr>
              <td 
                colSpan={columns.length + (actions ? 1 : 0)} 
                className="empty-message"
              >
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
