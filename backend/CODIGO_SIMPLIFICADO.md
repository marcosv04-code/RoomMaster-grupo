# 🎯 CÓDIGO SIMPLIFICADO - Versiones Fáciles de Entender

> Estas son versiones simplificadas de los archivos PHP. Si quieres reemplazar los existentes, copia el contenido completo.

---

## 📄 1. config.php - Conexión Simple

```php
<?php
/**
 * CONECTAR A LA BASE DE DATOS
 * (Es lo primero que hace cada endpoint)
 */

// Datos para conectar a MySQL
$servidor = 'localhost';      // Dónde está
$usuario = 'root';            // Quién es
$contraseña = '';             // Su contraseña
$base_datos = 'roommaster_db'; // Cuál BD

// Conectar
$conexion = mysqli_connect($servidor, $usuario, $contraseña, $base_datos);

// ¿Si no se conecta?
if (!$conexion) {
    echo json_encode(['error' => 'No puedo conectar: ' . mysqli_connect_error()]);
    exit;
}

// Configurar para acentos
mysqli_set_charset($conexion, 'utf8');
?>
```

---

## 📄 2. cors.php - Permitir Comunicación

```php
<?php
/**
 * CORS - Permite que React hable con este servidor
 */

// Decirle al navegador que puede venir desde cualquier lugar
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Si es un preflight (test automático del navegador), responder ok
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
?>
```

---

## 📄 3. functions.php - Funciones Comunes

```php
<?php
/**
 * FUNCIONES QUE USAMOS EN TODOS LADOS
 */

// Responder en JSON (todos los endpoints lo hacen igual)
function respuesta($exito, $mensaje, $datos = null) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => $exito,
        'mensaje' => $mensaje,
        'datos' => $datos
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Obtener datos que manda React (en POST/PUT)
function obtenerJSON() {
    return json_decode(file_get_contents('php://input'), true);
}

// Ejecutar SELECT (traer datos)
function traerDatos($sql, $conexion) {
    $resultado = mysqli_query($conexion, $sql);
    if (!$resultado) {
        respuesta(false, 'Error BD: ' . mysqli_error($conexion));
    }
    return mysqli_fetch_all($resultado, MYSQLI_ASSOC);
}

// Ejecutar INSERT, UPDATE, DELETE (guardar datos)
function guardarDatos($sql, $conexion) {
    if (!mysqli_query($conexion, $sql)) {
        respuesta(false, 'Error BD: ' . mysqli_error($conexion));
    }
    return true;
}

// Proteger texto (evitar ataques)
function limpiar($texto, $conexion) {
    return mysqli_real_escape_string($conexion, $texto);
}
?>
```

---

## 📄 4. login.php - Autenticación

```php
<?php
/**
 * LOGIN - Usuario entra con email + contraseña
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respuesta(false, 'Solo POST');
}

// Obtener datos que manda React
$datos = obtenerJSON();
$email = $datos['email'] ?? '';
$pass = $datos['contraseña'] ?? '';

// Verificar que no falte nada
if (empty($email) || empty($pass)) {
    respuesta(false, 'Falta email o contraseña');
}

// Limpiar datos
$email_limpio = limpiar($email, $conexion);
$pass_hash = md5($pass);

// Buscar en BD
$sql = "SELECT id, nombre, email, rol 
        FROM usuarios 
        WHERE email='$email_limpio' 
        AND contraseña='$pass_hash' 
        AND estado='activo' 
        LIMIT 1";

$usuarios = traerDatos($sql, $conexion);

// ¿Encontró?
if (empty($usuarios)) {
    respuesta(false, 'Email o contraseña incorrecto');
}

// Crear token (para futuras peticiones)
$usuario = $usuarios[0];
$token = bin2hex(random_bytes(16));

respuesta(true, '✓ Login correcto', [
    'token' => $token,
    'usuario' => $usuario
]);
?>
```

---

## 📄 5. clientes.php - Gestionar Clientes

```php
<?php
/**
 * CLIENTES
 * GET: traer
 * POST: crear
 * PUT: editar
 * DELETE: eliminar
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];

// TRAER CLIENTES
if ($metodo === 'GET') {
    if (isset($_GET['id'])) {
        // Un cliente
        $id = intval($_GET['id']);
        $sql = "SELECT * FROM clientes WHERE id=$id";
    } else {
        // Todos los clientes
        $sql = "SELECT * FROM clientes ORDER BY id DESC";
    }
    
    $datos = traerDatos($sql, $conexion);
    respuesta(true, 'Clientes cargados', $datos);
}

// CREAR CLIENTE
else if ($metodo === 'POST') {
    $datos = obtenerJSON();
    
    $nombre = limpiar($datos['nombre'] ?? '', $conexion);
    $email = limpiar($datos['email'] ?? '', $conexion);
    $telefono = limpiar($datos['telefono'] ?? '', $conexion);
    
    // Verificar
    if (empty($nombre) || empty($email) || empty($telefono)) {
        respuesta(false, 'Falta: nombre, email, teléfono');
    }
    
    $sql = "INSERT INTO clientes (nombre, email, telefono, fecha_registro)
            VALUES ('$nombre', '$email', '$telefono', NOW())";
    
    guardarDatos($sql, $conexion);
    respuesta(true, '✓ Cliente creado');
}

// EDITAR CLIENTE
else if ($metodo === 'PUT') {
    $datos = obtenerJSON();
    $id = intval($datos['id'] ?? 0);
    
    if ($id <= 0) respuesta(false, 'ID inválido');
    
    $nombre = limpiar($datos['nombre'] ?? '', $conexion);
    $email = limpiar($datos['email'] ?? '', $conexion);
    $telefono = limpiar($datos['telefono'] ?? '', $conexion);
    
    $sql = "UPDATE clientes 
            SET nombre='$nombre', email='$email', telefono='$telefono' 
            WHERE id=$id";
    
    guardarDatos($sql, $conexion);
    respuesta(true, '✓ Cliente actualizado');
}

// ELIMINAR CLIENTE
else if ($metodo === 'DELETE') {
    $datos = obtenerJSON();
    $id = intval($datos['id'] ?? 0);
    
    if ($id <= 0) respuesta(false, 'ID inválido');
    
    $sql = "DELETE FROM clientes WHERE id=$id";
    guardarDatos($sql, $conexion);
    respuesta(true, '✓ Cliente eliminado');
}
?>
```

