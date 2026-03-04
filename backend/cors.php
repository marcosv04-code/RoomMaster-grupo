<?php
/**
 * ============================================
 * CONFIGURACIÓN DE CORS Y HEADERS
 * Permite que el frontend React se conecte
 * ============================================
 */

// Determinar el origen permitido
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Lista de dominios permitidos
$allowed_origins = [
    'http://localhost',
    'http://localhost:5173',  // Vite dev server
    'http://localhost:8000',
    'http://127.0.0.1',
    'http://127.0.0.1:5173',
    'https://roommaster.site',
    'https://www.roommaster.site',
    'http://roommaster.site',    // Para desarrollo local
    'http://www.roommaster.site'
];

// Si el origen está en la lista permitida, aceptarlo
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}

// Headers CORS
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Si es una solicitud OPTIONS, responder y terminar
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

?>
