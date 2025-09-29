<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Maily\Core\Editor;
use Maily\Core\EmailRenderer;
use Maily\Core\EmailTemplate;

// Simple routing
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove leading slash
$path = ltrim($path, '/');

// Route handling
switch ($path) {
    case '':
    case 'editor':
        include __DIR__ . '/../templates/editor.php';
        break;
    
    case 'api/save':
        header('Content-Type: application/json');
        $editor = new Editor();
        $result = $editor->saveTemplate($_POST);
        echo json_encode($result);
        break;
    
    case 'api/load':
        header('Content-Type: application/json');
        $editor = new Editor();
        $templateId = $_GET['id'] ?? null;
        $result = $editor->loadTemplate($templateId);
        echo json_encode($result);
        break;
    
    case 'api/export':
        header('Content-Type: text/html');
        $editor = new Editor();
        $templateId = $_GET['id'] ?? null;
        $result = $editor->exportTemplate($templateId);
        echo $result;
        break;
    
    case 'api/preview':
        header('Content-Type: text/html');
        $editor = new Editor();
        $result = $editor->previewTemplate($_POST);
        echo $result;
        break;
    
    default:
        http_response_code(404);
        echo 'Page not found';
        break;
}