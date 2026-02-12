# EXPLICACIÓN COMPLETA: PROYECTO ROOMMASTER

---

## INTRODUCCIÓN AL PROYECTO

El proyecto **RoomMaster** es un sistema completo de gestión hotelera que funciona en dos partes:
1. **Frontend** (lo que ves en pantalla)
2. **Backend** (donde se guardan y procesan los datos)

Estas dos partes funcionan juntas para que puedas gestionar un hotel.

---

## PARTE 1: TECNOLOGÍAS UTILIZADAS

### ¿QUÉ LENGUAJES DE PROGRAMACIÓN USAMOS?

**FRONTEND (Lo que ve el usuario):**
- **JavaScript** - El lenguaje de programación principal
- **React** - Una librería de JavaScript para crear interfaces
- **Vite** - Una herramienta que organiza y prepara el código para que funcione rápido
- **JSX** - Una forma especial de escribir JavaScript que parece HTML (mezcla de ambos)
- **CSS** - Para los colores, tamaños y diseño

**BACKEND (Lo que está en el servidor):**
- **PHP** - Lenguaje de programación para el servidor
- **MySQL** - Para guardar datos en una base de datos

---

### ¿QUÉ ES REACT?

React es una **librería de JavaScript** que sirve para crear interfaces de usuario dinámicas (que cambian sin recargar la página).

**¿Cómo funciona?**
1. React divide la interfaz en **componentes** (piezas reutilizables)
2. Cada componente tiene su propio código, estilos y datos
3. Cuando los datos cambian, React actualiza automáticamente la pantalla
4. Todo sin recargar la página completa

**Ejemplo simple:**
- Si tienes un botón "Agregar cliente" en 3 páginas diferentes
- En lugar de escribir el botón 3 veces
- Lo escribes UNA VEZ como componente
- Y lo reutilizas en las 3 páginas

---

### ¿QUÉ ES VITE?

Vite es una **herramienta de desarrollo** que:
1. Organiza todo tu código (JavaScript, CSS, imágenes)
2. Lo optimiza para que funcione rápido
3. Permite que trabajes localmente (en tu computadora)
4. Genera un archivo listo para publicar en internet

