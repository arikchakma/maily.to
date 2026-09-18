import type { InlineImageAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';

import { useNodeBubbleState } from './use-node-bubble-state';

export function useInlineImageState(editor?: Editor) {
  return useNodeBubbleState({
    editor,
    selector: (instance) => {
      const attrs = instance.getAttributes(
        MAILY_NODE_TYPES.INLINE_IMAGE
      ) as InlineImageAttributes;

      return {
        alt: attrs.alt ?? '',
        externalLink: attrs.externalLink ?? '',
        size: attrs.width,
        src: attrs.src ?? '',
        title: attrs.title ?? '',
      };
    },
    type: MAILY_NODE_TYPES.INLINE_IMAGE,
  });
}
