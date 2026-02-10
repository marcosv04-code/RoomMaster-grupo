# 🎓 TUTORIAL PRÁCTICO - 30 Minutos para Entender Todo

> Guía paso a paso. Léelo de principio a fin sin saltarte nada.

---

## ⏱️ PARTE 1: TU PRIMER LOGIN (5 min)

### Paso 1: Entender qué pasa

**En tu cabeza:**
```
Usuario escribe email + contraseña
        ↓
React envía a: http://localhost/roommaster/backend/login.php
        ↓
PHP busca en tabla usuarios
        ↓
Si existe → Retorna token + datos del usuario
Si no existe → Retorna error
```

### Paso 2: El Código

**En `src/pages/auth/LoginPage.jsx`:**

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
    const [email, setEmail] = useState('admin@roommaster.com');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Enviar a backend
            const res = await fetch('http://localhost/roommaster/backend/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    contraseña: password
                })
            });
            
            const datos = await res.json();
            
            // ¿Funcionó?
            if (datos.success) {
                // Guardar token + usuario
                localStorage.setItem('token', datos.datos.token);
                localStorage.setItem('usuario', JSON.stringify(datos.datos.usuario));
                
                alert('✓ Login exitoso!');
                navigate('/dashboard'); // Ir a dashboard
            } else {
                setError(datos.mensaje);
            }
        } catch (err) {
            setError('Error de conexión');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div style={{ maxWidth: '400px', margin: '100px auto' }}>
            <h2>Iniciar Sesión</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <button disabled={loading}>
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}
```

### Paso 3: Probar

1. Copia el código arriba
2. Reemplaza tu `LoginPage.jsx`
3. Ejecuta React: `npm run dev`
4. Ve a `http://localhost:3002/login`
5. Ingresa: `admin@roommaster.com` / `admin123`

¿Ves "Login exitoso"? ✅

---

## ⏱️ PARTE 2: Tu Primera Página CRUD (10 min)

### ¿Qué es CRUD?

- **C**reate - Crear (POST)
- **R**ead - Leer/Traer (GET)
- **U**pdate - Editar (PUT)
- **D**elete - Eliminar (DELETE)

### Paso 1: Entender el flujo

```
Cuando carga la página:
  1. GET /clientes.php → Traer todos los clientes
  2. Mostran en una tabla

Cuando hace click en "Crear":
  3. POST /clientes.php → Crear cliente
  4. Refrescar tabla

Cuando hace click en "Eliminar":
  5. DELETE /clientes.php → Eliminar cliente
  6. Refrescar tabla
```

### Paso 2: El Código

**En `src/pages/clientes/ClientesPage.jsx`:**

