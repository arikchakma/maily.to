import { render as renderMaily } from '@maily-to/render';
import { DEFAULT_NODE_THEME, invariant } from '@maily-to/shared';
import { waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vite-plus/test';

import { createRenderer, getDocument } from '#test-utils';

const HTML_SOURCE = '<p>Snippet</p>';

const BLOCKS = [
  {
    type: 'heading',
    attrs: { level: 1 },
    content: [{ type: 'text', text: 'Heading one' }],
  },
  {
    type: 'heading',
    attrs: { level: 2 },
    content: [{ type: 'text', text: 'Heading two' }],
  },
  { type: 'paragraph', content: [{ type: 'text', text: 'Paragraph' }] },
  {
    type: 'bulletList',
    content: [
      {
        type: 'listItem',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Bullet' }] },
        ],
      },
    ],
  },
  {
    type: 'orderedList',
    content: [
      {
        type: 'listItem',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Number' }] },
        ],
      },
    ],
  },
  {
    type: 'blockquote',
    content: [
      { type: 'paragraph', content: [{ type: 'text', text: 'Quote' }] },
    ],
  },
  {
    type: 'button',
    attrs: { align: 'left', kind: 'tight', url: 'https://maily.to' },
    content: [{ type: 'text', text: 'Button' }],
  },
  {
    type: 'section',
    content: [
      { type: 'paragraph', content: [{ type: 'text', text: 'Section' }] },
    ],
  },
  {
    type: 'htmlCodeBlock',
    content: [{ type: 'text', text: HTML_SOURCE }],
  },
  { type: 'footer', content: [{ type: 'text', text: 'Footer' }] },
  { type: 'horizontalRule' },
  { type: 'spacer', attrs: { height: 24 } },
];

const DOCUMENT = getDocument(BLOCKS);

const COMPARED = [
  'backgroundColor',
  'borderLeftColor',
  'borderLeftStyle',
  'borderLeftWidth',
  'borderRadius',
  'borderTopColor',
  'borderTopStyle',
  'borderTopWidth',
  'fontStyle',
  'color',
  'display',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'listStyleType',
  'marginBottom',
  'marginLeft',
  'marginTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
];

type ComparedNode = {
  email: string;
  emailText?: string;
  editor: string;
  name: string;
  skip?: string[];
  text: string;
};

const NODES: ComparedNode[] = [
  { name: 'heading one', editor: 'h1', email: 'h1', text: 'Heading one' },
  { name: 'heading two', editor: 'h2', email: 'h2', text: 'Heading two' },
  { name: 'paragraph', editor: 'p', email: 'p', text: 'Paragraph' },
  { name: 'bullet list', editor: 'ul', email: 'ul', text: 'Bullet' },
  { name: 'list item', editor: 'li', email: 'li', text: 'Bullet' },
  { name: 'ordered list', editor: 'ol', email: 'ol', text: 'Number' },
  {
    name: 'blockquote',
    editor: 'blockquote',
    email: 'blockquote',
    text: 'Quote',
  },
  {
    name: 'button',
    editor: '[data-node-type="button"]',
    email: 'a',
    skip: ['display'],
    text: 'Button',
  },
  {
    name: 'section',
    editor: '[data-node-type="section"]',
    email: 'table',
    skip: ['display'],
    text: 'Section',
  },
  {
    name: 'html code block',
    editor: '[data-node-type="htmlCodeBlock"]',
    email: 'table',
    emailText: 'Snippet',
    skip: ['display'],
    text: HTML_SOURCE,
  },
  {
    name: 'footer',
    editor: '[data-node-type="footer"]',
    email: 'small',
    text: 'Footer',
  },
  {
    name: 'rule',
    editor: 'hr',
    email: 'hr',
    skip: ['borderLeftColor', 'color'],
    text: '',
  },
];

type FindNodeOptions = {
  root: Element;
  selector: string;
  text: string;
};

function findNode(options: FindNodeOptions) {
  const { root, selector, text } = options;

  return (
    [...root.querySelectorAll(selector)].find((element) => {
      return element.textContent?.trim() === text;
    }) ?? null
  );
}

function getStyle(element: Element | null) {
  if (!element) {
    return null;
  }

  const view = element.ownerDocument.defaultView;
  invariant(view, 'The element is not in a rendered document.');
  const computed = view.getComputedStyle(element);

  return Object.fromEntries(
    COMPARED.map((property) => {
      return [property, computed[property as never]];
    })
  );
}