---

## 📄 6. React - Uso Simplificado

```javascript
/**
 * USAR EN TUS COMPONENTES REACT
 */

import { useState, useEffect } from 'react';

const API = 'http://localhost/roommaster/backend';

export function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    
    // Cuando carga la página
    useEffect(() => {
        traerClientes();
    }, []);
    
    // Traer clientes
    async function traerClientes() {
        const res = await fetch(`${API}/clientes.php`);
        const datos = await res.json();
        if (datos.success) {
            setClientes(datos.datos);
        }
    }
    
    // Crear cliente
    async function crearCliente(e) {
        e.preventDefault();
        
        const res = await fetch(`${API}/clientes.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, telefono })
        });
        
        const datos = await res.json();
        if (datos.success) {
            alert('✓ Cliente creado');
            setNombre('');
            setEmail('');
            setTelefono('');
            traerClientes(); // Recargar lista
        } else {
            alert('Error: ' + datos.mensaje);
        }
    }
    
    // Eliminar cliente
    async function eliminarCliente(id) {
        const res = await fetch(`${API}/clientes.php`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        
        const datos = await res.json();
        if (datos.success) {
            alert('✓ Cliente eliminado');
            traerClientes();
        }
    }
    
    return (
        <div>
            <h1>Clientes</h1>
            
            {/* Formulario para crear */}
            <form onSubmit={crearCliente}>
                <input 
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input 
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                />
                <button>Crear</button>
            </form>
            
            {/* Lista de clientes */}
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
                    {clientes.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.nombre}</td>
                            <td>{c.email}</td>
                            <td>{c.telefono}</td>
                            <td>
                                <button onClick={() => eliminarCliente(c.id)}>
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

---

## 🔄 PATRÓN GENERAL - Todos los Endpoints Funcionan Igual

```php
<?php
// 1. Importar archivos base
require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

// 2. Ver qué método HTTP es
$metodo = $_SERVER['REQUEST_METHOD'];

// 3. GET - Traer datos
if ($metodo === 'GET') {
    $sql = "SELECT * FROM tabla";
    $datos = traerDatos($sql, $conexion);
    respuesta(true, 'Datos cargados', $datos);
}

// 4. POST - Crear
else if ($metodo === 'POST') {
    $datos = obtenerJSON();
    $sql = "INSERT INTO tabla (columa1, columa2) VALUES (...)";
    guardarDatos($sql, $conexion);
    respuesta(true, '✓ Creado');
}

// 5. PUT - Editar
else if ($metodo === 'PUT') {
    $datos = obtenerJSON();
    $sql = "UPDATE tabla SET ... WHERE id=...";
    guardarDatos($sql, $conexion);
    respuesta(true, '✓ Actualizado');
}

// 6. DELETE - Eliminar
else if ($metodo === 'DELETE') {
    $datos = obtenerJSON();
    $sql = "DELETE FROM tabla WHERE id=...";
    guardarDatos($sql, $conexion);
    respuesta(true, '✓ Eliminado');
}
?>
```

---

## 📚 LISTA DE ENDPOINTS (Todos Siguen El Mismo Patrón)

| Endpoint | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| `/login.php` | ❌ | ✅ | ❌ | ❌ |
| `/clientes.php` | ✅ | ✅ | ✅ | ✅ |
| `/facturas.php` | ✅ | ✅ | ✅ | ✅ |
| `/productos.php` | ✅ | ✅ | ✅ | ✅ |
| `/ventas.php` | ✅ | ✅ | ❌ | ❌ |
| `/estadias.php` | ✅ | ✅ | ✅ | ❌ |
| `/reportes.php` | ✅ | ❌ | ❌ | ❌ |

---

## 💡 CLAVE IMPORTANTE

Todos los endpoints hacen lo mismo:

1. **Incluyen** los 3 archivos base (cors, config, functions)
2. **Verifican** el método HTTP (GET, POST, PUT, DELETE)
3. **Limpian** los datos que viene de React
4. **Ejecutan** una query SQL
5. **Responden** en JSON

**100% del código es este patrón.**

---

¡Ahora el código es mucho más simple de entender! 🎉
