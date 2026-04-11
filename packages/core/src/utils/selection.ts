import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { NodeSelection, Selection } from '@tiptap/pm/state';
import type { Editor } from '@tiptap/react';
import {
  findParentNode,
  isNodeSelection,
  isTextSelection,
  posToDOMRect,
} from '@tiptap/react';

// ProseMirror's default Selection.atStart picks atom nodes (logo, spacer)
// as NodeSelection, showing a blue highlight on mount. We swap it to a
// text-only selection so nothing appears selected.
export function clearInitialNodeSelection(editor: Editor) {
  const { state } = editor;
  if (!(state.selection instanceof NodeSelection)) {
    return;
  }

  // textOnly=true skips atom nodes and finds the first text cursor position
  const textSel = Selection.findFrom(state.doc.resolve(0), 1, true);
  if (textSel) {
    editor.view.dispatch(state.tr.setSelection(textSel));
  }
  editor.view.dom.blur();
}

function findNodeClientRect(editor: Editor, nodeType: string) {
  const selection = editor.state.selection;
  const activeNode = findParentNode((node) => node.type.name === nodeType)(
    selection
  );
  if (!activeNode) {
    return null;
  }

  const dom = editor.view.nodeDOM(activeNode.pos);
  if (!dom || !(dom instanceof HTMLElement)) {
    return null;
  }

  return dom.getBoundingClientRect();
}

/**
 * Returns a DOMRect for the current selection. For nodes inside a
 * container (columns, repeat, section, button, html code block),
 * returns the container's rect so the bubble menu stays anchored
 * to the block rather than the inline selection.
 */
export function getCurrentSelectionRect(editor: Editor) {
  const selection = editor.state.selection;
  const { ranges } = selection;

  const from = Math.min(...ranges.map((range) => range.$from.pos));
  const to = Math.max(...ranges.map((range) => range.$to.pos));

  const isInsideColumns = editor.isActive(MAILY_NODE_TYPES.COLUMNS);
  if (isInsideColumns) {
    const rect = findNodeClientRect(editor, MAILY_NODE_TYPES.COLUMNS);
    return rect || posToDOMRect(editor.view, from, to);
  }

  const isInsideRepeat = editor.isActive(MAILY_NODE_TYPES.REPEAT);
  if (isInsideRepeat) {
    const rect = findNodeClientRect(editor, MAILY_NODE_TYPES.REPEAT);
    return rect || posToDOMRect(editor.view, from, to);
  }

  const isInsideSection = editor.isActive(MAILY_NODE_TYPES.SECTION);
  if (isInsideSection) {
    const rect = findNodeClientRect(editor, MAILY_NODE_TYPES.SECTION);
    return rect || posToDOMRect(editor.view, from, to);
  }

  const isInsideButton = editor.isActive(MAILY_NODE_TYPES.BUTTON);
  if (isInsideButton) {
    const rect = findNodeClientRect(editor, MAILY_NODE_TYPES.BUTTON);
    return rect || posToDOMRect(editor.view, from, to);
  }

  const isInsideHtmlCodeBlock = editor.isActive(
    MAILY_NODE_TYPES.HTML_CODE_BLOCK
  );
  if (isInsideHtmlCodeBlock) {
    const rect = findNodeClientRect(editor, MAILY_NODE_TYPES.HTML_CODE_BLOCK);
    return rect || posToDOMRect(editor.view, from, to);
  }

  if (isNodeSelection(selection)) {
    const node = editor.view.nodeDOM(from);
    if (node && node instanceof HTMLElement) {
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
  const state = editor.state;
  const selection = state.selection;
  const doc = state.doc;
  const { from, to, empty } = selection;

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

  const tr = state.tr.setSelection(Selection.near($pos));
  view.dispatch(tr);
}
