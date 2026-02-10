import './Table.css'

export default function Table({ columns, data, onEdit, onDelete, actions = true }) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={`${idx}-${col.key}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => onEdit(row)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => onDelete(row)}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="empty-message">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
