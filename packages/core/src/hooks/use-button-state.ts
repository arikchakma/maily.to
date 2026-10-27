import type { ButtonAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';

import { getNodeStyleState } from '~/utils/theme';

import { useNodeBubbleState } from './use-node-bubble-state';

export function useButtonState(editor?: Editor) {
  return useNodeBubbleState({
    editor,
    selector: (instance) => {
      const attrs = instance.getAttributes(
        MAILY_NODE_TYPES.BUTTON
      ) as ButtonAttributes;
      const { resolved } = getNodeStyleState({
        editor: instance,
        type: MAILY_NODE_TYPES.BUTTON,
      });

      return {
        align: attrs.align,
        backgroundColor: resolved.backgroundColor ?? '',
        color: resolved.color ?? '',
        kind: attrs.kind,
        url: attrs.url ?? '',
      };
    },
    type: MAILY_NODE_TYPES.BUTTON,
  });
}
