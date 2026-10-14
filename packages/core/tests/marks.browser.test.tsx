import { render as renderMaily } from '@maily-to/render';
import type { AnyMailyNode } from '@maily-to/shared';
import { is } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';

function getFirstText(node: AnyMailyNode): AnyMailyNode | undefined {
  if (is.text(node)) {
    return node;
  }

  for (const child of node.content ?? []) {
    const found = getFirstText(child);
    if (found) {
      return found;
    }
  }

  return undefined;
}

type GetMarkOptions = {
  content: AnyMailyNode[] | undefined;
  index: number;
  type: string;
};

function getMark(options: GetMarkOptions) {
  const { content, index, type } = options;

  return content?.[index]?.marks?.find((mark) => {
    return mark.type === type;
  });
}

type GetMarkTypesOptions = {
  content: AnyMailyNode[] | undefined;
  index: number;
};

function getMarkTypes(options: GetMarkTypesOptions) {
  const { content, index } = options;

  return (content?.[index]?.marks ?? [])
    .map((mark) => {
      return mark.type;
    })
    .sort();
}

describe('marks', () => {
  const { render } = createRenderer();

  describe('applying marks', () => {
    it('marks a selection as bold in the canonical document', async () => {
      const { ref } = await render({
        content: getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'Bold me' }] },
        ]),
      });

      ref.current!.getEditor().chain().focus().selectAll().toggleBold().run();

      expect(getContainerContent(ref.current!)[0]?.content?.[0]).toEqual({
        type: 'text',
        text: 'Bold me',
        marks: [{ type: 'bold', attrs: { style: null } }],
      });
    });

    it('records colour attributes for highlight and text style marks', async () => {
      const { ref } = await render({
        content: getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'Colour me' }] },
        ]),
      });

      ref
        .current!.getEditor()
        .chain()
        .focus()
        .selectAll()
        .setHighlight({ color: '#fef08a' })
        .setColor('#7c3aed')
        .run();

      const marks = getContainerContent(ref.current!)[0]?.content?.[0]?.marks;

      expect(
        Object.fromEntries(
          (marks ?? []).map((mark) => {
            return [mark.type, mark.attrs?.color];
          })
        )
      ).toEqual({ highlight: '#fef08a', textStyle: '#7c3aed' });
    });
  });

  describe('inline styles', () => {
    it('preserves inline styles no other mark owns without inventing a text style', async () => {
      const { ref } = await render({
        content:
          '<p><a href="https://maily.to" style="color:#dc2626">link</a>' +
          '<span style="letter-spacing:2px">spaced</span>' +
          '<span style="color:#7c3aed">coloured</span></p>',
      });

      const content = getContainerContent(ref.current!)[0]?.content;

      expect({
        linkStyle: getMark({ content, index: 0, type: 'link' })?.attrs?.style,
        spanStyle: getMark({ content, index: 1, type: 'span' })?.attrs?.style,
        spanMarks: getMarkTypes({ content, index: 1 }),
        colourSpan: getMark({ content, index: 2, type: 'span' }),
        colourMark: getMark({ content, index: 2, type: 'textStyle' })?.attrs
          ?.color,
        colourMarks: getMarkTypes({ content, index: 2 }),
      }).toEqual({
        linkStyle: 'color:#dc2626',
        spanStyle: 'letter-spacing:2px',
        spanMarks: ['span'],
        colourSpan: undefined,
        colourMark: '#7c3aed',
        colourMarks: ['textStyle'],
      });
    });

    it('keeps inline styles on styled semantic elements', async () => {
      const { ref } = await render({
        content:
          '<p><strong style="color:#16a34a">bold</strong>' +
          '<em style="letter-spacing:1px">italic</em>' +
          '<code style="color:#0369a1">code</code></p>',
      });

      const content = getContainerContent(ref.current!)[0]?.content;

      expect({
        bold: getMark({ content, index: 0, type: 'bold' })?.attrs?.style,
        italic: getMark({ content, index: 1, type: 'italic' })?.attrs?.style,
        code: getMark({ content, index: 2, type: 'code' })?.attrs?.style,
      }).toEqual({
        bold: 'color:#16a34a',
        italic: 'letter-spacing:1px',
        code: 'color:#0369a1',
      });
    });

    it('never carries a declaration another mark already represents', async () => {
      const { ref } = await render({
        content:
          '<p><a href="https://x.com" style="color:#dc2626;text-decoration:underline">link</a>' +
          '<strong style="color:#16a34a;font-weight:700">bold</strong></p>',
      });

      const content = getContainerContent(ref.current!)[0]?.content;

      expect({
        linkMarks: getMarkTypes({ content, index: 0 }),
        linkStyle: getMark({ content, index: 0, type: 'link' })?.attrs?.style,
        boldStyle: getMark({ content, index: 1, type: 'bold' })?.attrs?.style,
      }).toEqual({
        linkMarks: ['link', 'underline'],
        linkStyle: 'color:#dc2626',
        boldStyle: 'color:#16a34a',
      });
    });

    it('keeps span declarations no mark claims', async () => {
      const { ref } = await render({
        content:
          '<p><span style="background-color:#fef08a">bg</span>' +
          '<span style="font-weight:700;letter-spacing:1px">bold</span></p>',
      });

      const content = getContainerContent(ref.current!)[0]?.content;

      expect({
        background: getMark({ content, index: 0, type: 'span' })?.attrs?.style,
        claimedStripped: getMark({ content, index: 1, type: 'span' })?.attrs
          ?.style,
        inferredBold: content?.[1]?.marks?.some((mark) => {
          return mark.type === 'bold';
        }),
      }).toEqual({
        background: 'background-color:#fef08a',
        claimedStripped: 'letter-spacing:1px',
        inferredBold: true,
      });
    });
  });

  it('keeps a link href through render and re-import', async () => {
    const exported = await renderMaily(
      getDocument([
        {
          type: 'paragraph',
          attrs: { style: null },
          content: [
            {
              type: 'text',
              text: 'Maily',
              marks: [
                {
                  type: 'link',
                  attrs: { href: 'https://maily.to', target: '_blank' },
                },
              ],
            },
          ],
        },
      ])
    );

    const { ref } = await render({ content: exported });

    const text = getFirstText(ref.current!.getJSON());

    expect({
      text: text?.text,
      href: text?.marks?.[0]?.attrs?.href,
      type: text?.marks?.[0]?.type,
    }).toEqual({
      text: 'Maily',
      href: 'https://maily.to',
      type: 'link',
    });
  });
});
