import type { AnyMailyMark, DocumentNode } from '@maily-to/shared';
import { DEFAULT_NODE_THEME, parseInlineStyles } from '@maily-to/shared';
import type { HTMLElement } from 'node-html-parser';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import { markup, render, renderText } from '../src/index';

const PARAGRAPH_STYLE =
  'color:#0f172a;background:linear-gradient(90deg, #f8fafc, #ffffff);padding:6px 10px;-webkit-font-smoothing:antialiased;--brand-accent:#7c3aed;--maily-unknown-property:preserved';

const document: DocumentNode = {
  type: 'doc',
  attrs: {
    version: 2,
  },
  content: [
    {
      type: 'paragraph',
      attrs: {
        style: PARAGRAPH_STYLE,
      },
      content: [
        {
          type: 'text',
          text: 'A styled Maily paragraph',
        },
      ],
    },
  ],
};

type MarkedDocumentOptions = {
  marks: AnyMailyMark[];
  text?: string;
};

function getMarkedDocument(options: MarkedDocumentOptions): DocumentNode {
  const { marks, text = 'x' } = options;

  return {
    type: 'doc',
    attrs: { version: 2 },
    content: [{ type: 'paragraph', content: [{ type: 'text', text, marks }] }],
  };
}

const LINK_CASES = [
  {
    expected: {
      href: 'https://maily.to',
      rel: 'noopener noreferrer nofollow',
      target: '_blank',
      title: undefined,
      text: 'Maily',
    },
    marks: [
      { type: 'link', attrs: { href: 'https://maily.to' } },
    ] as AnyMailyMark[],
    name: 'renders a link mark with its href',
  },
  {
    expected: {
      href: 'https://maily.to',
      rel: 'noreferrer',
      target: '_self',
      title: 'Maily',
      text: 'Maily',
    },
    marks: [
      {
        type: 'link',
        attrs: {
          href: 'https://maily.to',
          rel: 'noreferrer',
          target: '_self',
          title: 'Maily',
        },
      },
    ] as AnyMailyMark[],
    name: 'renders the rel and target a link mark carries',
  },
];

const SPAN_MERGE_CASES = [
  {
    marks: [
      { type: 'textStyle', attrs: { color: '#7c3aed' } },
      { type: 'highlight', attrs: { color: '#fef08a' } },
    ] as AnyMailyMark[],
    name: 'merges text style and highlight marks into one span',
    style: { color: '#7c3aed', backgroundColor: '#fef08a' },
  },
  {
    marks: [
      { type: 'span', attrs: { style: 'letter-spacing:2px' } },
      { type: 'textStyle', attrs: { color: '#7c3aed' } },
      { type: 'highlight', attrs: { color: '#fef08a' } },
    ] as AnyMailyMark[],
    name: 'merges span, text style and highlight marks into one span',
    style: {
      letterSpacing: '2px',
      color: '#7c3aed',
      backgroundColor: '#fef08a',
    },
  },
];

const EMAIL_CONFIG = {
  htmlProps: { lang: 'fr' },
  meta: [{ name: 'author', content: 'Maily' }],
  openTrackingPixel: 'https://track.example.com/open.gif',
  preview: 'Hi {{name}}',
  variables: { name: 'Alice' },
};

function getPreviewText(root: HTMLElement) {
  return root.querySelector('[data-skip-in-text="true"]')?.childNodes[0]
    ?.textContent;
}

function getSlotOrder(root: HTMLElement) {
  const preview = root.querySelector('[data-skip-in-text="true"]');

  return preview?.parentNode?.children.map((child) => {
    return child.rawTagName;
  });
}

