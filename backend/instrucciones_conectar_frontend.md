# 🔗 Instrucciones para Conectar React al Backend

## Paso 1: Verificar que el Backend está Corriendo

1. Abre XAMPP/WAMP
2. Inicia Apache
3. Ve a: `http://localhost/phpmyadmin`
4. Verifica que la base de datos `roommaster_db` existe

## Paso 2: Copiar archivo de ejemplos

Copia el archivo `ejemplos_js.js` a tu carpeta del frontend:

```
src/services/api_examples.js
```

Este archivo tiene todas las funciones listos para usar.

## Paso 3: Actualizar API URL en tu Frontend

Abre `src/services/api.js` y modifica:

```javascript
// URLs según tu configuración
const API_BASE_URL = 'http://localhost/roommaster/backend';
// O si copiastes el proyecto en otra ruta:
// const API_BASE_URL = 'http://localhost/tuCarpeta/backend';
```

## Paso 4: Opción A - Usar la clase Axios (Recomendado)

Si tienes Axios en tu proyecto, actualiza `src/services/api.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost/roommaster/backend';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Agregar token a cada petición si existe
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
```

Luego en tus componentes:

```javascript
import api from '../services/api';

// Obtener clientes
const response = await api.get('/clientes.php');

// Crear cliente
const response = await api.post('/clientes.php', {
    nombre: 'Juan',
    email: 'juan@email.com',
    telefono: '3001234567'
});

// Actualizar cliente
const response = await api.put('/clientes.php', {
    id: 1,
    nombre: 'Juan Actualizado'
});

// Eliminar cliente
const response = await api.delete('/clientes.php', {
    data: { id: 1 }
});
```

## Paso 5: Opción B - Usar Fetch Directo

Si prefieres Fetch sin Axios, copia el archivo `ejemplos_js.js` en tus servicios:

```javascript
// En tu componente
import { 
    obtenerClientes, 
    crearCliente,
    obtenerFacturas 
} from '../services/api_examples';

// Usar directamente
const clientes = await obtenerClientes();
```

## Paso 6: Conectar en tus Contextos

### Actualizar AuthContext.jsx

