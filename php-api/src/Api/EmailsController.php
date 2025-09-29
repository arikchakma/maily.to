<?php

namespace Maily\Api;

use Maily\Core\EmailRenderer;

class EmailsController
{
    private EmailRenderer $renderer;

    public function __construct()
    {
        $this->renderer = new EmailRenderer();
    }

    public function preview(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['content'])) {
            $this->sendError(400, 'Content is required');
            return;
        }

        try {
            $content = is_string($input['content']) ? json_decode($input['content'], true) : $input['content'];
            $previewText = $input['previewText'] ?? null;
            $theme = $input['theme'] ?? null;

            $html = $this->renderer->render($content, [
                'preview' => $previewText,
                'theme' => $theme,
                'pretty' => true
            ]);

            echo json_encode(['html' => $html]);
        } catch (Exception $e) {
            $this->sendError(500, 'Failed to render preview: ' . $e->getMessage());
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