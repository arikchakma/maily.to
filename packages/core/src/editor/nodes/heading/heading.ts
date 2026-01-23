import TiptapHeading from '@tiptap/extension-heading';
import { DEFAULT_SECTION_SHOW_IF_KEY } from '../section/section';
import {
  AllowedTextDirection,
  DEFAULT_TEXT_DIRECTION,
} from '../paragraph/paragraph';

export const HeadingExtension = TiptapHeading.extend({
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
});
