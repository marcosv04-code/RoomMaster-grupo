<?php
/**
 * ============================================
 * FUNCIONES REUTILIZABLES
 * Se usan en todos los endpoints
 * ============================================
 */

// Función para responder con JSON
function responder($success, $mensaje = '', $datos = null, $codigo = 200) {
    http_response_code($codigo);
    $respuesta = [
        'success' => $success,
        'mensaje' => $mensaje,
        'datos' => $datos
    ];
    echo json_encode($respuesta);
    exit();
}

// Función para obtener datos POST o JSON
function obtenerDatos() {
    $metodo = $_SERVER['REQUEST_METHOD'];
    
    if ($metodo === 'POST' || $metodo === 'PUT') {
        $input = file_get_contents('php://input');
        $datos = json_decode($input, true);
        return $datos ?? $_POST;
    }
    
    return $_GET;
}

// Función para validar campos obligatorios
function validarCampos($datos, $campos_obligatorios) {
    foreach ($campos_obligatorios as $campo) {
        if (!isset($datos[$campo]) || empty($datos[$campo])) {
            return "El campo '$campo' es obligatorio";
        }
    }
    return null;
}

// Función para escapar strings (seguridad básica)
function escapar($conexion, $valor) {
    return $conexion->real_escape_string($valor);
}

// Función para ejecutar consulta y retornar resultados
function ejecutarConsulta($conexion, $sql) {
    $resultado = $conexion->query($sql);
    
    if (!$resultado) {
        return ['error' => $conexion->error];
    }
    
    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }
    
    return $datos;
}

// Función para ejecutar INSERT/UPDATE/DELETE
function ejecutarAccion($conexion, $sql) {
    if (!$conexion->query($sql)) {
        return ['error' => $conexion->error];
    }
    
    return ['exito' => true, 'id' => $conexion->insert_id];
}

// Función para validar rol del usuario
function validarRol($rol_requerido, $rol_usuario) {
    // Limpiar espacios y convertir a minúsculas
    $rol_usuario = strtolower(trim($rol_usuario ?? ''));
    $rol_requerido = strtolower(trim($rol_requerido));
    
    // Permitir si el rol del usuario coincide
    if ($rol_usuario === $rol_requerido) {
        return true;
    }
    
    // Admin puede hacer todo
    if ($rol_usuario === 'admin') {
        return true;
    }
    
    return false;
}

// Función para validar múltiples roles
function validarRoles($roles_requeridos, $rol_usuario) {
    if (!is_array($roles_requeridos)) {
        $roles_requeridos = [$roles_requeridos];
    }
    
    $rol_usuario = strtolower($rol_usuario ?? '');
    
    // Admin puede hacer todo
    if ($rol_usuario === 'admin') {
        return true;
    }
    
    // Verificar si el rol está en la lista permitida
    foreach ($roles_requeridos as $rol) {
        if ($rol_usuario === strtolower($rol)) {
            return true;
        }
    }
    
    return false;
}

?>
