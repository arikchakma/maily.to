import { render as renderMaily } from '@maily-to/render';
import type { AnyMailyNode, DocumentNode } from '@maily-to/shared';
import { DEFAULT_TEXT_DIRECTION, parseInlineStyles } from '@maily-to/shared';
import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';

import { cleanup, createRenderer, getContainerContent } from '#test-utils';

import { renderCellStyledLayout } from './fixtures/react-email/cell-styled-layout';
import { renderSectionLayout } from './fixtures/react-email/section-layout';
import { renderStyledParagraph } from './fixtures/react-email/styled-paragraph';
import { renderTwoCellLayout } from './fixtures/react-email/two-cell-layout';

function getComparableNode(node: AnyMailyNode): AnyMailyNode {
  const { id: _id, ...rest } = node.attrs ?? {};
  const attrs = Object.fromEntries(
    Object.entries(rest).filter(([name, value]) => {
      if (name === 'dir') {
        return value !== DEFAULT_TEXT_DIRECTION;
      }

      return value !== null;
    })
  );

  return {
    ...node,
    attrs: Object.keys(attrs).length > 0 ? attrs : undefined,
    content: node.content?.map(getComparableNode),
  } as AnyMailyNode;
}

function getShelledDocument(document: DocumentNode): AnyMailyNode {
  const [body] = document.content;
  const [container] = body?.content ?? [];

  return {
    ...document,
    content: [
      {
        ...body,
        content: [
          {
            ...container,
            attrs: { ...container?.attrs, style: 'max-width:37.5em' },
          },
        ],
      },
    ],
  } as AnyMailyNode;
}

function getSemanticNode(node: AnyMailyNode): unknown {
  const { id: _id, ...attrs } = node.attrs ?? {};
  const style = attrs.style;

  return {
    ...node,
    attrs: node.attrs
      ? {
          ...attrs,
          ...(typeof style === 'string'
            ? { style: parseInlineStyles(style) }
            : {}),
        }
      : undefined,
    content: node.content?.map(getSemanticNode),
  };
}

function getAligned(align: string) {
  return `<table role="presentation" style="max-width:600px"><tbody><tr><td><table role="presentation" align="${align}" width="100%" style="width:152px"><tbody><tr><td><p>Pinned</p></td></tr></tbody></table></td></tr></tbody></table>`;
}

type MailyDocumentCase = {
  content: DocumentNode;
  name: string;
};

type AlignmentCase = {
  align: string;
  name: string;
  style: Record<string, string>;
};

type SingleCellCase = {
  name: string;
  source: string;
  survives: boolean;
};

type FindNodeOptions = {
  node: AnyMailyNode;
  type: string;
};

function findNode(options: FindNodeOptions): AnyMailyNode | null {
  const { node, type } = options;

  if (node.type === type) {
    return node;
  }

  for (const child of node.content ?? []) {
    const found = findNode({ node: child, type });
    if (found) {
      return found;
    }
  }

  return null;
}

function getTableStyle(document: DocumentNode) {
  const table = findNode({ node: document as AnyMailyNode, type: 'table' });

  return parseInlineStyles((table?.attrs?.style as string) ?? '');
}

