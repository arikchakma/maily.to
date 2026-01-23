import { mergeAttributes, Node } from '@tiptap/core';
import {
  AllowedTextDirection,
  DEFAULT_TEXT_DIRECTION,
} from './paragraph/paragraph';

export interface FooterOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    footer: {
      setFooter: () => ReturnType;
      setFooterTextDirection: (direction: AllowedTextDirection) => ReturnType;
    };
  }
}

export const Footer = Node.create<FooterOptions>({
  name: 'footer',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      'maily-component': {
        default: 'footer',
        renderHTML: (attributes) => {
          return {
            'data-maily-component': attributes['maily-component'],
          };
        },
        parseHTML: (element) => element?.getAttribute('data-maily-component'),
      },
      textDirection: {
        default: DEFAULT_TEXT_DIRECTION,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-text-direction') ||
            element.getAttribute('dir') ||
            DEFAULT_TEXT_DIRECTION
          );
        },
        renderHTML(attributes) {
          if (
            !attributes.textDirection ||
            attributes.textDirection === DEFAULT_TEXT_DIRECTION
          ) {
            return {};
          }

          return {
            'data-text-direction': attributes.textDirection,
            dir: attributes.textDirection,
          };
        },
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
      setFooterTextDirection:
        (direction: AllowedTextDirection) =>
        ({ commands }) => {
          return commands.updateAttributes('footer', {
            textDirection: direction,
          });
        },
    };
  },

  parseHTML() {
    return [{ tag: 'small[data-maily-component="footer"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'small',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class:
          'footer mly:block mly:text-[13px] mly:text-slate-500 mly:relative',
      }),
      0,
    ];
  },
});
