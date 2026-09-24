import type { DocumentNode, MailyNodeType } from '@maily-to/shared';
import { BASIC_NODE_THEME } from '@maily-to/shared';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import type { MailyConfig } from '../src/index';
import { render } from '../src/index';

function variableText(id: string) {
  return {
    type: 'paragraph' as MailyNodeType,
    attrs: { style: 'margin:10px 0' },
    content: [{ type: 'variable' as MailyNodeType, attrs: { id } }],
  };
}

function repeatDocument(each: string, content = [variableText('name')]) {
  return {
    type: 'doc',
    attrs: { version: 2 },
    content: [{ type: 'repeat', attrs: { each }, content }],
  } as DocumentNode;
}

async function getParagraphs(document: DocumentNode, config?: MailyConfig) {
  const html = await render(document, config);

  return parse(html)
    .querySelectorAll('p')
    .map((element) => element.text.trim());
}

describe('repeat', () => {
  describe('the list source', () => {
    it('renders the content once for every item in the list', async () => {
      expect(
        await getParagraphs(repeatDocument('{{items}}'), {
          variables: { items: [{ name: 'Ada' }, { name: 'Grace' }] },
        })
      ).toEqual(['Ada', 'Grace']);
    });

    it('reads the list through the id the variable text names', async () => {
      expect(
        await getParagraphs(repeatDocument('items'), {
          variables: { items: [{ name: 'Ada' }] },
        })
      ).toEqual(['Ada']);
    });

    it('reads a list of plain values through value', async () => {
      expect(
        await getParagraphs(
          repeatDocument('{{items}}', [variableText('value')]),
          {
            variables: { items: ['Ada', 'Grace'] },
          }
        )
      ).toEqual(['Ada', 'Grace']);
    });
  });

  describe('an empty list', () => {
    it('renders nothing when the list is empty', async () => {
      expect(
        await getParagraphs(repeatDocument('{{items}}'), {
          variables: { items: [] },
        })
      ).toEqual([]);
    });

    it('renders nothing when nothing resolves to a list', async () => {
      expect(
        await getParagraphs(repeatDocument('{{items}}'), {
          variables: { items: 'not a list' },
        })
      ).toEqual([]);
    });

    it('renders nothing when the render was given no variables', async () => {
      expect(await getParagraphs(repeatDocument('{{items}}'))).toEqual([]);
    });
  });

  describe('item scope', () => {
    it('lets an item shadow a variable of the same name', async () => {
      expect(
        await getParagraphs(repeatDocument('{{items}}'), {
          variables: { items: [{ name: 'Ada' }], name: 'Grace' },
        })
      ).toEqual(['Ada']);
    });

    it('walks a list an enclosing item holds', async () => {
      const document = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'repeat',
            attrs: { each: '{{teams}}' },
            content: [
              {
                type: 'repeat',
                attrs: { each: '{{members}}' },
                content: [variableText('name')],
              },
            ],
          },
        ],
      } as DocumentNode;

      expect(
        await getParagraphs(document, {
          variables: {
            teams: [
              { members: [{ name: 'Ada' }, { name: 'Grace' }] },
              { members: [{ name: 'Alan' }] },
            ],
          },
        })
      ).toEqual(['Ada', 'Grace', 'Alan']);
    });
  });

  it('spaces the blocks inside a repeat the way the theme spaces a container', async () => {
    const document = {
      type: 'doc',
      attrs: { version: 2 },
      content: [
        {
          type: 'repeat',
          attrs: { each: '{{items}}' },
          content: [
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'variable', attrs: { id: 'name' } }],
            },
            variableText('role'),
          ],
        },
      ],
    } as DocumentNode;

    const html = await render(document, {
      theme: BASIC_NODE_THEME,
      variables: {
        items: [
          { name: 'Ada', role: 'One' },
          { name: 'Grace', role: 'Two' },
        ],
      },
    });

    expect(
      parse(html)
        .querySelectorAll('h2')
        .map((element) => element.getAttribute('style'))
    ).toEqual([
      expect.stringContaining('margin-bottom:12px'),
      expect.stringContaining('margin-bottom:12px'),
    ]);
  });
});