describe('html import', () => {
  const { render } = createRenderer();

  describe('react email documents', () => {
    it('preserves arbitrary paragraph inline styles in canonical JSON', async () => {
      const content = await renderStyledParagraph();
      const source = new DOMParser().parseFromString(content, 'text/html');
      const style = source.querySelector('p')?.getAttribute('style');

      const { ref } = await render({ content });

      expect(getComparableNode(ref.current!.getJSON())).toEqual({
        type: 'doc',
        attrs: {
          version: 2,
        },
        content: [
          {
            type: 'body',
            content: [
              {
                type: 'container',
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      style,
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'A styled React Email paragraph',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
    });

    it('imports a React Email section as a layout table', async () => {
      const { ref } = await render({ content: await renderSectionLayout() });

      const body = ref.current!.getJSON().content[0];
      const container = body?.content?.[0];
      const section = container?.content?.[0];

      expect({
        body: body?.type,
        container: container?.type,
        section: section?.type,
        sectionContent: section?.content?.map((node) => {
          return node.type;
        }),
      }).toEqual({
        body: 'body',
        container: 'container',
        section: 'table',
        sectionContent: ['tableRow'],
      });
    });
  });

  describe('responsive layouts', () => {
    it('imports and round-trips a responsive React Email two-cell layout', async () => {
      const sourceHtml = await renderTwoCellLayout();
      const { ref: firstRef } = await render({ content: sourceHtml });

      const firstDocument = firstRef.current!.getJSON();
      const [table] = getContainerContent(firstRef.current!);
      const row = table?.content?.[0];
      const cells = row?.content ?? [];
      const mailyHtml = await renderMaily(firstDocument);

      cleanup();

      const { ref: secondRef } = await render({ content: mailyHtml });

      expect({
        imported: {
          cellText: cells.map((cell) => {
            return cell.content?.[0]?.content?.[0]?.text;
          }),
          cellWidth: cells.map((cell) => {
            return parseInlineStyles(
              typeof cell.attrs?.style === 'string' ? cell.attrs.style : ''
            ).width;
          }),
          responsive: table?.attrs?.responsive,
          type: table?.type,
        },
        roundTrip: getSemanticNode(secondRef.current!.getJSON()),
      }).toEqual({
        imported: {
          cellText: ['Left column', 'Right column'],
          cellWidth: ['50%', '50%'],
          responsive: true,
          type: 'table',
        },
        roundTrip: getSemanticNode(getShelledDocument(firstDocument)),
      });
    });

    it('stacks responsive layout cells only at a narrow viewport', async () => {
      const sourceHtml = await renderTwoCellLayout();
      const { ref } = await render({ content: sourceHtml });

      const mailyHtml = await renderMaily(ref.current!.getJSON());

      cleanup();

      const frame = document.createElement('iframe');
      frame.style.width = '640px';
      document.body.append(frame);
      frame.srcdoc = mailyHtml;

      await new Promise<void>((resolve) => {
        frame.addEventListener(
          'load',
          () => {
            resolve();
          },
          { once: true }
        );
      });

      const getCellDisplay = () => {
        const cell = frame.contentDocument?.querySelector(
          '[data-mly-responsive="stack"] > tbody > tr > td'
        );
        return cell && frame.contentWindow
          ? frame.contentWindow.getComputedStyle(cell).display
          : null;
      };

      const desktop = getCellDisplay();
      frame.style.width = '320px';

      await waitFor(() => {
        expect({ desktop, narrow: getCellDisplay() }).toEqual({
          desktop: 'table-cell',
          narrow: 'block',
        });
      });

      frame.remove();
    });
  });

  describe('round trips', () => {
    it('re-imports rendered Maily HTML without changing the canonical document', async () => {
      const sourceHtml = await renderStyledParagraph();
      const { ref: firstRef } = await render({ content: sourceHtml });

      const firstDocument = firstRef.current!.getJSON();
      const mailyHtml = await renderMaily(firstDocument);

      cleanup();

      const { ref: secondRef } = await render({ content: mailyHtml });

      expect(getSemanticNode(secondRef.current!.getJSON())).toEqual(
        getSemanticNode(getShelledDocument(firstDocument))
      );
    });

    const MAILY_DOCUMENTS: MailyDocumentCase[] = [
      {
        content: {
          type: 'doc',
          attrs: { version: 2 },
          content: [
            {
              type: 'body',
              attrs: { style: 'background-color:#f9fafb' },
              content: [
                {
                  type: 'container',
                  attrs: { style: 'max-width:600px;padding:16px' },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: { style: 'margin:0' },
                      content: [{ type: 'text', text: 'Round trip' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        name: 'round-trips body and container nodes through rendered Maily HTML',
      },
    ];

    const SECTION_DOCUMENT: DocumentNode = {
      type: 'doc',
      attrs: { version: 2 },
      content: [
        {
          type: 'body',
          content: [
            {
              type: 'container',
              content: [
                {
                  type: 'section',
                  attrs: { style: 'background-color:#ffffff' },
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Round trip' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    it('re-imports an exported section as a layout table', async () => {
      const { ref } = await render({
        content: await renderMaily(SECTION_DOCUMENT),
      });

      const [table] = getContainerContent(ref.current!);
      const cell = table?.content?.[0]?.content?.[0];

      expect({
        text: cell?.content?.[0]?.content?.[0]?.text,
        type: table?.type,
      }).toEqual({ text: 'Round trip', type: 'table' });
    });

    for (const testCase of MAILY_DOCUMENTS) {
      it(testCase.name, async () => {
        const { ref } = await render({
          content: await renderMaily(testCase.content),
        });

        expect(getComparableNode(ref.current!.getJSON())).toEqual(
          testCase.content
        );
      });
    }
  });

  describe('layout tables', () => {
    it('leaves a layout table style on the table and its cell', async () => {
      const content = await renderCellStyledLayout();

      const { ref } = await render({ content });

      const table = getContainerContent(ref.current!)[0];
      const cell = table?.content?.[0]?.content?.[0];

      expect({
        cell: parseInlineStyles((cell?.attrs?.style as string) ?? ''),
        style: parseInlineStyles((table?.attrs?.style as string) ?? ''),
        type: table?.type,
      }).toEqual({
        cell: { paddingLeft: '40px', paddingRight: '40px' },
        style: {
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '72px',
          width: '100%',
        },
        type: 'table',
      });
    });

    const ALIGNMENTS: AlignmentCase[] = [
      {
        align: 'left',
        name: 'leaves a layout table where its align attribute already sits',
        style: { marginRight: 'auto', width: '152px' },
      },
      {
        align: 'center',
        name: 'centers a layout table its align attribute centers',
        style: { marginLeft: 'auto', marginRight: 'auto', width: '152px' },
      },
      {
        align: 'right',
        name: 'pulls a layout table to the side its align attribute names',
        style: { marginLeft: 'auto', width: '152px' },
      },
    ];

    for (const testCase of ALIGNMENTS) {
      it(testCase.name, async () => {
        const { ref } = await render({ content: getAligned(testCase.align) });

        expect(getTableStyle(ref.current!.getJSON())).toEqual(testCase.style);
      });
    }

    it('writes the alignment back onto the exported table', async () => {
      const { ref } = await render({ content: getAligned('right') });

      const html = await renderMaily(ref.current!.getJSON());
      const table = new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(
          'body > table > tbody > tr > td > table > tbody > tr > td > table'
        );

      expect(table?.getAttribute('align')).toBe('right');
    });

    const SINGLE_CELLS: SingleCellCase[] = [
      {
        name: 'collapses a layout table that never says it is presentational',
        source: `<table style="max-width:600px"><tbody><tr><td><p>Plain</p></td></tr></tbody></table>`,
        survives: false,
      },
      {
        name: 'leaves a single-celled table that heads its data as a table',
        source: `<table style="max-width:600px"><tbody><tr><td><table><tbody><tr><th>Head</th></tr><tr><td>Data</td></tr></tbody></table></td></tr></tbody></table>`,
        survives: true,
      },
      {
        name: 'leaves a single-celled table that draws a border as a table',
        source: `<table style="max-width:600px"><tbody><tr><td><table border="1"><tbody><tr><td>Data</td></tr></tbody></table></td></tr></tbody></table>`,
        survives: true,
      },
    ];

    for (const testCase of SINGLE_CELLS) {
      it(testCase.name, async () => {
        const { ref } = await render({ content: testCase.source });
        const node = ref.current!.getJSON() as AnyMailyNode;

        if (testCase.survives) {
          expect(findNode({ node, type: 'table' })).not.toBeNull();
          return;
        }

        expect(findNode({ node, type: 'container' })?.content?.[0]?.type).toBe(
          'paragraph'
        );
      });
    }
  });

  describe('head styles', () => {
    it('inlines a rule from the head onto the elements it matches', async () => {
      const source = `<html><head><style>.lead { color: rgb(1, 2, 3); padding: 12px }</style></head><body><table role="presentation" style="max-width:600px"><tbody><tr><td><p class="lead">Styled by a rule</p></td></tr></tbody></table></body></html>`;
      const { ref } = await render({ content: source });

      const paragraph = findNode({
        node: ref.current!.getJSON() as AnyMailyNode,
        type: 'paragraph',
      });

      expect(
        parseInlineStyles((paragraph?.attrs?.style as string) ?? '')
      ).toEqual({
        color: 'rgb(1, 2, 3)',
        padding: '12px',
      });
    });

    it('states an inherited rule only where it starts', async () => {
      const source = `<html><head><style>* { font-family: Inter }</style></head><body><table role="presentation" style="max-width:600px"><tbody><tr><td><p>One</p><p>Two</p></td></tr></tbody></table></body></html>`;
      const { ref } = await render({ content: source });
      const styles: string[] = [];

      const collect = (node: AnyMailyNode) => {
        const style = node.attrs?.style;
        if (typeof style === 'string' && style.includes('font-family')) {
          styles.push(node.type);
        }
        for (const child of node.content ?? []) {
          collect(child);
        }
      };
      collect(ref.current!.getJSON() as AnyMailyNode);

      expect(styles).toEqual(['container']);
    });
  });

  it('normalizes pasted rich text into canonical nodes', async () => {
    const { ref } = await render({ content: '<p></p>' });

    const editor = ref.current!.getEditor();
    editor.commands.setContent(
      '<div><h2 style="color:#111827">Title</h2>' +
        '<p><b style="color:#16a34a">Bold</b><i>Italic</i></p>' +
        '<ul><li><p>Item</p></li></ul>' +
        '<font size="3">Legacy</font></div>'
    );

    const content = getContainerContent(ref.current!);

    expect({
      types: content.map((node) => {
        return node.type;
      }),
      headingLevel: content[0]?.attrs?.level,
      headingStyle: content[0]?.attrs?.style,
      marks: content[1]?.content?.map((part) => {
        return part.marks?.[0]?.type;
      }),
      boldStyle: content[1]?.content?.[0]?.marks?.[0]?.attrs?.style,
    }).toEqual({
      types: ['heading', 'paragraph', 'bulletList', 'paragraph'],
      headingLevel: 2,
      headingStyle: 'color:#111827',
      marks: ['bold', 'italic'],
      boldStyle: 'color:#16a34a',
    });
  });

  it('drops the hidden preview text a template carries', async () => {
    const source = `<table role="presentation" style="max-width:600px"><tbody><tr><td><div style="display:none" data-skip-in-text="true">Preheader text</div><p>Real content</p></td></tr></tbody></table>`;
    const { ref } = await render({ content: source });

    expect(JSON.stringify(ref.current!.getJSON())).not.toContain('Preheader');
  });
});
