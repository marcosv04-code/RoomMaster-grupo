# 📚 DOCUMENTACIÓN UNIFICADA - RoomMaster 2.0

> Todo lo que necesitas saber en un único archivo

---

## 📑 TABLA DE CONTENIDOS

1. [Instalación y Ejecución](#-instalación-y-ejecución)
2. [Guía de Arquitectura](#-guía-de-arquitectura)
3. [Patrones Comunes](#-patrones-comunes)
4. [Debugging y Troubleshooting](#-debugging-y-troubleshooting)
5. [Nuevas Funcionalidades](#-nuevas-funcionalidades)
6. [Hoja de Trucos (Quick Reference)](#-hoja-de-trucos-quick-reference)
7. [Estructura del Proyecto](#-estructura-del-proyecto)
8. [Mejores Prácticas](#-mejores-prácticas)

---

---

# 🏨 INSTALACIÓN Y EJECUCIÓN

## 📋 Requisitos Previos

Asegúrate de tener instalado:
- **Node.js** (v16+): https://nodejs.org
- **npm** (viene con Node.js)
- **Un editor** (VS Code recomendado): https://code.visualstudio.com

Verifica:
```powershell
node --version    # Debe mostrar v16 o superior
npm --version     # Debe mostrar 8 o superior
```

## 🚀 Instalación Paso a Paso

### 1️⃣ Clonar o descargar el proyecto

Si tienes git:
```powershell
git clone <url-del-repositorio>
cd RoomMaster_Prueba
```

Si descargaste como ZIP:
```powershell
# Extrae el ZIP y abre PowerShell en la carpeta
cd C:\Users\Usuario\Desktop\RoomMaster_Prueba
```

### 2️⃣ Instalar dependencias del frontend

```powershell
cd frontend
npm install
```

Espera a que termine (puede tomar 2-3 minutos la primera vez).

### 3️⃣ Arrancar el servidor Vite

```powershell
npm run dev
```

Verás algo como:
```
➜  Local:   http://localhost:5173/
```

📌 **No cierres esta terminal**, déjala corriendo.

### 4️⃣ Abrir en navegador

En tu navegador, ve a:
```
http://localhost:5173
```

¡Verás la página de login de RoomMaster! ✅

## 👤 Credenciales de Prueba

### Acceso Admin
- **Email**: admin@roommaster.com
- **Contraseña**: admin123
- **Rol**: Administrador (acceso a todo)

### Acceso Recepcionista
- **Email**: recepcionista@roommaster.com
- **Contraseña**: recep123
- **Rol**: Recepcionista (acceso limitado)

## 🛠️ Comandos Útiles

### Desarrollo
```powershell
# En la carpeta frontend/
npm run dev          # Inicia servidor Vite (http://localhost:5173)
```

### Build para producción
```powershell
npm run build        # Crea carpeta dist/ lista para deployment
npm run preview      # Vista previa de la build
```

## 🐛 Solucionar Problemas Comunes

### ❌ Problema: "npm: No se reconoce el término"
**Solución**: 
- Node.js no está instalado
- Cierra PowerShell y reabre después de instalar

```powershell
node --version      # Verifica si funciona
```

### ❌ Problema: Puerto 5173 ya está en uso
**Solución**:
```powershell
# Para Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# O simplemente inicia en otro puerto:
npm run dev -- --port 3000
```

### ❌ Problema: "Cannot find module"
**Solución**:
```powershell
# En frontend/
del node_modules -R
del package-lock.json
npm install
```

### ❌ Problema: Cambios no se reflejan
**Solución**:
1. Clear navegador cache: Ctrl + Shift + Supr
2. Cierra Vite (Ctrl + C)
3. Ejecuta `npm run dev` nuevamente

### ❌ Problema: Errores de sintaxis React
**Verificar**: 
- ¿Importaste los hooks? `import { useState } from 'react'`
- ¿Cerraste todos los paréntesis y llaves?
- ¿Los nombres de componentes empiezan con mayúscula?

## 🌐 Conexión a Backend Real

Cuando tengas un servidor backend:

### Paso 1: Cambiar URL base
En `frontend/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:3000/api'  // ← Cambiar aquí
```

### Paso 2: Reemplazar llamadas mock
Ejemplo en `ClientesPage.jsx`:
```javascript
// ANTES (mock):
const [items] = useState([
  { id: 1, nombre: 'Cliente 1', ... }
])

// DESPUÉS (real):
useEffect(() => {
  fetch(`${API_URL}/clientes`)
    .then(res => res.json())
    .then(data => setItems(data))
}, [])
```

## 🚀 Deploy a Internet

### Opción 1: Vercel (Recomendado)
```powershell
# 1. Registrate en vercel.com
# 2. Instala CLI
npm install -g vercel

# 3. Deploy
cd frontend
vercel           # Sigue las instrucciones
```

### Opción 2: Netlify
```powershell
# 1. Registrate en netlify.com
# 2. Ejecuta build
npm run build

# 3. Arrastra carpeta 'dist' a Netlify
```

---

---

# 📚 GUÍA DE ARQUITECTURA

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── context/              # Contextos globales
│   │   └── AuthContext.jsx   # Gestión de autenticación
│   ├── hooks/                # Custom Hooks
│   │   ├── useAuth.js        # Hook para acceder a autenticación
│   │   └── useTheme.js       # Hook para tema oscuro/claro
│   ├── components/           # Componentes reutilizables
│   │   ├── common/           # Componentes genéricos
│   │   │   ├── Card.jsx      # Tarjeta de métrica
│   │   │   ├── Table.jsx     # Tabla de datos
│   │   │   ├── Modal.jsx     # Diálogo emergente
│   │   │   ├── Sidebar.jsx   # Menú lateral
│   │   │   ├── Navbar.jsx    # Barra superior
│   │   │   └── ProtectedRoute.jsx
│   │   └── layouts/          # Layouts (estructura)
│   │       └── DashboardLayout.jsx
│   ├── pages/                # Páginas/Módulos principales
│   │   ├── auth/             # Autenticación
│   │   ├── dashboard/        # Dashboard principal
│   │   ├── clientes/         # Gestión de clientes
│   │   ├── gestion-estadia/  # Gestión de reservas
│   │   ├── inventario/       # Inventario
│   │   ├── tienda/           # Tienda/Ventas
│   │   ├── facturacion/      # Facturación
│   │   ├── reportes/         # Reportes
│   │   └── perfil/           # Perfil de usuario
│   ├── services/             # Servicios (API, etc)
│   ├── styles/               # Estilos globales
│   └── main.jsx              # Punto de entrada
└── index.html
```

## 🔄 Flujo de Autenticación

### 1️⃣ Login/Registro
- Usuario ingresa email, contraseña y selecciona rol **Admin** o **Recepcionista**
- Datos se envían a `AuthContext.jsx`
- Se guarda el usuario en `localStorage` para persistencia

### 2️⃣ Context de Autenticación
```
App.jsx
└── AuthProvider (envuelve toda la app)
    └── AuthContext
        - user: { id, name, email, role }
        - isAuthenticated: boolean
        - loading: boolean
        - login(userData)
        - logout()
```

### 3️⃣ Uso del Hook useAuth
```jsx
// En cualquier componente:
const { user, login, logout, isAuthenticated } = useAuth()

// Acceder al roll del usuario:
if (user?.role === 'admin') { /* admin stuff */ }
if (user?.role === 'receptionist') { /* receptionist stuff */ }
```

### 4️⃣ Rutas Protegidas
```jsx
// En App.jsx:
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

Si el usuario NO está autenticado → redirige a `/login`

## 🔐 Sistema de Roles

### Administrador (admin)
- ✅ Ver todos los módulos
- ✅ CRUD completo en todos los módulos
- ✅ Agregar nuevos productos
- ✅ Gestionar inventario

### Recepcionista (receptionist)
- ✅ Ver todos los módulos
- ✅ CRUD completo en: **Clientes** y **Gestión de Estadía**
- ✅ Crear ventas en **Tienda**
- ✅ Crear facturas en **Facturación**
- ❌ No puede agregar productos
- ❌ Solo lectura en: Inventario, Tienda (productos), Facturación (solo listado)

## 📱 Componentes Reutilizables

### Card.jsx
Muestra una métrica o información destacada.
```jsx
<Card 
  title="Habitaciones Disponibles" 
  value="8" 
  icon="🏨"
  subtitle="de 15 habitaciones"
/>
```

### Table.jsx
Tabla genérica para mostrar datos con acciones.
```jsx
<Table
  columns={[
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email', render: (val) => <b>{val}</b> }
  ]}
  data={clients}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Modal.jsx
Diálogo emergente para formularios.
```jsx
<Modal
  isOpen={isOpen}
  title="Nuevo Cliente"
  onClose={handleClose}
  onConfirm={handleSave}
  confirmText="Guardar"
>
  {/* Contenido: formulario, etc */}
</Modal>
```

### Sidebar.jsx
Menú de navegación lateral con roles integrados.

### DashboardLayout.jsx
Layout que envuelve todas las páginas protegidas.

## 📋 Patrón CRUD (Create, Read, Update, Delete)

Todos los módulos siguen este patrón:

### 1. Estados
```jsx
const [items, setItems] = useState([...])      // Lista de items
const [isModalOpen, setIsModalOpen] = useState(false)
const [isEditMode, setIsEditMode] = useState(false)
const [editingItem, setEditingItem] = useState(null)
const [formData, setFormData] = useState({})
const [saving, setSaving] = useState(false)
```

### 2. CREATE (Crear)
```jsx
const handleOpenAddModal = () => {
  resetForm()
  setIsModalOpen(true)
}

const handleSave = async () => {
  if (isEditMode) {
    // ACTUALIZAR
    setItems(items.map(item => 
      item.id === editing.id ? {...item, ...formData} : item
    ))
  } else {
    // CREAR
    const newItem = { 
      id: Math.max(...items.map(i => i.id), 0) + 1,
      ...formData 
    }
    setItems([...items, newItem])
  }
}
```

### 3. READ (Leer)
```jsx
// Mostrar en tabla
<Table data={items} columns={...} />
```

### 4. UPDATE (Actualizar)
```jsx
const handleEdit = (item) => {
  setEditingItem(item)
  setFormData({...item})
  setIsEditMode(true)
  setIsModalOpen(true)
}
```

### 5. DELETE (Eliminar)
```jsx
const handleDelete = (item) => {
  const confirm = window.confirm(`¿Eliminar ${item.nombre}?`)
  if (!confirm) return
  setItems(items.filter(i => i.id !== item.id))
}
```

## 🎨 Flujo de Datos

### Props Drilling (pasar props de padre a hijo)
```jsx
// App.jsx
<LoginPage onLogin={handleLogin} />

// LoginPage.jsx
function LoginPage({ onLogin }) {
  // Dentro del componente
}
```

### Context (estado global)
```jsx
// Contexto
<AuthProvider>
  <App />
</AuthProvider>

// En cualquier lado
const { user } = useAuth()
```

### State Local (estado local del componente)
```jsx
const [name, setName] = useState('')
```

## 💡 Patrones de React a Aprender

### 1. Hooks Principales
- **useState**: Gestionar estado local
- **useEffect**: Efectos secundarios (cargar datos, etc)
- **useContext**: Acceder a contextos globales
- **useNavigate**: Navegar entre páginas

### 2. Controlled Inputs
```jsx
const [email, setEmail] = useState('')

<input 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### 3. Conditional Rendering
```jsx
{user?.role === 'admin' && <AdminPanel />}
{isLoading ? <Spinner /> : <Content />}
```

### 4. Array Methods
```jsx
// Actualizar item
items.map(item => item.id === 5 ? {...item, name: 'nuevo'} : item)

// Filtrar
items.filter(item => item.id !== 5)

// Encontrar
items.find(item => item.id === 5)
```

---

---

# 🔧 PATRONES COMUNES

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

  // Handler del submit
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

## 🌐 Llamadas a API (Mock)

```jsx
// Simular una llamada a API
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

---

# 🐛 DEBUGGING Y TROUBLESHOOTING

## 🔍 Herramientas de Debugging

### 1. React DevTools
**Instalación:**
- Chrome: React Developer Tools extensión
- Firefox: React Developer Tools extensión

**Uso:**
- Inspeccionar componentes en tiempo real
- Ver props y estado de cada componente
- Seguir cambios de estado
- Rastrear renders

### 2. Console del Navegador (F12)
```javascript
// Abrir con F12
// Tab: Console
// Escribir comandos JavaScript

console.log('Texto normal')
console.warn('Advertencia')
console.error('Error')
console.table(arrayDeObjetos)  // Ver tabla formateada
```

### 3. LocalStorage Inspector
```javascript
// En la consola:
localStorage  // Ver todo
localStorage.getItem('user')  // Ver un item
localStorage.setItem('test', 'valor')
localStorage.removeItem('test')
localStorage.clear()  // Limpiar todo
```

### 4. Network Tab
- Tab: Network
- Ver solicitudes HTTP
- Ver tiempos de respuesta
- Depurar APIs

## 🛑 Errores Comunes

### Error: "Cannot read property of undefined"
```javascript
// ❌ PROBLEMA
const user = null
console.log(user.name)  // Error!

// ✅ SOLUCIÓN 1: Optional Chaining
console.log(user?.name)  // undefined (sin error)

// ✅ SOLUCIÓN 2: Verificar antes
if (user) {
  console.log(user.name)
}
```

### Error: "setItems is not a function"
```javascript
// ❌ PROBLEMA: Olvidar destructurar
const item = useState([])
console.log(item)  // Es un array: [value, function]

// ✅ SOLUCIÓN: Destructurar correctamente
const [items, setItems] = useState([])
```

### Error: "Too many re-renders"
```javascript
// ❌ PROBLEMA: Llamar función en lugar de pasar referencia
<button onClick={handleClick()}>Click</button>  // Infinitas veces

// ✅ SOLUCIÓN: Pasar referencia
<button onClick={handleClick}>Click</button>
<button onClick={() => handleClick()}>Click</button>
```

### Error: "Mutating the state directly"
```javascript
// ❌ PROBLEMA: Mutar estado directamente
const [items, setItems] = useState([...])
items[0].name = 'nuevo'  // MALO
setItems(items)

// ✅ SOLUCIÓN: Crear nuevo array
setItems(items.map((item, idx) =>
  idx === 0 ? {...item, name: 'nuevo'} : item
))
```

## 🔧 Técnicas de Debugging

### 1. Console.log estratégico
```jsx
export default function MyComponent() {
  const [count, setCount] = useState(0)

  console.log('Componente renderizado, count:', count)

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}
```

### 2. Debugger Breakpoints
```jsx
export default function MyComponent() {
  const handleClick = () => {
    debugger  // Se pausa aquí cuando abre DevTools
    console.log('Click!')
  }

  return <button onClick={handleClick}>Click</button>
}
```

### 3. Verificar Tipos
```jsx
const data = { name: 'Carlos' }

// Ver tipo
console.log(typeof data)  // 'object'
console.log(typeof data.name)  // 'string'
console.log(Array.isArray(data))  // false

// Verificar propiedades
console.log('name' in data)  // true
console.log(data.hasOwnProperty('name'))  // true
```

## 🎯 Debugging por Escenario

### El componente no renderiza
```jsx
// 1. ¿Está montado?
console.log('Componente montado')

// 2. ¿El estado es correcto?
console.log('State:', count)

// 3. ¿Las props llegaron?
console.log('Props:', props)

// 4. ¿El return está correcto?
return (
  <div>
    {/* Revisar que esto no sea null/undefined */}
  </div>
)
```

### El estado no actualiza
```jsx
// ❌ PROBLEMA
const [items, setItems] = useState([])
items.push(newItem)  // MALO
setItems(items)

// ✅ SOLUCIÓN
setItems([...items, newItem])  // CORRECTO
```

### La función no se ejecuta
```jsx
// ❌ PROBLEMA
<button onClick={handleClick()}>Click</button>

// ✅ SOLUCIÓN
<button onClick={handleClick}>Click</button>
<button onClick={() => handleClick()}>Click</button>
```

### Modal no abre/cierra
```jsx
// Verificar que useStates están correctos
const [isOpen, setIsOpen] = useState(false)

// Verificar que pasamos los props correctos
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />

// En Modal, verificar que renderiza solo si isOpen es true
if (!isOpen) return null
```

### Tabla no muestra datos
```jsx
// 1. Verificar que data tiene elementos
console.log('Data:', data)
console.log('Data length:', data?.length)

// 2. Verificar que columns es correcto
console.log('Columns:', columns)

// 3. Verificar que las keys coinciden
// Si data = [{nombre: 'Carlos'}]
// columns debe tener { key: 'nombre', label: '...' }
```

### Autenticación no funciona
```jsx
// 1. Verificar si useAuth está siendo usado dentro de AuthProvider
// En App.jsx debe ser:
<AuthProvider>
  <Routes>...</Routes>
</AuthProvider>

// 2. Verificar que el user se guardó en localStorage
localStorage.getItem('user')

// 3. Verificar que ProtectedRoute redirige
// Si no autenticado → debe ir a /login

// 4. Verificar el contexto
const { user, isAuthenticated } = useAuth()
console.log('User:', user)
console.log('Authenticated:', isAuthenticated)
```

## 📊 Checklist de Debugging

Cuando algo no funciona:

- [ ] Abrir consola (F12)
- [ ] Ver si hay errores rojos
- [ ] Hacer console.log de variables clave
- [ ] Verificar que useState está destructurado correctamente
- [ ] Verificar que los props se pasan correctamente
- [ ] Revisar que no hay funciones llamadas sin paréntesis
- [ ] Verificar que no se muta estado directamente
- [ ] Revisar que Modal/Condicionales tienen la clave correcta
- [ ] Limpiar localStorage si hay problemas de autenticación
- [ ] Recargar página (Ctrl+Shift+R) para limpiar caché

---

---

# 🚀 NUEVAS FUNCIONALIDADES

## ✅ Agregar Nueva Página CRUD

### Paso 1: Crear archivo
```
frontend/src/pages/mimodulo/MiModuloPage.jsx
```

### Paso 2: Copiar patrón CRUD
Ver sección "Patrón CRUD Completo" en PATRONES COMUNES

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

---

# ⚡ HOJA DE TRUCOS (QUICK REFERENCE)

## 🚀 Comandos Básicos

```powershell
# Instalar dependencias
npm install

# Ejecutar en desarrollo (con auto-reload)
npm run dev

# Build para producción
npm run build

# Ver build en navegador
npm run preview
```

**URL local**: http://localhost:5173

## 🔐 Autenticación Rápida

### Credenciales de prueba
```
Admin:
  Email: admin@roommaster.com
  Password: admin123
  
Receptionist:
  Email: recepcionista@roommaster.com
  Password: recep123
```

### Importar y usar autenticación
```jsx
import { useAuth } from '../hooks/useAuth'

export default function MiComponente() {
  const { user, logout } = useAuth()
  
  console.log(user)          // { id, name, email, role }
  console.log(user?.role)    // 'admin' o 'receptionist'
  
  return (
    <div>
      Bienvenid@ {user?.name}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## 🎨 Componentes Principales

### Table - Mostrar datos en tabla
```jsx
import Table from '../components/common/Table'

<Table
  data={items}
  columns={[
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' }
  ]}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Modal - Ventana emergente
```jsx
import Modal from '../components/common/Modal'

<Modal
  isOpen={showModal}
  title="Nuevo Cliente"
  onClose={() => setShowModal(false)}
>
  <form>
    <input value={formData.nombre} onChange={handleChange} />
    <button onClick={handleSave}>Guardar</button>
  </form>
</Modal>
```

### Card - Tarjeta de contenido
```jsx
import Card from '../components/common/Card'

<Card title="Total Clientes" value={100} icon="👥" />
```

### DashboardLayout - Layout estándar
```jsx
import DashboardLayout from '../components/layouts/DashboardLayout'

<DashboardLayout>
  {/* Tu contenido aquí */}
</DashboardLayout>
```

## 🔑 Hooks y Estado

### useState - Estado local
```jsx
const [items, setItems] = useState([])
const [count, setCount] = useState(0)

// Actualizar
setItems([...items, newItem])      // Agregar
setItems(items.filter(i => i.id !== id))  // Eliminar
setCount(count + 1)                // Sumar
```

### useEffect - Efectos secundarios
```jsx
// Ejecutar al cargar componente
useEffect(() => {
  console.log('Componente cargado')
}, [])

// Ejecutar cuando cambia variable
useEffect(() => {
  console.log('userId cambió:', userId)
}, [userId])
```

### useAuth - Contexto de autenticación
```jsx
const { user, login, logout } = useAuth()

// Verificar rol
if (user?.role === 'admin') {
  // Solo para admins
}
```

## 💡 Tips Profesionales

```jsx
// 1. Desestructurar
const { nombre, email } = user

// 2. Default values
const { count = 0 } = props

// 3. Spread operator
const newUser = { ...user, email: 'nuevo@email.com' }

// 4. Optional chaining
const city = user?.profile?.address?.city

// 5. Template literals
const msg = `Hola ${name}, tienes ${age} años`

// 6. Arrow functions
const add = (a, b) => a + b
```

## 🌍 Importes Comunes

```jsx
// React
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Hooks
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

// Componentes
import DashboardLayout from '../components/layouts/DashboardLayout'
import Table from '../components/common/Table'
import Modal from '../components/common/Modal'
import Card from '../components/common/Card'
import ProtectedRoute from '../components/common/ProtectedRoute'
```

## ⏱️ Tabla de Búsqueda Rápida

| Necesito | Busca en | Ejemplo |
|----------|----------|---------|
| Componente reutilizable | components/ | Table, Modal |
| Gestión usuario | context/AuthContext | useAuth |
| Página nuevo módulo | pages/{modulo}/ | ClientesPage |
| Hook personalizado | hooks/ | useAuth, useTheme |
| API calls | services/api | fetch |
| Estilos | {carpeta}/*.css | DashboardLayout.css |

---

---

# 📂 ESTRUCTURA DEL PROYECTO

## Mapa Completo

```
RoomMaster_Prueba/
│
├── frontend/                         [CÓDIGO FUENTE]
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.jsx
│   │   │   ├── clientes/
│   │   │   │   └── ClientesPage.jsx
│   │   │   ├── gestion-estadia/
│   │   │   │   └── GestionEstadiaPage.jsx
│   │   │   ├── tienda/
│   │   │   │   └── TiendaPage.jsx
│   │   │   ├── facturacion/
│   │   │   │   └── FacturacionPage.jsx
│   │   │   ├── reportes/
│   │   │   │   └── ReportesPage.jsx
│   │   │   ├── inventario/
│   │   │   │   └── InventarioPage.jsx
│   │   │   ├── perfil/
│   │   │   │   └── PerfilPage.jsx
│   │   │   └── landing/
│   │   │       └── LandingPage.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── layouts/
│   │   │       └── DashboardLayout.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useTheme.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   │
│   │   ├── styles/
│   │   │   └── global.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── DOCUMENTACION_UNIFICADA.md      [ESTE ARCHIVO]
```

---

---

# ✅ MEJORES PRÁCTICAS

## ✅ DO's (Haz esto)

1. **Usar nombres descriptivos**
   ```jsx
   ✅ const handleUserDelete = () => {}
   ❌ const del = () => {}
   ```

2. **Comentar código complejo**
   ```jsx
   // Filtrar usuarios activos y ordenar por nombre
   const filtered = users
     .filter(u => u.active)
     .sort((a, b) => a.name.localeCompare(b.name))
   ```

3. **Dividir componentes grandes**
   ```jsx
   ✅ <UserForm /> + <UserList />
   ❌ <UserPage /> (500+ líneas)
   ```

4. **Reutilizar componentes genéricos**
   ```jsx
   ✅ import Table from '../components/common/Table'
   ❌ Copiar código de tabla 10 veces
   ```

5. **Validar datos antes de guardar**
   ```jsx
   if (!formData.email) {
     alert('Email requerido')
     return
   }
   ```

6. **Mostrar confirmaciones antes de eliminar**
   ```jsx
   const confirm = window.confirm('¿Eliminar?')
   if (confirm) { /* eliminar */ }
   ```

## ❌ DON'Ts (No hagas esto)

1. **No guardar passwords en localStorage**
   ```jsx
   ❌ localStorage.setItem('password', '123456')
   ✅ localStorage.setItem('token', 'jwt-token...')
   ```

2. **No mutar estado directamente**
   ```jsx
   ❌ state.name = 'nuevo'
   ✅ setState({...state, name: 'nuevo'})
   ```

3. **No usar alert() para todo**
   ```jsx
   ❌ alert('Guardado')
   ✅ <Notification message="Guardado" />
   ```

4. **No tener componentes gigantes**
   ```jsx
   ❌ <DashboardPage /> (300+ líneas)
   ✅ <StatsSection /> + <TablesSection />
   ```

5. **No usar índices como keys**
   ```jsx
   ❌ {items.map((item, idx) => <div key={idx}>...</div>)}
   ✅ {items.map(item => <div key={item.id}>...</div>)}
   ```

---

---

## 📞 SOPORTE Y RECURSOS

### Recursos Útiles

- **Documentación de React**: https://react.dev
- **Vite**: https://vitejs.dev
- **JavaScript Moderno**: https://javascript.info
- **CSS**: https://css-tricks.com
- **React Hooks**: https://react.dev/reference/react/hooks

### Preguntas Frecuentes

**P: ¿Cómo agrego un nuevo módulo?**
R: Ver sección "Agregar Nueva Página CRUD"

**P: ¿Cómo cambio los estilos?**
R: Modifica archivos `.css` en la carpeta del componente

**P: ¿Dónde se guardan los datos?**
R: Actualmente en `localStorage`. Ver "LocalStorage" en PATRONES COMUNES

**P: ¿Cómo hago que solo admins vean algo?**
R: Ver sección "Sistema de Roles"

**P: ¿Se pierden datos si recargo la página?**
R: No, se guardan en localStorage. Verifica F12 → Application → Local Storage

---

Hecho con ❤️ para estudiantes ADSO

**Versión:** 2.0 Unificada  
**Fecha:** 2024  
**Nivel:** Intermedio ADSO  
