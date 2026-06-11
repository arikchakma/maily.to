import type { ColumnAttributes, ColumnsAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { useCallback, useState } from 'react';

import { DEFAULT_COLUMN_VERTICAL_ALIGN } from '~/extensions/columns/column';
import { DEFAULT_COLUMNS_COUNT } from '~/extensions/columns/columns';

import { useEditorInstance } from './use-editor-instance';
import { useOnNodeSelect } from './use-on-node-select';
import { useOnSelectionUpdate } from './use-on-selection-update';

function getColumnWidths(editor: Editor): (number | null)[] {
  const { selection } = editor.state;
  const { $from } = selection;

  // Find the columns node
  for (let depth = $from.depth; depth >= 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name === MAILY_NODE_TYPES.COLUMNS) {
      const widths: (number | null)[] = [];
      node.forEach((child) => {
        if (child.type.name === MAILY_NODE_TYPES.COLUMN) {
          widths.push(child.attrs.width ?? null);
        }
      });
      return widths;
    }
  }

  return [];
}

export function useColumnsState(editor: Editor) {
  const editorInstance = useEditorInstance(editor);
  const [open, setOpen] = useState(false);

  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const columnsAttrs = ctx.editor.getAttributes(
        MAILY_NODE_TYPES.COLUMNS
      ) as Partial<ColumnsAttributes>;

      const columnAttrs = ctx.editor.getAttributes(
        MAILY_NODE_TYPES.COLUMN
      ) as Partial<ColumnAttributes>;

      return {
        isColumnActive: ctx.editor.isActive(MAILY_NODE_TYPES.COLUMN),
        columnCount: Number(columnsAttrs.columnCount) || DEFAULT_COLUMNS_COUNT,
        gap: Number(columnsAttrs.gap) || 0,
        columnWidths: getColumnWidths(ctx.editor),
        verticalAlign:
          columnAttrs.verticalAlign || DEFAULT_COLUMN_VERTICAL_ALIGN,
      };
    },
  });

  const handleSelectionUpdate = useCallback(() => {
    if (!editorInstance.isEditable) {
      return;
    }

    const isColumnsSelected = editorInstance.isActive(MAILY_NODE_TYPES.COLUMNS);
    setOpen(isColumnsSelected);
  }, [editorInstance]);

  useOnSelectionUpdate(editorInstance, handleSelectionUpdate);
  useOnNodeSelect(editorInstance, handleSelectionUpdate);

  return {
    ...state,
    open,
    setOpen,
  };
}
