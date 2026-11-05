import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';

const MODIFIER = navigator.platform.includes('Mac') ? 'Meta' : 'Control';

describe('nodes', () => {
  const { render } = createRenderer();

  describe('headings', () => {
    it('changes a heading level through an editor command', async () => {
      const { ref } = await render({
        content: getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'Title' }] },
        ]),
      });

      const editor = ref.current!.getEditor();
      editor.chain().focus().selectAll().toggleHeading({ level: 2 }).run();
      const asHeading = getContainerContent(ref.current!)[0];

      editor.chain().focus().selectAll().toggleHeading({ level: 3 }).run();
      const promoted = getContainerContent(ref.current!)[0];

      expect({
        type: asHeading?.type,
        level: asHeading?.attrs?.level,
        promotedLevel: promoted?.attrs?.level,
      }).toEqual({ type: 'heading', level: 2, promotedLevel: 3 });
    });

    it('imports a styled heading with its level', async () => {
      const { ref } = await render({
        content: '<h2 style="color:#111827">Title</h2>',
      });

      const heading = getContainerContent(ref.current!)[0];

      expect({
        type: heading?.type,
        level: heading?.attrs?.level,
        style: heading?.attrs?.style,
        text: heading?.content?.[0]?.text,
      }).toEqual({
        type: 'heading',
        level: 2,
        style: 'color:#111827',
        text: 'Title',
      });
    });
  });

  describe('html import', () => {
    it('imports blockquotes, horizontal rules and hard breaks', async () => {
      const { ref } = await render({
        content:
          '<blockquote style="color:#475569"><p>Quoted</p></blockquote>' +
          '<hr />' +
          '<p>Before<br />After</p>',
      });

      const content = getContainerContent(ref.current!);

      expect({
        blockquote: content[0]?.type,
        blockquoteStyle: content[0]?.attrs?.style,
        quoted: content[0]?.content?.[0]?.content?.[0]?.text,
        horizontalRule: content[1]?.type,
        paragraphParts: content[2]?.content?.map((part) => {
          return part.type;
        }),
      }).toEqual({
        blockquote: 'blockquote',
        blockquoteStyle: 'color:#475569',
        quoted: 'Quoted',
        horizontalRule: 'horizontalRule',
        paragraphParts: ['text', 'hardBreak', 'text'],
      });
    });

    it('imports a nested list without losing its structure', async () => {
      const { ref } = await render({
        content:
          '<ul style="padding-left:26px"><li><p>One</p>' +
          '<ol><li><p>Nested</p></li></ol></li></ul>',
      });

      const list = getContainerContent(ref.current!)[0];
      const item = list?.content?.[0];

      expect({
        list: list?.type,
        listStyle: list?.attrs?.style,
        item: item?.type,
        itemParts: item?.content?.map((part) => {
          return part.type;
        }),
        nestedText:
          item?.content?.[1]?.content?.[0]?.content?.[0]?.content?.[0]?.text,
      }).toEqual({
        list: 'bulletList',
        listStyle: 'padding-left:26px',
        item: 'listItem',
        itemParts: ['paragraph', 'orderedList'],
        nestedText: 'Nested',
      });
    });

    it('keeps the text direction of imported nodes', async () => {
      const { ref } = await render({
        content: '<p dir="rtl">مرحبا</p><p dir="ltr">Latin</p><p>Plain</p>',
        textDirection: 'auto',
      });

      expect(
        getContainerContent(ref.current!).map((node) => {
          return node.attrs?.dir;
        })
      ).toEqual(['rtl', 'ltr', 'auto']);
    });
  });

  describe('keyboard input', () => {
    it('rewrites typographic sequences as they are typed', async () => {
      const { ref } = await render({ caret: 'end', content: '<p></p>' });

      await userEvent.keyboard('(c) ');

      expect(ref.current?.getText()).toContain('©');
    });

    it('applies marks through their keyboard shortcuts', async () => {
      const { ref } = await render({
        caret: 'end',
        content: '<p>Shortcut</p>',
      });

      ref.current!.getEditor().commands.selectAll();
      await userEvent.keyboard(`{${MODIFIER}>}b{/${MODIFIER}}`);
      await userEvent.keyboard(`{${MODIFIER}>}i{/${MODIFIER}}`);

      expect(
        (getContainerContent(ref.current!)[0]?.content?.[0]?.marks ?? [])
          .map((mark) => {
            return mark.type;
          })
          .sort()
      ).toEqual(['bold', 'italic']);
    });
  });
});
