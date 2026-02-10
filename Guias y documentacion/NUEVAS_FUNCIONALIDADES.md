# 🚀 Guía Rápida - Nuevas Funcionalidades

> Cómo agregar nuevas características a RoomMaster

---

## ✅ Agregar Nueva Página CRUD

### Paso 1: Crear archivo
```
frontend/src/pages/mimodulo/MiModuloPage.jsx
```

### Paso 2: Copiar patrón CRUD
Ver: `PATRONES_COMUNES.md` → "Patrón CRUD Completo"

### Paso 3: Agregar ruta en `App.jsx`
```jsx
import MiModuloPage from './pages/mimodulo/MiModuloPage'

<Routes>
  {/* ... rutas existentes ... */}
  <Route 
    path="/mimodulo" 
    element={
      <ProtectedRoute>
        <MiModuloPage />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### Paso 4: Agregar a Sidebar
En `Sidebar.jsx`, agregar a `allMenuItems`:
```jsx
const allMenuItems = [
  // ... items existentes ...
  { label: 'Mi Módulo', path: '/mimodulo', icon: '📌' },
]
```

### Paso 5: Agregar CSS (opcional)
```
frontend/src/pages/mimodulo/ModulePage.css
```

**¡Listo!** Tu módulo está disponible.

---

## 🔑 Sistema de Roles en Nueva Página

Si quieres que solo admin vea algo:

```jsx
import { useAuth } from '../../hooks/useAuth'

export default function MiModuloPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      {user?.role === 'admin' && (
        <button className="btn btn-primary">
          Solo admins ven esto
        </button>
      )}

      {user?.role === 'receptionist' && (
        <div>
          Solo recepcionistas ven esto
        </div>
      )}

      {/* Todos lo ven */}
      <div>Contenido para todos</div>
    </DashboardLayout>
  )
}
```

---

## 🎨 Agregar Campo al Formulario

### En el estado
```jsx
const [formData, setFormData] = useState({
  nombre: '',
  email: '',
  // NUEVO CAMPO:
  telefono: '',  // ← Agregar aquí
})
```

### En el formulario
```jsx
<div className="form-group">
  <label>📞 Teléfono</label>
  <input
    type="tel"
    name="telefono"
    value={formData.telefono}
    onChange={handleFormChange}
    placeholder="Ej: +34 600 123 456"
  />
</div>
```

### En la tabla (columnas)
```jsx
const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  // NUEVO CAMPO:
  { key: 'telefono', label: 'Teléfono' },  // ← Agregar aquí
]
```

### Resetear form
```jsx
const resetForm = () => {
  setFormData({
    nombre: '',
    email: '',
    telefono: '',  // ← Agregar aquí
  })
}
```

---

## 🔍 Agregar Búsqueda

```jsx
import { useState } from 'react'

export default function MiModuloPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [items] = useState([...])

  // Filtrar
  const filteredItems = items.filter(item =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* Input de búsqueda */}
      <input
        type="search"
        placeholder="🔍 Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px 15px', width: '100%' }}
      />

      {/* Tabla filtrada */}
      <Table
        data={filteredItems}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
```

---

## 🔢 Agregar Paginación

```jsx
import { useState } from 'react'

const ITEMS_PER_PAGE = 10

export default function MiModuloPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [items] = useState([...])

  // Calcular índices
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedItems = items.slice(startIndex, endIndex)
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)

  return (
    <div>
      {/* Tabla paginada */}
      <Table data={paginatedItems} columns={columns} />

      {/* Controles de paginación */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          ← Anterior
        </button>

        <span style={{ margin: '0 15px' }}>
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Siguiente →
        </button>
      </div>
    </div>
  )
}
```

---

## 📊 Agregar Estadísticas

```jsx
export default function MiModuloPage() {
  const [items] = useState([...])

  // Calcular estadísticas
  const totalItems = items.length
  const activeItems = items.filter(i => i.estado === 'activo').length
  const inactiveItems = items.filter(i => i.estado === 'inactivo').length

  return (
    <div>
      {/* Tarjetas de estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <Card title="Total" value={totalItems} icon="📊" />
        <Card title="Activos" value={activeItems} icon="✅" />
        <Card title="Inactivos" value={inactiveItems} icon="❌" />
      </div>

      {/* Resto del contenido */}
    </div>
  )
}
```

---

## 🎯 Agregar Validaciones Avanzadas

```jsx
const handleSave = () => {
  // Validación 1: Campos requeridos
  if (!formData.nombre.trim()) {
    alert('El nombre es requerido')
    return
  }

  // Validación 2: Formato email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    alert('Email inválido')
    return
  }

  // Validación 3: Longitud mínima
  if (formData.nombre.length < 3) {
    alert('El nombre debe tener al menos 3 caracteres')
    return
  }

  // Validación 4: Número válido
  if (!formData.telefono.match(/^\d{10}$/)) {
    alert('Teléfono debe tener 10 dígitos')
    return
  }

  // Si llegó aquí, todos los datos son válidos
  setSaving(true)
  // ... guardar ...
}
```

---

## 🎨 Agregar Estilos Personalizados

### Crear archivo CSS
```css
/* ModulePage.css */
.custom-button {
  background-color: #2196F3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.custom-button:hover {
  background-color: #1976d2;
}

