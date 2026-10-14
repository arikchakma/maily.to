import { MAILY_MARK_TYPES } from '@maily-to/shared';
import { Mark, mergeAttributes } from '@tiptap/core';

import { getSpanStyle } from '~/utils/style';

export const SpanExtension = Mark.create({
  name: MAILY_MARK_TYPES.SPAN,

  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => getSpanStyle(element.getAttribute('style')),
        renderHTML: (attributes) => {
          if (typeof attributes.style !== 'string') {
            return {};
          }

          return { style: attributes.style };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[style]',
        getAttrs: (element) =>
          getSpanStyle(element.getAttribute('style')) ? null : false,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },
});
