import { render as renderReact, waitFor, within } from '@testing-library/react';
import type { Editor as TiptapEditor } from '@tiptap/core';
import { Paragraph } from '@tiptap/extension-paragraph';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, EMPTY_DOCUMENT, getDocument } from '#test-utils';
import { Editor } from '~/index';

function getTextDocument(text: string) {
  return getDocument([
    { type: 'paragraph', content: [{ type: 'text', text }] },
  ]);
}

const SHELLED_DOCUMENT = getDocument([
  { type: 'paragraph', content: [{ type: 'text', text: 'Inside' }] },
  { type: 'paragraph', content: [{ type: 'text', text: 'Stray' }] },
  { type: 'paragraph', content: [{ type: 'text', text: 'Also inside' }] },
]);

const SHELL_ENTER_CASES = [
  {
    enters: 2,
    name: 'keeps one shell when a paragraph is emptied and left',
    text: 'Stray',
  },
  {
    enters: 3,
    name: 'keeps one shell through three enters mid-document',
    text: 'Inside',
  },
];

function getText(handle: Editor.Root.Handle | null) {
  return handle?.getText();
}

function getShellCounts(editor: TiptapEditor) {
  const counts = { body: 0, container: 0 };

  editor.state.doc.descendants((node) => {
    if (node.type.name === 'body') {
      counts.body += 1;
    }

    if (node.type.name === 'container') {
      counts.container += 1;
    }

    return true;
  });

  return counts;
}

type ParagraphRangeOptions = {
  editor: TiptapEditor;
  text: string;
};

function getParagraphRange(options: ParagraphRangeOptions) {
  const { editor, text } = options;
  const range = { from: 0, to: 0 };

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'paragraph' && node.textContent === text) {
      range.from = pos + 1;
      range.to = pos + node.nodeSize - 1;
    }

    return true;
  });

  return range;
}