.custom-card {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #2196F3;
}
```

### Usar en componente
```jsx
import './ModulePage.css'

export default function MiModuloPage() {
  return (
    <div className="custom-card">
      <button className="custom-button">Mi Botón</button>
    </div>
  )
}
```

---

## 🔄 Agregar Estado Computed

```jsx
export default function MiModuloPage() {
  const [items, setItems] = useState([...])

  // Calculado automáticamente cuando items cambia
  const estadisticas = {
    total: items.length,
    activos: items.filter(i => i.activo).length,
    promedio: items.reduce((sum, i) => sum + i.valor, 0) / items.length
  }

  return (
    <div>
      <p>Total: {estadisticas.total}</p>
      <p>Activos: {estadisticas.activos}</p>
      <p>Promedio: {estadisticas.promedio.toFixed(2)}</p>
    </div>
  )
}
```

---

## 📤 Agregar Exportación a Excel/PDF

```jsx
// Exportar a CSV (Excel lo puede abrir)
const exportToCSV = (data, filename) => {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(obj => Object.values(obj).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'export.csv'
  a.click()
}

// Usar:
<button onClick={() => exportToCSV(items, 'items.csv')}>
  📥 Descargar CSV
</button>
```

---

## ⏰ Agregar Filtro por Fecha

```jsx
const [dateFilter, setDateFilter] = useState('')

const filteredItems = items.filter(item => {
  if (!dateFilter) return true
  return item.fecha === dateFilter
})

return (
  <div>
    <input
      type="date"
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
    />
    
    <Table data={filteredItems} columns={columns} />
  </div>
)
```

---

## 🔔 Agregar Notificaciones Persistentes

```jsx
const [notification, setNotification] = useState(null)

const showNotification = (message, type = 'success') => {
  setNotification({ message, type })
  setTimeout(() => setNotification(null), 3000)
}

return (
  <div>
    {notification && (
      <div className={`notification notification-${notification.type}`}>
        {notification.message}
      </div>
    )}

    <button onClick={() => showNotification('✓ Guardado')}>
      Guardar
    </button>
  </div>
)
```

CSS:
```css
.notification {
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.notification-success {
  background: #4CAF50;
  color: white;
}

.notification-error {
  background: #f44336;
  color: white;
}

.notification-warning {
  background: #FF9800;
  color: white;
}
```

---

## 🔗 Agregar Relaciones Entre Datos

```jsx
// Ejemplo: Cliente con múltiples estadías
export default function MiModuloPage() {
  const [clients, setClients] = useState([...])
  const [stays, setStays] = useState([...])

  // Obtener estadías de un cliente
  const getClientStays = (clientId) => {
    return stays.filter(stay => stay.clienteId === clientId)
  }

  // Usar
  const clientStays = getClientStays(1)

  return (
    <div>
      {clients.map(client => (
        <div key={client.id}>
          <h3>{client.nombre}</h3>
          <p>Estadías: {getClientStays(client.id).length}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## 💡 Próximos Pasos

1. **Conectar a API real** - Reemplazar datos mock con llamadas HTTP
2. **Agregar autenticación real** - Servidor de usuarios
3. **Persistencia en DB** - Base de datos (MongoDB, PostgreSQL, etc)
4. **Testing** - Jest, React Testing Library
5. **Deploy** - Vercel, Netlify, Heroku

---

Hecho con ❤️ para estudiantes ADSO