```javascript
import { useState, createContext } from 'react';

export const AuthContext = createContext();

async function loginUsuario(email, contraseña) {
    const API_URL = 'http://localhost/roommaster/backend';
    
    const respuesta = await fetch(`${API_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contraseña })
    });
    
    const datos = await respuesta.json();
    
    if (datos.success) {
        localStorage.setItem('token', datos.datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.datos.usuario));
        return datos.datos;
    } else {
        throw new Error(datos.mensaje);
    }
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const login = async (email, contraseña) => {
        setLoading(true);
        try {
            const datos = await loginUsuario(email, contraseña);
            setUsuario(datos.usuario);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <AuthContext.Provider value={{ usuario, login, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
```

## Paso 7: Ejemplos en Componentes

### Ejemplo 1: LoginPage.jsx

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, contraseña);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input 
                type="password" 
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                placeholder="Contraseña"
                required
            />
            <button disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </form>
    );
}
```

### Ejemplo 2: ClientesPage.jsx

```javascript
import { useState, useEffect } from 'react';
import api from '../services/api';

export function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    
    useEffect(() => {
        cargarClientes();
    }, []);
    
    async function cargarClientes() {
        try {
            const response = await api.get('/clientes.php');
            if (response.data.success) {
                setClientes(response.data.datos || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }
    
    async function handleCrear(e) {
        e.preventDefault();
        try {
            const response = await api.post('/clientes.php', {
                nombre,
                email,
                telefono
            });
            
            if (response.data.success) {
                setNombre('');
                setEmail('');
                setTelefono('');
                cargarClientes();
                alert('Cliente creado exitosamente');
            } else {
                alert('Error: ' + response.data.mensaje);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear cliente');
        }
    }
    
    async function handleEliminar(id) {
        if (confirm('¿Estás seguro?')) {
            try {
                const response = await api.delete('/clientes.php', {
                    data: { id }
                });
                
                if (response.data.success) {
                    cargarClientes();
                    alert('Cliente eliminado');
                } else {
                    alert('Error: ' + response.data.mensaje);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
    
    if (loading) return <div>Cargando...</div>;
    
    return (
        <div>
            <h1>Gestión de Clientes</h1>
            
            <form onSubmit={handleCrear}>
                <h2>Nuevo Cliente</h2>
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
            
            <h2>Lista de Clientes</h2>
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
                    {clientes.map(cliente => (
                        <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefono}</td>
                            <td>
                                <button onClick={() => handleEliminar(cliente.id)}>
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

### Ejemplo 3: FacturacionPage.jsx

```javascript
import { useState, useEffect } from 'react';
import api from '../services/api';

export function FacturacionPage() {
    const [facturas, setFacturas] = useState([]);
    const [estado, setEstado] = useState('Pendiente');
    
    useEffect(() => {
        cargarFacturas();
    }, [estado]);
    
    async function cargarFacturas() {
        try {
            const response = await api.get(`/facturas.php?estado=${estado}`);
            if (response.data.success) {
                setFacturas(response.data.datos || []);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    async function marcarComoPagada(id) {
        try {
            const response = await api.put('/facturas.php', {
                id,
                estado: 'Pagada',
                metodo_pago: 'efectivo'
            });
            
            if (response.data.success) {
                cargarFacturas();
                alert('Factura marcada como pagada');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    return (
        <div>
            <h1>Facturación</h1>
            
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="Pendiente">Pendiente</option>
                <option value="Pagada">Pagada</option>
                <option value="Cancelada">Cancelada</option>
            </select>
            
            <table>
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {facturas.map(factura => (
                        <tr key={factura.id}>
                            <td>{factura.numero_factura}</td>
                            <td>{factura.cliente_nombre}</td>
                            <td>${factura.total}</td>
                            <td>{factura.estado}</td>
                            <td>
                                {factura.estado === 'Pendiente' && (
                                    <button onClick={() => marcarComoPagada(factura.id)}>
                                        Marcar Pagada
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

## Paso 8: Verificar Conexión

### Test en el navegador (DevTools Console):

```javascript
// Abre la consola (F12) en la página de tu React app en localhost:3002

// Test 1: Login
fetch('http://localhost/roommaster/backend/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@roommaster.com',
        contraseña: 'admin123'
    })
}).then(r => r.json()).then(d => console.log(d));

// Test 2: Obtener clientes
fetch('http://localhost/roommaster/backend/clientes.php')
    .then(r => r.json())
    .then(d => console.log(d));
```

## Paso 9: Solucionar Problemas

### Error: CORS policy

Si ves este error en la consola:
```
Access to XMLHttpRequest at 'http://localhost/roommaster/backend/clientes.php' 
from origin 'http://localhost:3002' has been blocked by CORS policy
```

**Solución:** El archivo `cors.php` ya está configurado. Verifica que:
1. Los archivos `.php` llamen a `require_once 'cors.php'` al inicio
2. Todos los archivos PHP en `/backend/` tengan esta línea

### Error: Database connection refused

Si la base de datos no se conecta:
1. Verifica que XAMPP/WAMP está ejecutándose
2. Revisa que `config.php` tenga las credenciales correctas
3. Prueba en phpMyAdmin si la base de datos existe

### Error: 404 Not Found

Si los endpoints no se encuentran:
1. Verifica que los archivos `.php` están en la carpeta `/backend/`
2. Comprueba la URL correcta en tu `API_BASE_URL`
3. Los archivos deben estar en: `C:/xampp/htdocs/roommaster/backend/`

## URLs Correctas según tu Configuración

| Ruta del Proyecto | API Base URL |
|---|---|
| `C:/xampp/htdocs/roommaster/` | `http://localhost/roommaster/backend` |
| `C:/xampp/htdocs/RoomMaster/` | `http://localhost/RoomMaster/backend` |
| `C:/xampp/htdocs/` | `http://localhost/backend` |

## Checklist Final

- [ ] Base de datos `roommaster_db` creada en phpMyAdmin
- [ ] Archivos PHP en `/backend/` dentro de htdocs
- [ ] Apache/MySQL corriendo en XAMPP
- [ ] React frontend en `localhost:3002`
- [ ] API URL correcta en `api.js`
- [ ] Test básico en DevTools console exitoso
- [ ] Login funciona
- [ ] Clientes se cargan
- [ ] CRUD operations funcionan

¡Listo! Tu frontend ya debe estar conectado al backend.
