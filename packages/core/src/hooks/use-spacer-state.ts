import type { SpacerAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';

import { useNodeBubbleState } from './use-node-bubble-state';

export function useSpacerState(editor?: Editor) {
  return useNodeBubbleState({
    editor,
    selector: (instance) => {
      const attrs = instance.getAttributes(
        MAILY_NODE_TYPES.SPACER
      ) as SpacerAttributes;

      return { height: attrs.height };
    },
    type: MAILY_NODE_TYPES.SPACER,
  });
}