describe('<Editor.Root />', () => {
  const { render } = createRenderer();

  describe('extensions', () => {
    it('styles authored nodes only when ThemeExtension is registered', async () => {
      const content = getTextDocument('Theme boundary');
      const { view: plainView } = await render({ content });
      const { view: themedView } = await render({ content, theme: true });
      const plainParagraph = within(plainView.container).getByText(
        'Theme boundary'
      );
      const themedParagraph = within(themedView.container).getByText(
        'Theme boundary'
      );

      expect({
        plainColor: getComputedStyle(plainParagraph).color,
        plainStyle: plainParagraph.getAttribute('style'),
        rootStyle: themedView.container
          .querySelector('[data-mly-editor-root]')
          ?.getAttribute('style'),
        themedColor: getComputedStyle(themedParagraph).color,
      }).toEqual({
        plainColor: 'rgb(0, 0, 0)',
        plainStyle: null,
        rootStyle: null,
        themedColor: 'rgb(24, 24, 27)',
      });
    });

    it('replaces a default extension when a custom extension has the same name', async () => {
      const CustomParagraphExtension = Paragraph.configure({
        HTMLAttributes: {
          'data-custom-paragraph': '',
        },
      });
      const { view } = await render({
        content: getTextDocument('Custom paragraph'),
        extensions: [CustomParagraphExtension],
      });

      expect(
        view.container.querySelector('p')?.hasAttribute('data-custom-paragraph')
      ).toBe(true);
    });
  });

  describe('content', () => {
    it('updates controlled canonical content without an update loop', async () => {
      const ref = createRef<Editor.Root.Handle>();
      const onUpdate = vi.fn();
      const view = renderReact(
        <Editor.Root
          content={getTextDocument('First value')}
          onUpdate={onUpdate}
          ref={ref}
        >
          <Editor.Content />
        </Editor.Root>
      );

      view.rerender(
        <Editor.Root
          content={getTextDocument('Second value')}
          onUpdate={onUpdate}
          ref={ref}
        >
          <Editor.Content />
        </Editor.Root>
      );

      await waitFor(() => {
        expect({
          text: getText(ref.current),
          updates: onUpdate.mock.calls.length,
        }).toEqual({
          text: 'Second value',
          updates: 0,
        });
      });
    });

    it('updates canonical JSON when a user types into the editor', async () => {
      const ref = createRef<Editor.Root.Handle>();
      const onUpdate = vi.fn();
      const view = renderReact(
        <Editor.Root content={EMPTY_DOCUMENT} onUpdate={onUpdate} ref={ref}>
          <Editor.Content />
        </Editor.Root>
      );
      const textbox = within(view.container).getByRole('textbox');

      await userEvent.click(textbox);
      await userEvent.keyboard('Typed in the editor');

      expect({
        text: getText(ref.current),
        updated: onUpdate.mock.calls.length > 0,
      }).toEqual({
        text: 'Typed in the editor',
        updated: true,
      });
    });
  });

  describe('content validation', () => {
    const INVALID_DOCUMENT = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Loose' }] },
      ],
    };

    it('reports a document that does not match the schema', async () => {
      const onContentError = vi.fn();
      const ref = createRef<Editor.Root.Handle>();
      renderReact(
        <Editor.Root
          content={INVALID_DOCUMENT}
          onContentError={onContentError}
          ref={ref}
        >
          <Editor.Content />
        </Editor.Root>
      );

      const [body] = ref.current!.getEditor().state.doc.children;
      const [container] = body?.children ?? [];

      expect({
        errors: onContentError.mock.calls.length,
        message: onContentError.mock.calls[0]?.[0]?.error?.message,
        shape: [body?.type.name, container?.type.name].join(' > '),
        text: getText(ref.current),
      }).toEqual({
        errors: 1,
        message: '[tiptap error]: Invalid JSON content',
        shape: 'body > container',
        text: 'Loose',
      });
    });

    it('reports through the console when no handler is given', async () => {
      const reported = vi.spyOn(console, 'error').mockImplementation(() => {});
      const ref = createRef<Editor.Root.Handle>();
      renderReact(
        <Editor.Root content={INVALID_DOCUMENT} ref={ref}>
          <Editor.Content />
        </Editor.Root>
      );

      expect({
        messages: reported.mock.calls.map((call) => {
          return (call[0] as Error)?.message;
        }),
        text: getText(ref.current),
      }).toEqual({
        messages: ['[tiptap error]: Invalid JSON content'],
        text: 'Loose',
      });

      reported.mockRestore();
    });
  });

  describe('the document shell', () => {
    for (const { enters, name, text } of SHELL_ENTER_CASES) {
      it(name, async () => {
        const { ref } = await render({ content: SHELLED_DOCUMENT });

        const editor = ref.current!.getEditor();
        const { to } = getParagraphRange({ editor, text });

        editor.commands.focus();
        editor.commands.setTextSelection(to);
        for (let index = 0; index < enters; index += 1) {
          editor.commands.keyboardShortcut('Enter');
        }

        expect(getShellCounts(editor)).toEqual({ body: 1, container: 1 });
      });
    }

    it('keeps one shell when backspace runs at the very start', async () => {
      const { ref } = await render({ content: SHELLED_DOCUMENT });

      const editor = ref.current!.getEditor();
      const { from } = getParagraphRange({ editor, text: 'Inside' });

      editor.commands.focus();
      editor.commands.setTextSelection(from);
      editor.commands.keyboardShortcut('Backspace');
      editor.commands.keyboardShortcut('Backspace');

      expect({
        counts: getShellCounts(editor),
        text: editor.state.doc.textContent,
      }).toEqual({
        counts: { body: 1, container: 1 },
        text: 'InsideStrayAlso inside',
      });
    });

    it('rebuilds the shell when the whole document is deleted', async () => {
      const { ref } = await render({ content: SHELLED_DOCUMENT });

      const editor = ref.current!.getEditor();

      editor.commands.focus();
      editor.commands.selectAll();
      editor.commands.deleteSelection();

      const [body] = editor.state.doc.children;
      const [container] = body?.children ?? [];

      expect({
        counts: getShellCounts(editor),
        shape: [
          editor.state.doc.type.name,
          body?.type.name,
          container?.type.name,
          container?.firstChild?.type.name,
        ].join(' > '),
        text: editor.state.doc.textContent,
      }).toEqual({
        counts: { body: 1, container: 1 },
        shape: 'doc > body > container > paragraph',
        text: '',
      });
    });
  });

  it('undoes and redoes an edit', async () => {
    const { ref } = await render({ content: getTextDocument('Start') });

    const editor = ref.current!.getEditor();
    editor.chain().focus('end').insertContent(' and more').run();

    expect(getText(ref.current)).toBe('Start and more');

    editor.commands.undo();
    expect(getText(ref.current)).toBe('Start');

    editor.commands.redo();
    expect(getText(ref.current)).toBe('Start and more');
  });
});
