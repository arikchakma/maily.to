import {
  DATA_NODE_TYPE_KEY,
  DEFAULT_TEXT_ALIGN,
  isAllowedTextAlignment,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import { Image } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ImageView } from './image-view';

const DEFAULT_IMAGE_ALIGN = DEFAULT_TEXT_ALIGN;
const DEFAULT_IMAGE_WIDTH = '100%';

const UNITLESS_REGEX = /^-?\d*\.?\d+$/;

export const ImageExtension = Image.extend({
  name: MAILY_NODE_TYPES.IMAGE,

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: DEFAULT_IMAGE_WIDTH,
        parseHTML: (element) => {
          const width = element.style.width || element.getAttribute('width');
          if (!width) {
            return DEFAULT_IMAGE_WIDTH;
          }

          return UNITLESS_REGEX.test(width) ? `${width}px` : width;
        },
        renderHTML: (attributes) => ({ width: attributes.width }),
      },
      align: {
        default: DEFAULT_IMAGE_ALIGN,
        parseHTML: (element) => {
          const align = element.getAttribute('data-align');

          return isAllowedTextAlignment(align) ? align : DEFAULT_IMAGE_ALIGN;
        },
        renderHTML: (attributes) => ({ 'data-align': attributes.align }),
      },
      externalLink: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-external-link'),
        renderHTML: (attributes) =>
          attributes.externalLink
            ? { 'data-external-link': attributes.externalLink }
            : {},
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView, {
      attrs: () => ({ [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.IMAGE }),
    });
  },
}).configure({
  HTMLAttributes: {
    [DATA_NODE_TYPE_KEY]: MAILY_NODE_TYPES.IMAGE,
  },
});
