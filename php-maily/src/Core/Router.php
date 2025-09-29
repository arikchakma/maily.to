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

    public function serveReactApp(): void
    {
        $indexPath = __DIR__ . '/../../dist/index.html';
        
        if (file_exists($indexPath)) {
            header('Content-Type: text/html');
            readfile($indexPath);
        } else {
            // Fallback to development mode
            $this->serveDevelopmentApp();
        }
    }

    private function serveDevelopmentApp(): void
    {
        // In development, redirect to the React dev server
        $devServerUrl = 'http://localhost:3000' . $_SERVER['REQUEST_URI'];
        
        // For development, we'll serve a simple HTML that loads the React app
        echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maily Editor</title>
    <script>
        // Redirect to React dev server in development
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            window.location.href = "http://localhost:3000";
        }
    </script>
</head>
<body>
    <div id="root">
        <h1>Maily Editor</h1>
        <p>Loading...</p>
        <p>If you see this message, please run the React development server:</p>
        <code>cd apps/web && npm run dev</code>
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