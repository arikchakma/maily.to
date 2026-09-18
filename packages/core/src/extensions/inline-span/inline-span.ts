import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';

export const InlineSpanExtension = Node.create({
  name: MAILY_NODE_TYPES.INLINE_SPAN,
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  parseHTML() {
    return [
      {
        tag: 'span[style]',
        priority: 60,
        getAttrs: (element) => {
          return element.childNodes.length === 0 ? null : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes)];
  },
});
