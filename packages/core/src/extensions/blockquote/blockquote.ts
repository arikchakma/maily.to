import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes } from '@tiptap/core';
import { Blockquote as TiptapBlockquote } from '@tiptap/extension-blockquote';

export const BlockquoteExtension = TiptapBlockquote.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      'blockquote',
      mergeAttributes(
        {
          [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.BLOCKQUOTE,
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },
});
