# 📖 GUÍA MAESTRA - RoomMaster Completo

> **Para estudiantes SENA. Todo lo que necesitas en UN solo documento.**

---

## 🎯 ÍNDICE RÁPIDO

**Si tienes 5 minutos:** Ve a "CONEXIÓN RÁPIDA" (abajo)
**Si tienes 30 minutos:** Lee todo desde "INICIO"
**Si necesitas aprender:** Lee en este orden: Base de Datos → Backend → Frontend

---

## 📍 PARTE 1: BASE DE DATOS (Concepto Simple)

### ¿Qué es la Base de Datos?

Es un archivo Excel gigante donde guardamos toda la información del hotel:
- 👥 Clientes (nombre, email, teléfono)
- 🏠 Habitaciones (número, tipo, precio)
- 📋 Estadías (quién se hospeda, cuándo entra, cuándo sale)
- 💰 Facturas (qué le cobramos)
- 📦 Productos (bebidas, snacks, servicios)

### Cómo Funciona (Paso a Paso)

#### Paso 1: Ir a phpMyAdmin
Tu navegador → `http://localhost/phpmyadmin`

#### Paso 2: Ejecutar el SQL

**Opción A - Copiar y Pegar (MÁS FÁCIL):**
1. Abre el archivo: `BD ROOMMASTER/roommaster_database.sql`
2. Copia TODO el contenido (Ctrl+A, Ctrl+C)
3. En phpMyAdmin, pestaña "SQL"
4. Pega el código (Ctrl+V)
5. Presiona "Ejecutar"
6. Espera que termine ✓

**Opción B - Importar Archivo:**
1. En phpMyAdmin, pestaña "Importar"
2. Selecciona el archivo `.sql`
3. Presiona "Ejecutar"

**¿Listo?** Verás en la izquierda: carpeta `roommaster_db` con 9 tablas

#### Paso 3: Ver la Estructura

Haz click en la tabla, pestaña "Estructura":
```
Verás las columnas:
- id (número único automático)
- nombre
- email
- teléfono
- etc...
```

#### Paso 4: Ver los Datos

Pestaña "Examinar":
```
Verás filas como:
ID | Nombre      | Email               | Teléfono
1  | Admin Hotel | admin@roommaster.com| 3001234567
2  | Pedro Gómez | pedro@email.com     | 3009876543
```

### Las 9 Tablas Explicadas (en 30 segundos cada una)

| Tabla | Para Qué | Ejemplo |
|-------|----------|---------|
| **usuarios** | Logins (admin, recepcionista) | admin@roommaster.com / admin123 |
| **clientes** | Datos de huéspedes | Juan Pérez, juan@email.com, 3001111111 |
| **habitaciones** | Las rooms (101, 102, etc) | #101, tipo: simple, $50 |
| **estadias** | Reservaciones (entrada/salida) | Juan en #101 del 10 al 15 feb |
| **facturas** | Recibos de pago | FAC-001, Juan, $500, estado: Pagada |
| **productos** | Tienda del hotel | Café $2, Jugo $3, WiFi $5 |
| **ventas** | Lo que compraron en la tienda | Juan compró 2 cafés = $4 |
| **inventario** | Stock (cuántos hay) | Café: 50 unidades |
| **actividades** | Log de todo (para auditoría) | Usuario admin creó cliente, 10/02/2026 14:30 |

---

## 🔗 PARTE 2: BACKEND PHP (API Simple)

### ¿Qué es?

Es un "traductor" entre la BD y React:
- React pide: "Dame todos los clientes"
- Backend traduce: "Busca en la BD tabla clientes"
- Backend responde: "Aquí están: [Juan, Pedro, María]"

### Dónde Están los Archivos

```
C:\xampp\htdocs\roommaster\backend\
├── config.php           (conexión a BD)
├── cors.php             (permite comunicación)
├── functions.php        (funciones re-usables)
├── login.php            (autenticación)
├── clientes.php         (CRUD clientes)
├── facturas.php         (CRUD facturas)
├── productos.php        (CRUD productos)
├── ventas.php           (registrar compras)
├── estadias.php         (reservaciones)
└── reportes.php         (estadísticas)
```

### Los 7 Endpoints (= URLs Que React Usa)

