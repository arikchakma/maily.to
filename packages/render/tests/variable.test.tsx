import type { DocumentNode } from '@maily-to/shared';
import { deserializeVariableFromText } from '@maily-to/shared';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import { render } from '../src/index';

function documentWith(content: DocumentNode['content']): DocumentNode {
  return { type: 'doc', attrs: { version: 2 }, content };
}

const GREETING = documentWith([
  {
    type: 'paragraph',
    content: [
      { type: 'text', text: 'Hello ' },
      { type: 'variable', attrs: { id: 'name', fallback: 'there' } },
    ],
  },
]);

describe('variable', () => {
  describe('resolved variables', () => {
    it('resolves a variable node from the configured values', async () => {
      const html = await render(GREETING, { variables: { name: 'Alice' } });

      expect(parse(html).querySelector('p')?.textContent).toBe('Hello Alice');
    });

    it('resolves variables inside an image source and link', async () => {
      const html = await render(
        documentWith([
          {
            type: 'image',
            attrs: {
              align: 'left',
              externalLink: '{{profileUrl}}',
              src: '{{avatarUrl}}',
              width: '100%',
            },
          },
        ]),
        {
          variables: {
            avatarUrl: 'https://maily.to/avatar.png',
            profileUrl: 'https://maily.to/profile',
          },
        }
      );

      const document = parse(html);

      expect({
        href: document.querySelector('a')?.getAttribute('href'),
        src: document.querySelector('img')?.getAttribute('src'),
      }).toEqual({
        href: 'https://maily.to/profile',
        src: 'https://maily.to/avatar.png',
      });
    });
  });

  describe('unresolved variables', () => {
    it('falls back to a placeholder when a variable has no value', async () => {
      const html = await render(GREETING);

      expect(parse(html).querySelector('p')?.textContent).toBe(
        'Hello {{name fallback="there"}}'
      );
    });

    it('writes a placeholder that reads back as the variable it stood for', async () => {
      const html = await render(GREETING);
      const placeholder = parse(html)
        .querySelector('p')!
        .textContent.replace('Hello ', '');

      expect(deserializeVariableFromText(placeholder)).toMatchObject({
        fallback: 'there',
        id: 'name',
      });
    });

    it('lets a custom formatter shape the unresolved placeholder', async () => {
      const html = await render(GREETING, {
        variableFormatter: ({ variable }) => `\${${variable}}`,
      });

      expect(parse(html).querySelector('p')?.textContent).toBe('Hello ${name}');
    });
  });
});
