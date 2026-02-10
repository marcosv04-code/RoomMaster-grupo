# Configuración de Ambiente - RoomMaster

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# App Name
REACT_APP_NAME=RoomMaster

# Environment
REACT_APP_ENV=development
```

## Archivos de Configuración por Ambiente

### .env (Desarrollo Local)
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

### .env.staging (Staging)
```
REACT_APP_API_URL=https://api-staging.roommaster.com/api
REACT_APP_ENV=staging
```

### .env.production (Producción)
```
REACT_APP_API_URL=https://api.roommaster.com/api
REACT_APP_ENV=production
```

## Cómo Acceder a Variables de Entorno

Desde cualquier archivo React:

```javascript
const apiUrl = import.meta.env.VITE_API_URL
const environment = import.meta.env.MODE // 'development' o 'production'
```

## Configuración del Backend

El backend debe estar ejecutándose en:

**Desarrollo**: `http://localhost:8000`

### Endpoints Esperados

#### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

#### Habitaciones
- `GET /api/habitaciones` - Obtener todas
- `POST /api/habitaciones` - Crear nueva
- `PUT /api/habitaciones/:id` - Actualizar
- `DELETE /api/habitaciones/:id` - Eliminar

#### Clientes
- `GET /api/clientes` - Listar
- `POST /api/clientes` - Crear
- `PUT /api/clientes/:id` - Actualizar
- `DELETE /api/clientes/:id` - Eliminar

#### Estadías
- `GET /api/estadias` - Listar
- `POST /api/estadias` - Crear
- `PUT /api/estadias/:id` - Actualizar
- `DELETE /api/estadias/:id` - Eliminar

#### Reportes
- `GET /api/reportes/ocupacion` - Ocupación
- `GET /api/reportes/ingresos` - Ingresos
- `GET /api/reportes/huespedes` - Huéspedes

#### Facturas
- `GET /api/facturas` - Listar
- `POST /api/facturas` - Crear
- `GET /api/facturas/:id` - Obtener detalle

## Headers Requeridos

Todas las solicitudes deben incluir:

```
Content-Type: application/json
Authorization: Bearer <token>
```

El token se agrega automáticamente vía interceptor en `src/services/api.js`.

## Respuesta Esperada de Autenticación

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "role": "Administrador"
  }
}
```

## Inicio Local Completo

1. **Terminal 1 - Backend**
```bash
cd backend
npm install
npm run dev
# Backend corriendo en http://localhost:8000
```

2. **Terminal 2 - Frontend**
```bash
cd roommaster
npm install
npm run dev
# Frontend corriendo en http://localhost:3000
```

3. **Acceder a la aplicación**
Abre `http://localhost:3000` en tu navegador

## Credenciales de Prueba

Usuario Demo (después de conectar backend):
```
Email: demo@roommaster.com
Password: Demo123456!
```

## Troubleshooting

### Error: "Cannot find module 'axios'"
```bash
npm install axios
```

### Error: "API connection refused"
- Verifica que el backend está corriendo
- Comprueba la variable `REACT_APP_API_URL` en `.env`
- Revisa CORS en el backend

### Sesión se cierra al recargar
- Verifica que el token se está guardando en localStorage
- Comprueba que el backend devuelve un token válido

### Estilos no cargan correctamente
- Asegúrate de que los archivos CSS están en la carpeta correcta
- Verifica las rutas en los imports: `./ComponentName.css`

## Notas de Seguridad

- ✅ NO commites archivos `.env` (está en `.gitignore`)
- ✅ Usa HTTPS en producción
- ✅ Implementa CORS correctamente en backend
- ✅ Valida tokens JWT en el backend
- ✅ Usa variables de entorno para URLs sensibles
