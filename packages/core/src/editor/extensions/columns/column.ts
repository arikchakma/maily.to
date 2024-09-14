import { Node, mergeAttributes } from '@tiptap/core';

export const Column = Node.create({
  name: 'column',

  content: 'block+',

  isolating: true,

  addAttributes() {
    return {
      position: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-position'),
        renderHTML: (attributes) => ({ 'data-position': attributes.position }),
      },
      verticalAlign: {
        default: 'top',
        parseHTML: (element) => element?.style?.verticalAlign || 'top',
        renderHTML: (attributes) => {
          if (!attributes?.verticalAlign) {
            return {};
          }

          return {
            style: `vertical-align: ${attributes?.verticalAlign || 'top'}`,
          };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'td',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'column',
        width: '50%',
      }),
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'td[data-type="column"]',
      },
    ];
  },
});
