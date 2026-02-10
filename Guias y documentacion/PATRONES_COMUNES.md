# 🔧 Patrones Comunes - RoomMaster

> Ejemplos listos para copiar y pegar

---

## 📝 Patrón CRUD Completo

Copia este patrón para crear un nuevo módulo CRUD:

```jsx
import { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import './ModulePage.css'

/**
 * [NombrePage]: Descripción del módulo
 */
export default function NombrePage() {
  // ============ ESTADOS ============
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    campo1: '',
    campo2: '',
  })

  // ============ CONFIGURACIÓN ============
  const columns = [
    { key: 'campo1', label: 'Campo 1' },
    { key: 'campo2', label: 'Campo 2' },
  ]

  // ============ FUNCIONES AUXILIARES ============
  const resetForm = () => {
    setFormData({ campo1: '', campo2: '' })
    setIsEditMode(false)
    setEditingItem(null)
  }

  const handleOpenAddModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  // ============ FUNCIONES CRUD ============
  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({ ...item })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.campo1 || !formData.campo2) {
      alert('Completa todos los campos')
      return
    }

    setSaving(true)
    try {
      if (isEditMode && editingItem) {
        setItems(items.map(item => 
          item.id === editingItem.id ? { ...item, ...formData } : item
        ))
        alert('✓ Actualizado exitosamente')
      } else {
        const newItem = {
          id: Math.max(...items.map(i => i.id), 0) + 1,
          ...formData,
        }
        setItems([...items, newItem])
        alert('✓ Creado exitosamente')
      }
      setIsModalOpen(false)
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (item) => {
    if (!window.confirm(`¿Eliminar ${item.campo1}?`)) return
    setItems(items.filter(i => i.id !== item.id))
    alert('✓ Eliminado exitosamente')
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Nombre del Módulo</h1>
        <p className="page-subtitle">Descripción</p>

        <div className="page-header">
          <div></div>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            + Crear Nuevo
          </button>
        </div>

        <Table
          columns={columns}
          data={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          title={isEditMode ? `Editar: ${editingItem?.campo1}` : 'Crear Nuevo'}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSave}
          confirmText={saving ? 'Guardando...' : 'Guardar'}
        >
          <form className="form-grid">
            <div className="form-group">
              <label>Campo 1</label>
              <input
                type="text"
                name="campo1"
                value={formData.campo1}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>Campo 2</label>
              <input
                type="text"
                name="campo2"
                value={formData.campo2}
                onChange={handleFormChange}
              />
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
```

---

## 🔑 Verificar Autenticación y Rol

```jsx
import { useAuth } from '../../hooks/useAuth'

// En tu componente:
const { user, logout } = useAuth()

// Verificar si está autenticado
if (!user) {
  return <div>Cargando...</div>
}

// Verificar si es admin
if (user.role === 'admin') {
  // Solo admin ve esto
}

// Verificar si es recepcionista
if (user.role === 'receptionist') {
  // Solo recepcionista ve esto
}

// Mostrar botones solo para admin
{user?.role === 'admin' && (
  <button className="btn btn-primary">Agregar Producto</button>
)}
```

---

## 📋 Tabla Genérica con Roles

```jsx
<Table
  columns={columns}
  data={items}
  // Si es recepcionista, pasar null (sin acciones)
  onEdit={user?.role === 'admin' ? handleEdit : (user?.role === 'receptionist' ? null : handleEdit)}
  onDelete={user?.role === 'admin' ? handleDelete : (user?.role === 'receptionist' ? null : handleDelete)}
  // Solo mostrar botones de acciones si es admin
  actions={user?.role === 'admin'}
/>
```

---

## 📝 Formulario Controlado

```jsx
import { useState } from 'react'

export default function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  // Actualizar un campo
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handleri del submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validar
    if (!formData.name || !formData.email) {
      alert('Completa todos los campos')
      return
    }

    // Usar los datos
    console.log('Datos:', formData)
    
    // Limpiar
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nombre"
      />
      
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Mensaje"
      />
      
      <button type="submit">Enviar</button>
    </form>
  )
}
```

---

## 🔄 Actualizar Lista sin Mutar Estado

