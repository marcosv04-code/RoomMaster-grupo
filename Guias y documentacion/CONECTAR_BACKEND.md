═══════════════════════════════════════════════════════════════════════════
                   PRÓXIMO PASO: CONECTAR BACKEND
═══════════════════════════════════════════════════════════════════════════

Ahora que tienes el frontend funcionando, es hora de conectar con tu backend.


PASO 1: ASEGURATE QUE EL BACKEND ESTÁ CORRIENDO
════════════════════════════════════════════════

Tu backend debe estar en uno de estos puertos:
  • http://localhost:8000/api (puerto por defecto)
  • http://localhost:3001/api (si prefieres otro)
  • https://tu-dominio.com/api (en producción)


PASO 2: ACTUALIZA EL ARCHIVO .env
══════════════════════════════════

Edita el archivo .env que creaste:

ANTES:
  REACT_APP_API_URL=http://localhost:8000/api

DESPUÉS (si tu backend está en otro puerto):
  REACT_APP_API_URL=http://localhost:3001/api


PASO 3: VERIFICA LOS ENDPOINTS DEL BACKEND
═══════════════════════════════════════════

Tu backend debe tener estos endpoints:

AUTENTICACIÓN
─────────────
POST /api/auth/login
  Entrada: { email, password }
  Salida: { token, user: { id, name, email, role } }

POST /api/auth/register
  Entrada: { name, email, password }
  Salida: { token, user: {...} }

HABITACIONES (Room/Bedroom)
────────────────────────────
GET /api/habitaciones
  Salida: [{ id, numero, tipo, estado, precio }, ...]

POST /api/habitaciones
  Entrada: { numero, tipo, estado, precio }
  Salida: { id, numero, tipo, estado, precio }

GET /api/habitaciones/:id
PUT /api/habitaciones/:id
DELETE /api/habitaciones/:id

CLIENTES (Customer/Guest)
─────────────────────────
GET /api/clientes
POST /api/clientes
GET /api/clientes/:id
PUT /api/clientes/:id
DELETE /api/clientes/:id

ESTADÍAS (Stay/Booking)
──────────────────────
GET /api/estadias
POST /api/estadias
GET /api/estadias/:id
PUT /api/estadias/:id
DELETE /api/estadias/:id

REPORTES
────────
GET /api/reportes/ocupacion
GET /api/reportes/ingresos
GET /api/reportes/huespedes

FACTURAS
────────
GET /api/facturas
POST /api/facturas
GET /api/facturas/:id


PASO 4: MODIFICA LOS SERVICIOS SI ES NECESARIO
════════════════════════════════════════════════

Si tus endpoints tienen nombres diferentes, edita:
  src/services/index.js

Ejemplo - Si tu endpoint es /api/rooms en lugar de /api/habitaciones:

ANTES:
  export const roomService = {
    getAll: async () => {
      const response = await api.get('/habitaciones')
      return response.data
    },

DESPUÉS:
  export const roomService = {
    getAll: async () => {
      const response = await api.get('/rooms')  // <-- Cambiado
      return response.data
    },


PASO 5: CONFIGURA CORS EN TU BACKEND
═════════════════════════════════════

En desarrollo, tu frontend (localhost:3000) llamará a tu backend.
Asegúrate que el backend permite CORS:

Ejemplo en Express:
  const cors = require('cors');
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

Ejemplo en Django:
  CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
  ]

Ejemplo en PHP/Laravel:
  Usa el paquete laravel-cors


PASO 6: REEMPLAZA DATOS MOCK CON API REAL
═══════════════════════════════════════════

En cada página, cambia los datos simulados por llamadas API reales.

ANTES (Mock):
  const [rooms, setRooms] = useState([
    { id: 1, numero: 101, tipo: 'Doble', ... },
  ])

DESPUÉS (API Real):
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    roomService.getAll()
      .then(data => setRooms(data))
      .catch(error => console.error('Error:', error))
  }, [])


PASO 7: MEJORA EL MANEJO DE ERRORES
════════════════════════════════════

Agrega validaciones y feedback de errores:

const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

const loadRooms = async () => {
  try {
    setLoading(true)
    setError(null)
    const data = await roomService.getAll()
    setRooms(data)
  } catch (err) {
    setError('Error al cargar habitaciones')
    console.error(err)
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  loadRooms()
}, [])

En el JSX:
  {error && <div className="error-message">{error}</div>}
  {loading && <p>Cargando...</p>}
  {!loading && <Table columns={cols} data={rooms} />}


