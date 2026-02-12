<?php
/**
 * Archivo de diagnóstico temporal
 * Muestra información sobre la base de datos
 */

require_once 'cors.php';
require_once 'config.php';

// Información de la base de datos
echo "=== DIAGNÓSTICO DE LA BASE DE DATOS ===\n\n";

// 1. Verificar conexión
echo "1. CONEXIÓN:\n";
echo "   Host: " . DB_HOST . "\n";
echo "   Usuario: " . DB_USER . "\n";
echo "   Base de datos: " . DB_NAME . "\n";
if ($conexion->connect_error) {
    echo "   Estado: ❌ ERROR - " . $conexion->connect_error . "\n";
} else {
    echo "   Estado: ✓ CONECTADO\n";
}

// 2. Verificar tabla habitaciones
echo "\n2. TABLA HABITACIONES:\n";
$sql = "SELECT COUNT(*) as total FROM habitaciones WHERE activa = TRUE";
$resultado = $conexion->query($sql);
if ($resultado) {
    $fila = $resultado->fetch_assoc();
    echo "   Total de habitaciones activas: " . $fila['total'] . "\n";
    
    if ($fila['total'] > 0) {
        echo "\n   Listado de habitaciones:\n";
        $sql2 = "SELECT id, numero_habitacion, tipo, estado, precio_noche FROM habitaciones WHERE activa = TRUE LIMIT 10";
        $resultado2 = $conexion->query($sql2);
        while ($hab = $resultado2->fetch_assoc()) {
            echo "   - ID: " . $hab['id'] . " | Nº: " . $hab['numero_habitacion'] . " | Tipo: " . $hab['tipo'] . " | Estado: " . $hab['estado'] . " | Precio: $" . $hab['precio_noche'] . "\n";
        }
    } else {
        echo "   ⚠️ NO HAY HABITACIONES EN LA BASE DE DATOS\n";
    }
} else {
    echo "   Error: " . $conexion->error . "\n";
}

// 3. Verificar tabla usuarios
echo "\n3. TABLA USUARIOS:\n";
$sql = "SELECT COUNT(*) as total FROM usuarios WHERE estado = 'activo'";
$resultado = $conexion->query($sql);
if ($resultado) {
    $fila = $resultado->fetch_assoc();
    echo "   Total de usuarios activos: " . $fila['total'] . "\n";
    
    if ($fila['total'] > 0) {
        echo "\n   Listado de usuarios:\n";
        $sql2 = "SELECT id, nombre, email, rol FROM usuarios WHERE estado = 'activo' LIMIT 10";
        $resultado2 = $conexion->query($sql2);
        while ($user = $resultado2->fetch_assoc()) {
            echo "   - ID: " . $user['id'] . " | Nombre: " . $user['nombre'] . " | Email: " . $user['email'] . " | Rol: " . $user['rol'] . "\n";
        }
    }
} else {
    echo "   Error: " . $conexion->error . "\n";
}

// 4. Estructura de tabla habitaciones
echo "\n4. ESTRUCTURA DE TABLA HABITACIONES:\n";
$sql = "DESCRIBE habitaciones";
$resultado = $conexion->query($sql);
if ($resultado) {
    while ($col = $resultado->fetch_assoc()) {
        echo "   - " . $col['Field'] . " (" . $col['Type'] . ") " . ($col['Null'] === 'NO' ? 'NOT NULL' : 'NULL') . "\n";
    }
} else {
    echo "   Error: " . $conexion->error . "\n";
}

echo "\n=== FIN DIAGNÓSTICO ===\n";
?>
