import type { InlineSuggestionOptions } from '@maily-to/extension-inline-suggestion';
import { InlineSuggestion } from '@maily-to/extension-inline-suggestion';
import { waitFor } from '@testing-library/react';
import type { Editor as TiptapEditor } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { cleanup, createRenderer, getDocument } from '#test-utils';

const DOCUMENT = getDocument([
  { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
]);

function getTrimmedText(editor: TiptapEditor) {
  return editor.getText().trim();
}

describe('<InlineSuggestion />', () => {
  const { render } = createRenderer();

  const mountEditor = async (suggest: InlineSuggestionOptions['suggest']) => {
    const { ref } = await render({
      caret: 'end',
      content: DOCUMENT,
      extensions: [InlineSuggestion.configure({ debounceTime: 0, suggest })],
    });

    return ref.current!.getEditor();
  };

  const fetchSuggestion = async (suggestion = ' world') => {
    const editor = await mountEditor(async () => {
      return suggestion;
    });

    editor.commands.fetchSuggestion();

    await waitFor(() => {
      expect(editor.storage.inlineSuggestion.currentSuggestion).toBe(
        suggestion.trimStart()
      );
    });

    return editor;
  };

  describe('fetching', () => {
    it('draws the suggestion the fetch returns as a ghost', async () => {
      await fetchSuggestion();

      await waitFor(() => {
        expect(
          document
            .querySelector('[data-inline-suggestion]')
            ?.getAttribute('data-inline-suggestion')
        ).toBe('world');
      });
    });

    // The extension's config object is shared by every editor that registers it,
    // so state held in a closure there breaks the moment a page has two.
    it('keeps its request state per editor', async () => {
      const first = await fetchSuggestion();
      cleanup();

      const second = await mountEditor(async () => {
        return ' again';
      });

      second.commands.fetchSuggestion();

      await waitFor(() => {
        expect(second.storage.inlineSuggestion.currentSuggestion).toBe('again');
      });

      expect(first.isDestroyed).toBe(true);
    });

    it('leaves the cursor alone when the text is empty', async () => {
      const editor = await mountEditor(async () => {
        return 'never';
      });

      editor.commands.clearContent(true);
      editor.commands.fetchSuggestion();

      await waitFor(() => {
        expect(
          editor.storage.inlineSuggestion.currentSuggestion
        ).toBeUndefined();
      });
    });
  });

  describe('keyboard', () => {
    it('inserts the suggestion on the accept key', async () => {
      const editor = await fetchSuggestion();

      await userEvent.keyboard('{Tab}');

      await waitFor(() => {
        expect(getTrimmedText(editor)).toBe('Helloworld');
      });

      expect(editor.storage.inlineSuggestion.currentSuggestion).toBeUndefined();
    });

    it('dismisses the suggestion on escape', async () => {
      const editor = await fetchSuggestion();

      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(
          editor.storage.inlineSuggestion.currentSuggestion
        ).toBeUndefined();
      });

      expect(document.querySelector('[data-inline-suggestion]')).toBeNull();
      expect(getTrimmedText(editor)).toBe('Hello');
    });
  });
});
