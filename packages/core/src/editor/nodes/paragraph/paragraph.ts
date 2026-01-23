import { Command } from '@tiptap/core';
import TiptapParagraph from '@tiptap/extension-paragraph';
import { DEFAULT_SECTION_SHOW_IF_KEY } from '../section/section';

export const allowedTextDirection = ['ltr', 'rtl'] as const;
export type AllowedTextDirection = (typeof allowedTextDirection)[number];
export const DEFAULT_TEXT_DIRECTION: AllowedTextDirection = 'ltr';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textDirection: {
      setTextDirection: (direction: AllowedTextDirection) => ReturnType;
    };
  }
}

export const ParagraphExtension = TiptapParagraph.extend({
  addAttributes() {
    return {
      ...(this?.parent?.() || {}),
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
      ...this.parent?.(),
      setTextDirection:
        (direction: AllowedTextDirection): Command =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, {
            textDirection: direction,
          });
        },
    };
  },
});
