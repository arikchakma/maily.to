import type { FooterAttributes } from '@maily-to/shared';
import { DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES } from '@maily-to/shared';
import { mergeAttributes, Node } from '@tiptap/core';

export type FooterOptions = {
  HTMLAttributes: Record<string, unknown>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    footer: {
      setFooter: () => ReturnType;
      updateFooterAttributes: (attrs: Partial<FooterAttributes>) => ReturnType;
    };
  }
}

export const FooterExtension = Node.create<FooterOptions>({
  name: MAILY_NODE_TYPES.FOOTER,
  group: 'block',
  content: 'inline*',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addCommands() {
    return {
      setFooter:
        () =>
        ({ commands }) =>
          commands.setNode(this.name),
      updateFooterAttributes:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  parseHTML() {
    return [{ tag: `small[${DATA_NODE_TYPE_KEY}="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'small',
      mergeAttributes(
        { [DATA_NODE_TYPE_KEY]: this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },
});
