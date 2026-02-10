<?php
/**
 * ============================================
 * ENDPOINT DE CLIENTES
 * GET, POST, PUT, DELETE /backend/clientes.php
 * ============================================
 */

require_once 'cors.php';
require_once 'config.php';
require_once 'functions.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = obtenerDatos();

// GET - Obtener clientes
if ($metodo === 'GET') {
    $id = $datos['id'] ?? null;
    
    if ($id) {
        // Un cliente específico
        $id = intval($id);
        $sql = "SELECT * FROM clientes WHERE id = $id";
    } else {
        // Todos los clientes
        $sql = "SELECT * FROM clientes WHERE estado = 'activo' ORDER BY nombre";
    }
    
    $resultado = ejecutarConsulta($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Clientes obtenidos', $resultado);
}

// POST - Crear cliente
else if ($metodo === 'POST') {
    $error = validarCampos($datos, ['nombre', 'email', 'telefono']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $nombre = escapar($conexion, $datos['nombre']);
    $email = escapar($conexion, $datos['email']);
    $telefono = escapar($conexion, $datos['telefono']);
    $documento = escapar($conexion, $datos['documento_identidad'] ?? '');
    $tipo_documento = escapar($conexion, $datos['tipo_documento'] ?? 'cedula');
    $ciudad = escapar($conexion, $datos['ciudad'] ?? '');
    
    $sql = "INSERT INTO clientes (nombre, email, telefono, documento_identidad, tipo_documento, ciudad) 
            VALUES ('$nombre', '$email', '$telefono', '$documento', '$tipo_documento', '$ciudad')";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Cliente creado exitosamente', ['id' => $resultado['id']], 201);
}

// PUT - Actualizar cliente
else if ($metodo === 'PUT') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    $nombre = escapar($conexion, $datos['nombre'] ?? '');
    $email = escapar($conexion, $datos['email'] ?? '');
    $telefono = escapar($conexion, $datos['telefono'] ?? '');
    
    $sql = "UPDATE clientes SET nombre = '$nombre', email = '$email', telefono = '$telefono' WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Cliente actualizado exitosamente');
}

// DELETE - Eliminar cliente
else if ($metodo === 'DELETE') {
    $error = validarCampos($datos, ['id']);
    if ($error) {
        responder(false, $error, null, 400);
    }
    
    $id = intval($datos['id']);
    
    // Verificar que no tenga estadías
    $verificar = $conexion->query("SELECT COUNT(*) as cantidad FROM estadias WHERE cliente_id = $id");
    $fila = $verificar->fetch_assoc();
    
    if ($fila['cantidad'] > 0) {
        responder(false, 'No se puede eliminar: el cliente tiene estadías registradas', null, 400);
    }
    
    $sql = "DELETE FROM clientes WHERE id = $id";
    
    $resultado = ejecutarAccion($conexion, $sql);
    
    if (isset($resultado['error'])) {
        responder(false, $resultado['error'], null, 500);
    }
    
    responder(true, 'Cliente eliminado exitosamente');
}

else {
    responder(false, 'Método no permitido', null, 405);
}

?>