```javascript
// 1. LOGIN
POST http://localhost/roommaster/backend/login.php
Envía: { email, contraseña }
Recibe: { token, usuario }

// 2. CLIENTES
GET http://localhost/roommaster/backend/clientes.php?id=1
POST http://localhost/roommaster/backend/clientes.php
PUT http://localhost/roommaster/backend/clientes.php
DELETE http://localhost/roommaster/backend/clientes.php

// 3. FACTURAS
GET http://localhost/roommaster/backend/facturas.php?estado=Pendiente
POST http://localhost/roommaster/backend/facturas.php
PUT http://localhost/roommaster/backend/facturas.php

// 4. PRODUCTOS
GET http://localhost/roommaster/backend/productos.php
POST http://localhost/roommaster/backend/productos.php
PUT http://localhost/roommaster/backend/productos.php
DELETE http://localhost/roommaster/backend/productos.php

// 5. VENTAS
GET http://localhost/roommaster/backend/ventas.php?estadia_id=1
POST http://localhost/roommaster/backend/ventas.php

// 6. ESTADÍAS
GET http://localhost/roommaster/backend/estadias.php?estado=activa
POST http://localhost/roommaster/backend/estadias.php
PUT http://localhost/roommaster/backend/estadias.php

// 7. REPORTES
GET http://localhost/roommaster/backend/reportes.php?tipo=dashboard
```

### Cómo Funciona 1 Endpoint Completo: CLIENTES

**Archivo: `backend/clientes.php`**

```php
<?php
// Conexión a BD
require_once 'config.php';
require_once 'cors.php';

// Obtener método HTTP (GET, POST, PUT, DELETE)
$metodo = $_SERVER['REQUEST_METHOD'];

// Si piden GET (traer datos)
if ($metodo === 'GET') {
    $sql = "SELECT * FROM clientes";
    $result = mysqli_query($conexion, $sql);
    $clientes = mysqli_fetch_all($result, MYSQLI_ASSOC);
    
    echo json_encode([
        'success' => true,
        'datos' => $clientes
    ]);
}

// Si piden POST (crear nuevo)
else if ($metodo === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    
    $nombre = $datos['nombre'];
    $email = $datos['email'];
    $telefono = $datos['telefono'];
    
    $sql = "INSERT INTO clientes (nombre, email, telefono) 
            VALUES ('$nombre', '$email', '$telefono')";
    
    if (mysqli_query($conexion, $sql)) {
        echo json_encode([
            'success' => true,
            'mensaje' => 'Cliente creado'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'mensaje' => 'Error: ' . mysqli_error($conexion)
        ]);
    }
}
?>
```

**Uso desde React:**
```javascript
// Traer todos
fetch('http://localhost/roommaster/backend/clientes.php')
    .then(r => r.json())
    .then(d => console.log(d.datos)) // Aquí estén los clientes

// Crear nuevo
fetch('http://localhost/roommaster/backend/clientes.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        nombre: 'María García',
        email: 'maria@email.com',
        telefono: '3009999999'
    })
})
    .then(r => r.json())
    .then(d => console.log(d.mensaje)) // "Cliente creado"
```

---

## 💻 PARTE 3: REACT FRONTEND (Conexión Simple)

### Ubicación del Archivo

```
src/services/api.js ← AQUÍ ES
```

### Estructura Simple

```javascript
// 1. Configurar URL del backend
const API = 'http://localhost/roommaster/backend';

// 2. Crear funciones para cada operación
async function obtenerClientes() {
    const res = await fetch(`${API}/clientes.php`);
    const datos = await res.json();
    return datos.datos; // Retorna array de clientes
}

// 3. Usar en componentes
import { obtenerClientes } from './services/api.js';

export function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    
    useEffect(() => {
        obtenerClientes().then(setClientes);
    }, []);
    
    return (
        <div>
            {clientes.map(c => <p>{c.nombre}</p>)}
        </div>
    );
}
```

---

## 🚀 CONEXIÓN RÁPIDA (5 minutos)

### PASO 1: Crear Base de Datos (1 min)

```
1. phpMyAdmin: http://localhost/phpmyadmin
2. Pestaña SQL
3. Copia + Pega contenido de: BD ROOMMASTER/roommaster_database.sql
4. Presiona Ejecutar
5. ✓ Listo
```

### PASO 2: Copiar Backend (1 min)

```
1. Carpeta: C:\xampp\htdocs\roommaster\backend\
2. Aquí deben estar los 11 archivos .php
3. Si no existe la ruta, crea: htdocs/roommaster/backend/
4. ✓ Listo
```

