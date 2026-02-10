<?php
/**
 * ============================================
 * EJEMPLOS DE CONEXIÓN A ROOMMASTER
 * Backend en PHP para RoomMaster
 * Nivel: Principiante - SENA
 * ============================================
 */

// ============================================
// 1. CONEXIÓN A LA BASE DE DATOS
// ============================================

// Datos de conexión
$servidor = "localhost";
$usuario = "root";
$contraseña = "";
$base_datos = "roommaster_db";

// Crear conexión
$conexion = new mysqli($servidor, $usuario, $contraseña, $base_datos);

// Verificar conexión
if ($conexion->connect_error) {
    die("❌ Error de conexión: " . $conexion->connect_error);
}

// Si la conexión es exitosa
echo "✅ Conexión exitosa a la base de datos<br><br>";

// Establecer charset UTF-8 para caracteres especiales
$conexion->set_charset("utf8");


// ============================================
// 2. CRUD BÁSICO (CREATE, READ, UPDATE, DELETE)
// ============================================

// ↓↓↓ EJEMPLO 1: CREAR (INSERT) UN NUEVO CLIENTE ↓↓↓
function crearCliente($nombre, $email, $telefono, $documento, $tipo_documento, $ciudad) {
    global $conexion;
    
    // Escapar caracteres especiales para evitar SQL injection
    $nombre = $conexion->real_escape_string($nombre);
    $email = $conexion->real_escape_string($email);
    $telefono = $conexion->real_escape_string($telefono);
    $documento = $conexion->real_escape_string($documento);
    
    // SQL para insertar
    $sql = "INSERT INTO clientes (nombre, email, telefono, documento_identidad, tipo_documento, ciudad) 
            VALUES ('$nombre', '$email', '$telefono', '$documento', '$tipo_documento', '$ciudad')";
    
    // Ejecutar
    if ($conexion->query($sql) === TRUE) {
        $id_nuevo = $conexion->insert_id; // Obtiene el ID del registro creado
        echo "✅ Cliente creado correctamente. ID: " . $id_nuevo . "<br>";
        return $id_nuevo;
    } else {
        echo "❌ Error al crear cliente: " . $conexion->error . "<br>";
        return false;
    }
}

// Ejemplo de uso:
// crearCliente("Luis García", "luis@email.com", "3001234572", "4444444444", "cedula", "Cartagena");


// ↓↓↓ EJEMPLO 2: LEER (SELECT) TODOS LOS CLIENTES ↓↓↓
function obtenerTodosLosClientes() {
    global $conexion;
    
    $sql = "SELECT * FROM clientes ORDER BY fecha_registro DESC";
    $resultado = $conexion->query($sql);
    
    if ($resultado->num_rows > 0) {
        echo "📋 CLIENTES REGISTRADOS:<br>";
        
        // Recorrer cada fila de resultados
        while ($fila = $resultado->fetch_assoc()) {
            echo "- " . $fila['nombre'] . " (" . $fila['email'] . ") <br>";
        }
    } else {
        echo "❌ No hay clientes registrados<br>";
    }
}

// Ejemplo de uso:
// obtenerTodosLosClientes();


// ↓↓↓ EJEMPLO 3: LEER UN CLIENTE POR ID ↓↓↓
function obtenerClientePorId($id) {
    global $conexion;
    
    $id = intval($id); // Convertir a número entero
    $sql = "SELECT * FROM clientes WHERE id = $id";
    $resultado = $conexion->query($sql);
    
    if ($resultado->num_rows > 0) {
        $cliente = $resultado->fetch_assoc();
        echo "👤 Cliente encontrado: " . $cliente['nombre'] . "<br>";
        return $cliente;
    } else {
        echo "❌ Cliente no encontrado<br>";
        return null;
    }
}

// Ejemplo de uso:
// $cliente = obtenerClientePorId(1);


// ↓↓↓ EJEMPLO 4: ACTUALIZAR (UPDATE) UN CLIENTE ↓↓↓
function actualizarCliente($id, $nombre, $email, $telefono) {
    global $conexion;
    
    $id = intval($id);
    $nombre = $conexion->real_escape_string($nombre);
    $email = $conexion->real_escape_string($email);
    $telefono = $conexion->real_escape_string($telefono);
    
    $sql = "UPDATE clientes SET nombre = '$nombre', email = '$email', telefono = '$telefono' WHERE id = $id";
    
    if ($conexion->query($sql) === TRUE) {
        echo "✅ Cliente actualizado correctamente<br>";
        return true;
    } else {
        echo "❌ Error al actualizar: " . $conexion->error . "<br>";
        return false;
    }
}

// Ejemplo de uso:
// actualizarCliente(1, "Juan Pérez García", "juan.nuevo@email.com", "3001234599");


