import { mergeAttributes } from '@tiptap/core';
import { Node } from '@tiptap/core';

export const allowedColumnLayouts = [
  'sidebar-left',
  'sidebar-right',
  'two-column',
] as const;
export type ColumnLayout = (typeof allowedColumnLayouts)[number];

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: () => ReturnType;
      setLayout: (layout: ColumnLayout) => ReturnType;
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
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'table',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'columns',
        class: `layout-${HTMLAttributes.layout}`,
        width: '100%',
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
