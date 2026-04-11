import { describe, expect, it } from 'vite-plus/test';

import { htmlCodeBlock } from './html-code-block';

describe('transformHtmlCodeBlock', () => {
  it('drops activeTab attribute', () => {
    const node = {
      type: 'htmlCodeBlock',
      attrs: { activeTab: 'preview', language: 'html' },
    } as Record<string, any>;
    htmlCodeBlock(node, []);

    expect(node.attrs).not.toHaveProperty('activeTab');
    expect(node.attrs.language).toBe('html');
  });

  it('handles missing activeTab gracefully', () => {
    const node = {
      type: 'htmlCodeBlock',
      attrs: { language: 'html' },
    } as Record<string, any>;
    htmlCodeBlock(node, []);

    expect(node.attrs).not.toHaveProperty('activeTab');
  });
});
