import type { SpacerAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { useCallback, useState } from 'react';

import { useEditorInstance } from './use-editor-instance';
import { useOnNodeSelect } from './use-on-node-select';
import { useOnSelectionUpdate } from './use-on-selection-update';

export function useSpacerState(editor: Editor) {
  const editorInstance = useEditorInstance(editor);
  const [open, setOpen] = useState(false);

  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const currentSpacer = ctx.editor.getAttributes(
        MAILY_NODE_TYPES.SPACER
      ) as SpacerAttributes;

      return {
        height: currentSpacer.height,
        heightMode: currentSpacer.heightMode,
      };
    },
  });

  const handleSelectionUpdate = useCallback(() => {
    if (!editorInstance.isEditable) {
      return;
    }

    const isSpacerSelected = editorInstance.isActive(MAILY_NODE_TYPES.SPACER);
    setOpen(isSpacerSelected);
  }, [editorInstance]);

  useOnSelectionUpdate(editorInstance, handleSelectionUpdate);
  useOnNodeSelect(editorInstance, handleSelectionUpdate);

  return {
    ...state,
    open,
    setOpen,
  };
}
