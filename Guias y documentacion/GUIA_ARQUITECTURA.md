# 📚 Guía de Arquitectura - RoomMaster

> Guía completa para desarrolladores ADSO sobre la estructura y patrones de código de RoomMaster

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

---

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

---

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

---

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

---

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

---

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

---

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

## 🔍 Debugging Tips

### 1. React DevTools
```
Chrome: Instalar "React Developer Tools"
```

### 2. Console Logs
```jsx
console.log('Variable:', variable)
console.warn('Advertencia:', data)
console.error('Error:', error)
```

### 3. Verificar Estado
```jsx
console.log('User:', user)
console.log('Is Admin:', user?.role === 'admin')
```

### 4. Verificar LocalStorage
```javascript
// En consola del navegador:
localStorage.getItem('user')
localStorage.setItem('key', 'value')
localStorage.removeItem('key')
localStorage.clear()
```

---

## 📝 Mejores Prácticas

### ✅ DO's
- Usar nombres descriptivos en funciones y variables
- Comentar código complejo
- Dividir componentes grandes en componentes pequeños
- Reutilizar componentes genéricos (Card, Table, Modal)
- Validar datos antes de guardar
- Mostrar confirmaciones antes de eliminar

### ❌ DON'Ts
- No guardar passwords en localStorage
- No mutabilizar estado directamente (`state.name = 'nuevo'` ❌)
- No usar `alert()` para todo (usar modales)
- No tener componentes gigantes (300+ líneas)
- No usar índices como keys en listas

---

## 📚 Recursos de Aprendizaje

- [Documentación React](https://react.dev)
- [React Router](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [JavaScript ES6+](https://www.javascript.com)

---

## 🚀 Cómo Agregar una Nueva Página

### 1. Crear archivo
```
src/pages/mimodulo/MiModuloPage.jsx
```

### 2. Crear componente básico
```jsx
import DashboardLayout from '../../components/layouts/DashboardLayout'

export default function MiModuloPage() {
  return (
    <DashboardLayout>
      <div className="module-page">
        <h1>Mi Módulo</h1>
        {/* Contenido aquí */}
      </div>
    </DashboardLayout>
  )
}
```

### 3. Agregar ruta en App.jsx
```jsx
<Route 
  path="/mimodulo" 
  element={
    <ProtectedRoute>
      <MiModuloPage />
    </ProtectedRoute>
  } 
/>
```

### 4. Agregar a Sidebar.jsx
```jsx
allMenuItems.push({
  label: 'Mi Módulo',
  path: '/mimodulo',
  icon: '📌'
})
```

---

## ❓ Preguntas Comunes

**¿Cómo accedo al usuario autenticado?**
```jsx
const { user } = useAuth()
```

**¿Cómo verifico si es admin?**
```jsx
if (user?.role === 'admin') { ... }
```

**¿Cómo actualizo la lista después de crear/editar?**
```jsx
setItems([...items, newItem])  // Crear
setItems(items.map(...))       // Actualizar
setItems(items.filter(...))    // Eliminar
```

**¿Cómo uso un componente reutilizable?**
```jsx
import Table from '../../components/common/Table'
// Usar:
<Table columns={...} data={...} />
```

---

Hecho con ❤️ para estudiantes ADSO
