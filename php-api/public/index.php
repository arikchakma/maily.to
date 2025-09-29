<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Maily\Core\Router;
use Maily\Core\Database;

// Initialize database
$db = new Database();

// Initialize router
$router = new Router();

// CORS headers for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get request info
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove leading slash
$path = ltrim($path, '/');

// Route handling
try {
    // API Routes - handle all API requests
    if (strpos($path, 'api/') === 0) {
        $router->handleApiRequest($path, $requestMethod);
    } else {
        // For non-API routes, serve the built React app
        $router->serveReactApp($path);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}