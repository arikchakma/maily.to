import type { HtmlCodeBlockAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';

import { useNodeBubbleState } from './use-node-bubble-state';

export function useHtmlCodeBlockState(editor?: Editor) {
  return useNodeBubbleState({
    editor,
    selector: (instance) => {
      const attrs = instance.getAttributes(
        MAILY_NODE_TYPES.HTML_CODE_BLOCK
      ) as HtmlCodeBlockAttributes;

      return { activeTab: attrs.activeTab };
    },
    type: MAILY_NODE_TYPES.HTML_CODE_BLOCK,
  });
}
