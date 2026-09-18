import type { ImageAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';

import { useNodeBubbleState } from './use-node-bubble-state';

export function useImageBubbleState(editor?: Editor) {
  return useNodeBubbleState({
    editor,
    selector: (instance) => {
      const attrs = instance.getAttributes(
        MAILY_NODE_TYPES.IMAGE
      ) as ImageAttributes;

      return {
        align: attrs.align,
        alt: attrs.alt ?? '',
        externalLink: attrs.externalLink ?? '',
        src: attrs.src ?? '',
        title: attrs.title ?? '',
      };
    },
    type: MAILY_NODE_TYPES.IMAGE,
  });
}
