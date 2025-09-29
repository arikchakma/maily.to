<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Maily\Core\Router;
use Maily\Core\Database;
use Maily\Core\Auth;
use Maily\Core\EmailRenderer;

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
    // Serve static files (built React app)
    if (file_exists(__DIR__ . '/../dist' . $path) && !is_dir(__DIR__ . '/../dist' . $path)) {
        $filePath = __DIR__ . '/../dist' . $path;
        $mimeType = mime_content_type($filePath);
        header('Content-Type: ' . $mimeType);
        readfile($filePath);
        exit;
    }

    // API Routes
    if (strpos($path, 'api/') === 0) {
        $router->handleApiRequest($path, $requestMethod);
    } else {
        // Serve React app for all other routes
        $router->serveReactApp();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}