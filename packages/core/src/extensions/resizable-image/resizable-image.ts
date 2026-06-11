import type { AllowedTextAlignment, BorderStyleConfig } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  DATA_VISIBILITY_RULE_KEY,
  DEFAULT_BORDER_COLOR,
  DEFAULT_BORDER_STYLE,
  FIELD_MODE,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import type { ImageOptions } from '@tiptap/extension-image';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ResizableImageView } from './resizable-image-view';

export const DEFAULT_IMAGE_ALIGN = TEXT_ALIGNMENTS.LEFT;

export type ResizableImageAttributes = {
  src: string;
  alt?: string;
  title?: string;
  width: string;

  align: AllowedTextAlignment;
  externalLink: string | null;
} & BorderStyleConfig;

export const ResizableImageExtension = TiptapImage.extend<ImageOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
      },
      align: {
        default: DEFAULT_IMAGE_ALIGN,
        parseHTML: (element) => {
          return element.getAttribute('data-align') ?? DEFAULT_IMAGE_ALIGN;
        },
        renderHTML: (attributes) => {
          return {
            'data-align': attributes.align,
          };
        },
      },
      externalLink: {
        default: null,
      },
      borderColor: {
        default: DEFAULT_BORDER_COLOR,
      },
      borderRadiusMode: {
        default: FIELD_MODE.UNIFORM,
      },
      borderTopLeftRadius: {
        default: 0,
      },
      borderTopRightRadius: {
        default: 0,
      },
      borderBottomLeftRadius: {
        default: 0,
      },
      borderBottomRightRadius: {
        default: 0,
      },

      borderWidthMode: {
        default: FIELD_MODE.UNIFORM,
      },
      borderTopWidth: {
        default: 0,
      },
      borderRightWidth: {
        default: 0,
      },
      borderBottomWidth: {
        default: 0,
      },
      borderLeftWidth: {
        default: 0,
      },

      borderStyle: {
        default: DEFAULT_BORDER_STYLE,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView, {
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
