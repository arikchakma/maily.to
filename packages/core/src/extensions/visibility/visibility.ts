import type { VisibilityRule } from '@maily-to/shared';
import {
  DATA_VISIBILITY_RULE_KEY,
  MAILY_EXTENSION_TYPES,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { Extension } from '@tiptap/core';

export const VISIBILITY_SUPPORTED_TYPES: string[] = [
  MAILY_NODE_TYPES.PARAGRAPH,
  MAILY_NODE_TYPES.HEADING,
  MAILY_NODE_TYPES.IMAGE,
  MAILY_NODE_TYPES.SPACER,
  MAILY_NODE_TYPES.SECTION,
  MAILY_NODE_TYPES.COLUMNS,
  MAILY_NODE_TYPES.BULLET_LIST,
  MAILY_NODE_TYPES.ORDERED_LIST,
  MAILY_NODE_TYPES.HORIZONTAL_RULE,
  MAILY_NODE_TYPES.BUTTON,
  MAILY_NODE_TYPES.REPEAT,
  MAILY_NODE_TYPES.HTML_CODE_BLOCK,
];

type VisibilityAttributes = {
  visibilityRule: VisibilityRule | null;
};

export type VisibilityOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    visibility: {
      setVisibility: (attrs: Partial<VisibilityAttributes>) => ReturnType;
      unsetVisibility: () => ReturnType;
    };
  }
}

export const VisibilityExtension = Extension.create<VisibilityOptions>({
  name: MAILY_EXTENSION_TYPES.VISIBILITY,

  addOptions() {
    return {
      types: VISIBILITY_SUPPORTED_TYPES,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          visibilityRule: {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes.visibilityRule) {
                return {};
              }

              return {
                [DATA_VISIBILITY_RULE_KEY]: '',
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setVisibility:
        (attrs: Partial<VisibilityAttributes>) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          if (dispatch) {
            tr.doc.nodesBetween(from, to, (node, pos) => {
              if (node.isText) {
                return;
              }

              if (!this.options.types.includes(node.type.name)) {
                return;
              }

              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                ...attrs,
              });
            });
          }

          return true;
        },

      unsetVisibility:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          if (dispatch) {
            tr.doc.nodesBetween(from, to, (node, pos) => {
              if (node.isText) {
                return;
              }

              if (!this.options.types.includes(node.type.name)) {
                return;
              }

              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                visibilityRule: null,
              });
            });
          }

          return true;
        },
    };
  },
});
