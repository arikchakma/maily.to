import type { LinkCardAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';

import { useNodeBubbleState } from './use-node-bubble-state';

export function useLinkCardBubbleState(editor?: Editor) {
  return useNodeBubbleState({
    editor,
    selector: (instance) => {
      const attrs = instance.getAttributes(
        MAILY_NODE_TYPES.LINK_CARD
      ) as LinkCardAttributes;

      return {
        badgeText: attrs.badgeText ?? '',
        description: attrs.description ?? '',
        image: attrs.image ?? '',
        link: attrs.link ?? '',
        linkTitle: attrs.linkTitle ?? '',
        subTitle: attrs.subTitle ?? '',
        title: attrs.title ?? '',
      };
    },
    type: MAILY_NODE_TYPES.LINK_CARD,
  });
}
