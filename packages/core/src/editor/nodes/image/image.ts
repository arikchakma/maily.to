import TiptapImage from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { DEFAULT_SECTION_SHOW_IF_KEY } from '../section/section';
import { ImageView } from './image-view';

export const ImageExtension = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 'auto',
        parseHTML: (element) => {
          const width = element.style.width;
          return width ? { width } : null;
        },
        renderHTML: ({ width }) => ({ style: `width: ${width}` }),
      },
      height: {
        default: 'auto',
        parseHTML: (element) => {
          const height = element.style.height;
          return height ? { height } : null;
        },
        renderHTML: ({ height }) => ({ style: `height: ${height}` }),
      },
      alignment: {
        default: 'center',
        renderHTML: ({ alignment }) => ({ 'data-alignment': alignment }),
        parseHTML: (element) =>
          element.getAttribute('data-alignment') || 'center',
      },
      externalLink: {
        default: null,
        renderHTML: ({ externalLink }) => {
          if (!externalLink) {
            return {};
          }
          return {
            'data-external-link': externalLink,
          };
        },
        parseHTML: (element) => {
          const externalLink = element.getAttribute('data-external-link');
          return externalLink ? { externalLink } : null;
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
  addNodeView() {
    return ReactNodeViewRenderer(ImageView, {
      className: 'mly-relative',
    });
  },
});
