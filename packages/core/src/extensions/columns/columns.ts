import type { ColumnsAttributes } from '@maily-to/shared';
import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';

export const DEFAULT_COLUMNS_COUNT = 2;
export const DEFAULT_COLUMNS_GAP = 8;

export type ColumnsOptions = {
  HTMLAttributes: Record<string, any>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: (columnCount?: number) => ReturnType;
      updateColumns: (attrs: Partial<ColumnsAttributes>) => ReturnType;
      addColumn: () => ReturnType;
      removeColumn: () => ReturnType;
    };
  }
}

export const ColumnsExtension = Node.create<ColumnsOptions>({
  name: MAILY_NODE_TYPES.COLUMNS,
  group: 'block',
  content: 'column+',
  defining: true,
  isolating: true,
  draggable: true,

  addAttributes() {
    return {
      columnCount: {
        default: DEFAULT_COLUMNS_COUNT,
        parseHTML: (element) => {
          return (
            Number(element.getAttribute('data-column-count')) ||
            DEFAULT_COLUMNS_COUNT
          );
        },
        renderHTML: (attributes) => {
          return {
            'data-column-count': attributes.columnCount,
          };
        },
      },

      gap: {
        default: DEFAULT_COLUMNS_GAP,
        parseHTML: (element) => {
          return Number(element.style.gap) || DEFAULT_COLUMNS_GAP;
        },
        renderHTML: (attributes) => {
          if (!attributes.gap) {
            return {};
          }

          return {
            style: `gap: ${attributes.gap}px`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setColumns:
        (columnCount = DEFAULT_COLUMNS_COUNT) =>
        ({ tr, dispatch, editor }) => {
          const columnNodes = Array.from({ length: columnCount }, () =>
            editor.schema.nodes[MAILY_NODE_TYPES.COLUMN].createAndFill(
              {},
              editor.schema.nodes.paragraph.create()
            )
          ).filter((node) => node !== null);

          const columnsNode = editor.schema.nodes[this.name].createAndFill(
            { columnCount },
            columnNodes
          );

          if (!columnsNode) {
            return false;
          }

          const { $from } = tr.selection;
          const parent = $from.parent;

          let insertFrom: number;
          let insertTo: number;

          if (parent.isTextblock && parent.content.size === 0) {
            // Current block is empty — replace it
            insertFrom = $from.before($from.depth);
            insertTo = $from.after($from.depth);
          } else {
            // Current block has content — insert after it
            insertFrom = $from.after($from.depth);
            insertTo = insertFrom;
          }

          tr.replaceWith(insertFrom, insertTo, columnsNode);
          tr.setSelection(TextSelection.near(tr.doc.resolve(insertFrom + 3)));

          if (dispatch) {
            dispatch(tr);
          }

          return true;
        },
      updateColumns:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
      addColumn:
        () =>
        ({ state, chain }) => {
          const { selection } = state;
          const columnsNode = state.doc.nodeAt(
            selection.$from.before(selection.$from.depth - 1)
          );

          if (!columnsNode || columnsNode.type.name !== this.name) {
            return false;
          }

          const newColumnCount = columnsNode.attrs.columnCount + 1;

          return chain()
            .updateAttributes(this.name, { columnCount: newColumnCount })
            .insertContentAt(selection.$from.end(selection.$from.depth - 1), {
              type: MAILY_NODE_TYPES.COLUMN,
              attrs: {},
              content: [{ type: 'paragraph' }],
            })
            .run();
        },
      removeColumn:
        () =>
        ({ commands }) => {
          return commands.deleteNode(MAILY_NODE_TYPES.COLUMN);
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        [DATA_NODE_TYPE_KEY]: this.name,
        class: 'mly:relative',
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
