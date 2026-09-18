import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getDocument } from '#test-utils';
import type { Editor } from '~/index';

const EMPTY_PARAGRAPH = { type: 'paragraph' as const };

function getSectionDocument(paragraphs: JSONContent[]) {
  return getDocument([{ type: 'section', content: paragraphs }]);
}

function getColumnDocument(paragraphs: JSONContent[]) {
  return getDocument([
    {
      type: 'columns',
      attrs: { columnCount: 2, gap: 8 },
      content: [
        { type: 'column', content: paragraphs },
        { type: 'column', content: [EMPTY_PARAGRAPH] },
      ],
    },
  ]);
}

const STAYING_INSIDE_CASES: {
  edge: 'end' | 'start';
  inside: number;
  name: string;
  paragraphs: JSONContent[];
}[] = [
  {
    edge: 'end',
    inside: 4,
    name: 'keeps the caret in the section while the paragraph has text',
    paragraphs: [
      { type: 'paragraph', content: [{ type: 'text', text: 'Inside' }] },
    ],
  },
  {
    edge: 'start',
    inside: 6,
    name: 'keeps the caret in the section while the empty paragraph is not the last child',
    paragraphs: [
      EMPTY_PARAGRAPH,
      EMPTY_PARAGRAPH,
      { type: 'paragraph', content: [{ type: 'text', text: 'Last' }] },
    ],
  },
];

type SelectBlockEdgeOptions = {
  edge: 'end' | 'start';
  handle: Editor.Root.Handle;
  nodeType: string;
};

function selectBlockEdge(options: SelectBlockEdgeOptions) {
  const { edge, handle, nodeType } = options;
  const editor = handle.getEditor();
  let position: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === nodeType && position === null) {
      position = edge === 'start' ? pos + 2 : pos + node.nodeSize - 2;
    }
  });

  editor.commands.setTextSelection(position!);
}

function getContainerNode(handle: Editor.Root.Handle) {
  return handle.getJSON().content?.[0]?.content?.[0];
}

function getContainerChildren(handle: Editor.Root.Handle) {
  return getContainerNode(handle)?.content?.map((node) => {
    return node.type;
  });
}

function getFirstContainerChild(handle: Editor.Root.Handle) {
  return getContainerNode(handle)?.content?.[0];
}

function getSelectionAncestors(handle: Editor.Root.Handle) {
  const { $from } = handle.getEditor().state.selection;
  const ancestors: string[] = [];

  for (let depth = $from.depth; depth >= 0; depth--) {
    ancestors.push($from.node(depth).type.name);
  }

  return ancestors;
}

describe('exit on triple enter', () => {
  const { render } = createRenderer();

  describe('lifting out', () => {
    it('lifts the caret out of a section on a triple Enter', async () => {
      const { ref } = await render({
        caret: 'end',
        content: getSectionDocument([EMPTY_PARAGRAPH]),
      });

      selectBlockEdge({
        edge: 'end',
        handle: ref.current!,
        nodeType: 'section',
      });
      await userEvent.keyboard('{Enter}{Enter}{Enter}');

      const section = getFirstContainerChild(ref.current!);

      expect({
        ancestors: getSelectionAncestors(ref.current!),
        children: getContainerChildren(ref.current!),
        inside: section?.content?.map((node) => {
          return node.type;
        }),
      }).toEqual({
        ancestors: ['paragraph', 'container', 'body', 'doc'],
        children: ['section', 'paragraph'],
        inside: ['paragraph'],
      });
    });

    it('lifts the caret out of the columns on a triple Enter in a column', async () => {
      const { ref } = await render({
        caret: 'end',
        content: getColumnDocument([EMPTY_PARAGRAPH]),
      });

      selectBlockEdge({
        edge: 'end',
        handle: ref.current!,
        nodeType: 'column',
      });
      await userEvent.keyboard('{Enter}{Enter}{Enter}');

      const column = getFirstContainerChild(ref.current!)?.content?.[0];

      expect({
        ancestors: getSelectionAncestors(ref.current!),
        children: getContainerChildren(ref.current!),
        inside: column?.content?.map((node) => {
          return node.type;
        }),
      }).toEqual({
        ancestors: ['paragraph', 'container', 'body', 'doc'],
        children: ['columns', 'paragraph'],
        inside: ['paragraph'],
      });
    });
  });

  describe('staying inside', () => {
    for (const { edge, inside, name, paragraphs } of STAYING_INSIDE_CASES) {
      it(name, async () => {
        const { ref } = await render({
          caret: 'end',
          content: getSectionDocument(paragraphs),
        });

        selectBlockEdge({
          edge,
          handle: ref.current!,
          nodeType: 'section',
        });
        await userEvent.keyboard('{Enter}{Enter}{Enter}');

        const section = getFirstContainerChild(ref.current!);

        expect({
          ancestors: getSelectionAncestors(ref.current!),
          children: getContainerChildren(ref.current!),
          inside: section?.content?.length,
        }).toEqual({
          ancestors: ['paragraph', 'section', 'container', 'body', 'doc'],
          children: ['section'],
          inside,
        });
      });
    }
  });
});