```javascript
import { useState, useEffect } from 'react';

const API = 'http://localhost/roommaster/backend';

export function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    
    // Cuando carga la página
    useEffect(() => {
        cargarClientes();
    }, []);
    
    // Traer clientes del backend
    async function cargarClientes() {
        try {
            setLoading(true);
            const res = await fetch(`${API}/clientes.php`);
            const datos = await res.json();
            
            if (datos.success) {
                setClientes(datos.datos);
            } else {
                alert('Error: ' + datos.mensaje);
            }
        } catch (err) {
            alert('Error de conexión');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    
    // Crear cliente
    async function crearCliente(e) {
        e.preventDefault();
        
        try {
            const res = await fetch(`${API}/clientes.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: nombre,
                    email: email,
                    telefono: telefono
                })
            });
            
            const datos = await res.json();
            
            if (datos.success) {
                alert('✓ Cliente creado');
                setNombre('');
                setEmail('');
                setTelefono('');
                cargarClientes(); // Recargar lista
            } else {
                alert('Error: ' + datos.mensaje);
            }
        } catch (err) {
            alert('Error de conexión');
            console.error(err);
        }
    }
    
    // Eliminar cliente
    async function eliminarCliente(id, nombre) {
        if (!confirm(`¿Eliminar a ${nombre}?`)) return;
        
        try {
            const res = await fetch(`${API}/clientes.php`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            
            const datos = await res.json();
            
            if (datos.success) {
                alert('✓ Cliente eliminado');
                cargarClientes(); // Recargar lista
            } else {
                alert('Error: ' + datos.mensaje);
            }
        } catch (err) {
            alert('Error de conexión');
            console.error(err);
        }
    }
    
    if (loading) return <div>Cargando...</div>;
    
    return (
        <div style={{ padding: '20px' }}>
            <h1>Gestión de Clientes</h1>
            
            {/* Formulario para crear */}
            <div style={{ 
                background: '#f5f5f5', 
                padding: '15px', 
                marginBottom: '20px',
                borderRadius: '5px'
            }}>
                <h3>Agregar Nuevo Cliente</h3>
                <form onSubmit={crearCliente}>
                    <div style={{ marginBottom: '10px' }}>
                        <input 
                            placeholder="Nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            style={{ marginRight: '10px', padding: '8px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input 
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ marginRight: '10px', padding: '8px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input 
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                            style={{ marginRight: '10px', padding: '8px' }}
                        />
                    </div>
                    <button type="submit" style={{
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        cursor: 'pointer',
                        borderRadius: '3px'
                    }}>
                        Crear Cliente
                    </button>
                </form>
            </div>
            
            {/* Lista de clientes */}
            <h3>Lista ({clientes.length})</h3>
            <table style={{ 
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #ddd'
            }}>
                <thead style={{ background: '#333', color: 'white' }}>
                    <tr>
                        <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Teléfono</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(cliente => (
                        <tr key={cliente.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{cliente.id}</td>
                            <td style={{ padding: '10px' }}>{cliente.nombre}</td>
                            <td style={{ padding: '10px' }}>{cliente.email}</td>
                            <td style={{ padding: '10px' }}>{cliente.telefono}</td>
                            <td style={{ padding: '10px' }}>
                                <button 
                                    onClick={() => eliminarCliente(cliente.id, cliente.nombre)}
                                    style={{
                                        background: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px',
                                        cursor: 'pointer',
                                        borderRadius: '3px'
                                    }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

### Paso 3: Probar

1. Copia el código arriba
2. Reemplaza tu `ClientesPage.jsx`
3. Ve a `http://localhost:3002/clientes`
4. Prueba agregar un cliente

¿Lo creó? ✅

---

## ⏱️ PARTE 3: Patrón Para las Otras Páginas (10 min)

### Recordé de Todas las Páginas

Todas funcionan **igual** que ClientesPage:

1. `useEffect` para traer datos al cargar
2. `fetch` GET para traer
3. `fetch` POST para crear
4. `fetch` PUT para editar
5. `fetch` DELETE para eliminar

### Facturas

```javascript
// Traer facturas pendientes
const res = await fetch(`${API}/facturas.php?estado=Pendiente`);

// Crear factura
const res = await fetch(`${API}/facturas.php`, {
    method: 'POST',
    body: JSON.stringify({
        estadia_id: 1,
        cliente_id: 1,
        subtotal: 450,
        impuesto: 50,
        total: 500
    })
});

// Marcar como pagada
const res = await fetch(`${API}/facturas.php`, {
    method: 'PUT',
    body: JSON.stringify({
        id: 1,
        estado: 'Pagada',
        metodo_pago: 'tarjeta'
    })
});
```

### Productos

```javascript
// Traer productos
const res = await fetch(`${API}/productos.php`);

// Traer por categoría
const res = await fetch(`${API}/productos.php?categoria=bebidas`);

// Crear producto
const res = await fetch(`${API}/productos.php`, {
    method: 'POST',
    body: JSON.stringify({
        nombre: 'Café Americano',
        precio: 3.50,
        categoria: 'bebidas',
        stock: 50
    })
});
```

### Estadías

```javascript
// Traer estadías activas
const res = await fetch(`${API}/estadias.php?estado=activa`);

// Crear estadía
const res = await fetch(`${API}/estadias.php`, {
    method: 'POST',
    body: JSON.stringify({
        cliente_id: 1,
        habitacion_id: 101,
        fecha_entrada: '2026-02-10',
        fecha_salida: '2026-02-15',
        numero_huespedes: 2
    })
});

// Completar estadía
const res = await fetch(`${API}/estadias.php`, {
    method: 'PUT',
    body: JSON.stringify({
        id: 1,
        estado: 'completada'
    })
});
```

### Dashboard (Reportes)

```javascript
// Traer dashboard
const res = await fetch(`${API}/reportes.php?tipo=dashboard`);
// Retorna: huespedes_actuales, habitaciones_disponibles, ingresos_mes, pendiente_cobro

// Traer ingresos
const res = await fetch(`${API}/reportes.php?tipo=ingresos`);

// Traer ocupación
const res = await fetch(`${API}/reportes.php?tipo=ocupacion`);
```

---

## 🎯 RESUMEN - El Patrón Universal

```javascript
// TEMPLATE PARA TODAS LAS PÁGINAS

import { useState, useEffect } from 'react';

const API = 'http://localhost/roommaster/backend';

export function MiPagina() {
    const [datos, setDatos] = useState([]);
    
    useEffect(() => {
        traerDatos();
    }, []);
    
    async function traerDatos() {
        const res = await fetch(`${API}/MI_ENDPOINT.php`);
        const result = await res.json();
        if (result.success) {
            setDatos(result.datos);
        }
    }
    
    async function crear(nuevoItem) {
        const res = await fetch(`${API}/MI_ENDPOINT.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoItem)
        });
        const result = await res.json();
        if (result.success) traerDatos();
    }
    
    return (
        <div>
            {datos.map(item => <div key={item.id}>{item.nombre}</div>)}
        </div>
    );
}
```

**Usa este template para TODAS las páginas.**

---

## ✅ Ahora Ya Sabes

✓ Cómo funciona login
✓ Cómo funciona CRUD
✓ Cómo se repite el patrón
✓ Cómo conectar React con PHP

**Solo copia y adapta para cada página.**

---

## 📚 Referencia Rápida

| Acción | Código |
|--------|--------|
| Traer datos | `fetch('url').then(r => r.json())` |
| Crear | `fetch('url', { method: 'POST', body: JSON.stringify({...}) })` |
| Editar | `fetch('url', { method: 'PUT', body: JSON.stringify({...}) })` |
| Eliminar | `fetch('url', { method: 'DELETE', body: JSON.stringify({id}) })` |
| Guardar token | `localStorage.setItem('token', token)` |
| Obtener token | `localStorage.getItem('token')` |

---

¡Ahora ya tienes todo! 🚀
