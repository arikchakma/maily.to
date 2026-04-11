import type { ColumnAttributes } from '@maily-to/shared';
import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';

import { goToSiblingColumn } from '~/utils/columns';
import { exitOnTripleEnter } from '~/utils/exit-on-triple-enter';

export const DEFAULT_COLUMN_WIDTH = null;
export const DEFAULT_COLUMN_VERTICAL_ALIGN = 'top';

export type ColumnOptions = {
  HTMLAttributes: Record<string, any>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    column: {
      updateColumn: (attrs: Partial<ColumnAttributes>) => ReturnType;
    };
  }
}

export const ColumnExtension = Node.create<ColumnOptions>({
  name: MAILY_NODE_TYPES.COLUMN,
  group: 'column',
  content: 'block+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      width: {
        default: DEFAULT_COLUMN_WIDTH,
        parseHTML: (element) => {
          const width = element.style.width?.replace(/['"]+/g, '');
          if (!width) {
            return DEFAULT_COLUMN_WIDTH;
          }
          const num = parseFloat(width);
          return isNaN(num) ? DEFAULT_COLUMN_WIDTH : num;
        },
        renderHTML: (attributes) => {
          if (attributes.width === null || attributes.width === undefined) {
            return {};
          }

          return {
            style: `width: ${attributes.width}%; max-width: ${attributes.width}%`,
          };
        },
      },
      verticalAlign: {
        default: DEFAULT_COLUMN_VERTICAL_ALIGN,
        parseHTML: (element) => {
          return element?.style?.verticalAlign || DEFAULT_COLUMN_VERTICAL_ALIGN;
        },
        renderHTML: (attributes) => {
          const { verticalAlign } = attributes;
          if (
            !verticalAlign ||
            verticalAlign === DEFAULT_COLUMN_VERTICAL_ALIGN
          ) {
            return {};
          }

          if (verticalAlign === 'middle') {
            return {
              style:
                'display: flex; flex-direction: column; justify-content: center;',
            };
          } else if (verticalAlign === 'bottom') {
            return {
              style:
                'display: flex; flex-direction: column; justify-content: flex-end;',
            };
          }

          return {};
        },
      },
    };
  },

  addCommands() {
    return {
      updateColumn:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        return goToSiblingColumn(editor, 'next');
      },
      'Shift-Tab': ({ editor }) => {
        return goToSiblingColumn(editor, 'previous');
      },
      // Exit column on triple enter (exits after parent columns node)
      Enter: ({ editor }) => {
        return exitOnTripleEnter(editor, this.name, { exitDepthOffset: -1 });
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        [DATA_NODE_TYPE_KEY]: this.name,
      }),
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: `div[${DATA_NODE_TYPE_KEY}="${this.name}"]`,
      },
    ];
  },
});
