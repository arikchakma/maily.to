import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { TableCell } from '@tiptap/extension-table';

export const TableCellExtension = TableCell.configure({
  HTMLAttributes: {
    [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.TABLE_CELL,
  },
});
