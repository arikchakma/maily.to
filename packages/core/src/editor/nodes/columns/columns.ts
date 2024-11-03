import { goToColumn } from '@/editor/utils/columns';
import { updateAttributes } from '@/editor/utils/update-attribute';
import { mergeAttributes } from '@tiptap/core';
import { Node } from '@tiptap/core';
import { v4 as uuid } from 'uuid';
import { DEFAULT_SECTION_SHOW_IF_KEY } from '../section/section';

interface ColumnsAttributes {
  width: string;
  showIfKey: string;
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
  content: 'column+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      showIfKey: {
        default: DEFAULT_SECTION_SHOW_IF_KEY,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-show-if-key') ||
            DEFAULT_SECTION_SHOW_IF_KEY
          );
        },
        renderHTML(attributes) {
          if (!attributes.showIfKey) {
            return {};
          }

          return {
            'data-show-if-key': attributes.showIfKey,
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
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'columns',
      }),
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
      },
    ];
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return goToColumn(this.editor, 'next');
      },
      'Shift-Tab': () => {
        return goToColumn(this.editor, 'previous');
      },
    };
  },
});
