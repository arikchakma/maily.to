import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';

export const BodyExtension = Node.create({
  name: MAILY_NODE_TYPES.BODY,
  content: `${MAILY_NODE_TYPES.CONTAINER}+`,
  defining: true,

  parseHTML() {
    return [{ tag: `div[${DATA_NODE_TYPE_KEY}="${MAILY_NODE_TYPES.BODY}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.BODY },
        HTMLAttributes
      ),
      0,
    ];
  },
});
