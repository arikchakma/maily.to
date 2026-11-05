import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { TableHeader } from '@tiptap/extension-table';

export const TableHeaderExtension = TableHeader.configure({
  HTMLAttributes: {
    [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.TABLE_HEADER,
  },
});
