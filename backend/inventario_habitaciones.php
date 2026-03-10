<?php
header('Content-Type: application/json');
require_once 'cors.php';
require_once 'config.php';
require_once 'permissions.php';

// Obtener rol del usuario
$datosInput = json_decode(file_get_contents("php://input"), true) ?? [];
$rol = strtolower(trim($_POST['rol'] ?? $_GET['rol'] ?? $datosInput['rol'] ?? 'usuario'));

// GET - Obtener inventario por habitación
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $habitacion_id = $_GET['habitacion_id'] ?? null;
        
        if ($habitacion_id) {
            // Obtener inventario específico de una habitación
            $sql = "SELECT 
                        ih.id,
                        ih.habitacion_id,
                        h.numero_habitacion,
                        h.tipo as tipo_habitacion,
                        ih.suministro_id,
                        s.nombre as suministro_nombre,
                        s.tipo,
                        s.descripcion,
                        ih.cantidad_actual,
                        ih.cantidad_estandar,
                        ih.necesita_reabastecimiento,
                        ih.ultima_actualizacion
                    FROM inventario_habitaciones ih
                    JOIN habitaciones h ON ih.habitacion_id = h.id
                    JOIN suministros s ON ih.suministro_id = s.id
                    WHERE ih.habitacion_id = ?
                    ORDER BY s.tipo, s.nombre";
            
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("i", $habitacion_id);
        } else {
            // Obtener inventario de todas las habitaciones
            $sql = "SELECT 
                        ih.id,
                        ih.habitacion_id,
                        h.numero_habitacion,
                        h.tipo as tipo_habitacion,
                        h.estado as estado_habitacion,
                        ih.suministro_id,
                        s.nombre as suministro_nombre,
                        s.tipo,
                        s.descripcion,
                        ih.cantidad_actual,
                        ih.cantidad_estandar,
                        ih.necesita_reabastecimiento,
                        ih.ultima_actualizacion
                    FROM inventario_habitaciones ih
                    JOIN habitaciones h ON ih.habitacion_id = h.id
                    JOIN suministros s ON ih.suministro_id = s.id
                    ORDER BY h.numero_habitacion, s.tipo, s.nombre";
            
            $stmt = $conexion->prepare($sql);
        }
        
        $stmt->execute();
        $resultado = $stmt->get_result();
        $datos = [];
        
        while ($fila = $resultado->fetch_assoc()) {
            $datos[] = $fila;
        }
        
        echo json_encode([
            'exito' => true,
            'datos' => $datos,
            'total' => count($datos)
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error al obtener inventario: ' . $e->getMessage()
        ]);
    }
}

// PUT - Actualizar cantidad de suministro en una habitación
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Permitir admin y recepcionista
    if ($rol !== 'admin' && $rol !== 'recepcionista') {
        http_response_code(403);
        echo json_encode(['exito' => false, 'mensaje' => 'No tienes permiso para editar inventario']);
        return;
    }
    
    try {
        $id = $datosInput['id'] ?? null;
        $cantidad_actual = $datosInput['cantidad_actual'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['exito' => false, 'mensaje' => 'ID requerido']);
            return;
        }
        
        $sql = "UPDATE inventario_habitaciones 
                SET cantidad_actual = ?,
                    necesita_reabastecimiento = CASE 
                        WHEN ? < cantidad_estandar THEN TRUE 
                        ELSE FALSE 
                    END
                WHERE id = ?";
        
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("iii", $cantidad_actual, $cantidad_actual, $id);
        $stmt->execute();
        
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Inventario actualizado correctamente'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error al actualizar inventario: ' . $e->getMessage()
        ]);
    }
}

// POST - Reabastecimiento de habitación
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Solo admin puede reabastecer
    if ($rol !== 'admin') {
        http_response_code(403);
        echo json_encode(['exito' => false, 'mensaje' => 'No tienes permiso para reabastecer']);
        return;
    }
    
    try {
        $habitacion_id = $datosInput['habitacion_id'] ?? null;
        
        if (!$habitacion_id) {
            http_response_code(400);
            echo json_encode(['exito' => false, 'mensaje' => 'habitacion_id requerido']);
            return;
        }
        
        // Restaurar todos los suministros de una habitación a cantidad estándar
        $sql = "UPDATE inventario_habitaciones 
                SET cantidad_actual = cantidad_estandar,
                    necesita_reabastecimiento = FALSE,
                    ultima_actualizacion = NOW()
                WHERE habitacion_id = ?";
        
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("i", $habitacion_id);
        $stmt->execute();
        
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Habitación reabastecida correctamente'
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error al reabastecimiento: ' . $e->getMessage()
        ]);
    }
}

else {
    http_response_code(405);
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido']);
}
