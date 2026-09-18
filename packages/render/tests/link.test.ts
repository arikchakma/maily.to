import type { DocumentNode } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { links } from '../src/index';

function documentWith(content: DocumentNode['content']): DocumentNode {
  return { type: 'doc', attrs: { version: 2 }, content };
}

describe('link', () => {
  it('collects the hrefs of every link mark in the document', () => {
    const document = documentWith([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Home',
            marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Docs',
            marks: [
              { type: 'link', attrs: { href: 'https://example.com/docs' } },
            ],
          },
        ],
      },
    ]);

    expect([...links(document)]).toEqual([
      'https://example.com',
      'https://example.com/docs',
    ]);
  });

  it('deduplicates repeated hrefs and drops invalid ones', () => {
    const document = documentWith([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Once',
            marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
          },
          {
            type: 'text',
            text: 'Twice',
            marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
          },
          {
            type: 'text',
            text: 'Broken',
            marks: [{ type: 'link', attrs: { href: 'not a url' } }],
          },
          {
            type: 'text',
            text: 'Bold',
            marks: [{ type: 'bold' }],
          },
        ],
      },
    ]);

    expect([...links(document)]).toEqual(['https://example.com']);
  });

  it('returns nothing for a value that is not a Maily node', () => {
    expect([...links({ type: 'unknown' })]).toEqual([]);
  });
});
