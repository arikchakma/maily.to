import { updateAttributes } from '@/editor/utils/update-attribute';
import { Node, mergeAttributes } from '@tiptap/core';
import { v4 as uuid } from 'uuid';

export const DEFAULT_COLUMN_WIDTH = 50;

export type COLUMN_VERTICAL_ALIGN = 'top' | 'middle' | 'bottom';
export const DEFAULT_COLUMN_VERTICAL_ALIGN: COLUMN_VERTICAL_ALIGN = 'top';

interface ColumnAttributes {
  verticalAlign: COLUMN_VERTICAL_ALIGN;
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
      columnId: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute('data-column-id') || uuid(),
        renderHTML: (attributes) => {
          if (!attributes.columnId) {
            return {
              'data-column-id': uuid(),
            };
          }

          return {
            'data-column-id': attributes.columnId,
          };
        },
      },
      width: {
        default: DEFAULT_COLUMN_WIDTH,
        parseHTML: (element) =>
          Number(element.style.width.replace(/['"]+/g, '')) || 50,
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }

          return {
            style: `width: ${attributes.width}%`,
          };
        },
      },
      verticalAlign: {
        default: DEFAULT_COLUMN_VERTICAL_ALIGN,
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
