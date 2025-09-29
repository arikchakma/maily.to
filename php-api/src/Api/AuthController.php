<?php

namespace Maily\Api;

use Maily\Core\Auth;

class AuthController
{
    private Auth $auth;

    public function __construct()
    {
        $this->auth = new Auth();
    }

    public function callback(): void
    {
        // Handle OAuth callback (Google, GitHub, etc.)
        // This would integrate with your preferred OAuth provider
        try {
            $user = $this->auth->handleCallback($_GET);
            
            if ($user) {
                // Set session/cookie
                $this->auth->setUserSession($user);
                
                // Redirect to main app
                header('Location: /');
                exit;
            } else {
                $this->sendError(400, 'Authentication failed');
            }
        } catch (Exception $e) {
            $this->sendError(500, 'Authentication error: ' . $e->getMessage());
        }
    }

    public function confirm(): void
    {
        // Handle email confirmation
        try {
            $token = $_GET['token'] ?? null;
            if (!$token) {
                $this->sendError(400, 'Token is required');
                return;
            }

            $confirmed = $this->auth->confirmEmail($token);
            if ($confirmed) {
                header('Location: /?confirmed=true');
                exit;
            } else {
                $this->sendError(400, 'Invalid or expired token');
            }
        } catch (Exception $e) {
            $this->sendError(500, 'Confirmation error: ' . $e->getMessage());
        }
    }

    public function logout(): void
    {
        try {
            $this->auth->logout();
            echo json_encode(['status' => 'ok']);
        } catch (Exception $e) {
            $this->sendError(500, 'Logout error: ' . $e->getMessage());
        }
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