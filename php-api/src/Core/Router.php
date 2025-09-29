<?php

namespace Maily\Core;

use Maily\Api\TemplatesController;
use Maily\Api\EmailsController;
use Maily\Api\AuthController;

class Router
{
    private TemplatesController $templatesController;
    private EmailsController $emailsController;
    private AuthController $authController;

    public function __construct()
    {
        $this->templatesController = new TemplatesController();
        $this->emailsController = new EmailsController();
        $this->authController = new AuthController();
    }

    public function handleApiRequest(string $path, string $method): void
    {
        header('Content-Type: application/json');

        // Remove 'api/' prefix
        $path = substr($path, 4);

        try {
            switch ($path) {
                case 'v1/templates':
                    if ($method === 'POST') {
                        $this->templatesController->create();
                    } else {
                        $this->sendError(405, 'Method Not Allowed');
                    }
                    break;

                case preg_match('/^v1\/templates\/([^\/]+)$/', $path, $matches) ? true : false:
                    $templateId = $matches[1];
                    if ($method === 'POST') {
                        $this->templatesController->update($templateId);
                    } elseif ($method === 'DELETE') {
                        $this->templatesController->delete($templateId);
                    } else {
                        $this->sendError(405, 'Method Not Allowed');
                    }
                    break;

                case preg_match('/^v1\/templates\/([^\/]+)\/duplicate$/', $path, $matches) ? true : false:
                    $templateId = $matches[1];
                    if ($method === 'POST') {
                        $this->templatesController->duplicate($templateId);
                    } else {
                        $this->sendError(405, 'Method Not Allowed');
                    }
                    break;

                case 'v1/emails/preview':
                    if ($method === 'POST') {
                        $this->emailsController->preview();
                    } else {
                        $this->sendError(405, 'Method Not Allowed');
                    }
                    break;

                case 'auth/callback':
                    if ($method === 'GET') {
                        $this->authController->callback();
                    } else {
                        $this->sendError(405, 'Method Not Allowed');
                    }
                    break;

                case 'auth/confirm':
                    if ($method === 'GET') {
                        $this->authController->confirm();
                    } else {
                        $this->sendError(405, 'Method Not Allowed');
                    }
                    break;

                case 'auth/logout':
                    if ($method === 'POST') {
                        $this->authController->logout();
                    } else {
                        $this->sendError(405, 'Method Not Allowed');
                    }
                    break;

                default:
                    $this->sendError(404, 'Not Found');
                    break;
            }
        } catch (Exception $e) {
            $this->sendError(500, $e->getMessage());
        }
    }

    public function serveReactApp(string $path): void
    {
        // Check if it's a static file request
        $staticPath = __DIR__ . '/../../dist' . ($path ? '/' . $path : '');
        
        if (file_exists($staticPath) && !is_dir($staticPath)) {
            $this->serveStaticFile($staticPath);
            return;
        }

        // For SPA routing, always serve index.html
        $indexPath = __DIR__ . '/../../dist/index.html';
        
        if (file_exists($indexPath)) {
            header('Content-Type: text/html');
            readfile($indexPath);
        } else {
            // Development mode - serve a simple page that explains how to run the dev server
            $this->serveDevelopmentPage();
        }
    }

    private function serveStaticFile(string $filePath): void
    {
        $mimeType = mime_content_type($filePath);
        header('Content-Type: ' . $mimeType);
        readfile($filePath);
    }

    private function serveDevelopmentPage(): void
    {
        header('Content-Type: text/html');
        echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maily Editor - PHP Backend</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 4px; }
        code { background: #e9ecef; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
        .highlight { background: #fff3cd; padding: 10px; border-radius: 4px; border-left: 4px solid #ffc107; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Maily Editor - PHP Backend</h1>
        <p>This is the PHP backend for the Maily email editor. To run the full application:</p>
        
        <div class="step">
            <h3>1. Build the React Frontend</h3>
            <code>cd apps/web && npm run build</code>
        </div>
        
        <div class="step">
            <h3>2. Copy built files to PHP backend</h3>
            <code>cp -r apps/web/build/* php-api/dist/</code>
        </div>
        
        <div class="step">
            <h3>3. Install PHP dependencies</h3>
            <code>cd php-api && composer install</code>
        </div>
        
        <div class="step">
            <h3>4. Start PHP server</h3>
            <code>cd php-api && composer run serve</code>
        </div>
        
        <div class="highlight">
            <strong>Development Mode:</strong> For development, you can run the React dev server on port 3000 
            and the PHP API on port 8001, then proxy API requests from the React app to the PHP backend.
        </div>
    </div>
</body>
</html>';
    }

    private function sendError(int $code, string $message): void
    {
        http_response_code($code);
        echo json_encode([
            'status' => $code,
            'message' => $message,
            'errors' => []
        ]);
    }
}