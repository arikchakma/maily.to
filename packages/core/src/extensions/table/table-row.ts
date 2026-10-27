import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { TableRow } from '@tiptap/extension-table';

export const TableRowExtension = TableRow.configure({
  HTMLAttributes: {
    [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.TABLE_ROW,
  },
});
