import type { VariableAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';

import { useNodeBubbleState } from './use-node-bubble-state';

export function useVariableBubbleState(editor?: Editor) {
  return useNodeBubbleState({
    editor,
    selector: (instance) => {
      const attrs = instance.getAttributes(
        MAILY_NODE_TYPES.VARIABLE
      ) as VariableAttributes;

      return {
        fallback: attrs.fallback ?? '',
        id: attrs.id ?? '',
        isDefaultEditable: attrs.isDefaultEditable ?? true,
      };
    },
    type: MAILY_NODE_TYPES.VARIABLE,
  });
}
