import type { ButtonNode, ColumnNode, DocumentNode } from '@maily-to/shared';
import { HTML_CODE_BLOCK_TABS } from '@maily-to/shared';
import { waitFor } from '@testing-library/react';
import type { Editor as TiptapEditor } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';

import { createRenderer, getDocument, isFirefox } from '#test-utils';

function getPlaceholder(element: Element | null) {
  return element?.getAttribute('data-placeholder') ?? null;
}

function getEmptyColumn(): ColumnNode {
  return {
    type: 'column',
    attrs: { verticalAlign: 'top', width: null },
    content: [{ type: 'paragraph' }],
  };
}

function getEmptyButton(): ButtonNode {
  return {
    type: 'button',
    attrs: { align: 'center', kind: 'tight', url: '' },
    content: [],
  };
}

type FindPromptedNodeOptions = {
  editable: HTMLElement;
  selector: string;
};

function findPromptedNode(options: FindPromptedNodeOptions) {
  const { editable, selector } = options;

  return waitFor(() => {
    const found = editable.querySelector<HTMLElement>(selector);
    expect(getPlaceholder(found)).not.toBeNull();
    return found!;
  });
}

type GetNodePositionOptions = {
  editor: TiptapEditor;
  type: string;
};

function getNodePosition(options: GetNodePositionOptions) {
  const { editor, type } = options;
  let position = -1;

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === type && node.content.size === 0) {
      position = pos + 1;
    }

    return true;
  });

  return position;
}

type GetFocusedWidthOptions = {
  editable: HTMLElement;
  editor: TiptapEditor;
  position: number;
  selector: string;
};

async function getFocusedWidth(options: GetFocusedWidthOptions) {
  const { editable, editor, position, selector } = options;

  editor.commands.focus(position);

  return waitFor(() => {
    const found = editable.querySelector(selector);
    expect(found).not.toBeNull();
    return Math.round(found!.getBoundingClientRect().width);
  });
}

describe('<PlaceholderExtension />', () => {
  const { render } = createRenderer();

  function getStyledEditor(content: DocumentNode) {
    return render({ caret: 'end', content, styled: true });
  }

  describe('prompt text', () => {
    it('prompts for content on an empty paragraph', async () => {
      const { editable } = await getStyledEditor(
        getDocument([{ type: 'paragraph' }])
      );

      const paragraph = await findPromptedNode({ editable, selector: 'p' });

      expect({
        isEditorEmpty: paragraph.classList.contains('is-editor-empty'),
        placeholder: getPlaceholder(paragraph),
        shown: getComputedStyle(paragraph, '::before').color,
      }).toEqual({
        isEditorEmpty: true,
        placeholder: 'Write something or / to see commands',
        shown: 'rgb(153, 161, 175)',
      });
    });

    it('names the level of an empty heading', async () => {
      const { editable } = await getStyledEditor(
        getDocument([{ type: 'heading', attrs: { level: 2 } }])
      );

      const heading = await findPromptedNode({ editable, selector: 'h2' });

      expect(getPlaceholder(heading)).toBe('Heading 2');
    });

    it('prompts for markup inside an empty html code block', async () => {
      const { editable } = await getStyledEditor(
        getDocument([
          {
            type: 'htmlCodeBlock',
            attrs: { activeTab: HTML_CODE_BLOCK_TABS.CODE, language: 'html' },
            content: [],
          },
        ])
      );

      const block = await findPromptedNode({
        editable,
        selector: '[data-node-type="htmlCodeBlock"]',
      });

      expect({
        placeholder: getPlaceholder(block),
        position: getComputedStyle(block, '::before').position,
      }).toEqual({
        placeholder: 'Type your HTML code...',
        position: 'absolute',
      });
    });
  });

  describe('nodes without a prompt', () => {
    it('leaves the section, columns and list nodes without a placeholder', async () => {
      const { editable } = await getStyledEditor(
        getDocument([
          { type: 'section', content: [{ type: 'paragraph' }] },
          {
            type: 'columns',
            attrs: { columnCount: 2, gap: 8 },
            content: [getEmptyColumn(), getEmptyColumn()],
          },
          {
            type: 'bulletList',
            content: [{ type: 'listItem', content: [{ type: 'paragraph' }] }],
          },
        ])
      );

      await findPromptedNode({ editable, selector: 'li p[data-placeholder]' });

      expect(
        [
          '[data-node-type="section"]',
          '[data-node-type="columns"]',
          '[data-node-type="column"]',
          'ul',
          'li',
        ].map((selector) => {
          return getPlaceholder(editable.querySelector(selector));
        })
      ).toEqual([null, null, null, null, null]);
    });

    it('leaves an empty button without the writing prompt', async () => {
      const { editable, ref } = await getStyledEditor(
        getDocument([getEmptyButton(), { type: 'paragraph' }])
      );

      const editor = ref.current!.getEditor();

      editor.commands.focus(getNodePosition({ editor, type: 'button' }));

      const button = await waitFor(() => {
        const found = editable.querySelector('[data-node-type="button"]');
        expect(found?.classList.contains('is-empty')).toBe(true);
        return found!;
      });

      expect({
        content: getComputedStyle(button, '::before').content,
        placeholder: getPlaceholder(button),
      }).toEqual({
        content: isFirefox ? 'attr(data-placeholder)' : '""',
        placeholder: '',
      });
    });
  });

  describe('layout', () => {
    it('truncates the placeholder rather than wrapping it', async () => {
      const { editable } = await getStyledEditor(
        getDocument([{ type: 'paragraph' }])
      );

      const paragraph = await findPromptedNode({ editable, selector: 'p' });

      const style = getComputedStyle(paragraph, '::before');

      expect({
        hasDescenderRoom: Number.parseFloat(style.paddingBlockEnd) > 0,
        overflow: style.overflow,
        textOverflow: style.textOverflow,
        whiteSpace: style.whiteSpace,
      }).toEqual({
        hasDescenderRoom: true,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    });

    it('keeps an empty block one line tall in a column too narrow for the prompt', async () => {
      const { editable } = await getStyledEditor(
        getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'Written' }] },
          {
            type: 'columns',
            attrs: { columnCount: 4, gap: 8 },
            content: [
              getEmptyColumn(),
              getEmptyColumn(),
              getEmptyColumn(),
              getEmptyColumn(),
            ],
          },
        ])
      );

      const empty = await findPromptedNode({
        editable,
        selector: '[data-node-type="column"] p[data-placeholder]',
      });

      const written = editable.querySelector<HTMLElement>(
        'p:not([data-placeholder])'
      )!;

      expect(empty.getBoundingClientRect().height).toBe(
        written.getBoundingClientRect().height
      );
    });

    it('keeps an empty button at the width it has unfocused', async () => {
      const { editable, ref } = await getStyledEditor(
        getDocument([getEmptyButton(), { type: 'paragraph' }])
      );

      const editor = ref.current!.getEditor();
      const selector = '[data-node-type="button"]';

      const unfocused = await getFocusedWidth({
        editable,
        editor,
        position: getNodePosition({ editor, type: 'paragraph' }),
        selector,
      });
      const focused = await getFocusedWidth({
        editable,
        editor,
        position: getNodePosition({ editor, type: 'button' }),
        selector,
      });

      expect(focused).toBe(unfocused);
    });
  });
});
