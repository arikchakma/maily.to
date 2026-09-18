import { render as renderMaily } from '@maily-to/render';
import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import {
  cleanup,
  createRenderer,
  getContainerContent,
  getDocument,
} from '#test-utils';
import { VariableExtension } from '~/extensions';
import { getVariableSuggestions } from '~/extensions/variable/variable-suggestion';
import { VariableBubbleMenu } from '~/index';
import type { Editor } from '~/index';

const LINKED_DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
        text: 'Confirm ',
      },
    ],
  },
]);

const VARIABLE_DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'variable', attrs: { id: 'name' } }],
  },
]);

type SuggestionProps = {
  command: (attrs: Record<string, unknown>) => void;
  query: string;
};

function trackSuggestion() {
  const seen: SuggestionProps[] = [];

  return {
    latest: () => {
      return seen.at(-1)!;
    },
    render: () => {
      return {
        onStart: (props: SuggestionProps) => {
          seen.push(props);
        },
        onUpdate: (props: SuggestionProps) => {
          seen.push(props);
        },
      };
    },
    seen,
  };
}

function getInsertedVariable(handle: Editor.Root.Handle) {
  return getContainerContent(handle)
    .at(-1)
    ?.content?.find((node) => {
      return node.type === 'variable';
    });
}

function getInsertedMarks(handle: Editor.Root.Handle) {
  const marks: string[] = [];

  handle.getEditor().state.doc.descendants((node) => {
    if (node.type.name === 'variable') {
      marks.push(
        ...node.marks.map((mark) => {
          return mark.type.name;
        })
      );
    }
  });

  return marks;
}

