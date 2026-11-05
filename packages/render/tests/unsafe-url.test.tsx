import type { DocumentNode } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { render } from '../src/index';

const HOSTILE = 'vbscript:msgbox(1)';

function getButtonDocument(url: string): DocumentNode {
  return {
    type: 'doc',
    attrs: { version: 2 },
    content: [
      {
        type: 'button',
        attrs: { align: 'left', kind: 'tight', url },
        content: [{ type: 'text', text: 'Go' }],
      },
    ],
  };
}

const HOSTILE_DOCUMENTS: { document: DocumentNode; name: string }[] = [
  { document: getButtonDocument(HOSTILE), name: 'a button url' },
  {
    document: {
      type: 'doc',
      attrs: { version: 2 },
      content: [
        {
          type: 'button',
          attrs: { align: 'left', kind: 'full-width', url: HOSTILE },
          content: [{ type: 'text', text: 'Go' }],
        },
      ],
    },
    name: 'a full width button url',
  },
  {
    document: {
      type: 'doc',
      attrs: { version: 2 },
      content: [
        {
          type: 'image',
          attrs: {
            align: 'left',
            externalLink: HOSTILE,
            src: 'https://maily.to/logo.png',
            width: '100%',
          },
        },
      ],
    },
    name: 'an image external link',
  },
  {
    document: {
      type: 'doc',
      attrs: { version: 2 },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'inlineImage',
              attrs: {
                externalLink: HOSTILE,
                height: 18,
                src: 'https://maily.to/logo.png',
                width: 18,
              },
            },
          ],
        },
      ],
    },
    name: 'an inline image external link',
  },
  {
    document: {
      type: 'doc',
      attrs: { version: 2 },
      content: [
        {
          type: 'linkCard',
          attrs: {
            badgeText: '',
            description: '',
            image: '',
            link: HOSTILE,
            linkTitle: '',
            subTitle: '',
            title: 'Read this',
          },
        },
      ],
    },
    name: 'a link card link',
  },
];

const SCHEMES = [
  'javascript:alert(1)',
  'JaVaScRiPt:alert(1)',
  ' javascript:alert(1)',
  'java\tscript:alert(1)',
  'vbscript:msgbox(1)',
  'data:text/html,<script>alert(1)</script>',
];

function getHrefs(html: string) {
  return [...html.matchAll(/href="([^"]*)"/g)].map((match) => {
    return match[1] ?? '';
  });
}

describe('unsafe url', () => {
  for (const { document, name } of HOSTILE_DOCUMENTS) {
    it(`drops ${name}`, async () => {
      const html = await render(document);

      expect(getHrefs(html)).not.toContain(HOSTILE);
    });
  }

  it.each(SCHEMES)('drops the scheme in %s', async (url) => {
    const html = await render(getButtonDocument(url));

    expect(getHrefs(html)).toEqual([]);
  });

  it('drops a hostile url a variable resolves to', async () => {
    const html = await render(getButtonDocument('{{link}}'), {
      variables: { link: HOSTILE },
    });

    expect(getHrefs(html)).toEqual([]);
  });

  it('keeps an ordinary url', async () => {
    const html = await render(getButtonDocument('https://maily.to/go'));

    expect(getHrefs(html)).toEqual(['https://maily.to/go']);
  });
});
