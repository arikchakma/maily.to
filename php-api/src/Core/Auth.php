<?php

namespace Maily\Core;

class Auth
{
    private Database $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function getCurrentUser(): ?array
    {
        // Check for session-based auth
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (isset($_SESSION['user_id'])) {
            return $this->db->getUserById($_SESSION['user_id']);
        }

        // Check for API key or token-based auth
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
            return $this->validateToken($token);
        }

        return null;
    }

    public function handleCallback(array $params): ?array
    {
        // This is a simplified OAuth callback handler
        // In a real implementation, you'd integrate with OAuth providers
        
        $code = $params['code'] ?? null;
        $state = $params['state'] ?? null;
        
        if (!$code) {
            return null;
        }

        // For demo purposes, create a mock user
        // In production, you'd exchange the code for user info with the OAuth provider
        $mockUser = [
            'id' => uniqid('user_'),
            'email' => 'demo@example.com',
            'name' => 'Demo User',
            'avatar_url' => null
        ];

        // Save or update user in database
        $existingUser = $this->db->getUserByEmail($mockUser['email']);
        if ($existingUser) {
            return $existingUser;
        } else {
            $userId = $this->db->createUser($mockUser);
            return $this->db->getUserById($userId);
        }
    }

    public function setUserSession(array $user): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['name'];
    }

    public function confirmEmail(string $token): bool
    {
        // Implement email confirmation logic
        // For demo purposes, always return true
        return true;
    }

    public function logout(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        session_destroy();
    }

    private function validateToken(string $token): ?array
    {
        // Implement JWT or other token validation
        // For demo purposes, return null
        return null;
    }
}