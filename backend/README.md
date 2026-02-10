# 🔌 Backend RoomMaster - PHP

Backend simple para conectar el frontend React con la base de datos MySQL.

---

## 📋 Archivos incluidos

```
backend/
├── config.php           ← Conexión a la BD
├── cors.php             ← Configuración de CORS
├── functions.php        ← Funciones reutilizables
├── login.php            ← Autenticación
├── clientes.php         ← CRUD de clientes
├── facturas.php         ← CRUD de facturas
├── productos.php        ← CRUD de productos
├── ventas.php           ← Registro de ventas
├── estadias.php         ← CRUD de estadías
├── reportes.php         ← Reportes y estadísticas
└── README.md            ← Este archivo
```

---

## 🚀 INSTALACIÓN Y USO

### Paso 1: Instalar XAMPP (o WAMP)
1. Descargar de: https://www.apachefriends.org/es/index.html
2. Instalar
3. Iniciar Apache + MySQL

### Paso 2: Copiar archivos
1. Copiar la carpeta `backend/` a:
   - Windows: `C:/xampp/htdocs/roommaster/backend/`
   - O en la raíz del servidor web

### Paso 3: Verificar conexión
1. Editar `config.php` si es necesario (por defecto funciona con XAMPP)
2. Verificar que:
   - Base de datos: `roommaster_db`
   - Usuario: `root`
   - Contraseña: vacía

### Paso 4: Probar un endpoint
Abre en el navegador:
```
http://localhost/roommaster/backend/clientes.php
```

Deberías ver:
```json
{
  "success": true,
  "mensaje": "Clientes obtenidos",
  "datos": [...]
}
```

---

## 📡 ENDPOINTS DISPONIBLES

### 🔐 AUTENTICACIÓN

#### POST Login
```
POST /backend/login.php
Content-Type: application/json

{
  "email": "admin@roommaster.com",
  "contraseña": "admin123"
}

Respuesta:
{
  "success": true,
  "mensaje": "Login exitoso",
  "datos": {
    "token": "...",
    "usuario": {...}
  }
}
```

---

### 👥 CLIENTES

#### GET - Obtener todos los clientes
```
GET /backend/clientes.php
```

#### GET - Obtener un cliente
```
GET /backend/clientes.php?id=1
```

#### POST - Crear cliente
```
POST /backend/clientes.php
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "telefono": "3001234567",
  "documento_identidad": "1234567890",
  "tipo_documento": "cedula",
  "ciudad": "Bogotá"
}
```

#### PUT - Actualizar cliente
```
PUT /backend/clientes.php
Content-Type: application/json

{
  "id": 1,
  "nombre": "Juan García",
  "email": "juan.nuevo@email.com"
}
```

#### DELETE - Eliminar cliente
```
DELETE /backend/clientes.php
Content-Type: application/json

{
  "id": 1
}
```

---

### 💰 FACTURAS

#### GET - Obtener facturas
```
GET /backend/facturas.php
GET /backend/facturas.php?estado=Pagada
```

#### POST - Crear factura
```
POST /backend/facturas.php
Content-Type: application/json

{
  "estadia_id": 1,
  "cliente_id": 1,
  "subtotal": 450.00,
  "impuesto": 50.00,
  "total": 500.00,
  "estado": "Pendiente"
}

Respuesta:
{
  "success": true,
  "datos": {
    "numero_factura": "FAC-001"
  }
}
```

#### PUT - Actualizar factura
```
PUT /backend/facturas.php
Content-Type: application/json

{
  "id": 1,
  "estado": "Pagada",
  "metodo_pago": "tarjeta"
}
```

---

### 🛍️ PRODUCTOS

#### GET - Obtener productos
```
GET /backend/productos.php
GET /backend/productos.php?categoria=bebidas
```

#### POST - Crear producto
```
POST /backend/productos.php
Content-Type: application/json

{
  "nombre": "Café Expreso",
  "precio": 5.00,
  "categoria": "bebidas",
  "descripcion": "Café recién hecho",
  "stock": 50
}
```

#### PUT - Actualizar producto
```
PUT /backend/productos.php
Content-Type: application/json

{
  "id": 1,
  "nombre": "Café Premium",
  "precio": 6.00,
  "stock": 40
}
```

#### DELETE - Eliminar producto
```
DELETE /backend/productos.php
Content-Type: application/json

{
  "id": 1
}
```

---

### 📦 VENTAS

#### GET - Obtener ventas
```
GET /backend/ventas.php
GET /backend/ventas.php?estadia_id=1
```

