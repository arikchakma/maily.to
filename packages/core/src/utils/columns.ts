import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import { findParentNode } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { Fragment } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';

function getClosestNodeByName(editor: Editor, name: string) {
  const { state } = editor.view;
  return findParentNode((node) => node.type.name === name)(state.selection);
}

/**
 * Updates the width attribute of a single column inside the nearest
 * columns node. Preserves the cursor position after the transaction.
 */
export function updateColumnWidth(
  editor: Editor,
  columnIndex: number,
  width: number | null
): boolean {
  const columnsResult = getClosestNodeByName(editor, MAILY_NODE_TYPES.COLUMNS);
  if (!columnsResult) {
    return false;
  }

  const { node: columnsNode, pos: columnsNodePos } = columnsResult;
  const { state, dispatch } = editor.view;
  const { tr, selection } = state;

  const beforeNodeEnd = columnsNodePos + columnsNode.nodeSize;
  const selectionRelative = {
    from: selection.from - columnsNodePos,
    to: selection.to - columnsNodePos,
  };

  const updatedContent: Node[] = [];
  columnsNode.content.forEach((child, _, i) => {
    updatedContent.push(
      child.type.create(
        {
          ...child?.attrs,
          width: i === columnIndex ? width : child?.attrs?.width,
        },
        child.content
      )
    );
  });

  const updatedColumnsNode = columnsNode.copy(Fragment.from(updatedContent));
  const transaction = tr.replaceWith(
    columnsNodePos,
    beforeNodeEnd,
    updatedColumnsNode
  );

  const newSelection = TextSelection.create(
    transaction.doc,
    columnsNodePos + selectionRelative.from,
    columnsNodePos + selectionRelative.to
  );

  dispatch(transaction.setSelection(newSelection));
  return true;
}

/** Inserts a new empty column after the given index (-1 = append). */
export function addColumnByIndex(editor: Editor, index: number = -1): boolean {
  const columnsResult = getClosestNodeByName(editor, MAILY_NODE_TYPES.COLUMNS);
  if (!columnsResult) {
    return false;
  }

  const { node: columnsNode, pos: columnsNodePos } = columnsResult;
  const { state, dispatch } = editor.view;
  const { tr } = state;

  const newColumn = state.schema.nodes[MAILY_NODE_TYPES.COLUMN].create(
    { width: null },
    state.schema.nodes.paragraph.create(null)
  );

  const updatedContent: Node[] = [];
  columnsNode.content.forEach((child, _, i) => {
    updatedContent.push(child);
    if (i === index) {
      updatedContent.push(newColumn);
    }
  });

  if (index === -1) {
    updatedContent.push(newColumn);
  }

  const newColumnCount = columnsNode.childCount + 1;
  const updatedColumnsNode = columnsNode.type.create(
    { ...columnsNode.attrs, columnCount: newColumnCount },
    Fragment.from(updatedContent)
  );

  const transaction = tr.replaceWith(
    columnsNodePos,
    columnsNodePos + columnsNode.nodeSize,
    updatedColumnsNode
  );

  const newSelection = TextSelection.create(
    transaction.doc,
    columnsNodePos + 3
  );
  dispatch(transaction.setSelection(newSelection));
  return true;
}

/**
 * Removes the column at the given index (-1 = last). Refuses to
 * remove the last remaining column.
 */
export function removeColumnByIndex(
  editor: Editor,
  index: number = -1
): boolean {
  const columnsResult = getClosestNodeByName(editor, MAILY_NODE_TYPES.COLUMNS);
  if (!columnsResult) {
    return false;
  }

  const { node: columnsNode, pos: columnsNodePos } = columnsResult;

  if (columnsNode.childCount <= 1) {
    return false;
  }

  const { state, dispatch } = editor.view;
  const { tr, selection } = state;

  const removeIndex = index === -1 ? columnsNode.childCount - 1 : index;

  const updatedContent: Node[] = [];
  columnsNode.content.forEach((child, _, i) => {
    if (i !== removeIndex) {
      updatedContent.push(child);
    }
  });

  const newColumnCount = columnsNode.childCount - 1;
  const updatedColumnsNode = columnsNode.type.create(
    { ...columnsNode.attrs, columnCount: newColumnCount },
    Fragment.from(updatedContent)
  );

  const selectionRelative = {
    from: selection.from - columnsNodePos,
    to: selection.to - columnsNodePos,
  };

  const transaction = tr.replaceWith(
    columnsNodePos,
    columnsNodePos + columnsNode.nodeSize,
    updatedColumnsNode
  );

  const maxPos = columnsNodePos + updatedColumnsNode.nodeSize - 1;
  const newFrom = Math.min(columnsNodePos + selectionRelative.from, maxPos);

  const newSelection = TextSelection.near(transaction.doc.resolve(newFrom));

  dispatch(transaction.setSelection(newSelection));
  return true;
}

/** Moves the cursor into the next or previous sibling column. */
export function goToSiblingColumn(
  editor: Editor,
  direction: 'next' | 'previous'
) {
  const { $from } = editor.state.selection;

  let columnDepth = -1;
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type.name === MAILY_NODE_TYPES.COLUMN) {
      columnDepth = d;
      break;
    }
  }

  if (columnDepth === -1) {
    return false;
  }

  const columnsDepth = columnDepth - 1;
  const columns = $from.node(columnsDepth);
  const columnIndex = $from.index(columnsDepth);
  const targetIndex = direction === 'next' ? columnIndex + 1 : columnIndex - 1;

  if (targetIndex < 0 || targetIndex >= columns.childCount) {
    return false;
  }

  // Resolve a position inside the target column
  const targetPos =
    direction === 'next'
      ? $from.after(columnDepth) + 1
      : $from.before(columnDepth) - 1;

  const { tr } = editor.state;
  const bias = direction === 'next' ? 1 : -1;
  tr.setSelection(TextSelection.near(tr.doc.resolve(targetPos), bias));
  editor.view.dispatch(tr);

  return true;
}

export function addColumn(editor: Editor): boolean {
  return addColumnByIndex(editor, -1);
}

export function removeColumn(editor: Editor): boolean {
  return removeColumnByIndex(editor, -1);
}
