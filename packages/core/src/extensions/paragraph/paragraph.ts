import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { Paragraph } from '@tiptap/extension-paragraph';

export const ParagraphExtension = Paragraph.configure({
  HTMLAttributes: {
    [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.PARAGRAPH,
  },
});
