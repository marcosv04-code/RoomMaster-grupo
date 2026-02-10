# ✨ ESTÁS LISTO - GUÍA SIMPLIFICADA Y UNIFICADA

> **LÉEME PRIMERO** - Todo lo que necesitas en un solo documento

---

## 🎯 TU SISTEMA USA ESTO

```
React (localhost:3002)
        ↓ (HTTP requests)
PHP Backend (localhost/roommaster/backend)
        ↓ (SQL queries)
MySQL BD (roommaster_db)
```

**Easy, ¿cierto?**

---

## 🚀 COMIENZA EN 3 PASOS

### PASO 1️⃣: Crear la Base de Datos (1 min)

1. Ve a: `http://localhost/phpmyadmin`
2. Tab: **SQL**
3. Abre: `BD ROOMMASTER/roommaster_database.sql`
4. Copia TODO, pega en phpMyAdmin
5. Presiona **Ejecutar**

✅ Listo. Ya existe `roommaster_db`

### PASO 2️⃣: Copiar Carpeta Backend (1 min)

Los archivos `.php` deben estar aquí:
```
C:\xampp\htdocs\roommaster\backend\
```

Si no existe, crea la carpeta y copia los 11 archivos `.php`.

**Verifica:**
```
Abre navegador: http://localhost/roommaster/backend/clientes.php
Debes ver JSON: { "success": true, "datos": [...] }
```

✅ Listo. Backend funciona

### PASO 3️⃣: Conectar React (1 min)

Abre: `src/services/api.js`

Verifica esta línea:
```javascript
const API_BASE_URL = 'http://localhost/roommaster/backend';
```

¿Está así? ✅ Listo

¿Está diferente? ❌ Cámbialo

```javascript
// SI COPIASTE EN OTRA CARPETA, AQUÍ VA:
const API_BASE_URL = 'http://localhost/tuCarpeta/backend';
```

✅ Listo. React puede hablar con PHP

---

## ✅ ¿FUNCIONA TODO?

Prueba esto en DevTools Console (F12):

```javascript
// Test 1: ¿Backend responde?
fetch('http://localhost/roommaster/backend/clientes.php')
    .then(r => r.json())
    .then(d => console.log('✓ Backend OK:', d))
    .catch(e => console.log('✗ El backend está caído'));

// Test 2: ¿Login funciona?
fetch('http://localhost/roommaster/backend/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@roommaster.com',
        contraseña: 'admin123'
    })
})
.then(r => r.json())
.then(d => {
    if (d.success) {
        console.log('✓ Login OK - Token:', d.datos.token);
    } else {
        console.log('✗ Login falló:', d.mensaje);
    }
});
```

¿Ves respuestas JSON? ✅ **¡FUNCIONAAA!**

---

## 🎓 AHORA CONECTA TUS PÁGINAS

### Patrón Universal (Repare 10 veces, funciona siempre)

```javascript
// 1. Importar
import { useState, useEffect } from 'react';

// 2. API
const API = 'http://localhost/roommaster/backend';

// 3. Componente
export function MiPagina() {
    const [datos, setDatos] = useState([]);
    
    // 4. Cargar cuando monta
    useEffect(() => {
        traer();
    }, []);
    
    // 5. Traer datos
    async function traer() {
        const res = await fetch(`${API}/mi_endpoint.php`);
        const data = await res.json();
        if (data.success) {
            setDatos(data.datos);
        }
    }
    
    // 6. Mostrar
    return (
        <div>
            {datos.map(item => (
                <div key={item.id}>{item.nombre}</div>
            ))}
        </div>
    );
}
```

**Eso es TODO lo que necesitas.**

---

## 📋 ENDPOINTS DISPONIBLES

### 1. LOGIN
```javascript
fetch('/backend/login.php', {
    method: 'POST',
    body: JSON.stringify({
        email: 'admin@roommaster.com',
        contraseña: 'admin123'
    })
})
// Retorna: { success, token, usuario }
```

### 2. CLIENTES
```javascript
// Traer todos
fetch('/backend/clientes.php')

// Crear
fetch('/backend/clientes.php', {
    method: 'POST',
    body: JSON.stringify({
        nombre: 'Juan',
        email: 'juan@email.com',
        telefono: '3001234567'
    })
})

// Editar
fetch('/backend/clientes.php', {
    method: 'PUT',
    body: JSON.stringify({ id: 1, nombre: 'Juan Actualizado' })
})

// Eliminar
fetch('/backend/clientes.php', {
    method: 'DELETE',
    body: JSON.stringify({ id: 1 })
})
```

### 3. FACTURAS
```javascript
// Traer pendientes
fetch('/backend/facturas.php?estado=Pendiente')

// Crear
fetch('/backend/facturas.php', {
    method: 'POST',
    body: JSON.stringify({
        estadia_id: 1,
        cliente_id: 1,
        subtotal: 450,
        impuesto: 50,
        total: 500
    })
})

// Marcar pagada
fetch('/backend/facturas.php', {
    method: 'PUT',
    body: JSON.stringify({
        id: 1,
        estado: 'Pagada'
    })
})
```

