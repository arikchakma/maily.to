import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { Placeholder } from '@tiptap/extensions';

export const PlaceholderExtension = Placeholder.configure({
  placeholder: ({ node }) => {
    const { name } = node.type;

    if (name === MAILY_NODE_TYPES.HEADING) {
      return `Heading ${node.attrs.level}`;
    } else if (name === MAILY_NODE_TYPES.HTML_CODE_BLOCK) {
      return 'Type your HTML code...';
    } else if (
      (
        [
          MAILY_NODE_TYPES.SECTION,
          MAILY_NODE_TYPES.BULLET_LIST,
          MAILY_NODE_TYPES.ORDERED_LIST,
          MAILY_NODE_TYPES.LIST_ITEM,
          MAILY_NODE_TYPES.COLUMNS,
          MAILY_NODE_TYPES.COLUMN,
          MAILY_NODE_TYPES.REPEAT,
          MAILY_NODE_TYPES.BLOCKQUOTE,
          // we are using the string[] to avoid type errors
          // because node types are literal strings
        ] as string[]
      ).includes(name)
    ) {
      return '';
    }

    return 'Write something or / to see commands';
  },
  includeChildren: true,
});
