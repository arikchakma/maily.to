<?php

namespace Maily\Core;

class EmailRenderer
{
    public function render(array $content, array $options = []): string
    {
        $preview = $options['preview'] ?? null;
        $theme = $options['theme'] ?? null;
        $pretty = $options['pretty'] ?? false;

        // This is a simplified renderer
        // In a real implementation, you'd use the same rendering logic as the React version
        
        $html = $this->renderContent($content);
        
        // Wrap in email template
        $emailHtml = $this->wrapInEmailTemplate($html, $preview, $theme);
        
        if ($pretty) {
            $emailHtml = $this->prettifyHtml($emailHtml);
        }

        return $emailHtml;
    }

    private function renderContent(array $content): string
    {
        if (!isset($content['content']) || !is_array($content['content'])) {
            return '<p>No content to render</p>';
        }

        $html = '';
        foreach ($content['content'] as $node) {
            $html .= $this->renderNode($node);
        }

        return $html;
    }

    private function renderNode(array $node): string
    {
        $type = $node['type'] ?? 'paragraph';
        
        switch ($node['type']) {
            case 'paragraph':
                return $this->renderParagraph($node);
            case 'heading':
                return $this->renderHeading($node);
            case 'button':
                return $this->renderButton($node);
            case 'image':
                return $this->renderImage($node);
            case 'section':
                return $this->renderSection($node);
            case 'columns':
                return $this->renderColumns($node);
            default:
                return $this->renderParagraph($node);
        }
    }

    private function renderParagraph(array $node): string
    {
        $content = $node['content'] ?? '';
        $style = $this->getNodeStyle($node);
        
        return "<p style=\"{$style}\">{$content}</p>";
    }

    private function renderHeading(array $node): string
    {
        $content = $node['content'] ?? '';
        $level = $node['attrs']['level'] ?? 1;
        $style = $this->getNodeStyle($node);
        
        return "<h{$level} style=\"{$style}\">{$content}</h{$level}>";
    }

    private function renderButton(array $node): string
    {
        $content = $node['content'] ?? 'Button';
        $url = $node['attrs']['url'] ?? '#';
        $style = $this->getNodeStyle($node);
        
        return "<a href=\"{$url}\" style=\"{$style}\" class=\"button\">{$content}</a>";
    }

    private function renderImage(array $node): string
    {
        $src = $node['attrs']['src'] ?? '';
        $alt = $node['attrs']['alt'] ?? '';
        $style = $this->getNodeStyle($node);
        
        return "<img src=\"{$src}\" alt=\"{$alt}\" style=\"{$style}\" />";
    }

    private function renderSection(array $node): string
    {
        $content = '';
        if (isset($node['content']) && is_array($node['content'])) {
            foreach ($node['content'] as $child) {
                $content .= $this->renderNode($child);
            }
        }
        
        $style = $this->getNodeStyle($node);
        return "<div style=\"{$style}\">{$content}</div>";
    }

    private function renderColumns(array $node): string
    {
        $content = '';
        if (isset($node['content']) && is_array($node['content'])) {
            foreach ($node['content'] as $child) {
                $content .= $this->renderNode($child);
            }
        }
        
        $style = $this->getNodeStyle($node);
        return "<div style=\"{$style}\" class=\"columns\">{$content}</div>";
    }

    private function getNodeStyle(array $node): string
    {
        $styles = [];
        
        if (isset($node['attrs']['style'])) {
            $styles[] = $node['attrs']['style'];
        }
        
        // Add default styles based on node type
        switch ($node['type']) {
            case 'button':
                $styles[] = 'display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;';
                break;
            case 'heading':
                $styles[] = 'margin: 16px 0; font-weight: bold;';
                break;
            case 'paragraph':
                $styles[] = 'margin: 8px 0; line-height: 1.5;';
                break;
        }
        
        return implode(' ', $styles);
    }

    private function wrapInEmailTemplate(string $content, ?string $preview = null, ?array $theme = null): string
    {
        $previewText = $preview ? "<div style=\"display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;\">{$preview}</div>" : '';
        
        return "<!DOCTYPE html>
<html>
<head>
    <meta charset=\"utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>Email Template</title>
    {$previewText}
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .email-content { padding: 20px; }
    </style>
</head>
<body>
    <div class=\"email-container\">
        <div class=\"email-content\">
            {$content}
        </div>
    </div>
</body>
</html>";
    }

    private function prettifyHtml(string $html): string
    {
        // Simple HTML prettification
        $html = str_replace('><', ">\n<", $html);
        $html = preg_replace('/\n\s*\n/', "\n", $html);
        return trim($html);
    }
}