PASO 8: CONFIGURA TOKENS JWT
═════════════════════════════

El frontend ya está configurado para usar tokens JWT.

En tu backend, después del login:
  return {
    token: 'eyJhbGciOiJIUzI1NiIs...',  // Token JWT
    user: {
      id: 1,
      name: 'Usuario',
      email: 'user@example.com',
      role: 'Administrador'
    }
  }

El frontend:
  1. Recibe el token y lo guarda en localStorage
  2. Lo incluye automáticamente en todos los requests
  3. Si recibe 401, redirige a login

Ver: src/services/api.js (interceptores)


PASO 9: PRUEBA LA INTEGRACIÓN
══════════════════════════════

1. Inicia el backend:
   npm run dev  (o el comando de tu proyecto backend)

2. Inicia el frontend:
   npm run dev

3. En browser, abre http://localhost:3000

4. Registra un usuario nuevo

5. Verifica que:
   ✓ El login funciona
   ✓ Se crea el usuario en la DB
   ✓ El token se guarda
   ✓ Las rutas protegidas funcionan
   ✓ El logout limpia los datos

6. En la consola del browser (F12):
   Abre Network tab
   Verifica que los requests van a tu backend
   Verifica que incluyen el header Authorization

7. Carga datos de la API:
   Ve a Dashboard
   Verifica que carga las habitaciones desde /api/habitaciones


PASO 10: CONECTA OTROS MÓDULOS
═══════════════════════════════

Sigue el mismo proceso para cada módulo:

1. Ve a src/pages/[modulo]/[modulo]Page.jsx
2. Reemplaza datos mock por servicios
3. Agrega loading y error handling
4. Prueba en browser


CHECKLIST DE INTEGRACIÓN
═════════════════════════

[ ] Backend corriendo en http://localhost:8000
[ ] CORS configurado en backend
[ ] .env actualizado con URL correcta
[ ] Endpoints verificados
[ ] Servicios api.js tienen rutas correctas
[ ] Login funciona
[ ] Token se guarda en localStorage
[ ] Rutas protegidas funcionan
[ ] Logout limpia datos
[ ] Dashboard carga datos desde API
[ ] Otros módulos cargan datos desde API
[ ] Errores se muestran al usuario
[ ] Console.log no muestra errores CORS


TROUBLESHOOTING
════════════════

❌ Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
✅ Solución: Configura CORS en tu backend

❌ Error: "401 Unauthorized"
✅ Solución: 
   - Verifica que el token se está guardando
   - Verifica que el backend valida tokens correctamente
   - En Network tab, verifica Header "Authorization: Bearer ..."

❌ Error: "404 Not Found"
✅ Solución:
   - Verifica la URL del endpoint en .env
   - Verifica que el backend tiene ese endpoint
   - En Network tab, mira la URL completa

❌ El login no funciona pero muestra "Error al iniciar sesión"
✅ Solución:
   - Revisa la consola (F12) para ver el error real
   - Verifica que el backend retorna { token, user }
   - Prueba el endpoint del backend con Postman

❌ Datos no cargan en Dashboard
✅ Solución:
   - Abre Network tab en DevTools
   - Verifica que el request se envía
   - Verifica que trae datos (no error)
   - Revisa console.log en el componente


ESTRUCTURA DE RESPUESTA ESPERADA
══════════════════════════════════

Login Response:
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "Administrador"
    }
  }

Habitaciones List:
  [
    {
      "id": 1,
      "numero": 101,
      "tipo": "Doble",
      "estado": "Disponible",
      "precio": 120
    },
    ...
  ]

Habitación Single:
  {
    "id": 1,
    "numero": 101,
    "tipo": "Doble",
    "estado": "Disponible",
    "precio": 120
  }


HEADERS ESPERADOS EN REQUESTS
═══════════════════════════════

Todos los requests (excepto login/register) deben incluir:

Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

El frontend lo agrega automáticamente (ver src/services/api.js)


PRÓXIMOS PASOS DESPUÉS DE CONECTAR
═════════════════════════════════════

1. Agregar validaciones en formularios
2. Mejorar UI/UX con animaciones
3. Agregar paginación en tablas
4. Filtros y búsqueda
5. Exportar datos a PDF/Excel
6. Gráficos en reportes
7. Notificaciones (toast/snackbar)
8. Multi-idioma si necesitas


═══════════════════════════════════════════════════════════════════════════
                    ¡Éxito en la integración! 🎉
═══════════════════════════════════════════════════════════════════════════