// ↓↓↓ EJEMPLO 5: ELIMINAR (DELETE) UN CLIENTE ↓↓↓
function eliminarCliente($id) {
    global $conexion;
    
    $id = intval($id);
    
    // IMPORTANTE: Verificar primero que el cliente no tenga estadías
    $sql_verificar = "SELECT COUNT(*) as cantidad FROM estadias WHERE cliente_id = $id";
    $resultado = $conexion->query($sql_verificar);
    $fila = $resultado->fetch_assoc();
    
    if ($fila['cantidad'] > 0) {
        echo "❌ No se puede eliminar: El cliente tiene " . $fila['cantidad'] . " estadía(s)<br>";
        return false;
    }
    
    // Si no tiene estadías, eliminar
    $sql = "DELETE FROM clientes WHERE id = $id";
    
    if ($conexion->query($sql) === TRUE) {
        echo "✅ Cliente eliminado correctamente<br>";
        return true;
    } else {
        echo "❌ Error al eliminar: " . $conexion->error . "<br>";
        return false;
    }
}

// Ejemplo de uso:
// eliminarCliente(5);


// ============================================
// 3. OPERACIONES DE FACTURACIÓN
// ============================================

// ↓↓↓ OBTENER NÚMERO DE FACTURA SIGUIENTE ↓↓↓
function obtenerSiguienteNumeroFactura() {
    global $conexion;
    
    $sql = "SELECT COUNT(*) as cantidad FROM facturas";
    $resultado = $conexion->query($sql);
    $fila = $resultado->fetch_assoc();
    
    $numero = $fila['cantidad'] + 1;
    $numero_formateado = "FAC-" . str_pad($numero, 3, "0", STR_PAD_LEFT);
    
    return $numero_formateado;
}

// Ejemplo de uso:
// echo obtenerSiguienteNumeroFactura(); // FAC-004


// ↓↓↓ CREAR FACTURA ↓↓↓
function crearFactura($estadia_id, $cliente_id, $subtotal, $impuesto, $metodo_pago) {
    global $conexion;
    
    $total = $subtotal + $impuesto;
    $numero_factura = obtenerSiguienteNumeroFactura();
    
    $sql = "INSERT INTO facturas (numero_factura, estadia_id, cliente_id, subtotal, impuesto, total, estado, metodo_pago) 
            VALUES ('$numero_factura', $estadia_id, $cliente_id, $subtotal, $impuesto, $total, 'Pendiente', '$metodo_pago')";
    
    if ($conexion->query($sql) === TRUE) {
        $id_factura = $conexion->insert_id;
        echo "✅ Factura creada: " . $numero_factura . "<br>";
        return $id_factura;
    } else {
        echo "❌ Error: " . $conexion->error . "<br>";
        return false;
    }
}


// ↓↓↓ OBTENER TODAS LAS FACTURAS ↓↓↓
function obtenerFacturas($estado = null) {
    global $conexion;
    
    $sql = "SELECT f.*, c.nombre FROM facturas f 
            INNER JOIN clientes c ON f.cliente_id = c.id";
    
    if ($estado) {
        $estado = $conexion->real_escape_string($estado);
        $sql .= " WHERE f.estado = '$estado'";
    }
    
    $sql .= " ORDER BY f.fecha_factura DESC";
    
    $resultado = $conexion->query($sql);
    
    if ($resultado->num_rows > 0) {
        $facturas = array();
        while ($fila = $resultado->fetch_assoc()) {
            $facturas[] = $fila;
        }
        return $facturas;
    }
    return array();
}

// Ejemplo de uso:
// $facturas = obtenerFacturas('Pagada'); // Solo facturas pagadas


// ↓↓↓ MARCAR FACTURA COMO PAGADA ↓↓↓
function marcarFacturaComoPagada($numero_factura) {
    global $conexion;
    
    $numero_factura = $conexion->real_escape_string($numero_factura);
    
    $sql = "UPDATE facturas 
            SET estado = 'Pagada', fecha_pago = NOW() 
            WHERE numero_factura = '$numero_factura'";
    
    if ($conexion->query($sql) === TRUE) {
        echo "✅ Factura " . $numero_factura . " marcada como pagada<br>";
        return true;
    } else {
        echo "❌ Error: " . $conexion->error . "<br>";
        return false;
    }
}


// ============================================
// 4. OPERACIONES DE TIENDA/PRODUCTOS
// ============================================

// ↓↓↓ OBTENER TODOS LOS PRODUCTOS ↓↓↓
function obtenerProductos($categoria = null) {
    global $conexion;
    
    $sql = "SELECT p.*, i.cantidad_actual as stock FROM productos p 
            LEFT JOIN inventario i ON p.id = i.producto_id 
            WHERE p.estado = 'activo'";
    
    if ($categoria) {
        $categoria = $conexion->real_escape_string($categoria);
        $sql .= " AND p.categoria = '$categoria'";
    }
    
    $sql .= " ORDER BY p.categoria, p.nombre";
    
    $resultado = $conexion->query($sql);
    
    if ($resultado->num_rows > 0) {
        $productos = array();
        while ($fila = $resultado->fetch_assoc()) {
            $productos[] = $fila;
        }
        return $productos;
    }
    return array();
}

// Ejemplo de uso:
// $bebidas = obtenerProductos('bebidas');


