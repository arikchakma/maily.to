import {
  DEFAULT_TEXT_ALIGN,
  isAllowedTextAlignment,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/react';

import { getNodeStyleState } from '~/utils/theme';

import { useNodeBubbleState } from './use-node-bubble-state';

export function useSectionState(editor?: Editor) {
  return useNodeBubbleState({
    editor,
    selector: (instance) => {
      const { resolved } = getNodeStyleState({
        editor: instance,
        type: MAILY_NODE_TYPES.SECTION,
      });

      return {
        align: isAllowedTextAlignment(resolved.textAlign)
          ? resolved.textAlign
          : DEFAULT_TEXT_ALIGN,
        backgroundColor: resolved.backgroundColor ?? '',
      };
    },
    type: MAILY_NODE_TYPES.SECTION,
  });
}
