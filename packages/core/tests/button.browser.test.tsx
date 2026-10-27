import { render as renderMaily } from '@maily-to/render';
import { BASIC_NODE_THEME } from '@maily-to/shared';
import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import type { Editor } from '~/index';

const STORED_EMPTY_BUTTON_DOCUMENT = getDocument([
  {
    type: 'button',
    attrs: { align: 'center', kind: 'tight', url: '' },
    content: [],
  },
  { type: 'paragraph' },
]);

const FRAMED_DOCUMENT = getDocument([
  { type: 'paragraph', content: [{ type: 'text', text: 'Before' }] },
  { type: 'button', content: [{ type: 'text', text: 'Button' }] },
  { type: 'paragraph', content: [{ type: 'text', text: 'After' }] },
]);

function getButtonNode(ref: React.RefObject<Editor.Root.Handle | null>) {
  let found: JSONContent | undefined;
  ref.current!.getEditor().state.doc.descendants((node) => {
    if (node.type.name === 'button') {
      found = node.toJSON() as JSONContent;
    }
  });

  return found;
}

function getExportedDocument(html: string) {
  return new DOMParser().parseFromString(html, 'text/html');
}

describe('<ButtonExtension />', () => {
  const { render } = createRenderer();

  const mountButton = async () => {
    const { ref } = await render({ content: FRAMED_DOCUMENT });
    const editor = ref.current!.getEditor();

    let position = 0;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'button') {
        position = pos;
      }
    });

    return { editor, position, ref };
  };

  it('inserts a button without authoring a style', async () => {
    const { ref } = await render();

    ref.current
      ?.getEditor()
      .chain()
      .focus()
      .setButton({ url: 'https://maily.to' })
      .run();

    const button = getButtonNode(ref);

    expect({
      align: button?.attrs?.align,
      kind: button?.attrs?.kind,
      style: button?.attrs?.style,
      url: button?.attrs?.url,
    }).toEqual({
      align: 'center',
      kind: 'tight',
      style: null,
      url: 'https://maily.to',
    });
  });

  describe('exporting', () => {
    it('exports a tight button with the configured theme', async () => {
      const { ref } = await render();

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .setButton({ url: 'https://maily.to' })
        .run();

      const anchor = getExportedDocument(
        await renderMaily(ref.current!.getJSON(), { theme: BASIC_NODE_THEME })
      ).querySelector('a');

      expect({
        background: anchor?.style.backgroundColor,
        href: anchor?.getAttribute('href'),
        text: anchor?.textContent,
      }).toEqual({
        background: 'rgb(0, 0, 0)',
        href: 'https://maily.to',
        text: 'Button',
      });
    });

    it('exports a full-width button as a presentation table', async () => {
      const { ref } = await render();

      ref.current?.getEditor().chain().focus().setButton().run();
      ref.current
        ?.getEditor()
        .commands.updateButtonAttributes({ kind: 'full-width' });

      const exported = getExportedDocument(
        await renderMaily(ref.current!.getJSON())
      );

      expect({
        cellWidth: exported.querySelector('table')?.getAttribute('width'),
        linkDisplay: exported.querySelector('a')?.style.display,
      }).toEqual({ cellWidth: '100%', linkDisplay: 'block' });
    });

    it('resolves a variable in the button url', async () => {
      const { ref } = await render();

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .setButton({ url: '{{ctaUrl}}' })
        .run();

      const html = await renderMaily(ref.current!.getJSON(), {
        variables: { ctaUrl: 'https://maily.to/cta' },
      });

      expect(
        getExportedDocument(html).querySelector('a')?.getAttribute('href')
      ).toBe('https://maily.to/cta');
    });
  });

  describe('empty content', () => {
    it('leaves an emptied button empty instead of filling it with a variable', async () => {
      const { ref } = await render();

      const editor = ref.current!.getEditor();
      editor.chain().focus().setButton().run();

      let position = 0;
      let size = 0;
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'button') {
          position = pos;
          size = node.nodeSize;
        }
      });

      editor
        .chain()
        .setTextSelection({ from: position + 1, to: position + size - 1 })
        .deleteSelection()
        .run();

      const button = getContainerContent(ref.current!).find((node) => {
        return node.type === 'button';
      });

      expect(button).not.toBeUndefined();
      expect(button?.content ?? []).toEqual([]);
    });

    it('accepts a stored empty button as a valid document', async () => {
      const { ref } = await render({ content: STORED_EMPTY_BUTTON_DOCUMENT });

      const editor = ref.current!.getEditor();
      editor.chain().focus('end').insertContent('After').run();

      expect(() => {
        return editor.state.doc.check();
      }).not.toThrow();
      expect(getButtonNode(ref)?.content).toBeUndefined();
    });
  });

  describe('keyboard shortcuts', () => {
    it('deletes the button with the delete shortcut', async () => {
      const { editor, position, ref } = await mountButton();

      editor
        .chain()
        .focus()
        .setTextSelection(position + 1)
        .run();
      editor.commands.keyboardShortcut('Mod-Backspace');

      expect(getButtonNode(ref)).toBeUndefined();
    });

    it('deletes an empty button on backspace', async () => {
      const { editor, position, ref } = await mountButton();

      editor
        .chain()
        .setTextSelection({ from: position + 1, to: position + 7 })
        .deleteSelection()
        .run();

      expect(getButtonNode(ref)).not.toBeUndefined();

      editor
        .chain()
        .focus()
        .setTextSelection(position + 1)
        .run();
      expect(editor.state.selection.$anchor.parent.type.name).toBe('button');

      editor.commands.keyboardShortcut('Backspace');

      expect(getButtonNode(ref)).toBeUndefined();
    });

    it('keeps a button with text on backspace', async () => {
      const { editor, position, ref } = await mountButton();

      editor
        .chain()
        .focus()
        .setTextSelection(position + 3)
        .run();
      editor.commands.keyboardShortcut('Backspace');

      expect(getButtonNode(ref)).not.toBeUndefined();
    });

    it('leaves the button on enter at the end', async () => {
      const { editor, position } = await mountButton();

      editor
        .chain()
        .focus()
        .setTextSelection(position + 7)
        .run();
      editor.commands.keyboardShortcut('Enter');

      const siblings: string[] = [];
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'container') {
          node.forEach((child) => {
            siblings.push(child.type.name);
          });
          return false;
        }

        return true;
      });

      const buttonIndex = siblings.indexOf('button');

      expect(siblings[buttonIndex + 1]).toBe('paragraph');
    });
  });
});
