🚀 GUÍA DE INICIO RÁPIDO - ROOMMASTER
=====================================

¡Bienvenido al proyecto RoomMaster! Esta guía te ayudará a empezar en 5 minutos.


PASO 1: INSTALACIÓN DE DEPENDENCIAS
═══════════════════════════════════

1. Abre una terminal en la carpeta del proyecto
2. Ejecuta:
   
   npm install

3. Espera a que se instalen todas las dependencias (axios, react-router, etc.)


PASO 2: CONFIGURACIÓN DE ENTORNO
═════════════════════════════════

1. En la raíz del proyecto, crea un archivo llamado `.env`:

   .env
   ────
   REACT_APP_API_URL=http://localhost:8000/api

2. Guarda el archivo


PASO 3: INICIAR EL SERVIDOR DE DESARROLLO
═══════════════════════════════════════════

1. En la terminal, ejecuta:

   npm run dev

2. Automáticamente se abrirá http://localhost:3000 en tu navegador

3. Verás la Landing Page de RoomMaster


PASO 4: PROBAR LA APLICACIÓN
═════════════════════════════

OPCIÓN A: Modo Demo (Sin Backend)
──────────────────────────────

1. Click en "Registrarse" o "Iniciar sesión"
2. Completa el formulario (cualquier datos)
3. Click en "Registrarse" / "Iniciar Sesión"
4. Accederás al Dashboard

Nota: Los datos se guardan en localStorage, así que si recargas, mantendrá la sesión.


OPCIÓN B: Con Backend Real
────────────────────────

1. Asegúrate de que tu backend esté corriendo en http://localhost:8000
2. En Sidebar.jsx, verifica que los menuItems apunten a las rutas correctas
3. En src/services/index.js, los servicios ya están preparados para llamar a la API
4. Modifica REACT_APP_API_URL en .env si el backend está en otro puerto


PASO 5: EXPLORAR LA ESTRUCTURA
══════════════════════════════

Abre Visual Studio Code y revisa:

1. src/App.jsx
   → Define todas las rutas de la aplicación

2. src/components/common/
   → Componentes reutilizables: Sidebar, Navbar, Card, Modal, Table, etc.

3. src/pages/
   → Las 8 páginas principales por módulo

4. src/services/index.js
   → Todos los servicios de API

5. src/context/AuthContext.jsx
   → Sistema de autenticación global

6. src/styles/global.css
   → Variables de color y estilos base


PASO 6: CREAR UN NUEVO MÓDULO
══════════════════════════════

Ejemplo: Agregar un nuevo módulo llamado "Mantenimiento"

1. Crea la carpeta:
   src/pages/mantenimiento/

2. Crea el archivo:
   src/pages/mantenimiento/MantenimientoPage.jsx

   Con este contenido base:
   
   ┌─────────────────────────────────────────────┐
   │ import DashboardLayout from '../../components/layouts/DashboardLayout'
   │ 
   │ export default function MantenimientoPage() {
   │   return (
   │     <DashboardLayout>
   │       <h1>Mantenimiento</h1>
   │       {/* Tu contenido aquí */}
   │     </DashboardLayout>
   │   )
   │ }
   └─────────────────────────────────────────────┘

3. Agrega la ruta en App.jsx:
   
   import MantenimientoPage from './pages/mantenimiento/MantenimientoPage'
   
   <Route 
     path="/mantenimiento" 
     element={<ProtectedRoute><MantenimientoPage /></ProtectedRoute>}
   />

4. Agrega al menú en Sidebar.jsx:
   
   { label: 'Mantenimiento', path: '/mantenimiento', icon: '🔧' }


PASO 7: AGREGAR UN FORMULARIO CON MODAL
════════════════════════════════════════

Ejemplo en ClientesPage.jsx:

