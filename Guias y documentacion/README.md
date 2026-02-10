# RoomMaster - Sistema de Gestión Integral para Hoteles

## 📋 Descripción

RoomMaster es un sistema web administrativo profesional diseñado para optimizar la operación de hoteles. Proporciona herramientas integrales para gestionar estadías, inventario, clientes, facturación y reportes en un único dashboard.

## 🎯 Características Principales

- **Dashboard Inteligente**: Visualización en tiempo real de estadísticas y ocupación
- **Gestión de Estadía**: Control completo de reservas y registros de huéspedes
- **Inventario**: Administración de inventario por habitación
- **Gestión de Clientes**: Base de datos de clientes y contactos
- **Tienda**: Módulo para venta de productos adicionales
- **Reportes**: Análisis detallados de ocupación e ingresos
- **Facturación y Cobro**: Sistema automatizado de facturas y pagos
- **Perfil y Configuración**: Gestión de usuario y preferencias

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── common/              # Componentes reutilizables
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── *.css
│   └── layouts/             # Layouts principales
│       └── DashboardLayout.jsx
├── pages/                   # Páginas por módulo
│   ├── landing/
│   ├── auth/
│   ├── dashboard/
│   ├── gestion-estadia/
│   ├── inventario/
│   ├── clientes/
│   ├── tienda/
│   ├── reportes/
│   ├── facturacion/
│   └── perfil/
├── services/                # Servicios API
│   ├── api.js              # Configuración de Axios
│   └── index.js            # Servicios específicos
├── hooks/                   # Custom hooks
│   └── useAuth.js
├── context/                 # Context API
│   └── AuthContext.jsx
├── styles/                  # Estilos globales
│   └── global.css
├── utils/                   # Funciones utilitarias
├── assets/                  # Imágenes e iconos
│   ├── icons/
│   └── images/
├── App.jsx                  # Componente raíz
└── main.jsx                 # Punto de entrada
```

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 16+ 
- npm o yarn

### Instalación

1. **Clona el repositorio**
```bash
git clone <url-repositorio>
cd roommaster
```

2. **Instala dependencias**
```bash
npm install
```

3. **Configura variables de entorno**
```bash
# Crea archivo .env
REACT_APP_API_URL=http://localhost:8000/api
```

4. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

El aplicativo estará disponible en `http://localhost:3000`

## 📦 Dependencias Principales

- **React 18.2**: Framework UI
- **React Router DOM 6.20**: Enrutamiento
- **Axios 1.6**: Cliente HTTP
- **Vite**: Build tool de siguiente generación

## 🎨 Diseño y Estilos

### Paleta de Colores

- **Primario**: #2196F3 (Azul claro)
- **Primario Oscuro**: #1565c0 (Azul oscuro)
- **Secundario**: #f5f5f5 (Gris claro)
- **Blanco**: #ffffff
- **Texto Principal**: #212121
- **Texto Secundario**: #757575

### Tipografía

- **Inter**: Tipografía principal (body)
- **Poppins**: Tipografía para encabezados

### Componentes Base

- Cards con sombra y hover effects
- Tablas modernas con acciones
- Modales reutilizables
- Sidebar con navegación
- Navbar responsive

## 🔐 Autenticación

El sistema utiliza un contexto de autenticación global (`AuthContext`) que maneja:

- Login/Logout de usuarios
- Persistencia de sesión en localStorage
- Rutas protegidas con `ProtectedRoute`
- Redirección automática a login si no hay sesión

### Ejemplo de Uso

```jsx
import { useAuth } from './hooks/useAuth'

function MiComponente() {
  const { user, isAuthenticated, login, logout } = useAuth()
  // ...
}
```

## 🔌 Integración con API

Todos los servicios se centralizan en `src/services/index.js` usando Axios.

### Ejemplo - Obtener Habitaciones

```javascript
import { roomService } from '@/services'

const [rooms, setRooms] = useState([])

useEffect(() => {
  roomService.getAll()
    .then(data => setRooms(data))
    .catch(error => console.error(error))
}, [])
```

### Configuración de API

El archivo `src/services/api.js` incluye:

- **Base URL**: Configurable vía `.env`
- **Interceptores**: Agregan token JWT automáticamente
- **Manejo de errores**: Redirige a login si 401

## 📝 Convenciones de Código

### Nombres de Carpetas

- **components/**: En minúsculas
- **pages/**: En kebab-case (ej: `gestion-estadia`)
- **services, hooks, context, utils**: En minúsculas

### Nombres de Archivos

- **Componentes React**: PascalCase (`Button.jsx`)
- **Estilos CSS**: MatchComponentName.css
- **Servicios/Hooks**: camelCase (`useAuth.js`)

### Estructura de Componentes

```jsx
import './ComponentName.css'

export default function ComponentName({ prop1, prop2 }) {
  // lógica

  return (
    // JSX
  )
}
```

## 🛠️ Desarrollo de Nuevos Módulos

### 1. Crear página en `src/pages/[modulo]/`

```jsx
import DashboardLayout from '../../components/layouts/DashboardLayout'

export default function NuevoModulo() {
  return (
    <DashboardLayout>
      {/* contenido */}
    </DashboardLayout>
  )
}
```

### 2. Agregar ruta en `App.jsx`

```jsx
<Route 
  path="/nuevo-modulo" 
  element={<ProtectedRoute><NuevoModulo /></ProtectedRoute>}
/>
```

### 3. Agregar al sidebar en `Sidebar.jsx`

```jsx
{ label: 'Nuevo Módulo', path: '/nuevo-modulo', icon: '📦' }
```

### 4. Crear servicio en `src/services/index.js`

```javascript
export const newModuleService = {
  getAll: async () => {
    const response = await api.get('/nuevo-modulo')
    return response.data
  },
  // ... más métodos
}
```

## 📱 Responsividad

El proyecto incluye breakpoints para:

- **Desktop**: 1400px
- **Tablet**: 768px
- **Mobile**: 480px

## 🚢 Deployment

### Build para producción

```bash
npm run build
```

Genera archivos en `dist/`

### Servir localmente

```bash
npm run preview
```

## 📋 Checklist de Desarrollo

- [ ] Instalar Node.js y dependencias
- [ ] Conectar Backend API (cambiar `REACT_APP_API_URL`)
- [ ] Implementar autenticación real
- [ ] Desarrollar servicios API específicos
- [ ] Crear formularios y validaciones
- [ ] Agregar manejo de errores
- [ ] Testing y optimización
- [ ] Deploy en servidor

## 🤝 Contribución

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Commit tus cambios: `git commit -m 'Agrega nueva funcionalidad'`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

## 📄 Licencia

Proyecto desarrollado bajo licencia privada.

## 📞 Soporte

Para soporte o consultas, contacta al equipo de desarrollo.

---

**Última actualización**: Febrero 2026
