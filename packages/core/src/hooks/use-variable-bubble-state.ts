import type { VariableAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { useCallback, useState } from 'react';

import { useEditorInstance } from './use-editor-instance';
import { useOnNodeSelect } from './use-on-node-select';
import { useOnSelectionUpdate } from './use-on-selection-update';

export function useVariableBubbleState(editor: Editor) {
  const editorInstance = useEditorInstance(editor);
  const [open, setOpen] = useState(false);

  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const currentVariable = ctx.editor.getAttributes(
        MAILY_NODE_TYPES.VARIABLE
      ) as VariableAttributes;
      return {
        id: currentVariable.id,
        label: currentVariable.label,
        required: currentVariable.required,
        fallback: currentVariable.fallback,
        hideDefaultValue: currentVariable.hideDefaultValue,
      };
    },
  });

  const handleSelectionUpdate = useCallback(() => {
    if (!editorInstance.isEditable) {
      return;
    }

    const isVariableSelected = editorInstance.isActive(
      MAILY_NODE_TYPES.VARIABLE
    );
    setOpen(isVariableSelected);
  }, [editorInstance]);

  useOnSelectionUpdate(editorInstance, handleSelectionUpdate);
  useOnNodeSelect(editorInstance, handleSelectionUpdate);

  return {
    ...state,
    open,
    setOpen,
  };
}