### 4. PRODUCTOS
```javascript
// Traer todos
fetch('/backend/productos.php')

// Traer por categoría
fetch('/backend/productos.php?categoria=bebidas')

// Crear
fetch('/backend/productos.php', {
    method: 'POST',
    body: JSON.stringify({
        nombre: 'Café',
        precio: 2.50,
        categoria: 'bebidas',
        stock: 50
    })
})
```

### 5. ESTADÍAS
```javascript
// Traer activas
fetch('/backend/estadias.php?estado=activa')

// Crear
fetch('/backend/estadias.php', {
    method: 'POST',
    body: JSON.stringify({
        cliente_id: 1,
        habitacion_id: 101,
        fecha_entrada: '2026-02-10',
        fecha_salida: '2026-02-15',
        numero_huespedes: 2
    })
})

// Completar
fetch('/backend/estadias.php', {
    method: 'PUT',
    body: JSON.stringify({
        id: 1,
        estado: 'completada'
    })
})
```

### 6. REPORTES
```javascript
// Dashboard
fetch('/backend/reportes.php?tipo=dashboard')

// Ingresos
fetch('/backend/reportes.php?tipo=ingresos')

// Ocupación
fetch('/backend/reportes.php?tipo=ocupacion')

// Productos
fetch('/backend/reportes.php?tipo=productos')

// Clientes
fetch('/backend/reportes.php?tipo=clientes')
```

---

## 🔥 PATRÓN CRUD COMPLETO (Copia y Pega)

```javascript
import { useState, useEffect } from 'react';

const API = 'http://localhost/roommaster/backend';

export function ClientesPage() {
    const [items, setItems] = useState([]);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    
    // Cargar
    useEffect(() => {
        cargar();
    }, []);
    
    async function cargar() {
        const res = await fetch(`${API}/clientes.php`);
        const d = await res.json();
        if (d.success) setItems(d.datos);
    }
    
    async function crear(e) {
        e.preventDefault();
        const res = await fetch(`${API}/clientes.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, telefono })
        });
        const d = await res.json();
        if (d.success) {
            cargar();
            setNombre('');
            setEmail('');
            setTelefono('');
        } else alert(d.mensaje);
    }
    
    async function eliminar(id) {
        const res = await fetch(`${API}/clientes.php`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const d = await res.json();
        if (d.success) cargar();
    }
    
    return (
        <div>
            <h1>Clientes</h1>
            
            <form onSubmit={crear}>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" required />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required />
                <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" required />
                <button>Crear</button>
            </form>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nombre}</td>
                            <td>{item.email}</td>
                            <td>{item.telefono}</td>
                            <td>
                                <button onClick={() => eliminar(item.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

---

## ⚠️ ERRORES COMUNES

### ❌ "CORS policy blocked"
**Solución:** Verifica que los archivos `.php` incluyen `require_once 'cors.php';`

### ❌ "404 Not Found"
**Solución:** 
- Verifica que los archivos están en `C:\xampp\htdocs\roommaster\backend\`
- Verifica que `API_BASE_URL` en `api.js` es correcto

### ❌ "Database connection error"
**Solución:**
- Abre phpMyAdmin
- Verifica que existe `roommaster_db`
- Si no, ejecuta el SQL nuevamente

### ❌ No ves cambios
**Solución:** Limpia cache
```javascript
localStorage.clear();
window.location.reload();
```

---

## 📚 DOCUMENTOS DISPONIBLES

Si necesitas **más detalle**:

| Documento | Para Qué |
|-----------|----------|
| `GUIA_UNIFICADA.md` | Guía completa (30 min) |
| `TUTORIAL_PRACTICO.md` | Ejemplos paso a paso |
| `CODIGO_SIMPLIFICADO.md` | Código PHP simple |
| `backend/README.md` | Documentación técnica |

---

## 🎯 CHECKLIST RÁPIDO

Antes de empezar:

- [ ] XAMPP corriendo (Apache ✓ + MySQL ✓)
- [ ] `roommaster_db` existe en phpMyAdmin
- [ ] Archivos PHP en `C:\xampp\htdocs\roommaster\backend\`
- [ ] `http://localhost/roommaster/backend/clientes.php` devuelve JSON
- [ ] `API_BASE_URL` correcto en `api.js`
- [ ] React en `localhost:3002`
- [ ] Test en console (login) funciona

¿Todo ✓? **¡A PROGRAMAR!**

---

## 🚀 PRÓXIMO PASO

1. Abre `src/pages/clientes/ClientesPage.jsx`
2. Copia el "PATRÓN CRUD COMPLETO" de arriba
3. Reemplaza el contenido
4. Ve a `http://localhost:3002/clientes`
5. Prueba crear/eliminar clientes

**Listo. Uno a uno, conecta todas las páginas.**

---

## 💡 LA CLAVE IMPORTANTE

**Todos los endpoints hacen lo mismo:**

1. Reciben datos desde React
2. Los validan
3. Ejecutan una query SQL
4. Responden en JSON

**100% es este patrón.**

---

**¿Preguntas? Lee la guía completa en `GUIA_UNIFICADA.md`**

**¿Necesitas ejemplos? Mira `TUTORIAL_PRACTICO.md`**

**¿Código simple? Abre `CODIGO_SIMPLIFICADO.md`**

---

¡Ahora sí, **VAMOS CON TODO!** 🎉
