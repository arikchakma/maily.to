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
          return (
            element.getAttribute('width') ||
            (element.style?.width || element.style?.inlineSize)?.replace(
              'px',
              ''
            ) ||
            null
          );
        },
        renderHTML: ({ width }) => ({ width }),
      },
      height: {
        default: 'auto',
        parseHTML: (element) => {
          return (
            element.getAttribute('height') ||
            (element.style?.height || element.style?.blockSize)?.replace(
              'px',
              ''
            ) ||
            null
          );
        },
        renderHTML: ({ height }) => ({ height }),
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

      // Later we will remove this attribute
      // and use the `externalLink` attribute instead
      // when implement the URL variable feature
      isExternalLinkVariable: {
        default: false,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-is-external-link-variable') === 'true'
          );
        },
        renderHTML: (attributes) => {
          if (!attributes.isExternalLinkVariable) {
            return {};
          }

          return {
            'data-is-external-link-variable': 'true',
          };
        },
      },

      // Later we will remove this attribute
      // and use the `src` attribute instead when implement
      // the URL variable feature
      isSrcVariable: {
        default: false,
        parseHTML: (element) => {
          return element.getAttribute('data-is-src-variable') === 'true';
        },
        renderHTML: (attributes) => {
          if (!attributes.isSrcVariable) {
            return {};
          }

          return {
            'data-is-src-variable': 'true',
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
  addNodeView() {
    return ReactNodeViewRenderer(ImageView, {
      className: 'mly-relative',
    });
  },
});