### PASO 3: Actualizar React (1 min)

Abre `src/services/api.js` en tu proyecto React.

En la línea que dice:
```javascript
const API_BASE_URL = 'http://localhost/roommaster/backend';
```

¿Está así? ✓ Si no, cámbialo.

### PASO 4: Test (2 min)

**Verificar Backend:**
```
Navegador: http://localhost/roommaster/backend/clientes.php
¿Ves JSON? ✓
```

**Verificar React:**
```
DevTools Console (F12):

fetch('http://localhost/roommaster/backend/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@roommaster.com',
        contraseña: 'admin123'
    })
})
.then(r => r.json())
.then(d => console.log(d));

¿Ves token? ✓
```

✅ **¡LISTO! Todo funciona**

---

## 📝 EJEMPLOS PRÁCTICOS

### Ejemplo 1: Obtener Clientes en React

```javascript
import { useState, useEffect } from 'react';

export function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    
    useEffect(() => {
        // Cuando carga la página, traer clientes
        fetch('http://localhost/roommaster/backend/clientes.php')
            .then(res => res.json())
            .then(data => setClientes(data.datos))
            .catch(err => console.error(err));
    }, []);
    
    return (
        <div>
            <h1>Clientes ({clientes.length})</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(cliente => (
                        <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefono}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

### Ejemplo 2: Crear Nuevo Cliente

```javascript
export function NuevoClienteForm() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const res = await fetch('http://localhost/roommaster/backend/clientes.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, telefono })
        });
        
        const data = await res.json();
        
        if (data.success) {
            alert('✓ Cliente creado!');
            // Limpiar formulario
            setNombre('');
            setEmail('');
            setTelefono('');
        } else {
            alert('✗ Error: ' + data.mensaje);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
            <input 
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input 
                type="tel" 
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
            />
            <button type="submit">Crear Cliente</button>
        </form>
    );
}
```

### Ejemplo 3: Login

```javascript
export function LoginPage() {
    const [email, setEmail] = useState('admin@roommaster.com');
    const [contraseña, setContraseña] = useState('admin123');
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        const res = await fetch('http://localhost/roommaster/backend/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contraseña })
        });
        
        const data = await res.json();
        
        if (data.success) {
            // Guardar token y usuario
            localStorage.setItem('token', data.datos.token);
            localStorage.setItem('usuario', JSON.stringify(data.datos.usuario));
            alert('✓ Login exitoso!');
            // Redireccionar a dashboard
        } else {
            alert('✗ Error: ' + data.mensaje);
        }
    };
    
    return (
        <form onSubmit={handleLogin}>
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password" 
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
            />
            <button type="submit">Ingresar</button>
        </form>
    );
}
```

### Ejemplo 4: Obtener Facturas Pendientes

```javascript
export function FacturasPage() {
    const [facturas, setFacturas] = useState([]);
    
    useEffect(() => {
        // Traer solo facturas pendientes
        fetch('http://localhost/roommaster/backend/facturas.php?estado=Pendiente')
            .then(res => res.json())
            .then(data => setFacturas(data.datos));
    }, []);
    
    return (
        <div>
            <h1>Facturas Pendientes</h1>
            {facturas.map(f => (
                <div key={f.id}>
                    <p>{f.numero_factura}</p>
                    <p>Cliente: {f.cliente_nombre}</p>
                    <p>Total: ${f.total}</p>
                    <button>Pagar</button>
                </div>
            ))}
        </div>
    );
}
```

---

## 🐛 PROBLEMAS Y SOLUCIONES

### ❌ Error: "CORS policy blocked"

**Causa:** React no puede hablar con PHP

**Solución:**
```
1. Verifica que todos los archivos .php tienen esto arriba:
   require_once 'cors.php';
   
2. Si no lo tienen, agrégalo
```

### ❌ Error: "404 Not Found"

**Causa:** El archivo PHP no está donde React lo busca

**Solución:**
```
1. Verifica que existe: C:\xampp\htdocs\roommaster\backend\
2. Verifica que en src/services/api.js está:
   const API = 'http://localhost/roommaster/backend';