describe('render', () => {
  describe('nodes', () => {
    it('renders canonical paragraph text and arbitrary inline styles', async () => {
      const html = await render(document);
      const paragraph = parse(html).querySelector('p');

      expect({
        style: parseInlineStyles(paragraph?.getAttribute('style') ?? ''),
        text: paragraph?.textContent,
      }).toEqual({
        style: parseInlineStyles(PARAGRAPH_STYLE),
        text: 'A styled Maily paragraph',
      });
    });

    it('renders a heading at its level', async () => {
      const headed: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'heading',
            attrs: { level: 3, style: 'color:#111827' },
            content: [{ type: 'text', text: 'Title' }],
          },
        ],
      };
      const root = parse(await render(headed));

      expect({
        text: root.querySelector('h3')?.textContent,
        style: parseInlineStyles(
          root.querySelector('h3')?.getAttribute('style') ?? ''
        ).color,
      }).toEqual({ text: 'Title', style: '#111827' });
    });

    it('renders blockquotes, horizontal rules and hard breaks', async () => {
      const document: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'blockquote',
            attrs: { style: 'color:#475569' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Quoted' }],
              },
            ],
          },
          { type: 'horizontalRule', attrs: { style: 'border-color:#e5e7eb' } },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Before' },
              { type: 'hardBreak' },
              { type: 'text', text: 'After' },
            ],
          },
        ],
      };
      const root = parse(await render(document));

      expect({
        quote: root.querySelector('blockquote')?.textContent,
        quoteColour: parseInlineStyles(
          root.querySelector('blockquote')?.getAttribute('style') ?? ''
        ).color,
        rules: root.querySelectorAll('hr').length,
        breaks: root.querySelectorAll('br').length,
      }).toEqual({
        quote: 'Quoted',
        quoteColour: '#475569',
        rules: 1,
        breaks: 1,
      });
    });

    it('renders nested bullet and ordered lists', async () => {
      const listed: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'bulletList',
            attrs: { style: 'padding-left:26px' },
            content: [
              {
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'One' }],
                  },
                  {
                    type: 'orderedList',
                    content: [
                      {
                        type: 'listItem',
                        content: [
                          {
                            type: 'paragraph',
                            content: [{ type: 'text', text: 'Nested' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      const root = parse(await render(listed));

      expect({
        listPadding: parseInlineStyles(
          root.querySelector('ul')?.getAttribute('style') ?? ''
        ).paddingLeft,
        nested: Boolean(root.querySelector('ul > li > ol > li')),
        nestedText: root.querySelector('ol li')?.textContent,
      }).toEqual({ listPadding: '26px', nested: true, nestedText: 'Nested' });
    });

    it('renders text direction as a dir attribute and css property', async () => {
      const directed: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'paragraph',
            attrs: { dir: 'rtl' },
            content: [{ type: 'text', text: 'مرحبا' }],
          },
          {
            type: 'paragraph',
            attrs: { dir: 'auto' },
            content: [{ type: 'text', text: 'Auto' }],
          },
        ],
      };
      const paragraphs = parse(await render(directed)).querySelectorAll('p');

      expect({
        rtlAttr: paragraphs[0]?.getAttribute('dir'),
        rtlCss: parseInlineStyles(paragraphs[0]?.getAttribute('style') ?? '')
          .direction,
        autoAttr: paragraphs[1]?.getAttribute('dir'),
        autoCss: parseInlineStyles(paragraphs[1]?.getAttribute('style') ?? '')
          .direction,
      }).toEqual({
        rtlAttr: 'rtl',
        rtlCss: 'rtl',
        autoAttr: 'auto',
        autoCss: undefined,
      });
    });
  });

  describe('marks', () => {
    it('wraps marked text in its mark elements', async () => {
      const marked: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'plain ' },
              { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
            ],
          },
        ],
      };
      const paragraph = parse(await render(marked)).querySelector('p');

      expect({
        strong: paragraph?.querySelector('strong')?.textContent,
        text: paragraph?.textContent,
      }).toEqual({ strong: 'bold', text: 'plain bold' });
    });

    for (const { expected, marks, name } of LINK_CASES) {
      it(name, async () => {
        const anchor = parse(
          await render(getMarkedDocument({ marks, text: 'Maily' }))
        ).querySelector('a');

        expect({
          href: anchor?.getAttribute('href'),
          rel: anchor?.getAttribute('rel'),
          target: anchor?.getAttribute('target'),
          title: anchor?.getAttribute('title'),
          text: anchor?.textContent,
        }).toEqual(expected);
      });
    }

    it('nests marks in a stable order regardless of document order', async () => {
      const forwards = await render(
        getMarkedDocument({ marks: [{ type: 'bold' }, { type: 'underline' }] })
      );
      const backwards = await render(
        getMarkedDocument({ marks: [{ type: 'underline' }, { type: 'bold' }] })
      );

      expect({
        forwards: Boolean(parse(forwards).querySelector('strong > u')),
        backwards: Boolean(parse(backwards).querySelector('strong > u')),
      }).toEqual({ forwards: true, backwards: true });
    });

    for (const { marks, name, style } of SPAN_MERGE_CASES) {
      it(name, async () => {
        const root = parse(await render(getMarkedDocument({ marks })));

        expect({
          spans: root.querySelectorAll('span').length,
          style: parseInlineStyles(
            root.querySelector('span')?.getAttribute('style') ?? ''
          ),
        }).toEqual({ spans: 1, style });
      });
    }

    it('renders a font weight a span mark carries', async () => {
      const root = parse(
        await render(
          getMarkedDocument({
            marks: [{ type: 'span', attrs: { style: 'font-weight:600' } }],
          })
        )
      );

      expect({
        strongs: root.querySelectorAll('strong').length,
        style: parseInlineStyles(
          root.querySelector('span')?.getAttribute('style') ?? ''
        ),
      }).toEqual({
        strongs: 0,
        style: { fontWeight: '600' },
      });
    });

    it('renders inline styles carried by marks', async () => {
      const strong = parse(
        await render(
          getMarkedDocument({
            marks: [{ type: 'bold', attrs: { style: 'color:#16a34a' } }],
          })
        )
      ).querySelector('strong');

      expect(parseInlineStyles(strong?.getAttribute('style') ?? '')).toEqual({
        color: '#16a34a',
      });
    });
  });

  describe('link cards', () => {
    it('renders a link card with the values it is pinned to', async () => {
      const card: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'linkCard',
            attrs: {
              badgeText: 'New',
              description: 'What the page is about',
              image: 'https://maily.to/brand/logo.png',
              link: 'https://maily.to',
              linkTitle: 'Read more',
              subTitle: '5 min read',
              title: 'Card title',
            },
          },
          { type: 'paragraph', content: [{ type: 'text', text: 'After' }] },
        ],
      };
      const root = parse(await render(card));
      const anchors = root.querySelectorAll('a');
      const cardStyle = parseInlineStyles(
        anchors[0]?.getAttribute('style') ?? ''
      );
      const titleStyle = parseInlineStyles(
        root.querySelectorAll('p')[0]?.getAttribute('style') ?? ''
      );

      expect({
        badge: root.querySelector('span')?.textContent,
        border: cardStyle.border,
        borderRadius: cardStyle.borderRadius,
        cta: anchors[1]?.textContent,
        href: anchors[0]?.getAttribute('href'),
        image: root.querySelector('img')?.getAttribute('src'),
        marginBottom: cardStyle.marginBottom,
        titleColor: titleStyle.color,
        titleSize: titleStyle.fontSize,
      }).toEqual({
        badge: 'New',
        border: '1px solid #eaeaea',
        borderRadius: '10px',
        cta: 'Read more',
        href: 'https://maily.to',
        image: 'https://maily.to/brand/logo.png',
        marginBottom: '20px',
        titleColor: '#111827',
        titleSize: '18px',
      });
    });

    it('drops the link card bottom margin at a container edge', async () => {
      const lastCard: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'linkCard',
            attrs: {
              badgeText: '',
              description: '',
              image: '',
              link: '',
              linkTitle: '',
              subTitle: '',
              title: 'Card title',
            },
          },
        ],
      };
      const style = parse(await render(lastCard))
        .querySelector('a')
        ?.getAttribute('style');

      expect(parseInlineStyles(style ?? '').marginBottom).toBe('0');
    });

    it('drops the link card subtitle when a badge takes its place', async () => {
      const withBoth: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'linkCard',
            attrs: {
              badgeText: 'New',
              description: '',
              image: '',
              link: '',
              linkTitle: '',
              subTitle: '5 min read',
              title: 'Card title',
            },
          },
        ],
      };
      const html = await render(withBoth);

      expect({
        badge: html.includes('New'),
        subTitle: html.includes('5 min read'),
      }).toEqual({ badge: true, subTitle: false });
    });
  });

  describe('the html shell', () => {
    it('wraps body and container nodes in an email-safe html shell', async () => {
      const shell: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'body',
            attrs: { style: 'background-color:#f9fafb' },
            content: [
              {
                type: 'container',
                attrs: { style: 'background-color:#ffffff;max-width:480px' },
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Hi' }],
                  },
                ],
              },
            ],
          },
        ],
      };
      const root = parse(await render(shell));

      expect({
        html: Boolean(root.querySelector('html')),
        head: Boolean(root.querySelector('head')),
        bodyBackground: parseInlineStyles(
          root.querySelector('body')?.getAttribute('style') ?? ''
        ).backgroundColor,
        containerMaxWidth: parseInlineStyles(
          root
            .querySelector('body table[role="presentation"] table')
            ?.getAttribute('style') ?? ''
        ).maxWidth,
        text: root.querySelector('p')?.textContent,
      }).toEqual({
        html: true,
        head: true,
        bodyBackground: '#f9fafb',
        containerMaxWidth: '480px',
        text: 'Hi',
      });
    });

    it('collects document-level css into the head', async () => {
      const responsive: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'table',
            attrs: { responsive: true },
            content: [
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    attrs: { colspan: 1, colwidth: null, rowspan: 1 },
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'C' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      expect({
        withTable: parse(await render(responsive))
          .querySelector('head style')
          ?.textContent.includes('max-width:480px'),
        withoutTable: parse(await render(document)).querySelector('head style')
          ?.textContent,
      }).toEqual({
        withTable: true,
        withoutTable: '',
      });
    });
  });

  describe('fonts', () => {
    it('declares a font face for the family the body authors', async () => {
      const themed: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'body',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
            ],
          },
        ],
      };

      const root = parse(await render(themed, { theme: DEFAULT_NODE_THEME }));

      expect({
        css: root.querySelector('head style')?.textContent,
        fontFamily: parseInlineStyles(
          root.querySelector('[style*="font-family"]')?.getAttribute('style') ??
            ''
        ).fontFamily,
      }).toEqual({
        css: "@font-face {font-family: 'Inter';font-style: normal;font-weight: 400;mso-font-alt: 'sans-serif';src: url(https://cdn.usemaily.com/fonts/v0/inter.woff2) format('woff2');}",
        fontFamily: "'Inter', sans-serif",
      });
    });

    it('declares one font face per authored family', async () => {
      const mixed: DocumentNode = {
        type: 'doc',
        attrs: { version: 2 },
        content: [
          {
            type: 'paragraph',
            attrs: { style: "font-family:'Lato', serif;font-weight:600" },
            content: [{ type: 'text', text: 'Heading-ish' }],
          },
          {
            type: 'paragraph',
            attrs: { style: "font-family:'Lato', serif;font-weight:600" },
            content: [{ type: 'text', text: 'Same variant' }],
          },
          {
            type: 'paragraph',
            attrs: { style: "font-family:'Helvetica'" },
            content: [{ type: 'text', text: 'A system font' }],
          },
        ],
      };

      expect(
        parse(await render(mixed))
          .querySelector('head style')
          ?.textContent.split('@font-face')
          .filter(Boolean)
          .map((rule) => `@font-face${rule}`)
      ).toEqual([
        "@font-face {font-family: 'Lato';font-style: normal;font-weight: 600;mso-font-alt: 'serif';src: url(https://cdn.usemaily.com/fonts/v0/lato.woff2) format('woff2');}",
        "@font-face {font-family: 'Helvetica';font-style: normal;font-weight: 400;mso-font-alt: 'sans-serif';}",
      ]);
    });
  });

  it('renders plain text without markup or styles', async () => {
    const document: DocumentNode = {
      type: 'doc',
      attrs: {
        version: 2,
      },
      content: [
        {
          type: 'paragraph',
          attrs: {
            style: null,
          },
          content: [
            {
              type: 'text',
              text: 'Plain text output',
            },
          ],
        },
      ],
    };

    expect(await renderText(document)).toBe('Plain text output');
  });

  it('surfaces a renderer failure instead of returning empty output', async () => {
    const notADocument = {
      type: 'paragraph',
      content: [{ type: 'text', text: 'orphan' }],
    } as unknown as DocumentNode;

    expect(() => markup(notADocument)).toThrow(/document/i);
    await expect(render(notADocument)).rejects.toThrow(/document/i);
    await expect(renderText(notADocument)).rejects.toThrow(/document/i);
  });

  it('carries preview, meta, html props and the tracking pixel into the email', async () => {
    const shell: DocumentNode = {
      type: 'doc',
      attrs: { version: 2 },
      content: [
        {
          type: 'body',
          content: [
            {
              type: 'container',
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Hi' }] },
              ],
            },
          ],
        },
      ],
    };

    const root = parse(await render(shell, EMAIL_CONFIG));

    expect({
      author: root
        .querySelector('head meta[name="author"]')
        ?.getAttribute('content'),
      builtIn: root
        .querySelectorAll('head meta')
        .map((tag) => {
          return tag.getAttribute('name') ?? tag.getAttribute('http-equiv');
        })
        .filter((name) => {
          return name !== null;
        }),
      lang: root.querySelector('html')?.getAttribute('lang'),
      pixel: root.querySelector('body img')?.getAttribute('src'),
      preview: getPreviewText(root),
      previewInBody: Boolean(
        root.querySelector('body [data-skip-in-text="true"]')
      ),
      slotOrder: getSlotOrder(root),
    }).toEqual({
      author: 'Maily',
      builtIn: expect.arrayContaining([
        'X-UA-Compatible',
        'x-apple-disable-message-reformatting',
        'color-scheme',
        'supported-color-schemes',
        'author',
      ]),
      lang: 'fr',
      pixel: 'https://track.example.com/open.gif',
      preview: 'Hi Alice',
      previewInBody: true,
      slotOrder: ['div', 'table', 'img'],
    });
  });
});
