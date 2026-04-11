import type { SpacerAttributes } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  DATA_VISIBILITY_RULE_KEY,
  FIELD_MODE,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { SpacerView } from './spacer-view';

export type SpacerOptions = {
  HTMLAttributes: Record<string, any>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    spacer: {
      setSpacer: (attrs?: Partial<SpacerAttributes>) => ReturnType;
      updateSpacerAttributes: (attrs: Partial<SpacerAttributes>) => ReturnType;
      unsetSpacer: () => ReturnType;
    };
  }
}

export const DEFAULT_SPACER_HEIGHT = 8;

export const SpacerExtension = Node.create<SpacerOptions>({
  name: MAILY_NODE_TYPES.SPACER,
  priority: 1000,
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      height: {
        default: DEFAULT_SPACER_HEIGHT,
        parseHTML: (element) => Number(element.getAttribute('data-height')),
        renderHTML: (attributes) => {
          return {
            'data-height': attributes.height,
          };
        },
      },
      heightMode: {
        default: FIELD_MODE.UNIFORM,
        parseHTML: (element) => element.getAttribute('data-height-mode'),
        renderHTML: (attributes) => {
          return {
            'data-height-mode': attributes.heightMode,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setSpacer: (attrs) => {
        return ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        };
      },
      updateSpacerAttributes: (attrs) => {
        return ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        };
      },
      unsetSpacer: () => {
        return ({ commands }) => {
          return commands.deleteNode(this.name);
        };
      },
    };
  },
  renderHTML({ HTMLAttributes, node }) {
    const { height = DEFAULT_SPACER_HEIGHT } = node.attrs as SpacerAttributes;

    return [
      'div',
      mergeAttributes(
        {
          [DATA_NODE_TYPE_KEY]: this.name,
        },
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          contenteditable: false,
          style: `height: ${height}px;--spacer-height: ${height}px;`,
        }
      ),
    ];
  },
  parseHTML() {
    return [{ tag: `div[${DATA_NODE_TYPE_KEY}="${this.name}"]` }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(SpacerView, {
      className: 'mly:relative',
      attrs: (props) => {
        return {
          [DATA_NODE_TYPE_KEY]: this.name,
          ...(props.node.attrs.visibilityRule
            ? { [DATA_VISIBILITY_RULE_KEY]: '' }
            : {}),
        };
      },
    });
  },
});
