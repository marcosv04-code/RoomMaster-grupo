<?php
/**
 * ============================================
 * CONFIGURACIÓN DE CORS Y HEADERS
 * Permite que el frontend React se conecte
 * ============================================
 */

// Headers para CORS (Cross-Origin Resources Sharing)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Si es una solicitud OPTIONS, responder y terminar
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

?>