#### POST - Registrar venta
```
POST /backend/ventas.php
Content-Type: application/json

{
  "estadia_id": 1,
  "producto_id": 1,
  "cantidad": 2,
  "factura_id": 1,
  "huésped": "Juan Pérez"
}

Nota: El stock se rebaja automáticamente
```

---

### 🏨 ESTADÍAS

#### GET - Obtener estadías
```
GET /backend/estadias.php
GET /backend/estadias.php?estado=activa
```

#### POST - Crear estadía
```
POST /backend/estadias.php
Content-Type: application/json

{
  "cliente_id": 1,
  "habitacion_id": 1,
  "fecha_entrada": "2026-02-10",
  "fecha_salida": "2026-02-15",
  "numero_huespedes": 2
}

Nota: La habitación se marca automáticamente como ocupada
```

#### PUT - Actualizar estadía
```
PUT /backend/estadias.php
Content-Type: application/json

{
  "id": 1,
  "estado": "completada",
  "precio_total": 500.00
}

Nota: Al completar, la habitación se marca como disponible
```

---

### 📊 REPORTES

#### GET - Obtener reportes
```
GET /backend/reportes.php
GET /backend/reportes.php?tipo=general
GET /backend/reportes.php?tipo=ingresos
GET /backend/reportes.php?tipo=ocupacion
GET /backend/reportes.php?tipo=productos
GET /backend/reportes.php?tipo=clientes
```

Respuesta ejemplo:
```json
{
  "success": true,
  "datos": {
    "dashboard": {
      "huespedes_actuales": 2,
      "habitaciones_disponibles": 3,
      "ingresos_mes": 2450.00,
      "pendiente_cobro": 320.00
    },
    "ingresos_por_estado": [...]
  }
}
```

---

## 🔗 CONECTAR CON REACT

En tu archivo `api.js` del frontend:

```javascript
import axios from 'axios'

const API_BASE_URL = 'http://localhost/roommaster/backend'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Ejemplo de uso
export async function obtenerClientes() {
  const response = await api.get('/clientes.php')
  return response.data
}

export async function crearCliente(datos) {
  const response = await api.post('/clientes.php', datos)
  return response.data
}

export default api
```

---

## ⚙️ ESTRUCTURA DE RESPUESTAS

Todas las respuestas son JSON:

### Respuesta exitosa
```json
{
  "success": true,
  "mensaje": "Descripción de lo que pasó",
  "datos": {...}
}
```

### Respuesta con error
```json
{
  "success": false,
  "mensaje": "Descripción del error",
  "datos": null
}
```

---

## 🔒 SEGURIDAD

⚠️ **Importante para producción:**

1. **Cambiar credenciales:**
   ```php
   define('DB_USER', 'nuevo_usuario');
   define('DB_PASS', 'contraseña_segura');
   ```

2. **Usar prepared statements** - El código actual tiene protección básica pero en producción usar:
   ```php
   $stmt = $conexion->prepare("SELECT * FROM clientes WHERE id = ?");
   $stmt->bind_param("i", $id);
   ```

3. **Validar y sanitizar** todos los inputs

4. **Usar HTTPS** en producción

5. **Implementar autenticación JWT** en lugar de tokens simples

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Error de conexión a la base de datos"
- ✅ Verificar que MySQL está corriendo
- ✅ Verificar credenciales en `config.php`
- ✅ Verificar que la base de datos `roommaster_db` existe

### Error: "CORS error"
- ✅ Verificar que `cors.php` se incluye
- ✅ Verificar que `Access-Control-Allow-Origin: *` está en headers

### Error: "404 Not Found"
- ✅ Verificar la ruta del archivo
- ✅ Verificar que los archivos están en la carpeta correcta

### Error: "Stock insuficiente"
- ✅ Reducir la cantidad de venta
- ✅ Verificar inventario en BD

---

## 📚 PRÓXIMOS PASOS

1. **Conectar con React** - Usar los endpoints desde el frontend
2. **Añadir autenticación JWT** - Mejorar seguridad
3. **Implementar roles** - Admin, gerente, recepcionista
4. **Añadir validaciones** - Más completas
5. **Crear logs** - Auditoría de operaciones

---

## 🎓 PARA ESTUDIANTES SENA

Este backend es:
- ✅ Simple y fácil de entender
- ✅ Sin dependencias complicadas
- ✅ Solo PHP puro
- ✅ Comentado line by line
- ✅ Listo para producción (con ajustes de seguridad)

**Aprende cómo funciona, luego mejóralo** 💪

---

Hecho en Colombia 🇨🇴