function getDisplay(options: FindNodeOptions) {
  const { root, selector, text } = options;
  const element = findNode({ root, selector, text }) as Element;

  return element.ownerDocument.defaultView!.getComputedStyle(element).display;
}

function getBlockquoteTheme(root: Element) {
  const style = getComputedStyle(
    findNode({ root, selector: 'blockquote', text: 'Quote' }) as Element
  );

  return {
    borderLeftColor: style.borderLeftColor,
    borderLeftWidth: style.borderLeftWidth,
    color: style.color,
    fontStyle: style.fontStyle,
    marginLeft: style.marginLeft,
    paddingLeft: style.paddingLeft,
  };
}

async function getRenderedBody(html: string) {
  const frame = document.createElement('iframe');
  frame.dataset.parity = '';
  frame.style.border = 'none';
  frame.style.height = '2400px';
  frame.style.width = '600px';
  document.body.append(frame);
  frame.srcdoc = html;

  // The email declares its fonts as remote @font-face sources, so a load event
  // waits on the network. The compared properties only need the parsed markup.
  return await waitFor(
    () => {
      const body = frame.contentDocument?.body;
      invariant(body?.firstElementChild, 'The rendered email has no body.');
      return body;
    },
    { timeout: 5_000 }
  );
}

describe('render parity', () => {
  const { render } = createRenderer();

  afterEach(() => {
    document.querySelectorAll('[data-parity]').forEach((node) => {
      node.remove();
    });
  });

  const mountBoth = async () => {
    const { editable, ref } = await render({
      content: DOCUMENT,
      frame: true,
      styled: true,
      theme: true,
    });

    const html = await renderMaily(ref.current!.getJSON(), {
      theme: DEFAULT_NODE_THEME,
    });

    return {
      editor: editable as Element,
      rendered: await getRenderedBody(html),
    };
  };

  it('finds every compared node on both surfaces', async () => {
    const { editor, rendered } = await mountBoth();

    const missing = NODES.flatMap((node) => {
      return [
        findNode({ root: editor, selector: node.editor, text: node.text })
          ? []
          : [`${node.name} editor`],
        findNode({
          root: rendered,
          selector: node.email,
          text: node.emailText ?? node.text,
        })
          ? []
          : [`${node.name} email`],
      ].flat();
    });

    expect(missing).toEqual([]);
  });

  describe('computed styles', () => {
    it('lays every themed block out the same in the editor and the email', async () => {
      const { editor, rendered } = await mountBoth();

      const drift = NODES.flatMap((node) => {
        const inEditor = getStyle(
          findNode({ root: editor, selector: node.editor, text: node.text })
        );
        const inEmail = getStyle(
          findNode({
            root: rendered,
            selector: node.email,
            text: node.emailText ?? node.text,
          })
        );

        return COMPARED.filter((property) => {
          return (
            !node.skip?.includes(property) &&
            inEditor?.[property] !== inEmail?.[property]
          );
        }).map((property) => {
          return `${node.name} ${property}: editor=${inEditor?.[property]} email=${inEmail?.[property]}`;
        });
      });

      expect(drift).toEqual([]);
    });

    it('lays the footer out as a block on both surfaces', async () => {
      const { editor, rendered } = await mountBoth();

      expect({
        editor: getDisplay({
          root: editor,
          selector: '[data-node-type="footer"]',
          text: 'Footer',
        }),
        email: getDisplay({
          root: rendered,
          selector: 'small',
          text: 'Footer',
        }),
      }).toEqual({ editor: 'block', email: 'block' });
    });

    it('gives a blockquote the theme it declares on both surfaces', async () => {
      const { editor, rendered } = await mountBoth();

      const themed = {
        borderLeftColor: 'rgb(209, 213, 219)',
        borderLeftWidth: '4px',
        color: 'rgb(55, 65, 81)',
        fontStyle: 'italic',
        marginLeft: '0px',
        paddingLeft: '16px',
      };

      expect({
        editor: getBlockquoteTheme(editor),
        email: getBlockquoteTheme(rendered),
      }).toEqual({ editor: themed, email: themed });
    });
  });

  // A theme margin the renderer suppresses has to be written as zero, not
  // dropped: an email has no reset, so a dropped declaration hands the block
  // back to the client's own heading and list margins.
  it('writes a suppressed margin as zero rather than dropping it', async () => {
    const { rendered } = await mountBoth();

    expect(rendered.querySelector('h1')?.getAttribute('style')).toContain(
      'margin-top:0'
    );
  });
});
