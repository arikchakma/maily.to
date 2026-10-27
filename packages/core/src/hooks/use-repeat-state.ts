import type { RepeatAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';

import { DEFAULT_REPEAT_EACH } from '~/extensions/repeat/repeat';

import { useNodeBubbleState } from './use-node-bubble-state';

export function useRepeatState(editor?: Editor) {
  return useNodeBubbleState({
    editor,
    selector: (instance) => {
      const attrs = instance.getAttributes(
        MAILY_NODE_TYPES.REPEAT
      ) as RepeatAttributes;

      return { each: attrs.each ?? DEFAULT_REPEAT_EACH };
    },
    type: MAILY_NODE_TYPES.REPEAT,
  });
}
