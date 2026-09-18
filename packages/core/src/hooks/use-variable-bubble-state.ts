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
        hideDefaultValue: attrs.hideDefaultValue ?? false,
        id: attrs.id ?? '',
      };
    },
    type: MAILY_NODE_TYPES.VARIABLE,
  });
}
