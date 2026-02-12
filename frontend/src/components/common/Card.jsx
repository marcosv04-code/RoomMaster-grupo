import './Card.css'
import Icon from './Icon'

/**
 * Card: Componente para mostrar una métrica o información destacada
 * 
 * Se usa típicamente para:
 * - Mostrar números importantes en dashboards
 * - Mostrar estadísticas
 * - Mostrar información resumida
 * 
 * Props:
 * - title: String - Nombre de la métrica (ej: "Habitaciones Disponibles")
 * - value: String/Number - Valor a mostrar (ej: "8")
 * - icon: String - Nombre del icono (ej: "hotel", "users", "money", "chart")
 * - subtitle: String - Texto pequeño debajo (ej: "de 15 habitaciones")
 * - className: String - Clase CSS adicional (opcional)
 * 
 * Ejemplo de uso:
 * <Card 
 *   title="Habitaciones Disponibles" 
 *   value="8" 
 *   icon="hotel"
 *   subtitle="de 15 habitaciones"
 * />
 */
export default function Card({ title, value, icon, subtitle, className }) {
  return (
    // Contenedor principal de la tarjeta
    <div className={`stat-card ${className}`}>
      
      {/* ICONO: SVG Icon con contenedor para estilos */}
      <div className="card-icon">
        <Icon name={icon} size={32} className="white" />
      </div>
      
      {/* CONTENIDO: Información de la métrica */}
      <div className="card-content">
        {/* Título de la métrica */}
        <p className="card-title">{title}</p>
        
        {/* Valor principal (número importante) */}
        <h3 className="card-value">{value}</h3>
        
        {/* Subtítulo opcional (contexto adicional) */}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
