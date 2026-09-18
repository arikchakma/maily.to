import type { AnyMailyNode, ColumnsNode, DocumentNode } from '@maily-to/shared';
import type { HTMLElement } from 'node-html-parser';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import { render, renderText } from '../src/index';

const THEME = {
  body: { backgroundColor: '#f1f5f9' },
  container: { maxWidth: '400px' },
};

function getDocument(content: AnyMailyNode[]): DocumentNode {
  return { type: 'doc', attrs: { version: 2 }, content } as DocumentNode;
}

function getColumns(): ColumnsNode {
  return {
    type: 'columns',
    attrs: { columnCount: 2, gap: 8 },
    content: [
      {
        type: 'column',
        attrs: { verticalAlign: 'top', width: null },
        content: [{ type: 'paragraph' }],
      },
      {
        type: 'column',
        attrs: { verticalAlign: 'top', width: null },
        content: [{ type: 'paragraph' }],
      },
    ],
  };
}

function getContainers(root: HTMLElement) {
  return root.querySelectorAll(
    'body > table[role="presentation"] > tbody > tr > td > table[role="presentation"]'
  );
}

async function getShell(document: DocumentNode) {
  const root = parse(await render(document, THEME_CONFIG));

  return {
    bodyBackground: root
      .querySelector('body')
      ?.getAttribute('style')
      ?.includes('background-color:#f1f5f9'),
    bodies: root.querySelectorAll('body').length,
    containerWidths: getContainers(root).map((container) => {
      return /max-width:([^;]+)/.exec(
        container.getAttribute('style') ?? ''
      )?.[1];
    }),
    text: root.querySelector('body p')?.textContent,
    widths: root
      .querySelectorAll('.tab-row-full td')
      .map((cell) => cell.getAttribute('width')),
  };
}

const THEME_CONFIG = { theme: THEME };

const SHELLED_CASES = [
  {
    document: getDocument([getColumns()]),
    name: 'wraps a bare document top level in a body and a container',
  },
  {
    document: getDocument([{ type: 'body', content: [getColumns()] }]),
    name: 'wraps a container-less body content in a container',
  },
  {
    document: getDocument([{ type: 'container', content: [getColumns()] }]),
    name: 'wraps a body-less container in a body',
  },
];

const SLOT_CONFIG = {
  openTrackingPixel: 'https://track.example.com/open.gif',
  preview: 'Peek',
};

const PARAGRAPH = {
  type: 'paragraph',
  content: [{ type: 'text', text: 'A' }],
} as AnyMailyNode;

const SLOT_CASES = [
  {
    contained: 'A',
    document: getDocument([PARAGRAPH]),
    name: 'hosts one preview and one pixel for a bare document',
  },
  {
    contained: 'A',
    document: getDocument([
      { type: 'body', content: [PARAGRAPH] } as AnyMailyNode,
    ]),
    name: 'hosts one preview and one pixel for a container-less body',
  },
  {
    contained: 'A',
    document: getDocument([
      {
        type: 'body',
        content: [{ type: 'container', content: [PARAGRAPH] }],
      } as AnyMailyNode,
    ]),
    name: 'hosts one preview and one pixel for a shelled document',
  },
  {
    contained: 'A',
    document: getDocument([
      { type: 'container', content: [PARAGRAPH] } as AnyMailyNode,
    ]),
    name: 'hosts one preview and one pixel for a body-less container',
  },
  {
    contained: undefined,
    document: getDocument([]),
    name: 'hosts one preview and one pixel for an empty document',
  },
];

