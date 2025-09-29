<?php

namespace Maily\Api;

use Maily\Core\Database;
use Maily\Core\Auth;

class TemplatesController
{
    private Database $db;
    private Auth $auth;

    public function __construct()
    {
        $this->db = new Database();
        $this->auth = new Auth();
    }

    public function create(): void
    {
        $user = $this->auth->getCurrentUser();
        if (!$user) {
            $this->sendError(401, 'Unauthorized');
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate input
        $errors = [];
        if (empty($input['title']) || strlen(trim($input['title'])) < 3) {
            $errors[] = 'Title must be at least 3 characters';
        }
        if (empty($input['content'])) {
            $errors[] = 'Content is required';
        }

        if (!empty($errors)) {
            $this->sendError(400, 'Validation failed', $errors);
            return;
        }

        try {
            $templateId = $this->db->createTemplate([
                'title' => trim($input['title']),
                'preview_text' => $input['previewText'] ?? null,
                'content' => $input['content'],
                'user_id' => $user['id']
            ]);

            echo json_encode(['template' => ['id' => $templateId]]);
        } catch (Exception $e) {
            $this->sendError(500, 'Failed to create template');
        }
    }

    public function update(string $templateId): void
    {
        $user = $this->auth->getCurrentUser();
        if (!$user) {
            $this->sendError(401, 'Unauthorized');
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate input
        $errors = [];
        if (empty($input['title']) || strlen(trim($input['title'])) < 3) {
            $errors[] = 'Title must be at least 3 characters';
        }
        if (empty($input['content'])) {
            $errors[] = 'Content is required';
        }

        if (!empty($errors)) {
            $this->sendError(400, 'Validation failed', $errors);
            return;
        }

        try {
            $updated = $this->db->updateTemplate($templateId, [
                'title' => trim($input['title']),
                'preview_text' => $input['previewText'] ?? null,
                'content' => $input['content']
            ], $user['id']);

            if (!$updated) {
                $this->sendError(404, 'Template not found');
                return;
            }

            echo json_encode(['status' => 'ok']);
        } catch (Exception $e) {
            $this->sendError(500, 'Failed to update template');
        }
    }

    public function delete(string $templateId): void
    {
        $user = $this->auth->getCurrentUser();
        if (!$user) {
            $this->sendError(401, 'Unauthorized');
            return;
        }

        try {
            $deleted = $this->db->deleteTemplate($templateId, $user['id']);
            
            if (!$deleted) {
                $this->sendError(404, 'Template not found');
                return;
            }

            echo json_encode(['status' => 'ok']);
        } catch (Exception $e) {
            $this->sendError(500, 'Failed to delete template');
        }
    }

    public function duplicate(string $templateId): void
    {
        $user = $this->auth->getCurrentUser();
        if (!$user) {
            $this->sendError(401, 'Unauthorized');
            return;
        }

        try {
            $template = $this->db->getTemplate($templateId, $user['id']);
            if (!$template) {
                $this->sendError(404, 'Template not found');
                return;
            }

            $newTemplateId = $this->db->createTemplate([
                'title' => $template['title'] . ' (Copy)',
                'preview_text' => $template['preview_text'],
                'content' => $template['content'],
                'user_id' => $user['id']
            ]);

            echo json_encode(['template' => ['id' => $newTemplateId]]);
        } catch (Exception $e) {
            $this->sendError(500, 'Failed to duplicate template');
        }
    }

    private function sendError(int $code, string $message, array $errors = []): void
    {
        http_response_code($code);
        echo json_encode([
            'status' => $code,
            'message' => $message,
            'errors' => $errors
        ]);
    }
}