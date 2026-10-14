import type { SpacerAttributes } from '@maily-to/shared';
import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { SpacerView } from './spacer-view';

export const DEFAULT_SPACER_HEIGHT = 8;

export type SpacerOptions = {
  HTMLAttributes: Record<string, unknown>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    spacer: {
      setSpacer: (attrs?: Partial<SpacerAttributes>) => ReturnType;
      unsetSpacer: () => ReturnType;
      updateSpacerAttributes: (attrs: Partial<SpacerAttributes>) => ReturnType;
    };
  }
}

export const SpacerExtension = Node.create<SpacerOptions>({
  name: MAILY_NODE_TYPES.SPACER,
  priority: 1000,
  group: 'block',
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      height: {
        default: DEFAULT_SPACER_HEIGHT,
        parseHTML: (element) =>
          Number(element.getAttribute('data-height')) || DEFAULT_SPACER_HEIGHT,
        renderHTML: (attributes) => ({ 'data-height': attributes.height }),
      },
    };
  },

  addCommands() {
    return {
      setSpacer:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
      unsetSpacer:
        () =>
        ({ commands }) =>
          commands.deleteNode(this.name),
      updateSpacerAttributes:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  parseHTML() {
    return [{ tag: `div[${DATA_NODE_TYPE_KEY}="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { height } = node.attrs as SpacerAttributes;

    return [
      'div',
      mergeAttributes(
        { [DATA_NODE_TYPE_KEY]: this.name },
        this.options.HTMLAttributes,
        HTMLAttributes,
        { contenteditable: 'false', style: `height:${height}px` }
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SpacerView, {
      attrs: { [DATA_NODE_TYPE_KEY]: this.name },
    });
  },
});
