import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';

import { buildConfig, defineRenderContext } from '../src/index';
import type { MailyConfig } from '../src/index';
import { preview } from '../src/lib/preview';

function getContext(config: MailyConfig = {}) {
  return defineRenderContext({ config: buildConfig(config) });
}

describe('preview', () => {
  describe('placeholders', () => {
    it('resolves a placeholder in a preview string from the configured values', () => {
      const text = preview({
        ctx: getContext({ variables: { name: 'Alice' } }),
        preview: 'Hello {{name}}, your order shipped',
      });

      expect(text).toBe('Hello Alice, your order shipped');
    });

    it('falls back to the formatter when a preview placeholder has no value', () => {
      const text = preview({
        ctx: getContext({
          variableFormatter: ({ variable }) => {
            return `[${variable}]`;
          },
        }),
        preview: 'Hello {{name}}',
      });

      expect(text).toBe('Hello [name]');
    });
  });

  it('walks a preview document for its text and variable nodes', () => {
    const document: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hi ' },
            { type: 'variable', attrs: { fallback: 'there', id: 'name' } },
            { type: 'text', text: ', see you at ' },
            { type: 'variable', attrs: { fallback: null, id: 'place' } },
          ],
        },
      ],
    };

    expect(
      preview({
        ctx: getContext({ variables: { name: 'Alice' } }),
        preview: document,
      })
    ).toBe('Hi Alice, see you at {{place}}');
  });
});
