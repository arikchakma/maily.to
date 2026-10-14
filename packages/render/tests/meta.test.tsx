import type { DocumentNode } from '@maily-to/shared';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import { render } from '../src/index';
import type { MetaDescriptor } from '../src/index';

const DOCUMENT: DocumentNode = {
  type: 'doc',
  attrs: { version: 2 },
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }],
};

async function getHeadTags(meta: MetaDescriptor[]) {
  const head = parse(await render(DOCUMENT, { meta })).querySelector('head');

  return head!.querySelectorAll('meta, title, link').map((element) => {
    return {
      attrs: element.attributes,
      tag: element.rawTagName,
      text: element.textContent,
    };
  });
}

describe('meta', () => {
  describe('descriptor shapes', () => {
    it('renders a tag for each supported descriptor shape', async () => {
      const tags = await getHeadTags([
        { charSet: 'utf-8' },
        { title: 'Your receipt' },
        { name: 'author', content: 'Maily' },
        { property: 'og:title', content: 'Your receipt' },
        { httpEquiv: 'content-language', content: 'en' },
      ]);

      expect(tags).toEqual(
        expect.arrayContaining([
          { attrs: { charSet: 'utf-8' }, tag: 'meta', text: '' },
          { attrs: {}, tag: 'title', text: 'Your receipt' },
          {
            attrs: { content: 'Maily', name: 'author' },
            tag: 'meta',
            text: '',
          },
          {
            attrs: { content: 'Your receipt', property: 'og:title' },
            tag: 'meta',
            text: '',
          },
          {
            attrs: { content: 'en', 'http-equiv': 'content-language' },
            tag: 'meta',
            text: '',
          },
        ])
      );
    });

    it('renders a link descriptor as a link tag', async () => {
      const tags = await getHeadTags([
        { tagName: 'link', rel: 'canonical', href: 'https://example.com' },
      ]);

      expect(tags).toContainEqual({
        attrs: { href: 'https://example.com', rel: 'canonical' },
        tag: 'link',
        text: '',
      });
    });
  });

  it('dedupes descriptors that differ only in key order', async () => {
    const tags = await getHeadTags([
      { name: 'author', content: 'Maily' },
      { content: 'Maily', name: 'author' },
    ]);

    expect(
      tags.filter((tag) => {
        return tag.attrs.name === 'author';
      })
    ).toEqual([
      { attrs: { content: 'Maily', name: 'author' }, tag: 'meta', text: '' },
    ]);
  });

  it('keeps the built-in head tags when meta adds its own', async () => {
    const tags = await getHeadTags([{ name: 'author', content: 'Maily' }]);

    expect(tags).toEqual(
      expect.arrayContaining([
        {
          attrs: { content: 'IE=edge', 'http-equiv': 'X-UA-Compatible' },
          tag: 'meta',
          text: '',
        },
        {
          attrs: { name: 'x-apple-disable-message-reformatting' },
          tag: 'meta',
          text: '',
        },
        {
          attrs: { content: 'light', name: 'color-scheme' },
          tag: 'meta',
          text: '',
        },
        {
          attrs: { content: 'light', name: 'supported-color-schemes' },
          tag: 'meta',
          text: '',
        },
        { attrs: { content: 'Maily', name: 'author' }, tag: 'meta', text: '' },
      ])
    );
  });
});