// ↓↓↓ REDUCIR STOCK DE PRODUCTO ↓↓↓
function reducirStockProducto($producto_id, $cantidad) {
    global $conexion;
    
    $producto_id = intval($producto_id);
    $cantidad = intval($cantidad);
    
    // Verificar que hay stock disponible
    $sql_verificar = "SELECT cantidad_actual FROM inventario WHERE producto_id = $producto_id";
    $resultado = $conexion->query($sql_verificar);
    $fila = $resultado->fetch_assoc();
    
    if ($fila['cantidad_actual'] < $cantidad) {
        echo "❌ Stock insuficiente de producto $producto_id<br>";
        return false;
    }
    
    // Rebajar stock
    $sql = "UPDATE inventario SET cantidad_actual = cantidad_actual - $cantidad WHERE producto_id = $producto_id";
    
    if ($conexion->query($sql) === TRUE) {
        echo "✅ Stock reducido correctamente<br>";
        return true;
    } else {
        echo "❌ Error: " . $conexion->error . "<br>";
        return false;
    }
}

// Ejemplo de uso:
// reducirStockProducto(1, 5); // Reducir 5 unidades del producto 1


// ↓↓↓ REGISTRAR VENTA ↓↓↓
function registrarVenta($factura_id, $estadia_id, $producto_id, $cantidad, $precio_unitario, $huesped = '') {
    global $conexion;
    
    $factura_id = intval($factura_id);
    $estadia_id = intval($estadia_id);
    $producto_id = intval($producto_id);
    $cantidad = intval($cantidad);
    $precio_unitario = floatval($precio_unitario);
    $subtotal = $cantidad * $precio_unitario;
    
    $huesped = $conexion->real_escape_string($huesped);
    
    $sql = "INSERT INTO ventas (factura_id, estadia_id, producto_id, cantidad, precio_unitario, subtotal, huésped) 
            VALUES ($factura_id, $estadia_id, $producto_id, $cantidad, $precio_unitario, $subtotal, '$huesped')";
    
    if ($conexion->query($sql) === TRUE) {
        // Reducir stock automáticamente
        reducirStockProducto($producto_id, $cantidad);
        echo "✅ Venta registrada<br>";
        return true;
    } else {
        echo "❌ Error: " . $conexion->error . "<br>";
        return false;
    }
}


// ============================================
// 5. REPORTES Y ESTADÍSTICAS
// ============================================

// ↓↓↓ OBTENER INGRESOS TOTALES ↓↓↓
function obtenerIngresos() {
    global $conexion;
    
    $sql = "SELECT 
            COUNT(*) as total_facturas,
            SUM(CASE WHEN estado = 'Pagada' THEN total ELSE 0 END) as pagado,
            SUM(CASE WHEN estado = 'Pendiente' THEN total ELSE 0 END) as pendiente,
            SUM(CASE WHEN estado = 'Cancelada' THEN total ELSE 0 END) as cancelado,
            SUM(total) as total_general
            FROM facturas";
    
    $resultado = $conexion->query($sql);
    return $resultado->fetch_assoc();
}

// Ejemplo de uso:
// $ingresos = obtenerIngresos();
// echo "Pagado: $" . $ingresos['pagado'];


// ↓↓↓ OCUPACIÓN DE HABITACIONES ↓↓↓
function obtenerOcupacion() {
    global $conexion;
    
    $sql = "SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN estado = 'disponible' THEN 1 ELSE 0 END) as disponibles,
            SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) as ocupadas,
            ROUND(SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as porcentaje
            FROM habitaciones";
    
    $resultado = $conexion->query($sql);
    return $resultado->fetch_assoc();
}

// Ejemplo de uso:
// $ocupacion = obtenerOcupacion();
// echo "Ocupación: " . $ocupacion['porcentaje'] . "%";


// ============================================
// EJEMPLOS DE USO COMPLETO
// ============================================

echo "<h2>🔧 EJEMPLOS DE USO</h2><br>";

// Crear un cliente
// crearCliente("Rosa López", "rosa@email.com", "3001234580", "5555555555", "cedula", "Valledupar");

// Obtener todos los clientes
obtenerTodosLosClientes();

// Obtener ingresos
echo "<h2>💰 ESTADO FINANCIERO</h2><br>";
$ingresos = obtenerIngresos();
echo "Total de facturas: " . $ingresos['total_facturas'] . "<br>";
echo "💵 Pagado: $" . number_format($ingresos['pagado'], 2) . "<br>";
echo "⏳ Pendiente: $" . number_format($ingresos['pendiente'], 2) . "<br>";
echo "❌ Cancelado: $" . number_format($ingresos['cancelado'], 2) . "<br>";

// Obtener ocupación
echo "<h2>🛏️ OCUPACIÓN DE HABITACIONES</h2><br>";
$ocupacion = obtenerOcupacion();
echo "Disponibles: " . $ocupacion['disponibles'] . "<br>";
echo "Ocupadas: " . $ocupacion['ocupadas'] . "<br>";
echo "Porcentaje: " . $ocupacion['porcentaje'] . "%<br>";

// ============================================
// CERRAR CONEXIÓN
// ============================================
// $conexion->close();

?>
