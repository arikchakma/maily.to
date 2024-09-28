import { updateAttributes } from '@/editor/utils/update-attribute';
import { Node, mergeAttributes } from '@tiptap/core';

interface ColumnAttributes {
  position: string;
  verticalAlign: 'top' | 'middle' | 'bottom';
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    column: {
      updateColumn: (attrs: Partial<ColumnAttributes>) => ReturnType;
    };
  }
}

export const Column = Node.create({
  name: 'column',

  content: '(block|columns)+',

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

  addCommands() {
    return {
      updateColumn: (attrs) => updateAttributes(this.name, attrs),
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'td',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'column',
        width: '50%',
        class: 'mly-not-prose',
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
