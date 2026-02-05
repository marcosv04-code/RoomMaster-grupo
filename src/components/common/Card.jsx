import './Card.css'

export default function Card({ title, value, icon, subtitle, className }) {
  return (
    <div className={`stat-card ${className}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <p className="card-title">{title}</p>
        <h3 className="card-value">{value}</h3>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}
