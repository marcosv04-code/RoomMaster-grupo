<?php
// Archivo de diagnóstico para verificar la BD

require_once 'config.php';

echo "=== DIAGNÓSTICO DE BASE DE DATOS ===\n\n";

// 1. Verificar conexión
echo "✓ Conexión a BD exitosa\n";
echo "Servidor: " . DB_HOST . "\n";
echo "Base de datos: " . DB_NAME . "\n\n";

// 2. Verificar tablas
echo "=== TABLAS ENCONTRADAS ===\n";
$result = $conexion->query("SHOW TABLES");
if ($result) {
    while ($row = $result->fetch_row()) {
        echo "- " . $row[0] . "\n";
    }
} else {
    echo "Error: " . $conexion->error . "\n";
}

echo "\n";

// 3. Verificar estructura de tabla clientes
echo "=== ESTRUCTURA DE TABLA 'clientes' ===\n";
$result = $conexion->query("DESCRIBE clientes");
if ($result) {
    echo "Campo | Tipo | Null | Clave | Default\n";
    echo "------|------|------|-------|----------\n";
    while ($row = $result->fetch_assoc()) {
        echo $row['Field'] . " | " . $row['Type'] . " | " . $row['Null'] . " | " . $row['Key'] . " | " . $row['Default'] . "\n";
    }
} else {
    echo "Error: La tabla 'clientes' no existe\n";
    echo "Detalles: " . $conexion->error . "\n";
}

echo "\n";

// 4. Verificar si hay datos
echo "=== DATOS EN 'clientes' ===\n";
$result = $conexion->query("SELECT COUNT(*) as total FROM clientes");
if ($result) {
    $row = $result->fetch_assoc();
    echo "Total de clientes: " . $row['total'] . "\n";
} else {
    echo "Error al contar: " . $conexion->error . "\n";
}

?>
