import type { ColumnAttributes, ColumnsAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';

import { DEFAULT_COLUMN_VERTICAL_ALIGN } from '~/extensions/columns/column';
import { DEFAULT_COLUMNS_COUNT } from '~/extensions/columns/columns';
import { getColumnWidths } from '~/utils/columns';

import { useNodeBubbleState } from './use-node-bubble-state';

export function useColumnsState(editor?: Editor) {
  return useNodeBubbleState({
    editor,
    selector: (instance) => {
      const columnsAttrs = instance.getAttributes(
        MAILY_NODE_TYPES.COLUMNS
      ) as ColumnsAttributes;
      const columnAttrs = instance.getAttributes(
        MAILY_NODE_TYPES.COLUMN
      ) as ColumnAttributes;

      return {
        columnCount: Number(columnsAttrs.columnCount) || DEFAULT_COLUMNS_COUNT,
        columnWidths: getColumnWidths(instance),
        gap: Number(columnsAttrs.gap) || 0,
        isColumnActive: instance.isActive(MAILY_NODE_TYPES.COLUMN),
        verticalAlign:
          columnAttrs.verticalAlign || DEFAULT_COLUMN_VERTICAL_ALIGN,
      };
    },
    type: MAILY_NODE_TYPES.COLUMNS,
  });
}
