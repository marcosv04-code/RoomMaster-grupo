# 🔥 CHEAT SHEET - Todo en Una Hoja

> Quick reference para cuando necesitas recordar algo rápido

---

## 📂 DÓNDE ESTÁN LOS ARCHIVOS

```
C:\xampp\htdocs\roommaster\
├── backend\              ← Aquí van los .php
│   ├── config.php        ← Conexión BD
│   ├── login.php         ← Login
│   ├── clientes.php      ← CRUD clientes
│   ├── facturas.php      ← CRUD facturas
│   ├── productos.php     ← CRUD productos
│   ├── ventas.php        ← Ventas
│   └── estadias.php      ← Reservas
└── ... (front end aquí)

Base de Datos:
Database: roommaster_db
User: root
Pass: (vacío)
```

---

## 🎯 3 PASOS PARA CONECTAR

```bash
# 1. Crear BD
phpMyAdmin → SQL → Pegar roommaster_database.sql → Ejecutar

# 2. Copiar Backend
C:\xampp\htdocs\roommaster\backend\ ← 11 archivos aquí

# 3. Actualizar React
src/services/api.js → API_BASE_URL = 'http://localhost/roommaster/backend'
```

---

## 🧪 TEST RÁPIDO

```javascript
// En DevTools Console (F12)

// Test 1: ¿Funciona backend?
fetch('http://localhost/roommaster/backend/clientes.php')
    .then(r => r.json())
    .then(d => console.log(d))

// Test 2: ¿Login?
fetch('http://localhost/roommaster/backend/login.php', {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        email: 'admin@roommaster.com',
        contraseña: 'admin123'
    })
})
    .then(r => r.json())
    .then(d => console.log(d))
```

---

## 🔗 TODOS LOS ENDPOINTS

```javascript
const API = 'http://localhost/roommaster/backend';

// LOGIN
fetch(`${API}/login.php`, { method: 'POST', body: {...} })

// CLIENTES
fetch(`${API}/clientes.php`)                           // GET todos
fetch(`${API}/clientes.php?id=1`)                      // GET uno
fetch(`${API}/clientes.php`, { method: 'POST', body: {...} })  // CREATE
fetch(`${API}/clientes.php`, { method: 'PUT', body: {...} })   // UPDATE
fetch(`${API}/clientes.php`, { method: 'DELETE', body: {...} }) // DELETE

// FACTURAS
fetch(`${API}/facturas.php?estado=Pendiente`)          // Filtrado
fetch(`${API}/facturas.php`, { method: 'POST', body: {...} })

// PRODUCTOS
fetch(`${API}/productos.php`)                          // Todos
fetch(`${API}/productos.php?categoria=bebidas`)        // Por categoría

// ESTADÍAS
fetch(`${API}/estadias.php?estado=activa`)             // Activas

// REPORTES
fetch(`${API}/reportes.php?tipo=dashboard`)            // Métricas
fetch(`${API}/reportes.php?tipo=ingresos`)             // Ingresos
fetch(`${API}/reportes.php?tipo=ocupacion`)            // Ocupación

// VENTAS
fetch(`${API}/ventas.php`)                             // Get
fetch(`${API}/ventas.php`, { method: 'POST', body: {...} })  // Crear
```

---

## 🎨 PATRÓN UNIVERSAL (Copia y Pega)

```javascript
import { useState, useEffect } from 'react';

const API = 'http://localhost/roommaster/backend';

export function MiPagina() {
    const [datos, setDatos] = useState([]);
    const [nombre, setNombre] = useState('');
    
    useEffect(() => {
        cargar();
    }, []);
    
    async function cargar() {
        const res = await fetch(`${API}/mi_endpoint.php`);
        const d = await res.json();
        if (d.success) setDatos(d.datos);
    }
    
    async function crear(e) {
        e.preventDefault();
        const res = await fetch(`${API}/mi_endpoint.php`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nombre })
        });
        const d = await res.json();
        if (d.success) cargar();
    }
    
    async function eliminar(id) {
        const res = await fetch(`${API}/mi_endpoint.php`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id })
        });
        const d = await res.json();
        if (d.success) cargar();
    }
    
    return (
        <div>
            <form onSubmit={crear}>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <button>Crear</button>
            </form>
            
            {datos.map(item => (
                <div key={item.id}>
                    {item.nombre}
                    <button onClick={() => eliminar(item.id)}>Eliminar</button>
                </div>
            ))}
        </div>
    );
}
```

---

## 📝 FORMATO DE REQUESTS

### GET
```javascript
fetch(`${API}/clientes.php`)
fetch(`${API}/clientes.php?id=1`)
```

### POST
```javascript
fetch(`${API}/clientes.php`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        nombre: 'Juan',
        email: 'juan@email.com',
        telefono: '3001234567'
    })
})
```

