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
            // Obtener inventario específico de una habitación (incluyendo las sin inventario)
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
                    FROM habitaciones h
                    LEFT JOIN inventario_habitaciones ih ON h.id = ih.habitacion_id
                    LEFT JOIN suministros s ON ih.suministro_id = s.id
                    WHERE h.id = ?
                    ORDER BY s.tipo, s.nombre";
            
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("i", $habitacion_id);
        } else {
            // Obtener inventario de TODAS las habitaciones (incluso sin inventario registrado)
            $sql = "SELECT 
                        ih.id,
                        ih.habitacion_id,
                        h.id as id_habitacion,
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
                    FROM habitaciones h
                    LEFT JOIN inventario_habitaciones ih ON h.id = ih.habitacion_id
                    LEFT JOIN suministros s ON ih.suministro_id = s.id
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
        $cantidad_estandar = $datosInput['cantidad_estandar'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['exito' => false, 'mensaje' => 'ID requerido']);
            return;
        }
        
        // Si solo actualiza cantidad_actual
        if ($cantidad_actual !== null && $cantidad_estandar === null) {
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
        }
        // Si solo actualiza cantidad_estandar
        else if ($cantidad_estandar !== null && $cantidad_actual === null) {
            $sql = "UPDATE inventario_habitaciones 
                    SET cantidad_estandar = ?,
                        necesita_reabastecimiento = CASE 
                            WHEN cantidad_actual < ? THEN TRUE 
                            ELSE FALSE 
                        END
                    WHERE id = ?";
            
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("iii", $cantidad_estandar, $cantidad_estandar, $id);
            $stmt->execute();
        }
        // Si actualiza ambas
        else if ($cantidad_actual !== null && $cantidad_estandar !== null) {
            $sql = "UPDATE inventario_habitaciones 
                    SET cantidad_actual = ?,
                        cantidad_estandar = ?,
                        necesita_reabastecimiento = CASE 
                            WHEN ? < ? THEN TRUE 
                            ELSE FALSE 
                        END
                    WHERE id = ?";
            
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param("iiiii", $cantidad_actual, $cantidad_estandar, $cantidad_actual, $cantidad_estandar, $id);
            $stmt->execute();
        }
        else {
            http_response_code(400);
            echo json_encode(['exito' => false, 'mensaje' => 'Debe proporcionar cantidad_actual o cantidad_estandar']);
            return;
        }
        
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

// POST - Reabastecimiento de habitación o crear inventario inicial
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Solo admin puede reabastecer o crear inventario
    if ($rol !== 'admin') {
        http_response_code(403);
        echo json_encode(['exito' => false, 'mensaje' => 'No tienes permiso para esta acción']);
        return;
    }
    
    try {
        $habitacion_id = $datosInput['habitacion_id'] ?? null;
        $action = $datosInput['action'] ?? 'reabastecer';
        
        if (!$habitacion_id) {
            http_response_code(400);
            echo json_encode(['exito' => false, 'mensaje' => 'habitacion_id requerido']);
            return;
        }
        
        // ACTION 1: Crear inventario inicial para habitación sin inventario
        if ($action === 'inicializar') {
            // Obtener todos los suministros
            $sqlSuministros = "SELECT id FROM suministros ORDER BY tipo, nombre";
            $resultSuministros = $conexion->query($sqlSuministros);
            
            $creados = 0;
            while ($suministro = $resultSuministros->fetch_assoc()) {
                $suministro_id = $suministro['id'];
                $cantidad_estandar = 5; // Cantidad estándar por defecto
                
                // Verificar si ya existe este inventario
                $sqlCheck = "SELECT id FROM inventario_habitaciones 
                           WHERE habitacion_id = ? AND suministro_id = ?";
                $stmtCheck = $conexion->prepare($sqlCheck);
                $stmtCheck->bind_param("ii", $habitacion_id, $suministro_id);
                $stmtCheck->execute();
                $existente = $stmtCheck->get_result()->fetch_assoc();
                
                // Si no existe, crearlo
                if (!$existente) {
                    $sqlInsert = "INSERT INTO inventario_habitaciones 
                                (habitacion_id, suministro_id, cantidad_actual, cantidad_estandar, necesita_reabastecimiento, ultima_actualizacion)
                                VALUES (?, ?, ?, ?, FALSE, NOW())";
                    $stmtInsert = $conexion->prepare($sqlInsert);
                    $stmtInsert->bind_param("iiii", $habitacion_id, $suministro_id, $cantidad_estandar, $cantidad_estandar);
                    if ($stmtInsert->execute()) {
                        $creados++;
                    }
                }
            }
            
            echo json_encode([
                'exito' => true,
                'mensaje' => "Inventario inicializado: $creados suministros registrados"
            ]);
        } 
        // ACTION 2: Reabastecer habitación (restaurar a cantidad estándar)
        else {
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
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Error en la operación: ' . $e->getMessage()
        ]);
    }
}

else {
    http_response_code(405);
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido']);
}