┌──────────────────────────────────────────────────────┐
│ import { useState } from 'react'
│ import Modal from '../../components/common/Modal'
│ 
│ export default function ClientesPage() {
│   const [isModalOpen, setIsModalOpen] = useState(false)
│   const [formData, setFormData] = useState({ 
│     nombre: '', email: '', telefono: '' 
│   })
│ 
│   const handleSave = () => {
│     console.log('Guardando:', formData)
│     setIsModalOpen(false)
│   }
│ 
│   return (
│     <>
│       <button onClick={() => setIsModalOpen(true)}>
│         + Nuevo Cliente
│       </button>
│       
│       <Modal
│         isOpen={isModalOpen}
│         title="Nuevo Cliente"
│         onClose={() => setIsModalOpen(false)}
│         onConfirm={handleSave}
│       >
│         <div className="form-group">
│           <label>Nombre</label>
│           <input 
│             value={formData.nombre}
│             onChange={(e) => setFormData({...formData, nombre: e.target.value})}
│           />
│         </div>
│       </Modal>
│     </>
│   )
│ }
└──────────────────────────────────────────────────────┘


PASO 8: LLAMAR A UNA API
════════════════════════

Ejemplo: Obtener clientes desde el backend

┌──────────────────────────────────────────────────────┐
│ import { useState, useEffect } from 'react'
│ import { clientService } from '../../services'
│ 
│ export default function ClientesPage() {
│   const [clients, setClients] = useState([])
│ 
│   useEffect(() => {
│     clientService.getAll()
│       .then(data => setClients(data))
│       .catch(error => console.error(error))
│   }, [])
│ 
│   return (
│     <table>
│       {clients.map(client => (
│         <tr key={client.id}>
│           <td>{client.nombre}</td>
│           <td>{client.email}</td>
│         </tr>
│       ))}
│     </table>
│   )
│ }
└──────────────────────────────────────────────────────┘


PASO 9: USAR EL CONTEXT DE AUTENTICACIÓN
═════════════════════════════════════════

Para acceder al usuario logueado en cualquier componente:

┌──────────────────────────────────────────────────────┐
│ import { useAuth } from '../../hooks/useAuth'
│ 
│ export default function MiComponente() {
│   const { user, isAuthenticated, logout } = useAuth()
│ 
│   if (!isAuthenticated) {
│     return <p>No autenticado</p>
│   }
│ 
│   return (
│     <>
│       <p>Bienvenido, {user.name}</p>
│       <button onClick={logout}>Cerrar sesión</button>
│     </>
│   )
│ }
└──────────────────────────────────────────────────────┘


COMMANDS ÚTILES
════════════════

npm run dev       → Inicia servidor de desarrollo (Puerto 3000)
npm run build     → Construye para producción
npm run preview   → Previsualiza build de producción


ARCHIVOS IMPORTANTES QUE DEBES CONOCER
════════════════════════════════════════

1. src/App.jsx
   Punto central de rutas

2. src/context/AuthContext.jsx
   Sistema de autenticación

3. src/services/api.js
   Configuración de axios

4. src/services/index.js
   Todos los servicios

5. src/styles/global.css
   Variables de color y estilos base


ESTRUCTURA CSS
═════════════

Cada componente tiene su propio CSS:
- Sidebar.jsx → Sidebar.css
- Card.jsx → Card.css
- Modal.jsx → Modal.css
- Etc.

Las variables de color están en global.css:
--color-primary: #2196F3
--color-primary-dark: #1565c0
--color-success: #4caf50


TROUBLESHOOTING
════════════════

❌ Error: "Cannot find module 'react-router-dom'"
✅ Solución: npm install

❌ Error: "REACT_APP_API_URL is undefined"
✅ Solución: Crea archivo .env con REACT_APP_API_URL

❌ Error: "API connection refused"
✅ Solución: Verifica que backend está corriendo y el puerto es correcto

❌ Las rutas protegidas redirigen a /login
✅ Solución: Inicia sesión o usa datos de demo


PRÓXIMOS PASOS
═══════════════

1. ✅ Proyecto instalado y corriendo
2. Conectar backend real
3. Reemplazar datos mock con API real
4. Agregar validaciones en formularios
5. Implementar manejo de errores mejorado
6. Crear nuevos módulos según requisitos
7. Testing
8. Deploy


SOPORTE
═══════

- Documentación completa: ver README.md
- Ejemplos de código: ver EJEMPLOS_USO.js
- Estructura detallada: ver ESTRUCTURA_PROYECTO.txt
- Configuración: ver CONFIGURACION_ENTORNO.md


═════════════════════════════════════════════════════════════
¡Listo! Ya estás preparado para empezar a desarrollar.
Cualquier duda, revisa los archivos de documentación.
═════════════════════════════════════════════════════════════
