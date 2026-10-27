import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { NodeSelection, Selection } from '@tiptap/pm/state';
import type { Editor } from '@tiptap/react';
import {
  findParentNode,
  isNodeSelection,
  isTextSelection,
  posToDOMRect,
} from '@tiptap/react';

// Nodes whose bubble menu should anchor to the container rather than the
// inline selection inside it.
const CONTAINER_NODES: string[] = [
  MAILY_NODE_TYPES.COLUMNS,
  MAILY_NODE_TYPES.REPEAT,
  MAILY_NODE_TYPES.SECTION,
  MAILY_NODE_TYPES.BUTTON,
  MAILY_NODE_TYPES.HTML_CODE_BLOCK,
];

// ProseMirror's default Selection.atStart picks atom nodes (image, spacer)
// as NodeSelection, showing a highlight on mount. We swap it to a text-only
// selection so nothing appears selected.
export function clearInitialNodeSelection(editor: Editor) {
  const { state } = editor;
  if (!(state.selection instanceof NodeSelection)) {
    return;
  }

  // textOnly=true skips atom nodes and finds the first text cursor position
  const textSelection = Selection.findFrom(state.doc.resolve(0), 1, true);
  if (textSelection) {
    editor.view.dispatch(state.tr.setSelection(textSelection));
  }

  editor.view.dom.blur();
}

function findNodeClientRect(editor: Editor, nodeType: string) {
  const activeNode = findParentNode((node) => node.type.name === nodeType)(
    editor.state.selection
  );
  if (!activeNode) {
    return null;
  }

  const dom = editor.view.nodeDOM(activeNode.pos);

  return dom instanceof HTMLElement ? dom.getBoundingClientRect() : null;
}

/**
 * Returns a DOMRect for the current selection. For nodes inside a
 * container (columns, repeat, section, button, html code block), returns the
 * container's rect so the bubble menu stays anchored to the block rather than
 * the inline selection.
 */
export function getCurrentSelectionRect(editor: Editor) {
  const { selection } = editor.state;
  const { ranges } = selection;

  const from = Math.min(...ranges.map((range) => range.$from.pos));
  const to = Math.max(...ranges.map((range) => range.$to.pos));

  for (const nodeType of CONTAINER_NODES) {
    if (editor.isActive(nodeType)) {
      return (
        findNodeClientRect(editor, nodeType) ??
        posToDOMRect(editor.view, from, to)
      );
    }
  }

  if (isNodeSelection(selection)) {
    const node = editor.view.nodeDOM(from);
    if (node instanceof HTMLElement) {
      return node.getBoundingClientRect();
    }
  }

  return posToDOMRect(editor.view, from, to);
}

/**
 * Returns true if the current selection is non-empty, non-collapsed,
 * and not on a disallowed node type.
 */
export function isValidSelection(
  editor: Editor,
  notAllowedNodes: string[] = []
) {
  const { doc, selection } = editor.state;
  const { empty, from, to } = selection;

  const isEmptyTextBlock =
    !doc.textBetween(from, to).length && isTextSelection(selection);
  const isNotAllowedNode =
    isNodeSelection(selection) &&
    notAllowedNodes.includes(selection.node.type.name);

  return !isEmptyTextBlock && !empty && !isNotAllowedNode;
}

type MoveCursorToCoordsCoords = {
  left: number;
  top: number;
};

/**
 * Sets cursor position at mouse coordinates to prevent flicker
 * when clicking outside the floating bubble menu. Only moves the
 * cursor if the target position is inside an inline-content parent
 * (skips block nodes like images and lists).
 */
export function moveCursorToCoords(
  editor: Editor,
  coords: MoveCursorToCoordsCoords
) {
  const { state, view } = editor;
  const position = view.posAtCoords(coords);
  if (!position || position.pos <= 0) {
    return;
  }

  const $pos = state.doc.resolve(position.pos);
  // Only allow if the parent actually allows inline content
  // ignore blocks like images, lists, etc.
  if (!$pos.parent.inlineContent) {
    return;
  }

  view.dispatch(state.tr.setSelection(Selection.near($pos)));
}