**¿Cómo lo usamos?**
- `npm run dev` - Inicia el servidor LOCAL (http://localhost:3002)
- `npm run build` - Prepara el código para publicar en internet (lo que hicimos en Vercel)

---

### ¿QUÉ ES JSX?

JSX es una forma especial de escribir código React donde **mezclas JavaScript con HTML**.

**Ejemplo:**
```jsx
// Sin JSX (forma antigua):
React.createElement('div', null, 'Hola')

// Con JSX (forma que usamos):
<div>Hola</div>
```

En JSX parece que escribes HTML, pero en realidad es JavaScript que React transforma.

---

### ¿CÓMO SE RELACIONAN FRONTEND Y BACKEND?

```
┌─────────────────────────────────────────────────────────┐
│  USUARIO VE ESTO (FRONTEND EN NAVEGADOR)                │
│  ─ Botones, formularios, tablas                         │
│  ─ Todo lo visual que ves en pantalla                   │
│  ─ Hecho con React + JavaScript                         │
└─────────────────────────────────────────────────────────┘
                        ↓↑
                  (Comunica vía HTTP/INTERNET)
                        ↓↑
┌─────────────────────────────────────────────────────────┐
│  PROCESA Y GUARDA DATOS (BACKEND EN SERVIDOR)           │
│  ─ Recibe solicitudes del frontend                      │
│  ─ Consulta la base de datos                            │
│  ─ Devuelve datos en formato JSON                       │
│  ─ Hecho con PHP y MySQL                                │
└─────────────────────────────────────────────────────────┘
```

---

## PARTE 2: CÓMO FUNCIONA EL FLUJO DE DATOS

### EJEMPLO: EL USUARIO QUIERE VER LA LISTA DE CLIENTES

**PASO 1 - Frontend (JavaScript/React)**
```
El usuario abre la página "Clientes"
↓
React ejecuta: fetch('http://localhost/RoomMaster_Prueba/backend/clientes.php')
↓
Esto envía una solicitud al servidor
```

**PASO 2 - Backend (PHP/MySQL)**
```
El servidor recibe la solicitud
↓
PHP ejecuta: SELECT * FROM clientes (consulta a la base de datos)
↓
MySQL devuelve todos los clientes
↓
PHP convierte los datos a JSON (formato que entiende JavaScript)
↓
PHP envía: [{"id":1, "nombre":"Juan", ...}, {...}]
```

**PASO 3 - Frontend recibe los datos**
```
JavaScript recibe: [{"id":1, "nombre":"Juan", ...}]
↓
React almacena en "useState"
↓
React dibuja en pantalla una tabla con los clientes
↓
El usuario ve la lista
```

---

## PARTE 3: CONCEPTOS IMPORTANTES DE JAVASCRIPT QUE USAMOS

### 1. VARIABLES Y TIPOS DE DATOS

```javascript
// Variable (guarda información)
const nombre = "Juan"              // Texto (String)
const edad = 25                    // Número (Number)
const activo = true                // Verdadero o Falso (Boolean)
const clientes = [...]             // Lista (Array)
const usuario = {id: 1, nombre: "Juan"}  // Objeto (Object)
```

**¿Cuándo usar `const`, `let`, `var`?**
- `const` - Cuando el valor NO va a cambiar
- `let` - Cuando el valor SÍ puede cambiar
- `var` - (Antiguo, no se usa)

---

### 2. FUNCIONES

Una función es CODE que puedes **reutilizar múltiples veces**.

```javascript
// Definir una función
function saludar(nombre) {
  console.log("Hola " + nombre)
}

// Usar la función
saludar("Juan")   // Imprime: Hola Juan
saludar("María")  // Imprime: Hola María
```

**En nuestro proyecto:**
```javascript
// Función que obtiene clientes del backend
async function cargarClientes() {
  const respuesta = await fetch(API + '/clientes.php')
  const datos = await respuesta.json()
  setClientes(datos)
}
```

---

### 3. ASYNC / AWAIT (para operaciones que toman tiempo)

Cuando le pides datos al servidor, **el servidor tarda un poco**.

`async/await` permite que el código espere sin bloquear todo.

```javascript
// SIN esperar (MALO - no funciona)
const datos = fetch('/api')
console.log(datos)  // undefined (aún no llegó)

// CON async/await (BIEN)
async function obtenerDatos() {
  const respuesta = await fetch('/api')    // Espera la respuesta
  const datos = await respuesta.json()     // Convierte a JavaScript
  console.log(datos)                       // Ahora SÍ tiene datos
}
```

---

### 4. FETCH (comunicar con el servidor)

`fetch` es cómo JavaScript le pide datos al servidor.

```javascript
// GET - Pedir datos (Leer)
fetch('http://localhost/api/clientes.php')

// POST - Enviar datos nuevos (Crear)
fetch('http://localhost/api/clientes.php', {
  method: 'POST',
  body: JSON.stringify({nombre: "Juan"})
})

// PUT - Actualizar datos existentes (Editar)
fetch('http://localhost/api/clientes.php', {
  method: 'PUT',
  body: JSON.stringify({id: 1, nombre: "Juan Actualizado"})
})

// DELETE - Eliminar datos (Borrar)
fetch('http://localhost/api/clientes.php', {
  method: 'DELETE',
  body: JSON.stringify({id: 1})
})
```

---

## PARTE 4: CONCEPTOS DE REACT QUE USAMOS

### 1. COMPONENTES

Un componente es una **pieza reutilizable** de la interfaz.

```javascript
// Componente simple
function MiBoton() {
  return <button>Haz clic aquí</button>
}

// Componente con propiedades
function Card({ titulo, contenido }) {
  return (
    <div>
      <h2>{titulo}</h2>
      <p>{contenido}</p>
    </div>
  )
}

// Usar el componente
<Card titulo="Bienvenido" contenido="Esto es un ejemplo" />
```

---

### 2. HOOKS - useState (guardar información que cambia)

Los hooks son funciones que permiten que los componentes **recuerden información**.

```javascript
// Importar useState
import { useState } from 'react'

function MiComponente() {
  // Crear una variable que React observa
  // nombre = valor actual
  // setNombre = función para cambiar el valor
  const [nombre, setNombre] = useState("Juan")
  
  return (
    <div>
      <p>Nombre: {nombre}</p>
      <button onClick={() => setNombre("María")}>
        Cambiar nombre
      </button>
    </div>
  )
}
```

**¿Qué pasa?**
1. El componente empieza con nombre = "Juan"
2. Cuando haces clic en el botón, ejecuta setNombre("María")
3. React actualiza automáticamente la pantalla
4. Ahora muestra "María"

---

### 3. HOOKS - useEffect (ejecutar código al cargar)

`useEffect` permite ejecutar código cuando el componente carga o cuando algo cambia.

```javascript
function ClientesPage() {
  const [clientes, setClientes] = useState([])
  
  // Este código se ejecuta CUANDO CARGA el componente
  useEffect(() => {
    console.log("La página cargó")
    // Aquí se obtienen los clientes del servidor
    cargarClientes()
  }, [])  // [] = ejecutar SÓLOque cuando carga
  
  return <div>Lista de clientes: {clientes.length}</div>
}
```

---

### 4. JSX - Mezclar JavaScript con HTML

En React, dentro del código puedes usar `{}` para insertar JavaScript en HTML.

```javascript
function Saludo() {
  const nombre = "Juan"
  const edad = 30
  
  return (
    <div>
      {/* Usar variables */}
      <h1>Hola {nombre}</h1>
      <p>Edad: {edad}</p>
      
      {/* Hacer operaciones */}
      <p>Próximo año: {edad + 1}</p>
      
      {/* Condicionales */}
      {edad >= 18 ? <p>Es mayor de edad</p> : <p>Es menor</p>}
      
      {/* Listas */}
      {[1, 2, 3].map(num => <p key={num}>{num}</p>)}
    </div>
  )
}
```

---

## PARTE 5: ESTRUCTURA DEL PROYECTO

```
RoomMaster/
├── backend/                    # SERVIDOR (PHP)
│   ├── config.php             # Conexión a BD
│   ├── functions.php          # Funciones reutilizables
│   ├── clientes.php           # API de clientes
│   ├── usuarios.php           # API de usuarios
│   ├── reportes.php           # API de reportes
│   └── ... (más APIs)
│
└── frontend/                   # INTERFAZ (React)
    ├── src/
    │   ├── components/        # Componentes reutilizables
    │   ├── pages/            # Páginas de la app
    │   ├── hooks/            # Funciones reutilizables
    │   ├── context/          # Datos compartidos
    │   └── services/         # Conexión con backend
    ├── index.html            # página principal
    ├── package.json          # Dependencias
    └── vite.config.js        # Configuración de Vite
```

---

## PARTE 6: CODE COMENTADO LÍNEA POR LÍNEA

### ARCHIVO 1: frontend/src/main.jsx (PUNTO DE ENTRADA)

```javascript
// IMPORTAN librerías que necesitamos
import React from 'react'                    // React base
import ReactDOM from 'react-dom/client'      // Para renderizar en HTML
import App from './App.jsx'                  // Componente principal
import './styles/global.css'                 // Estilos globales

// CREAR un contenedor donde React va a renderizar
// Busca el elemento HTML con id="root" en index.html
const root = ReactDOM.createRoot(document.getElementById('root'))

// RENDERIZAR (dibujar) el componente App dentro del elemento "root"
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// EXPLICACIÓN:
// 1. React necesita saber DÓNDE dibujar en el HTML
// 2. Le decimos que use el elemento "root"
// 3. Dentro dibuja el componente App
// 4. Todo lo que hace App aparece en pantalla
```

---

### ARCHIVO 2: frontend/src/App.jsx (ESTRUCTURA PRINCIPAL)

```javascript
// IMPORTAR librerías y componentes que necesitamos
import { BrowserRouter, Routes, Route } from 'react-router-dom'   // Para navegar entre páginas
import { AuthProvider } from './context/AuthContext'              // Para guardar usuario logueado
import { ThemeProvider } from './context/ThemeContext'            // Para tema claro/oscuro
import ProtectedRoute from './components/common/ProtectedRoute'    // Para proteger páginas
import LoginPage from './pages/auth/LoginPage'                    // Página de login
import DashboardPage from './pages/dashboard/DashboardPage'       // Panel principal
import ClientesPage from './pages/clientes/ClientesPage'          // Gestión de clientes
import PerfilPage from './pages/perfil/PerfilPage'                // Perfil del usuario

// COMPONENTE PRINCIPAL
export default function App() {
  return (
    // AuthProvider: Proporciona información del usuario a toda la app
    <AuthProvider>
      {/* ThemeProvider: Proporciona tema (claro/oscuro) a toda la app */}
      <ThemeProvider>
        {/* BrowserRouter: Permite navegar entre páginas sin recargar */}
        <BrowserRouter>
          {/* Define las rutas (URLs) de la aplicación */}
          <Routes>
            {/* Ruta 1: Login (pública, cualquiera puede entrar) */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Ruta 2: Dashboard (protegida, solo si estás logueado) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            
            {/* Ruta 3: Clientes (protegida) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/clientes" element={<ClientesPage />} />
            </Route>
            
            {/* Ruta 4: Perfil (protegida) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<PerfilPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

// EXPLICACIÓN DEL FLUJO:
// 1. Usuario entra a http://localhost:3002/login
//    → Ve LoginPage
// 2. Usuario hace login correctamente
//    → AuthProvider guarda sus datos (id, nombre, email, rol)
// 3. Usuario va a http://localhost:3002/dashboard
//    → ProtectedRoute verifica si está logueado
//    → Si SÍ → muestra DashboardPage
//    → Si NO → redirige a login
```

---

### ARCHIVO 3: frontend/src/context/AuthContext.jsx (GUARDAR USUARIO)

```javascript
// IMPORTAR
import { createContext, useState, useEffect } from 'react'

// CREAR contexto (para compartir datos entre componentes)
export const AuthContext = createContext()

// COMPONENTE PROVEEDOR (proporciona datos)
export function AuthProvider({ children }) {
  // STATE: Guardar usuario actual
  const [user, setUser] = useState(null)
  
  // EFFECT: Cuando carga la página, intentar restaurar usuario de localStorage
  useEffect(() => {
    // Buscar en localStorage (memoria del navegador)
    const storedUser = localStorage.getItem('user')
    
    if (storedUser) {
      // Si existe, parsearlo (convertir de JSON a JavaScript)
      setUser(JSON.parse(storedUser))
    }
  }, [])
  
  // FUNCIÓN: Guardar usuario cuando hace login
  const login = (userData) => {
    // userData = {id: 1, name: "Juan", email: "juan@ejemplo.com", role: "admin"}
    setUser(userData)                              // Guardar en memoria
    localStorage.setItem('user', JSON.stringify(userData))  // Guardar en navegador
  }
  
  // FUNCIÓN: Eliminar usuario cuando hace logout
  const logout = () => {
    setUser(null)                          // Limpiar memoria
    localStorage.removeItem('user')        // Limpiar navegador
  }
  
  // PROPORCIONAR datos a toda la app
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// EXPLICACIÓN:
// 1. AuthContext es como una "caja mágica" que cualquier componente puede abrir
// 2. Dentro de la caja hay: user, login(), logout()
// 3. Cuando haces login, guardar usuario en:
//    a) useState (memoria de React) - dura mientras estés en la página
//    b) localStorage (navegador) - dura incluso si cierras la página
// 4. Cuando carga la página, intentar restaurar usuario de localStorage
// 5. Así el usuario sigue logueado aunque cierre y abra el navegador
```

---

### ARCHIVO 4: frontend/src/hooks/useAuth.js (ACCEDER AL USUARIO)

```javascript
// IMPORTAR
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// HOOK PERSONALIZADO para acceder al usuario
export function useAuth() {
  // Acceder al contexto
  const context = useContext(AuthContext)
  
  // Si no existe el contexto, error
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  
  // Devolver los datos
  return context
}

// COMO USARLO EN CUALQUIER COMPONENTE:
// function MiComponente() {
//   const { user, login, logout } = useAuth()
//   
//   return <p>Hola {user.name}</p>
// }

// EXPLICACIÓN:
// 1. useAuth() es un "atajo" para acceder a AuthContext
// 2. En lugar de importar AuthContext y usar useContext()
// 3. Simplemente importas useAuth y lo usas
// 4. Mucho más fácil y limpio
```

---

### ARCHIVO 5: frontend/src/pages/auth/LoginPage.jsx (FORMULARIO DE LOGIN)

```javascript
// IMPORTAR
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'      // Para navegar a otra página
import { useAuth } from '../../hooks/useAuth'       // Para guardar usuario logueado
import './AuthPage.css'

// CONSTANTE: URL del servidor
const API = 'http://localhost/RoomMaster_Prueba/backend'

// COMPONENTE
export default function LoginPage() {
  // STATE 1: Guardar correo y contraseña que escribe el usuario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // STATE 2: Mostrar mensajes de error
  const [error, setError] = useState('')
  
  // STATE 3: Indicar si está cargando (esperando respuesta del servidor)
  const [loading, setLoading] = useState(false)
  
  // HOOK: Para navegar entre páginas
  const navigate = useNavigate()
  
  // HOOK: Para guardar usuario logueado
  const { login } = useAuth()
  
  // FUNCIÓN: Cuando hace clic en "Login"
  async function handleLogin(e) {
    e.preventDefault()                    // No recargar la página
    setError('')                          // Limpiar errores anteriores
    setLoading(true)                      // Mostrar que está cargando
    
    try {
      // ENVIAR login al servidor
      const response = await fetch(API + '/login.php', {
        method: 'POST',                   // Enviar datos (POST)
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      
      // Recibir respuesta del servidor
      const data = await response.json()
      
      // VERIFICAR si el login fue exitoso
      if (data.exito) {
        // Login correcto
        login(data.usuario)               // Guardar usuario logueado
        navigate('/dashboard')            // Ir al dashboard
      } else {
        // Login falló
        setError(data.mensaje)            // Mostrar mensaje de error
      }
    } catch (err) {
      // Error de conexión con servidor
      setError('Error de conexión con el servidor')
      console.error(err)
    } finally {
      setLoading(false)                   // Dejar de mostrar que carga
    }
  }
  
  // RENDERIZAR (lo que ve el usuario)
  return (
    <div className="auth-page">
      <form onSubmit={handleLogin}>
        {/* Título */}
        <h1>RoomMaster - Login</h1>
        
        {/* Mostrar error si existe */}
        {error && <div className="error">{error}</div>}
        
        {/* Input: Email */}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}  // Guardar en state
          required
        />
        
        {/* Input: Contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}  // Guardar en state
          required
        />
        
        {/* Botón */}
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

// EXPLICACIÓN DEL FLUJO:
// 1. Usuario escribe email → onChange → setEmail actualiza
// 2. Usuario escribe contraseña → onChange → setPassword actualiza
// 3. Usuario hace clic en "Ingresar" → handleLogin se ejecuta
// 4. handleLogin envía email y contraseña al servidor PHP
// 5. Servidor verifica en BD y responde
// 6. Si correcto → guardar usuario y ir a dashboard
// 7. Si incorrecto → mostrar error
```

---

### ARCHIVO 6: backend/config.php (CONEXIÓN A BASE DE DATOS)

```php
<?php
// CONFIGURACIÓN DE CONEXIÓN A LA BASE DE DATOS

// DEFINIR constantes (variables que no cambian)
define('DB_HOST', 'localhost');        // Servidor WHERE está MySQL
define('DB_USER', 'root');             // Usuario de MySQL
define('DB_PASS', '');                 // Contraseña de MySQL (vacía en XAMPP)
define('DB_NAME', 'roommaster_db');    // Nombre de la base de datos

// CREAR conexión
$conexion = new mysqli(
  DB_HOST,    // 'localhost'
  DB_USER,    // 'root'
  DB_PASS,    // ''
  DB_NAME     // 'roommaster_db'
);

// VERIFICAR conexión
if ($conexion->connect_error) {
  // Si hay error, mostrar y parar
  die("Error de conexión: " . $conexion->connect_error);
}

// CONFIGURAR para usar UTF-8 (soportar acentos, ñ, etc.)
$conexion->set_charset("utf8");

// EXPLICACIÓN:
// 1. define() = crear variable que no cambia
// 2. mysqli = clase de PHP para conectar a MySQL
// 3. $conexion = guardamos la conexión en una variableúltim
// 4. Si erro → die() = parar ejecución y mostrar error
// 5. set_charset = permitir caracteres especiales
// 6. Este archivo se importa en TODOS los endpoints PHP
?>
```

---

### ARCHIVO 7: backend/functions.php (FUNCIONES REUTILIZABLES)

```php
<?php
// FUNCIONES QUE USAMOS EN MÚLTIPLES ARCHIVOS

// FUNCIÓN 1: Obtener datos enviados (GET, POST, PUT, DELETE)
function obtenerDatos() {
  $metodo = $_SERVER['REQUEST_METHOD'];
  
  if ($metodo === 'GET') {
    // Si es GET → buscar en URL
    return $_GET;
  } elseif ($metodo === 'POST' || $metodo === 'PUT' || $metodo === 'DELETE') {
    // Si es POST/PUT/DELETE → buscar en el cuerpo
    $json = file_get_contents('php://input');
    return json_decode($json, true);
  }
  
  return [];
}

// EXPLICACIÓN DE obtenerDatos():
// GET:    http://api.com/usuarios.php?id=1
//         → $_GET['id'] = 1
// POST:   Enviar datos en el cuerpo
//         → json_decode convierte JSON a PHP

// FUNCIÓN 2: Ejecutar consulta SELECT (leer datos)
function ejecutarConsulta($conexion, $sql) {
  $resultado = $conexion->query($sql);
  
  if (!$resultado) {
    return ['error' => $conexion->error];
  }
  
  $datos = [];
  while ($fila = $resultado->fetch_assoc()) {
    // fetch_assoc() convierte cada fila en array
    $datos[] = $fila;
  }
  
  return $datos;
}

// EXPLICACIÓN:
// 1. Ejecutar SELECT (trae filas)
// 2. Si error → devolver array con error
// 3. Si OK → convertir filas a array
// 4. Devolver array con todos los datos

// FUNCIÓN 3: Ejecutar acción (INSERT, UPDATE, DELETE)
function ejecutarAccion($conexion, $sql) {
  if (!$conexion->query($sql)) {
    return ['error' => $conexion->error];
  }
  
  return ['exito' => true];
}

// EXPLICACIÓN:
// 1. Ejecutar INSERT/UPDATE/DELETE (no trae filas)
// 2. Si error → devolver array con error
// 3. Si OK → devolver exito = true

// FUNCIÓN 4: Enviar respuesta JSON al frontend
function responder($exito, $mensaje, $datos = null, $codigo = 200) {
  // Configurar que devolvemos JSON
  header('Content-Type: application/json');
  http_response_code($codigo);
  
  // Crear array de respuesta
  $respuesta = [
    'exito' => $exito,
    'mensaje' => $mensaje,
    'datos' => $datos
  ];
  
  // Convertir a JSON y enviar
  echo json_encode($respuesta);
  exit;
}

// EXPLICACIÓN:
// 1. header() = decir que enviamos JSON
// 2. http_response_code() = código HTTP (200=OK, 400=error, etc.)
// 3. json_encode() = convertir array PHP a JSON
// 4. Ejemplo respuesta:
//    {
//      "exito": true,
//      "mensaje": "Clientes obtenidos",
//      "datos": [{id: 1, nombre: "Juan"}, ...]
//    }
?>
```

---

### ARCHIVO 8: backend/clientes.php (API DE CLIENTES)

```php
<?php
// API PARA GESTIONAR CLIENTES
// Soporta: GET (leer), POST (crear), PUT (editar), DELETE (eliminar)

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

// Obtener método HTTP (GET, POST, PUT, DELETE)
$metodo = $_SERVER['REQUEST_METHOD'];

// Obtener datos enviados
$datos = obtenerDatos();

// ==================== GET ====================
// Obtener lista de clientes
if ($metodo === 'GET') {
  // Consulta SQL: seleccionar TODOS los clientes
  $sql = "SELECT id, nombre, email, telefono, documento_identidad 
          FROM clientes 
          WHERE estado = 'activo'";
  
  // Ejecutar consulta
  $resultado = ejecutarConsulta($conexion, $sql);
  
  if (isset($resultado['error'])) {
    responder(false, 'Error al obtener clientes', null, 500);
  }
  
  // Responder con datos
  responder(true, 'Clientes obtenidos', $resultado);
}

// ==================== POST ====================
// Crear nuevo cliente
elseif ($metodo === 'POST') {
  // Obtener datos del cliente a crear
  $nombre = $datos['nombre'] ?? null;
  $email = $datos['email'] ?? null;
  $telefono = $datos['telefono'] ?? null;
  
  // Validar que llegaron todos los datos
  if (!$nombre || !$email || !$telefono) {
    responder(false, 'Faltan datos requeridos', null, 400);
  }
  
  // Escapar datos (prevenir inyección SQL)
  $nombre = $conexion->real_escape_string($nombre);
  $email = $conexion->real_escape_string($email);
  $telefono = $conexion->real_escape_string($telefono);
  
  // Consulta SQL: insertar nuevo cliente
  $sql = "INSERT INTO clientes (nombre, email, telefono, estado) 
          VALUES ('$nombre', '$email', '$telefono', 'activo')";
  
  // Ejecutar acción
  $resultado = ejecutarAccion($conexion, $sql);
  
  if (isset($resultado['error'])) {
    responder(false, 'Error al crear cliente', null, 500);
  }
  
  responder(true, 'Cliente creado exitosamente');
}

// ==================== PUT ====================
// Actualizar cliente existente
elseif ($metodo === 'PUT') {
  $id = $datos['id'] ?? null;
  $nombre = $datos['nombre'] ?? null;
  
  if (!$id || !$nombre) {
    responder(false, 'Faltan datos requeridos', null, 400);
  }
  
  $id = intval($id);
  $nombre = $conexion->real_escape_string($nombre);
  
  $sql = "UPDATE clientes 
          SET nombre = '$nombre' 
          WHERE id = $id";
  
  $resultado = ejecutarAccion($conexion, $sql);
  
  if (isset($resultado['error'])) {
    responder(false, 'Error al actualizar cliente', null, 500);
  }
  
  responder(true, 'Cliente actualizado exitosamente');
}

// ==================== DELETE ====================
// Eliminar cliente (soft delete - marcar como inactivo)
elseif ($metodo === 'DELETE') {
  $id = $datos['id'] ?? null;
  
  if (!$id) {
    responder(false, 'ID requerido', null, 400);
  }
  
  $id = intval($id);
  
  // No eliminar, solo marcar como inactivo
  $sql = "UPDATE clientes 
          SET estado = 'inactivo' 
          WHERE id = $id";
  
  $resultado = ejecutarAccion($conexion, $sql);
  
  if (isset($resultado['error'])) {
    responder(false, 'Error al eliminar cliente', null, 500);
  }
  
  responder(true, 'Cliente eliminado exitosamente');
}

// Si es otro método HTTP, error
else {
  responder(false, 'Método no permitido', null, 405);
}

// EXPLICACIÓN DEL FLUJO:
// 1. Frontend hace request GET/POST/PUT/DELETE a este archivo
// 2. PHP verifica el $metodo
// 3. Según el método:
//    - GET: devuelve todos los clientes
//    - POST: crea cliente nuevo
//    - PUT: actualiza cliente existente
//    - DELETE: marca cliente como eliminado
// 4. Envía respuesta JSON al frontend
// 5. Frontend recibe datos y actualiza pantalla
?>
```

---

### ARCHIVO 9: frontend/src/pages/clientes/ClientesPage.jsx (GESTIÓN DE CLIENTES)

```javascript
// PÁGINA PARA GESTIONAR CLIENTES
// Permite: Ver lista, crear, editar, eliminar clientes

import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import Table from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import Icon from '../../components/common/Icon'
import './ModulePage.css'

// URL del servidor
const API = 'http://localhost/RoomMaster_Prueba/backend'

export default function ClientesPage() {
  // STATE 1: Lista de clientes
  const [clientes, setClientes] = useState([])
  
  // STATE 2: Si está cargando (esperando del servidor)
  const [loading, setLoading] = useState(true)
  
  // STATE 3: Si el modal está abierto
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // STATE 4: Cliente que se está editando (null si es nuevo)
  const [editando, setEditando] = useState(null)
  
  // STATE 5: Datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  })
  
  // EFECTO: Cuando carga la página
  useEffect(() => {
    cargarClientes()
  }, [])
  
  // FUNCIÓN 1: Obtener clientes del servidor
  async function cargarClientes() {
    try {
      setLoading(true)
      
      // HACER request GET al servidor
      const response = await fetch(API + '/clientes.php')
      const data = await response.json()
      
      if (data.exito) {
        // Si OK → guardar clientes
        setClientes(data.datos)
      } else {
        // Si error → mostrar
        alert('Error: ' + data.mensaje)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }
  
  // FUNCIÓN 2: Cuando hace clic en "Nuevo Cliente"
  function abrirModalNuevo() {
    setEditando(null)
    setFormData({ nombre: '', email: '', telefono: '' })
    setIsModalOpen(true)
  }
  
  // FUNCIÓN 3: Cuando hace clic en "Editar"
  function abrirModalEditar(cliente) {
    setEditando(cliente)
    setFormData({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono
    })
    setIsModalOpen(true)
  }
  
  // FUNCIÓN 4: Cuando escribe en un input
  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value  // Actualizar solo el campo que cambió
    }))
  }
  
  // FUNCIÓN 5: Guardar cliente (crear o editar)
  async function guardarCliente() {
    if (!formData.nombre || !formData.email || !formData.telefono) {
      alert('Por favor completa todos los campos')
      return
    }
    
    try {
      let response
      
      if (editando) {
        // EDITAR: PUT request
        response = await fetch(API + '/clientes.php', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editando.id,
            ...formData
          })
        })
      } else {
        // CREAR: POST request
        response = await fetch(API + '/clientes.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      
      const data = await response.json()
      
      if (data.exito) {
        alert('Cliente guardado correctamente')
        setIsModalOpen(false)
        cargarClientes()  // Recargar lista
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar cliente')
    }
  }
  
  // FUNCIÓN 6: Eliminar cliente
  async function eliminarCliente(id) {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) {
      return
    }
    
    try {
      const response = await fetch(API + '/clientes.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      })
      
      const data = await response.json()
      
      if (data.exito) {
        alert('Cliente eliminado')
        cargarClientes()  // Recargar lista
      } else {
        alert('Error: ' + data.mensaje)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar cliente')
    }
  }
  
  // RENDERIZAR (lo que ve el usuario)
  return (
    <DashboardLayout>
      <div className="module-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>👥 Gestión de Clientes</h1>
          <button onClick={abrirModalNuevo} className="btn btn-primary">
            + Nuevo Cliente
          </button>
        </div>
        
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <Table
            columns={['ID', 'Nombre', 'Email', 'Teléfono', 'Acciones']}
            data={clientes.map(cliente => [
              cliente.id,
              cliente.nombre,
              cliente.email,
              cliente.telefono,
              <div key={cliente.id}>
                <button onClick={() => abrirModalEditar(cliente)} className="btn btn-small">
                  Editar
                </button>
                <button onClick={() => eliminarCliente(cliente.id)} className="btn btn-danger">
                  Eliminar
                </button>
              </div>
            ])}
          />
        )}
        
        {/* MODAL para crear/editar */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editando ? 'Editar Cliente' : 'Nuevo Cliente'}
        >
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleInputChange}
          />
          <button onClick={guardarCliente} className="btn btn-primary">
            Guardar
          </button>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

// EXPLICACIÓN DEL FLUJO COMPLETO:
// 1. Página carga:
//    → useEffect se ejecuta
//    → cargarClientes() hace GET a /clientes.php
//    → Recibe lista de clientes
//    → setClientes actualiza state
//    → React re-renderiza tabla con clientes
//
// 2. Usuario hace clic en "+ Nuevo Cliente":
//    → abrirModalNuevo() abre el modal
//    → Usuario rellena formulario
//    → Usuario hace clic en "Guardar"
//    → guardarCliente() hace POST a /clientes.php
//    → Servidor crea cliente en BD
//    → Recargar lista de clientes
//
// 3. Usuario hace clic en "Editar":
//    → abrirModalEditar() abre modal con datos
//    → Usuario modifica datos
//    → guardarCliente() hace PUT a /clientes.php
//    → Servidor actualiza cliente
//    → Recargar lista
//
// 4. Usuario hace clic en "Eliminar":
//    → eliminarCliente() hace DELETE a /clientes.php
//    → Servidor marca cliente como inactivo
//    → Recargar lista (cliente desaparece)
```

---

### ARCHIVO 10: frontend/src/components/layouts/DashboardLayout.jsx (NAVEGACIÓN)

```javascript
// DISEÑO GENERAL DE LA APP
// Contiene: Logo, menú, sidebar, etc.

import { Sidebar } from '../common/Sidebar'
import { Navbar } from '../common/Navbar'
import './DashboardLayout.css'

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      {/* SIDEBAR izquierda: menú de navegación */}
      <Sidebar />
      
      <div className="main-content">
        {/* NAVBAR arriba: logo y datos del usuario */}
        <Navbar />
        
        {/* CONTENIDO PRINCIPAL: se reemplaza según página */}
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  )
}

// EXPLICACIÓN:
// 1. DashboardLayout es como un "marco" que contiene:
//    - Sidebar (menú izq)
//    - Navbar (arriba)
//    - Contenido (centro)
// 2. {children} = lo que pasamos desde otras páginas
// 3. Ejemplo:
//    <DashboardLayout>
//      <ClientesPage />    ← esto es {children}
//    </DashboardLayout>
```

---

## RESUMEN FINAL

**¿Cómo funciona RoomMaster?**

1. **Backend (PHP)** - Maneja los datos:
   - Recibe solicitudes del frontend
   - Consulta la base de datos MySQL
   - Responde con JSON

2. **Frontend (React)** - Interfaz visual:
   - Muestra botones, formularios, tablas
   - Envía solicitudes al backend
   - Recibe datos y actualiza pantalla

3. **Base de datos (MySQL)** - Guarda todo:
   - Clientes, usuarios, estadías, etc.
   - El backend accede a esta BD

**Flujo completo:**
```
Usuario escribe en formulario
    ↓
React detecta change
    ↓
React guarda en state
    ↓
Usuario hace clic en "Guardar"
    ↓
Java script fetch() envío al backend
    ↓
PHP recibe y valida datos
    ↓
PHP consulta/actualiza MySQL
    ↓
PHP responde con JSON
    ↓
JavaScript recibe respuesta
    ↓
React actualiza state
    ↓
Re-renderiza pantalla
    ↓
Usuario ve cambios
```

**Conceptos clave:**
- **React** = La interfaz cambia sin recargar
- **Hooks** = useState y useEffect para guardar datos
- **Fetch** = Comunicación entre frontend y backend
- **JSON** = Formato de intercambio de datos
- **Protected Routes** = Solo si estás logueado
- **Context** = Compartir datos (usuario, tema)

---

**¡Fin de la explicación completa!**

Ahora tienes toda la información en UN SOLO lugar.
Lee, entiende, y ¡explícalo en tu presentación! 🎉