### PUT
```javascript
fetch(`${API}/clientes.php`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        id: 1,
        nombre: 'Juan Nuevo'
    })
})
```

### DELETE
```javascript
fetch(`${API}/clientes.php`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ id: 1 })
})
```

---

## 📨 FORMATO DE RESPUESTAS

```javascript
// SUCCESS
{
    "success": true,
    "mensaje": "✓ Cliente creado",
    "datos": {
        "id": 1,
        "nombre": "Juan",
        ...
    }
}

// ERROR
{
    "success": false,
    "mensaje": "Falta: nombre, email, teléfono",
    "datos": null
}

// LOGIN
{
    "success": true,
    "mensaje": "✓ Login correcto",
    "datos": {
        "token": "abc123...",
        "usuario": {
            "id": 1,
            "nombre": "Admin",
            "email": "admin@roommaster.com",
            "rol": "admin"
        }
    }
}
```

---

## 🗄️ TABLAS DE BD

| Tabla | Qué Hace | Campos Clave |
|-------|----------|-------------|
| usuarios | Logins | email, contraseña, rol |
| clientes | Huéspedes | nombre, email, teléfono |
| habitaciones | Rooms | numero, tipo, precio |
| estadias | Reservas | cliente_id, habitacion_id, fechas |
| facturas | Recibos | numero_factura, total, estado |
| productos | Tienda | nombre, precio, categoria |
| ventas | Compras en tienda | producto_id, cantidad |
| inventario | Stock | producto_id, cantidad_actual |

---

## 💾 DATOS DE PRUEBA

```
Email: admin@roommaster.com
Pass: admin123

Usuario 1: admin - admin123 - admin
Usuario 2: gerente - gerente123 - gerente
Usuario 3: recepcionista - recepcionista123 - recepcionista

Cliente 1: Pedro García - pedro@email.com
Cliente 2: María López - maria@email.com
Cliente 3: Juan Rodríguez - juan@email.com
```

---

## 🐛 ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| CORS blocked | Falta require 'cors.php' | Agrega en .php |
| 404 Not Found | Ruta incorrecta | Verifica URL en api.js |
| DB connection | BD no existe | Ejecuta SQL en phpMyAdmin |
| Token inválido | Session expirada | localStorage.clear() |
| No ves cambios | Caché del navegador | Ctrl+Shift+Delete |

---

## 🔑 FUNCIONES PHP CLAVE

```php
// Responder
respuesta(true, 'mensaje', $datos);

// Obtener datos de React
$datos = obtenerJSON();

// Limpiar input
$texto_limpio = limpiar($email, $conexion);

// Traer datos
$resultados = traerDatos($sql, $conexion);

// Guardar datos
guardarDatos($sql, $conexion);
```

---

## 🎯 CHECKLIST RÁPIDO

- [ ] XAMPP corriendo
- [ ] `roommaster_db` existe
- [ ] `/backend/` en htdocs
- [ ] `http://localhost/roommaster/backend/clientes.php` → JSON
- [ ] `API_BASE_URL` correcto en `api.js`
- [ ] React en `localhost:3002`
- [ ] Test login funciona
- [ ] ¡A PROGRAMAR!

---

## 📚 DOCUMENTOS

| Documento | Tiempo | Para Qué |
|-----------|--------|----------|
| COMIENZA_AQUI.md | 5 min | Quick start |
| GUIA_UNIFICADA.md | 30 min | Aprender todo |
| TUTORIAL_PRACTICO.md | 30 min | Ejemplos |
| CODIGO_SIMPLIFICADO.md | 15 min | Entender código |

---

## 🚀 PROCESO RÁPIDO

```
1. chmod +x deploy.sh (si necesitas)
2. npm run dev (React en 3002)
3. XAMPP encendido (Apache + MySQL)
4. phpMyAdmin: crear BD
5. Código copiado de plantilla
6. Adaptar para tu página
7. ¡LISTO!
```

---

## 💡 RECORDATORIOS

- **Todo es fetch()** - No importa el endpoint, siempre es fetch
- **Todo es JSON** - Request y response son JSON
- **Todo sigue patrón** - Todos funcionan igual
- **Todo es HTTP** - GET, POST, PUT, DELETE
- **Todo está comentado** - Mira los .php para entender

---

## 📞 BÚSQUEDA RÁPIDA

```
¿Rápido? → COMIENZA_AQUI.md
¿Aprender? → GUIA_UNIFICADA.md
¿Ejemplos? → TUTORIAL_PRACTICO.md
¿Código? → CODIGO_SIMPLIFICADO.md
¿Técnico? → README.md
```

---

**Imprime esto, guárdalo en favoritos, usalo constantemente.**

**¡Ahora tienes todo al alcance! 🎉**
