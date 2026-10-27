import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import { findParentNode } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';

function getClosestColumns(editor: Editor) {
  return findParentNode((node) => node.type.name === MAILY_NODE_TYPES.COLUMNS)(
    editor.state.selection
  );
}

export function getColumnWidths(editor: Editor): (number | null)[] {
  const columns = getClosestColumns(editor);
  if (!columns) {
    return [];
  }

  const widths: (number | null)[] = [];
  columns.node.forEach((child) => {
    if (child.type.name === MAILY_NODE_TYPES.COLUMN) {
      const width = child.attrs.width;
      widths.push(typeof width === 'number' ? width : null);
    }
  });

  return widths;
}

export function updateColumnWidth(
  editor: Editor,
  columnIndex: number,
  width: number | null
): boolean {
  const columns = getClosestColumns(editor);
  if (!columns) {
    return false;
  }

  const { node: columnsNode, pos: columnsPos } = columns;
  const { dispatch, state } = editor.view;
  const { selection, tr } = state;

  const selectionRelative = {
    from: selection.from - columnsPos,
    to: selection.to - columnsPos,
  };

  const updatedContent: Node[] = [];
  columnsNode.content.forEach((child, _, index) => {
    updatedContent.push(
      child.type.create(
        {
          ...child.attrs,
          width: index === columnIndex ? width : child.attrs.width,
        },
        child.content
      )
    );
  });

  const transaction = tr.replaceWith(
    columnsPos,
    columnsPos + columnsNode.nodeSize,
    columnsNode.type.create(
      columnsNode.attrs,
      updatedContent,
      columnsNode.marks
    )
  );

  dispatch(
    transaction.setSelection(
      TextSelection.create(
        transaction.doc,
        columnsPos + selectionRelative.from,
        columnsPos + selectionRelative.to
      )
    )
  );

  return true;
}

export function addColumn(editor: Editor): boolean {
  const columns = getClosestColumns(editor);
  if (!columns) {
    return false;
  }

  const { node: columnsNode, pos: columnsPos } = columns;
  const { dispatch, state } = editor.view;
  const { tr } = state;

  const newColumn = state.schema.nodes[MAILY_NODE_TYPES.COLUMN].create(
    { width: null },
    state.schema.nodes[MAILY_NODE_TYPES.PARAGRAPH].create()
  );

  const updatedContent: Node[] = [];
  columnsNode.content.forEach((child) => {
    updatedContent.push(child);
  });
  updatedContent.push(newColumn);

  const updatedColumnsNode = columnsNode.type.create(
    { ...columnsNode.attrs, columnCount: columnsNode.childCount + 1 },
    updatedContent
  );

  const transaction = tr.replaceWith(
    columnsPos,
    columnsPos + columnsNode.nodeSize,
    updatedColumnsNode
  );

  dispatch(
    transaction.setSelection(
      TextSelection.create(transaction.doc, columnsPos + 3)
    )
  );

  return true;
}

export function removeColumn(editor: Editor): boolean {
  const columns = getClosestColumns(editor);
  if (!columns) {
    return false;
  }

  const { node: columnsNode, pos: columnsPos } = columns;
  if (columnsNode.childCount <= 1) {
    return false;
  }

  const { dispatch, state } = editor.view;
  const { selection, tr } = state;

  const removeIndex = columnsNode.childCount - 1;

  const updatedContent: Node[] = [];
  columnsNode.content.forEach((child, _, childIndex) => {
    if (childIndex !== removeIndex) {
      updatedContent.push(child);
    }
  });

  const updatedColumnsNode = columnsNode.type.create(
    { ...columnsNode.attrs, columnCount: columnsNode.childCount - 1 },
    updatedContent
  );

  const selectionFrom = selection.from - columnsPos;
  const transaction = tr.replaceWith(
    columnsPos,
    columnsPos + columnsNode.nodeSize,
    updatedColumnsNode
  );

  const maxPos = columnsPos + updatedColumnsNode.nodeSize - 1;

  dispatch(
    transaction.setSelection(
      TextSelection.near(
        transaction.doc.resolve(Math.min(columnsPos + selectionFrom, maxPos))
      )
    )
  );

  return true;
}

export function goToSiblingColumn(
  editor: Editor,
  direction: 'next' | 'previous'
) {
  const { $from } = editor.state.selection;

  let columnDepth = -1;
  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === MAILY_NODE_TYPES.COLUMN) {
      columnDepth = depth;
      break;
    }
  }

  if (columnDepth === -1) {
    return false;
  }

  const columnsDepth = columnDepth - 1;
  const columnIndex = $from.index(columnsDepth);
  const targetIndex = direction === 'next' ? columnIndex + 1 : columnIndex - 1;

  if (targetIndex < 0 || targetIndex >= $from.node(columnsDepth).childCount) {
    return false;
  }

  const targetPos =
    direction === 'next'
      ? $from.after(columnDepth) + 1
      : $from.before(columnDepth) - 1;

  const { tr } = editor.state;
  tr.setSelection(
    TextSelection.near(tr.doc.resolve(targetPos), direction === 'next' ? 1 : -1)
  );
  editor.view.dispatch(tr);

  return true;
}
