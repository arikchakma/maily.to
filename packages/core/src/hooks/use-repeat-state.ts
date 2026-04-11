import type { RepeatAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { useCallback, useState } from 'react';

import { DEFAULT_REPEAT_EACH } from '~/extensions/repeat/repeat';

import { useEditorInstance } from './use-editor-instance';
import { useOnNodeSelect } from './use-on-node-select';
import { useOnSelectionUpdate } from './use-on-selection-update';

export function useRepeatState(editor: Editor) {
  const editorInstance = useEditorInstance(editor);
  const [open, setOpen] = useState(false);

  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes(
        MAILY_NODE_TYPES.REPEAT
      ) as Partial<RepeatAttributes>;

      return {
        each: attrs.each ?? DEFAULT_REPEAT_EACH,
      };
    },
  });

  const handleSelectionUpdate = useCallback(() => {
    if (!editorInstance.isEditable) {
      return;
    }

    const isRepeatSelected = editorInstance.isActive(MAILY_NODE_TYPES.REPEAT);
    setOpen(isRepeatSelected);
  }, [editorInstance]);

  useOnSelectionUpdate(editorInstance, handleSelectionUpdate);
  useOnNodeSelect(editorInstance, handleSelectionUpdate);

  return {
    ...state,
    open,
    setOpen,
  };
}
