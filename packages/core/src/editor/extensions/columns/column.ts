import { updateAttributes } from '@/editor/utils/update-attribute';
import { Node, mergeAttributes } from '@tiptap/core';
import { v4 as uuid } from 'uuid';

export const DEFAULT_COLUMN_WIDTH = 50;

export type COLUMN_VERTICAL_ALIGN = 'top' | 'middle' | 'bottom';
export const DEFAULT_COLUMN_VERTICAL_ALIGN: COLUMN_VERTICAL_ALIGN = 'top';

export const DEFAULT_COLUMN_BACKGROUND_COLOR = 'transparent';
export const DEFAULT_COLUMN_BORDER_RADIUS = 0;
export const DEFAULT_COLUMN_PADDING = 0;
export const DEFAULT_COLUMN_BORDER_WIDTH = 0;
export const DEFAULT_COLUMN_BORDER_COLOR = 'transparent';

export const DEFAULT_COLUMN_PADDING_TOP = 0;
export const DEFAULT_COLUMN_PADDING_RIGHT = 0;
export const DEFAULT_COLUMN_PADDING_BOTTOM = 0;
export const DEFAULT_COLUMN_PADDING_LEFT = 0;

interface ColumnAttributes {
  verticalAlign: COLUMN_VERTICAL_ALIGN;
  backgroundColor: string;
  borderRadius: number;
  align: string;
  borderWidth: number;
  borderColor: string;

  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
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
      borderRadius: {
        default: 0,
        parseHTML: (element) => {
          return Number(element?.style?.borderRadius?.replace(/['"]+/g, ''));
        },
        renderHTML: (attributes) => {
          if (!attributes.borderRadius) {
            return {};
          }

          return {
            style: `border-radius: ${attributes.borderRadius}px`,
          };
        },
      },
      backgroundColor: {
        default: DEFAULT_COLUMN_BACKGROUND_COLOR,
        parseHTML: (element) => {
          return element.style.backgroundColor;
        },
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }

          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
      borderWidth: {
        default: DEFAULT_COLUMN_BORDER_WIDTH,
        parseHTML: (element) => {
          return (
            Number(element?.style?.borderWidth?.replace(/['"]+/g, '')) || 0
          );
        },
        renderHTML: (attributes) => {
          if (!attributes.borderWidth) {
            return {};
          }

          return {
            style: `border-width: ${attributes.borderWidth}px`,
          };
        },
      },
      borderColor: {
        default: DEFAULT_COLUMN_BORDER_COLOR,
        parseHTML: (element) => {
          return element.style.borderColor;
        },
        renderHTML: (attributes) => {
          if (!attributes.borderColor) {
            return {};
          }

          return {
            style: `border-color: ${attributes.borderColor}`,
          };
        },
      },
      paddingTop: {
        default: DEFAULT_COLUMN_PADDING_TOP,
        parseHTML: (element) => {
          return Number(element?.style?.paddingTop?.replace(/['"]+/g, '')) || 0;
        },
        renderHTML: (attributes) => {
          if (!attributes.paddingTop) {
            return {};
          }

          return {
            style: `padding-top: ${attributes.paddingTop}px`,
          };
        },
      },
      paddingRight: {
        default: DEFAULT_COLUMN_PADDING_RIGHT,
        parseHTML: (element) =>
          Number(element?.style?.paddingRight?.replace(/['"]+/g, '')) || 0,
        renderHTML: (attributes) => {
          if (!attributes.paddingRight) {
            return {};
          }

          return {
            style: `padding-right: ${attributes.paddingRight}px`,
          };
        },
      },
      paddingBottom: {
        default: DEFAULT_COLUMN_PADDING_BOTTOM,
        parseHTML: (element) =>
          Number(element?.style?.paddingBottom?.replace(/['"]+/g, '')) || 0,
        renderHTML: (attributes) => {
          if (!attributes.paddingBottom) {
            return {};
          }

          return {
            style: `padding-bottom: ${attributes.paddingBottom}px`,
          };
        },
      },
      paddingLeft: {
        default: DEFAULT_COLUMN_PADDING_LEFT,
        parseHTML: (element) =>
          Number(element?.style?.paddingLeft?.replace(/['"]+/g, '')) || 0,
        renderHTML: (attributes) => {
          if (!attributes.paddingLeft) {
            return {};
          }

          return {
            style: `padding-left: ${attributes.paddingLeft}px`,
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
