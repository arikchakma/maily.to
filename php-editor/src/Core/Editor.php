<?php

namespace Maily\Core;

use Maily\Components\Button;
use Maily\Components\Column;
use Maily\Components\Divider;
use Maily\Components\Footer;
use Maily\Components\Heading;
use Maily\Components\Image;
use Maily\Components\Logo;
use Maily\Components\Paragraph;
use Maily\Components\Section;
use Maily\Components\Spacer;
use Maily\Components\Variable;

class Editor
{
    private EmailRenderer $renderer;
    private array $templates = [];
    private string $templatesPath;

    public function __construct()
    {
        $this->renderer = new EmailRenderer();
        $this->templatesPath = __DIR__ . '/../../data/templates/';
        
        // Ensure templates directory exists
        if (!is_dir($this->templatesPath)) {
            mkdir($this->templatesPath, 0755, true);
        }
    }

    /**
     * Save email template
     */
    public function saveTemplate(array $data): array
    {
        try {
            $templateId = $data['id'] ?? uniqid('template_');
            $template = new EmailTemplate($templateId, $data);
            
            $filePath = $this->templatesPath . $templateId . '.json';
            file_put_contents($filePath, json_encode($template->toArray(), JSON_PRETTY_PRINT));
            
            return [
                'success' => true,
                'id' => $templateId,
                'message' => 'Template saved successfully'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Load email template
     */
    public function loadTemplate(?string $templateId): array
    {
        try {
            if (!$templateId) {
                return [
                    'success' => true,
                    'template' => $this->getDefaultTemplate()
                ];
            }

            $filePath = $this->templatesPath . $templateId . '.json';
            if (!file_exists($filePath)) {
                return [
                    'success' => false,
                    'error' => 'Template not found'
                ];
            }

            $templateData = json_decode(file_get_contents($filePath), true);
            return [
                'success' => true,
                'template' => $templateData
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Export template as HTML
     */
    public function exportTemplate(?string $templateId): string
    {
        $templateData = $this->loadTemplate($templateId);
        if (!$templateData['success']) {
            return '<p>Error loading template</p>';
        }

        return $this->renderer->render($templateData['template']);
    }

    /**
     * Preview template
     */
    public function previewTemplate(array $data): string
    {
        $template = new EmailTemplate('preview', $data);
        return $this->renderer->render($template->toArray());
    }

    /**
     * Get default template structure
     */
    private function getDefaultTemplate(): array
    {
        return [
            'id' => 'default',
            'name' => 'New Email',
            'subject' => 'Your Email Subject',
            'preheader' => 'Your email preheader text',
            'content' => [
                [
                    'type' => 'section',
                    'id' => 'section_1',
                    'settings' => [
                        'backgroundColor' => '#ffffff',
                        'padding' => '20px'
                    ],
                    'content' => [
                        [
                            'type' => 'paragraph',
                            'id' => 'paragraph_1',
                            'content' => 'Start typing your email content here...',
                            'settings' => [
                                'fontSize' => '16px',
                                'color' => '#333333',
                                'textAlign' => 'left'
                            ]
                        ]
                    ]
                ]
            ],
            'settings' => [
                'width' => '600px',
                'backgroundColor' => '#ffffff'
            ]
        ];
    }

    /**
     * Get available components
     */
    public function getComponents(): array
    {
        return [
            'text' => [
                'name' => 'Text',
                'icon' => 'text',
                'description' => 'Add text content'
            ],
            'heading' => [
                'name' => 'Heading',
                'icon' => 'heading',
                'description' => 'Add a heading'
            ],
            'button' => [
                'name' => 'Button',
                'icon' => 'button',
                'description' => 'Add a call-to-action button'
            ],
            'image' => [
                'name' => 'Image',
                'icon' => 'image',
                'description' => 'Add an image'
            ],
            'logo' => [
                'name' => 'Logo',
                'icon' => 'logo',
                'description' => 'Add a logo'
            ],
            'divider' => [
                'name' => 'Divider',
                'icon' => 'divider',
                'description' => 'Add a horizontal line'
            ],
            'spacer' => [
                'name' => 'Spacer',
                'icon' => 'spacer',
                'description' => 'Add vertical space'
            ],
            'section' => [
                'name' => 'Section',
                'icon' => 'section',
                'description' => 'Add a new section'
            ],
            'columns' => [
                'name' => 'Columns',
                'icon' => 'columns',
                'description' => 'Add column layout'
            ],
            'footer' => [
                'name' => 'Footer',
                'icon' => 'footer',
                'description' => 'Add footer content'
            ],
            'variable' => [
                'name' => 'Variable',
                'icon' => 'variable',
                'description' => 'Add dynamic content'
            ]
        ];
    }
}