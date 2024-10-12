import { updateAttributes } from '@/editor/utils/update-attribute';
import { mergeAttributes } from '@tiptap/core';
import { Node } from '@tiptap/core';
import { v4 as uuid } from 'uuid';

export const DEFAULT_COLUMNS_WIDTH = '100%';

interface ColumnsAttributes {
  width: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: () => ReturnType;
      updateColumns: (attrs: Partial<ColumnsAttributes>) => ReturnType;
    };
  }
}

export const Columns = Node.create({
  name: 'columns',
  group: 'columns',
  content: 'column{2,10}',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
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
    };
  },

  addCommands() {
    return {
      setColumns:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
            content: [
              {
                type: 'column',
                attrs: {
                  columnId: uuid(),
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
                  columnId: uuid(),
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
      updateColumns: (attrs) => updateAttributes(this.name, attrs),
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'table',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'columns',
      }),
      [
        'tbody',
        {
          class: 'mly-w-full',
        },
        [
          'tr',
          {
            class: 'mly-w-full',
          },
          0,
        ],
      ],
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
