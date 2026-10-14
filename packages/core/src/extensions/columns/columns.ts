import type { ColumnsAttributes } from '@maily-to/shared';
import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';
import { TextSelection } from '@tiptap/pm/state';

export const DEFAULT_COLUMNS_COUNT = 2;
export const DEFAULT_COLUMNS_GAP = 8;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: (columnCount?: number) => ReturnType;
      updateColumns: (attrs: Partial<ColumnsAttributes>) => ReturnType;
    };
  }
}

export const ColumnsExtension = Node.create({
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
        parseHTML: (element) =>
          Number(element.getAttribute('data-column-count')) ||
          DEFAULT_COLUMNS_COUNT,
        renderHTML: (attributes) => ({
          'data-column-count': attributes.columnCount,
        }),
      },
      gap: {
        default: DEFAULT_COLUMNS_GAP,
        parseHTML: (element) =>
          Number(element.getAttribute('data-gap')) || DEFAULT_COLUMNS_GAP,
        renderHTML: (attributes) => ({
          'data-gap': attributes.gap,
          style: `gap:${attributes.gap}px`,
        }),
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
          const isEmptyBlock =
            $from.parent.isTextblock && $from.parent.content.size === 0;

          const insertFrom = isEmptyBlock
            ? $from.before($from.depth)
            : $from.after($from.depth);
          const insertTo = isEmptyBlock ? $from.after($from.depth) : insertFrom;

          tr.replaceWith(insertFrom, insertTo, columnsNode);
          tr.setSelection(TextSelection.near(tr.doc.resolve(insertFrom + 3)));

          if (dispatch) {
            dispatch(tr);
          }

          return true;
        },
      updateColumns:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  parseHTML() {
    return [
      { tag: `div[${DATA_NODE_TYPE_KEY}="${MAILY_NODE_TYPES.COLUMNS}"]` },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.COLUMNS,
      }),
      0,
    ];
  },
});
