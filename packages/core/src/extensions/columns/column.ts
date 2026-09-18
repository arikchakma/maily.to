import type { ColumnAttributes, ColumnWidth } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  getColumnWidth,
  getColumnWidthValue,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';

import { goToSiblingColumn } from '~/utils/columns';
import { exitOnTripleEnter } from '~/utils/exit-on-triple-enter';

const DEFAULT_COLUMN_WIDTH = null;
export const DEFAULT_COLUMN_VERTICAL_ALIGN = 'top';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    column: {
      updateColumn: (attrs: Partial<ColumnAttributes>) => ReturnType;
    };
  }
}

export const ColumnExtension = Node.create({
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
          return getColumnWidth(element.style.width) ?? DEFAULT_COLUMN_WIDTH;
        },
        renderHTML: (attributes) => {
          const width = attributes.width as ColumnWidth | null;
          if (width === null) {
            return {};
          }

          const value = getColumnWidthValue(width);

          return { style: `width:${value};max-width:${value}` };
        },
      },
      verticalAlign: {
        default: DEFAULT_COLUMN_VERTICAL_ALIGN,
        parseHTML: (element) => {
          if (element.style.verticalAlign) {
            return element.style.verticalAlign;
          }

          if (element.style.justifyContent === 'center') {
            return 'middle';
          }

          if (element.style.justifyContent === 'flex-end') {
            return 'bottom';
          }

          return DEFAULT_COLUMN_VERTICAL_ALIGN;
        },
        renderHTML: (attributes) => {
          const verticalAlign = attributes.verticalAlign;
          if (
            !verticalAlign ||
            verticalAlign === DEFAULT_COLUMN_VERTICAL_ALIGN
          ) {
            return {};
          }

          if (verticalAlign === 'middle') {
            return {
              style:
                'display:flex;flex-direction:column;justify-content:center',
            };
          }

          if (verticalAlign === 'bottom') {
            return {
              style:
                'display:flex;flex-direction:column;justify-content:flex-end',
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
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => goToSiblingColumn(editor, 'next'),
      'Shift-Tab': ({ editor }) => goToSiblingColumn(editor, 'previous'),
      Enter: ({ editor }) => {
        return exitOnTripleEnter({
          editor,
          exitDepthOffset: -1,
          nodeName: this.name,
        });
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[${DATA_NODE_TYPE_KEY}="${MAILY_NODE_TYPES.COLUMN}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.COLUMN,
      }),
      0,
    ];
  },
});
