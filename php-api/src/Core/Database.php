<?php

namespace Maily\Core;

use PDO;
use PDOException;

class Database
{
    private PDO $pdo;
    private string $dbPath;

    public function __construct()
    {
        $this->dbPath = __DIR__ . '/../../data/maily.db';
        $this->initializeDatabase();
    }

    private function initializeDatabase(): void
    {
        // Ensure data directory exists
        $dataDir = dirname($this->dbPath);
        if (!is_dir($dataDir)) {
            mkdir($dataDir, 0755, true);
        }

        try {
            $this->pdo = new PDO('sqlite:' . $this->dbPath);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->createTables();
        } catch (PDOException $e) {
            throw new Exception('Database connection failed: ' . $e->getMessage());
        }
    }

    private function createTables(): void
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                avatar_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS mails (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                preview_text TEXT,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            );

            CREATE INDEX IF NOT EXISTS idx_mails_user_id ON mails(user_id);
            CREATE INDEX IF NOT EXISTS idx_mails_created_at ON mails(created_at);
        ";

        $this->pdo->exec($sql);
    }

    public function createTemplate(array $data): string
    {
        $templateId = uniqid('template_');
        
        $sql = "INSERT INTO mails (id, user_id, title, preview_text, content) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $templateId,
            $data['user_id'],
            $data['title'],
            $data['preview_text'],
            $data['content']
        ]);

        return $templateId;
    }

    public function getTemplate(string $templateId, string $userId): ?array
    {
        $sql = "SELECT * FROM mails WHERE id = ? AND user_id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$templateId, $userId]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function updateTemplate(string $templateId, array $data, string $userId): bool
    {
        $sql = "UPDATE mails SET title = ?, preview_text = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $data['title'],
            $data['preview_text'],
            $data['content'],
            $templateId,
            $userId
        ]);

        return $stmt->rowCount() > 0;
    }

    public function deleteTemplate(string $templateId, string $userId): bool
    {
        $sql = "DELETE FROM mails WHERE id = ? AND user_id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$templateId, $userId]);

        return $stmt->rowCount() > 0;
    }

    public function getUserTemplates(string $userId): array
    {
        $sql = "SELECT * FROM mails WHERE user_id = ? ORDER BY updated_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId]);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createUser(array $data): string
    {
        $userId = uniqid('user_');
        
        $sql = "INSERT INTO users (id, email, name, avatar_url) VALUES (?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $userId,
            $data['email'],
            $data['name'] ?? null,
            $data['avatar_url'] ?? null
        ]);

        return $userId;
    }

    public function getUserByEmail(string $email): ?array
    {
        $sql = "SELECT * FROM users WHERE email = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$email]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function getUserById(string $userId): ?array
    {
        $sql = "SELECT * FROM users WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }
}