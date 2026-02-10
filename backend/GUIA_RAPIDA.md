# ⚡ GUÍA RÁPIDA: Conectar Backend PHP con React

## 🎯 Objetivo
Conectar el frontend React en `localhost:3002` con el backend PHP en `localhost/roommaster/backend`

---

## ✅ PASO 1: Verificar que el Backend Existe

### 1.1 Ubica la carpeta del proyecto
```
C:\xampp\htdocs\roommaster\backend\
```

Aquí deben estar estos archivos (ya creados):
- `config.php` ✓
- `cors.php` ✓
- `functions.php` ✓
- `login.php` ✓
- `clientes.php` ✓
- `facturas.php` ✓
- `productos.php` ✓
- `ventas.php` ✓
- `estadias.php` ✓
- `reportes.php` ✓
- `README.md` ✓

### 1.2 Prueba que funciona el backend
Abre en tu navegador:
```
http://localhost/roommaster/backend/clientes.php
```

Debes ver una respuesta JSON así:
```json
{
  "success": true,
  "mensaje": "Clientes obtenidos correctamente",
  "datos": [...]
}
```

Si NO ves esto:
- [ ] Verifica que XAMPP está corriendo (Apache + MySQL)
- [ ] Verifica que la carpeta está en `C:\xampp\htdocs\`
- [ ] Verifica que la base de datos existe: `http://localhost/phpmyadmin`

---

## ✅ PASO 2: Conectar React

### 2.1 Actualizar URL del API

Abre: `src/services/api.js`

Verifica que la URL sea correcta según TU ruta:

```javascript
// Si copiaste en: C:/xampp/htdocs/roommaster/
const API_BASE_URL = 'http://localhost/roommaster/backend';

// Si copiaste en otra ruta, cambia esto:
// const API_BASE_URL = 'http://localhost/tuCarpeta/backend';
```

### 2.2 Usar las funciones en tus componentes

Ejemplo en **LoginPage.jsx**:

```javascript
import { authService } from '../services/api';

export function LoginPage() {
    const handleLogin = async (email, contraseña) => {
        try {
            const response = await authService.login(email, contraseña);
            console.log('Login exitoso:', response.data);
            localStorage.setItem('usuario', JSON.stringify(response.data.datos.usuario));
            // Redirigir a dashboard
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
}
```

Ejemplo en **ClientesPage.jsx**:

```javascript
import { useState, useEffect } from 'react';
import { clientesService } from '../services/api';

export function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    
    useEffect(() => {
        cargarClientes();
    }, []);
    
    async function cargarClientes() {
        try {
            const response = await clientesService.obtener();
            setClientes(response.data.datos);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    
    async function crear(nombre, email, telefono) {
        try {
            await clientesService.crear({ nombre, email, telefono });
            cargarClientes(); // Recargar lista
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}
```

Ejemplo en **FacturacionPage.jsx**:

```javascript
import { facturasService } from '../services/api';

export function FacturacionPage() {
    useEffect(() => {
        facturasService.obtener('Pendiente')
            .then(res => console.log(res.data.datos));
    }, []);
}
```

---

## 🧪 TEST RÁPIDO

Abre DevTools en tu navegador (F12) y en la consola ejecuta:

```javascript
// Test 1: Verificar que puedes contactar el backend
fetch('http://localhost/roommaster/backend/clientes.php')
    .then(r => r.json())
    .then(d => console.log('Backend funciona:', d))
    .catch(e => console.log('Error:', e));

// Test 2: Login
fetch('http://localhost/roommaster/backend/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@roommaster.com',
        contraseña: 'admin123'
    })
})
    .then(r => r.json())
    .then(d => console.log('Login:', d))
    .catch(e => console.log('Error:', e));
```

Si ves respuestas JSON = ✅ Conexión está bien

---

## 📚 Servicios Disponibles

Todos importables desde `src/services/api`:

```javascript
// Autenticación
import { authService } from '../services/api';
authService.login(email, contraseña)
authService.logout()

// Clientes
import { clientesService } from '../services/api';
clientesService.obtener()           // GET todos
clientesService.obtenerPorId(id)    // GET por ID
clientesService.crear(datos)        // POST
clientesService.actualizar(id, datos)  // PUT
clientesService.eliminar(id)        // DELETE

// Facturas
import { facturasService } from '../services/api';
facturasService.obtener(estado)     // GET con filtro
facturasService.crear(datos)        // POST
facturasService.marcarPagada(id)    // PUT

// Productos
import { productosService } from '../services/api';
productosService.obtener(categoria)
productosService.crear(datos)
productosService.actualizar(id, datos)

// Ventas
import { ventasService } from '../services/api';
ventasService.obtener(estadia_id)
ventasService.registrar(datos)

// Estadías
import { stadasService } from '../services/api';
stadasService.obtener(estado)
stadasService.crear(datos)
stadasService.completar(id)

// Reportes
import { reportesService } from '../services/api';
reportesService.getDashboard()
reportesService.getIngresos()
```

---

## ⚠️ Errores Comunes

### ❌ CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solución:** Verifica que todos los archivos `.php` tengan:
```php
require_once 'cors.php';
```
al inicio

### ❌ 404 Not Found
```
Failed to load resource: the server responded with a status of 404
```
**Solución:** 
- Verifica la URL en `api.js`
- Verifica que los archivos están en `htdocs`
- Reinicia XAMPP

### ❌ 500 Internal Server Error
**Solución:**
- Verifica que la BD existe: `http://localhost/phpmyadmin`
- Verifica credenciales en `config.php`
- Revisa los logs de PHP: `C:\xampp\apache\logs\error.log`

### ❌ Connection Refused
**Solución:**
- Inicia XAMPP (Apache + MySQL)
- Verifica puertos (Apache: 80, MySQL: 3306)

---

## 🎬 Orden de Implementación Recomendado

1. **LoginPage** → Conectar `authService.login()`
2. **Dashboard** → Conectar `reportesService.getDashboard()`
3. **ClientesPage** → Conectar `clientesService.*`
4. **FacturacionPage** → Conectar `facturasService.*`
5. **TiendaPage** → Conectar `productosService.*` + `ventasService.*`
6. **ReportesPage** → Conectar `reportesService.*`

---

## 📋 Checklist Final

- [ ] Backend en `C:\xampp\htdocs\roommaster\backend\`
- [ ] XAMPP corriendo (Apache + MySQL)
- [ ] Base de datos `roommaster_db` existe
- [ ] `http://localhost/roommaster/backend/clientes.php` devuelve JSON
- [ ] `src/services/api.js` tiene URL correcta
- [ ] React corre en `localhost:3002`
- [ ] Test en consola funciona
- [ ] LoginPage conectada
- [ ] ¡Todo funciona! 🚀

---

## 📞 Referencia Rápida

**API Base URL:** `http://localhost/roommaster/backend`

**Endpoints:**
- POST `/login.php` - Login
- GET/POST/PUT/DELETE `/clientes.php` - Clientes
- GET/POST/PUT/DELETE `/facturas.php` - Facturas
- GET/POST/PUT/DELETE `/productos.php` - Productos  
- GET/POST `/ventas.php` - Ventas
- GET/POST/PUT `/estadias.php` - Estadías
- GET `/reportes.php` - Reportes

**Usuario de Prueba:**
```
Email: admin@roommaster.com
Contraseña: admin123
```

¡Listo! Ahora puedes conectar tu React al backend PHP. 🎉
