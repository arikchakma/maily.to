import { mergeAttributes, Node } from '@tiptap/core';

export interface FooterOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    footer: {
      setFooter: () => ReturnType;
    };
  }
}

export const Footer = Node.create<FooterOptions>({
  name: 'footer',
  group: 'block',
  content: 'inline*',
  addAttributes() {
    return {
      'mailbox-component': {
        default: 'footer',
        renderHTML: (attributes) => {
          return {
            'data-mailbox-component': attributes['mailbox-component'],
          };
        },
        parseHTML: (element) => element.getAttribute('data-mailbox-component'),
      },
    };
  },

  addCommands() {
    return {
      setFooter:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },

  parseHTML() {
    return [{ tag: 'small[data-mailbox-component="footer"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'small',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'footer block text-[13px]',
      }),
      0,
    ];
  },
});
