import { updateAttributes } from '@/editor/utils/update-attribute';
import { mergeAttributes } from '@tiptap/core';
import { Node } from '@tiptap/core';

export const DEFAULT_COLUMNS_WIDTH = '100%';
export const DEFAULT_COLUMNS_ALIGN = 'left';

export const allowedColumnLayouts = [
  'sidebar-left',
  'sidebar-right',
  'two-column',
] as const;
export type ColumnLayout = (typeof allowedColumnLayouts)[number];

interface ColumnsAttributes {
  width: string;
  align: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: () => ReturnType;
      setLayout: (layout: ColumnLayout) => ReturnType;
      updateColumns: (attrs: Partial<ColumnsAttributes>) => ReturnType;
    };
  }
}

export const Columns = Node.create({
  name: 'columns',
  group: 'columns',
  content: 'column column',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      layout: {
        default: 'two-column',
      },
      width: {
        default: DEFAULT_COLUMNS_WIDTH,
        parseHTML: (element) => element.style.width,
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }

          return {
            style: `width: ${attributes.width}`,
          };
        },
      },
      align: {
        default: DEFAULT_COLUMNS_ALIGN,
        parseHTML: (element) =>
          element.getAttribute('align') || DEFAULT_COLUMNS_ALIGN,
        renderHTML: (attributes) => {
          if (!attributes.align) {
            return {};
          }

          return {
            align: attributes.align,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setColumns:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              layout: 'two-column',
            },
            content: [
              {
                type: 'column',
                attrs: {
                  position: 'left',
                },
                content: [
                  {
                    type: 'paragraph',
                  },
                ],
              },
              {
                type: 'column',
                attrs: {
                  position: 'right',
                },
                content: [
                  {
                    type: 'paragraph',
                  },
                ],
              },
            ],
          });
        },
      setLayout:
        (layout: ColumnLayout) =>
        ({ commands }) =>
          commands.updateAttributes('columns', { layout }),
      updateColumns: (attrs) => updateAttributes(this.name, attrs),
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'table',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'columns',
        class: `layout-${HTMLAttributes.layout}`,
      }),
      ['tbody', {}, ['tr', {}, 0]],
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'table[data-type="columns"]',
      },
    ];
  },
});