```jsx
// ✅ CORRECTO - Crear nuevo array
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
]

// Crear
const newItems = [...items, { id: 3, name: 'Item 3' }]
setItems(newItems)

// Actualizar
const updatedItems = items.map(item =>
  item.id === 2 ? { ...item, name: 'Item 2 Actualizado' } : item
)
setItems(updatedItems)

// Eliminar
const filteredItems = items.filter(item => item.id !== 2)
setItems(filteredItems)

// ❌ INCORRECTO - Mutar directamente
items[0].name = 'Nuevo'  // NO HACER ESTO
setItems(items)
```

---

## 🎯 Búsqueda/Filtrado

```jsx
import { useState } from 'react'

export default function SearchExample() {
  const [items] = useState([
    { id: 1, name: 'Carlos' },
    { id: 2, name: 'María' },
    { id: 3, name: 'Juan' },
  ])
  
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar items según búsqueda
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <input
        type="search"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 🔊 Notificaciones Simples

```jsx
// Usar alert (simple)
alert('✓ Guardado exitosamente')

// Usar confirmación
const confirm = window.confirm('¿Estás seguro?')
if (confirm) {
  // Hacer algo
}

// MEJOR: Crear un componente de notificación reutilizable
import { useState } from 'react'

export default function NotificationExample() {
  const [message, setMessage] = useState('')

  const showNotification = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div>
      {message && (
        <div className="notification">
          {message}
        </div>
      )}
      
      <button onClick={() => showNotification('✓ Operación exitosa')}>
        Mostrar notificación
      </button>
    </div>
  )
}
```

---

## 🌐 Llamadas a API (Mock)

```jsx
// Simular una llamada a API (lo que harás cuando conectes a servidor real)
const fetchUsers = async () => {
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Datos simulados
    const data = [
      { id: 1, name: 'Carlos' },
      { id: 2, name: 'María' },
    ]
    
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// Usar en useEffect
import { useState, useEffect } from 'react'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchUsers()
      .then(data => setUsers(data))
      .catch(error => console.error(error))
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) return <div>Cargando...</div>
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

---

## 💾 LocalStorage

```jsx
// Guardar
const user = { id: 1, name: 'Carlos' }
localStorage.setItem('user', JSON.stringify(user))

// Recuperar
const savedUser = JSON.parse(localStorage.getItem('user'))
console.log(savedUser)  // { id: 1, name: 'Carlos' }

// Eliminar
localStorage.removeItem('user')

// Limpiar todo
localStorage.clear()

// Verificar si existe
if (localStorage.getItem('user')) {
  console.log('Usuario guardado')
}
```

---

## 🎨 Condicionales en JSX

```jsx
// Operador ternario
{isAdmin ? <AdminPanel /> : <UserPanel />}

// AND lógico (solo si es true)
{isAdmin && <AdminPanel />}

// OR lógico (mostrar uno o el otro)
{user || <LoginPage />}

// Switch (múltiples casos)
{
  userRole === 'admin' && <AdminPanel />
  userRole === 'user' && <UserPanel />
  userRole === 'guest' && <GuestPanel />
}

// Map (para listas)
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// Filter + Map
{items
  .filter(item => item.status === 'active')
  .map(item => (
    <div key={item.id}>{item.name}</div>
  ))
}
```

---

## 🚀 Exportar e Importar

```jsx
// Exportar como default
export default MyComponent

// Importar como default
import MyComponent from './MyComponent'

// Exportar múltiples cosas
export const MyFunction = () => {}
export const MyConstant = 'value'

// Importar específico
import { MyFunction, MyConstant } from './utils'

// Importar todo con alias
import * as utils from './utils'
// Usar: utils.MyFunction()
```

---

## 📦 Array Methods Útiles

```jsx
const items = [
  { id: 1, name: 'A', active: true },
  { id: 2, name: 'B', active: false },
]

// .map() - Transformar cada elemento
items.map(i => i.name)  // ['A', 'B']

// .filter() - Filtrar elementos
items.filter(i => i.active)  // [{ id: 1, name: 'A', active: true }]

// .find() - Encontrar primer elemento
items.find(i => i.id === 2)  // { id: 2, name: 'B', active: false }

// .findIndex() - Índice del elemento
items.findIndex(i => i.id === 2)  // 1

// .includes() - ¿Contiene?
items.map(i => i.name).includes('A')  // true

// .some() - ¿Alguno cumple?
items.some(i => i.active)  // true

// .every() - ¿Todos cumplen?
items.every(i => i.active)  // false

// .sort() - Ordenar
items.sort((a, b) => a.name.localeCompare(b.name))

// .reverse() - Invertir
items.reverse()
```

---

Hecho con ❤️ para estudiantes ADSO