describe('<VariableExtension />', () => {
  const { render } = createRenderer();

  describe('inserting', () => {
    it('inserts a variable node with its fallback', async () => {
      const { ref } = await render({ extensions: [VariableExtension] });

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .insertVariable({ fallback: 'there', id: 'name' })
        .run();

      const variable = getInsertedVariable(ref.current!);

      expect({
        fallback: variable?.attrs?.fallback,
        id: variable?.attrs?.id,
        required: variable?.attrs?.required,
      }).toEqual({ fallback: 'there', id: 'name', required: true });
    });

    it('keeps the marks around it when a variable is inserted', async () => {
      const { ref } = await render({
        content: LINKED_DOCUMENT,
        extensions: [VariableExtension],
      });
      const editor = ref.current!.getEditor();

      editor.commands.setTextSelection(editor.state.doc.content.size - 3);
      editor.commands.insertVariable({ id: 'firstName' });

      expect(getInsertedMarks(ref.current!)).toEqual(['link']);
    });
  });

  describe('the suggestion list', () => {
    it('opens the suggestion when the trigger is typed', async () => {
      const tracker = trackSuggestion();
      const { ref } = await render({
        caret: 'end',
        extensions: [
          VariableExtension.configure({
            suggestion: {
              items: ({ query }: { query: string }) => {
                return ['name', 'email'].filter((item) => {
                  return item.startsWith(query);
                });
              },
              render: tracker.render,
            },
          }),
        ],
      });

      await userEvent.keyboard('{{{{na');

      await waitFor(() => {
        expect(tracker.seen.length).toBeGreaterThan(0);
      });

      tracker.latest().command({ id: 'name' });

      const variable = getInsertedVariable(ref.current!);

      expect({
        char: variable?.attrs?.variableSuggestionChar,
        id: variable?.attrs?.id,
        query: tracker.latest().query,
      }).toEqual({ char: '{{', id: 'name', query: 'na' });
    });

    it('filters the configured variables as the query is typed', async () => {
      const tracker = trackSuggestion();

      await render({
        caret: 'end',
        extensions: [
          VariableExtension.configure({
            suggestion: { ...getVariableSuggestions(), render: tracker.render },
            variables: [{ id: 'name' }, { id: 'email' }, { id: 'nickname' }],
          }),
        ],
      });

      await userEvent.keyboard('{{{{n');

      await waitFor(() => {
        expect(tracker.seen.length).toBeGreaterThan(0);
      });

      expect(
        (
          tracker.latest() as unknown as { items: Array<{ id: string }> }
        ).items.map((item) => {
          return item.id;
        })
      ).toEqual(['name', 'nickname', 'n']);
    });

    it('shows the suggestion popup and inserts the chosen variable', async () => {
      const { ref } = await render({
        caret: 'end',
        extensions: [
          VariableExtension.configure({
            variables: [{ id: 'name' }, { id: 'email' }],
          }),
        ],
      });

      await userEvent.keyboard('{{{{');

      const popover = await waitFor(() => {
        const found = document.querySelector('[data-mly-suggestion]');
        expect(found).not.toBeNull();
        return found!;
      });

      expect(
        [...popover.querySelectorAll('[data-mly-suggestion-item]')].map(
          (item) => {
            return item.textContent;
          }
        )
      ).toEqual(['name', 'email']);

      await userEvent.keyboard('{ArrowDown}{Enter}');

      await waitFor(() => {
        expect(document.querySelector('[data-mly-suggestion]')).toBeNull();
      });

      expect(getInsertedVariable(ref.current!)?.attrs?.id).toBe('email');
    });

    it('keeps the marks around it when the suggestion inserts', async () => {
      const tracker = trackSuggestion();
      const { ref } = await render({
        caret: 'end',
        content: LINKED_DOCUMENT,
        extensions: [
          VariableExtension.configure({
            suggestion: {
              items: ({ query }: { query: string }) => {
                return ['name'].filter((item) => {
                  return item.startsWith(query);
                });
              },
              render: tracker.render,
            },
          }),
        ],
      });

      await userEvent.keyboard('{{{{na');

      await waitFor(() => {
        expect(tracker.seen.length).toBeGreaterThan(0);
      });

      tracker.latest().command({ id: 'name' });

      expect(getInsertedMarks(ref.current!)).toEqual(['link']);
    });
  });

  describe('the trigger character', () => {
    it('supports a second trigger character', async () => {
      const tracker = trackSuggestion();
      const { ref } = await render({
        caret: 'end',
        extensions: [
          VariableExtension.configure({
            suggestions: [
              {
                char: '{{',
                items: () => {
                  return [];
                },
                render: tracker.render,
              },
              {
                char: '#',
                items: () => {
                  return [];
                },
                render: tracker.render,
              },
            ],
          }),
        ],
      });

      await userEvent.keyboard('#tag');

      await waitFor(() => {
        expect(tracker.seen.length).toBeGreaterThan(0);
      });

      tracker.latest().command({ id: 'tag' });

      expect(
        getInsertedVariable(ref.current!)?.attrs?.variableSuggestionChar
      ).toBe('#');
    });

    it('restores the trigger character on backspace', async () => {
      const { editable, ref } = await render({
        extensions: [VariableExtension],
      });

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .insertVariable({ id: 'name' })
        .run();

      await userEvent.click(editable);
      ref.current?.getEditor().commands.focus('end');
      await userEvent.keyboard('{Backspace}');

      expect(ref.current!.getText().trim()).toBe('{{');
    });
  });

  it('round-trips a variable through the editor HTML', async () => {
    const { ref } = await render({ extensions: [VariableExtension] });

    ref.current
      ?.getEditor()
      .chain()
      .focus()
      .insertVariable({ fallback: 'there', id: 'name' })
      .run();

    const before = ref.current!.getJSON();
    const editorHtml = ref.current!.getEditorHTML();

    cleanup();

    const { ref: pasted } = await render({
      content: editorHtml,
      extensions: [VariableExtension],
    });

    expect(pasted.current!.getJSON()).toEqual(before);
  });

  it('resolves an inserted variable when the document is exported', async () => {
    const { ref } = await render({ extensions: [VariableExtension] });

    ref.current
      ?.getEditor()
      .chain()
      .focus()
      .insertContent('Hello ')
      .insertVariable({ fallback: 'there', id: 'name' })
      .run();

    const html = await renderMaily(ref.current!.getJSON(), {
      variables: { name: 'Alice' },
    });

    expect(
      new DOMParser().parseFromString(html, 'text/html').querySelector('p')
        ?.textContent
    ).toBe('Hello Alice');
  });

  it('commits a variable field with the enter key it advertises', async () => {
    const { ref } = await render({
      children: <VariableBubbleMenu />,
      content: VARIABLE_DOCUMENT,
      extensions: [VariableExtension],
    });

    ref.current!.getEditor().commands.setNodeSelection(3);

    const field = await waitFor(() => {
      const found = document.querySelector<HTMLInputElement>(
        'input[aria-label="Default Value"]'
      );
      expect(found).not.toBeNull();
      return found!;
    });

    expect(document.querySelectorAll('[data-mly-field-icon]').length).toBe(2);

    await userEvent.click(field);
    await userEvent.keyboard('Ada{Enter}');

    await waitFor(() => {
      expect(getInsertedVariable(ref.current!)?.attrs?.fallback).toBe('Ada');
    });
  });
});