3. Verifica que reemplazaste /tuCarpeta/ si copiastes en otra ruta
```

### ❌ Error: "Database connection failed"

**Causa:** BD no existe o contraseña incorrecta

**Solución:**
```
1. Abre phpMyAdmin
2. Verifica que existe: roommaster_db
3. Si no existe, ejecuta el SQL en phpMyAdmin
4. En config.php verifica:
   - DB_HOST: localhost
   - DB_USER: root
   - DB_PASS: (vacía)
   - DB_NAME: roommaster_db
```

### ❌ Error: "Token inválido"

**Causa:** Session expirada o no guardó token

**Solución:**
```javascript
// Limpia y recarga
localStorage.clear();
window.location.reload();

// Luego haz login de nuevo
```

### ❌ No ve cambios en React

**Causa:** Caché del navegador

**Solución:**
```
1. Ctrl+Shift+Delete (limpiar caché)
2. F5 (recargar)
3. Ctrl+Shift+R (hard refresh)
```

---

## 📊 DATOS DE PRUEBA

**Usuario para Login:**
```
Email: admin@roommaster.com
Contraseña: admin123
```

**Clientes de Ejemplo:**
```
1. Pedro García - pedro@email.com - 3001111111
2. María López - maria@email.com - 3002222222
3. Juan Rodríguez - juan@email.com - 3003333333
```

**Productos en Tienda:**
```
Café - $2
Jugo - $3
Agua - $1
WiFi 24h - $5
```

---

## 🎯 PRÓXIMOS PASOS

### Para conectar cada página:

1. **LoginPage.jsx** → Usa el Ejemplo 3 de arriba
2. **ClientesPage.jsx** → Usa Ejemplo 1
3. **FacturacionPage.jsx** → Usa Ejemplo 4
4. **TiendaPage.jsx** → Similar a ejemplo 1 pero en `/productos.php`
5. **DashboardPage.jsx** → `/reportes.php?tipo=dashboard`

### Patrón general (en todas las páginas):

```javascript
import { useState, useEffect } from 'react';

export function MiPagina() {
    const [datos, setDatos] = useState([]);
    
    useEffect(() => {
        // Traer datos cuando carga
        fetch('http://localhost/roommaster/backend/MI_ENDPOINT.php')
            .then(res => res.json())
            .then(data => setDatos(data.datos));
    }, []);
    
    return (
        <div>
            {datos.map(item => (
                <div key={item.id}>{item.nombre}</div>
            ))}
        </div>
    );
}
```

---

## ✅ CHECKLIST FINAL

Antes de decir que está listo, verifica:

- [ ] Base de datos creada en phpMyAdmin (ves `roommaster_db`)
- [ ] Carpeta `/backend/` en `C:\xampp\htdocs\roommaster\backend\`
- [ ] XAMPP corriendo (Apache + MySQL verde)
- [ ] `http://localhost/roommaster/backend/clientes.php` devuelve JSON
- [ ] `src/services/api.js` tiene URL correcta (sin tuCarpeta/)
- [ ] React en `localhost:3002`
- [ ] Test de login en console funciona
- [ ] ¡SIN ERRORES CORS!

Si todo está ✓ **¡Estás listo!**

---

## 📞 REFERENCIAS RÁPIDAS

| Necesito... | Archivo | Línea |
|------------|---------|-------|
| Ejecutar BD | `BD ROOMMASTER/roommaster_database.sql` | Copiar todo |
| Cambiar URL | `src/services/api.js` | Buscar `API_BASE_URL` |
| Ver estructura BD | phpMyAdmin | Pestaña "Estructura" |
| Traer clientes | Endpoint | `GET /clientes.php` |
| Crear cliente | Endpoint | `POST /clientes.php` |
| Crear factura | Endpoint | `POST /facturas.php` |
| Ver facturas | Endpoint | `GET /facturas.php?estado=Pendiente` |

---

## 🎓 LO QUE APRENDISTE

✅ Qué es una base de datos (tablas con filas y columnas)
✅ Cómo crear una BD desde SQL
✅ Qué es un backend (traductor entre BD y frontend)
✅ Cómo funciona un endpoint (GET, POST, PUT, DELETE)
✅ Cómo conectar React con PHP
✅ Cómo hacer un CRUD (Create, Read, Update, Delete)
✅ Cómo manejar errores

**¡Felicidades! Ahora eres desarrollador Full Stack** 🚀

---

**Última actualización:** Febrero 2026
**Para:** Estudiantes SENA
**Nivel:** Básico → Intermedio
**Versión:** 1.0