describe('normalize', () => {
  describe('shelling', () => {
    for (const { document, name } of SHELLED_CASES) {
      it(name, async () => {
        expect(await getShell(document)).toEqual({
          bodyBackground: true,
          bodies: 1,
          containerWidths: ['400px'],
          text: '',
          widths: ['49%', '2%', '49%'],
        });
      });
    }

    it('leaves a document that already shells its content alone', async () => {
      const shelled = getDocument([
        {
          type: 'body',
          content: [
            {
              type: 'container',
              attrs: { style: 'max-width:480px' },
              content: [getColumns()],
            },
          ],
        },
      ]);

      expect(await getShell(shelled)).toEqual({
        bodyBackground: true,
        bodies: 1,
        containerWidths: ['480px'],
        text: '',
        widths: ['49.167%', '1.667%', '49.167%'],
      });
    });

    // A document holds exactly one body, so a top level that mixes one with other
    // blocks adopts those blocks into it rather than rendering a second `<body>`.
    it('adopts stray top-level blocks into the body they sit beside', async () => {
      const malformed = getDocument([
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Before' }],
        },
        {
          type: 'body',
          attrs: { style: 'background-color:#0f172a' },
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'In' }] },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'After' }],
        },
      ]);
      const root = parse(await render(malformed, THEME_CONFIG));

      expect({
        background: root.querySelector('body')?.getAttribute('style'),
        bodies: root.querySelectorAll('body').length,
        containerWidths: getContainers(root).length,
        texts: root.querySelectorAll('body p').map((node) => {
          return node.textContent;
        }),
      }).toEqual({
        background: 'background-color:#0f172a;margin-top:0;margin-bottom:0',
        bodies: 1,
        containerWidths: 1,
        texts: ['Before', 'In', 'After'],
      });
    });

    it('shells an empty document rather than rendering a bare html', async () => {
      const root = parse(await render(getDocument([]), THEME_CONFIG));

      expect({
        bodyBackground: root
          .querySelector('body')
          ?.getAttribute('style')
          ?.includes('background-color:#f1f5f9'),
        containerWidths: getContainers(root).map((container) => {
          return container.getAttribute('style');
        }),
      }).toEqual({
        bodyBackground: true,
        containerWidths: ['max-width:400px;margin-top:0;margin-bottom:0'],
      });
    });

    it('leaves a body that shells its content in several containers alone', async () => {
      const sideBySide = getDocument([
        {
          type: 'body',
          content: [
            {
              type: 'container',
              attrs: { style: 'max-width:300px' },
              content: [getColumns()],
            },
            { type: 'container', content: [getColumns()] },
          ],
        },
      ]);
      const root = parse(await render(sideBySide, THEME_CONFIG));

      expect({
        containers: getContainers(root).length,
        widths: root
          .querySelectorAll('.tab-row-full td')
          .map((cell) => cell.getAttribute('width')),
      }).toEqual({
        containers: 2,
        widths: ['48.667%', '2.667%', '48.667%', '49%', '2%', '49%'],
      });
    });
  });

  describe('slots', () => {
    for (const { contained, document, name } of SLOT_CASES) {
      it(name, async () => {
        const root = parse(await render(document, SLOT_CONFIG));
        const preview = root.querySelector('[data-skip-in-text="true"]');

        expect({
          contained: root.querySelector(
            'body table[role="presentation"] table p'
          )?.textContent,
          pixels: root.querySelectorAll('body img').length,
          previews: root.querySelectorAll('body [data-skip-in-text="true"]')
            .length,
          slotOrder: preview?.parentNode?.children.map((child) => {
            return child.rawTagName;
          }),
        }).toEqual({
          contained,
          pixels: 1,
          previews: 1,
          slotOrder: ['div', 'table', 'img'],
        });
      });
    }

    // A nested body is a block like any other, so it must not host a second copy
    // of the preview and the tracking pixel.
    it('hosts the slots in the document body alone', async () => {
      const nested = getDocument([
        {
          type: 'body',
          content: [
            {
              type: 'container',
              content: [
                {
                  type: 'body',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'A' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]);
      const root = parse(await render(nested, SLOT_CONFIG));

      expect({
        pixels: root.querySelectorAll('img').length,
        previews: root.querySelectorAll('[data-skip-in-text="true"]').length,
      }).toEqual({ pixels: 1, previews: 1 });
    });

    it('keeps the preview out of the plain text a shelled document renders', async () => {
      const bare = getDocument([
        { type: 'paragraph', content: [{ type: 'text', text: 'Plain text' }] },
      ]);

      expect(await renderText(bare, SLOT_CONFIG)).toBe('Plain text');
    });
  });

  it('renders a document that carries no attrs at all', async () => {
    const html = await render({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Bare' }] },
      ],
    } as never);

    const root = parse(html);

    expect({
      body: root.querySelector('body') !== null,
      text: root.querySelector('p')?.textContent,
    }).toEqual({ body: true, text: 'Bare' });
  });
});
