import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { useCallback, useState } from 'react';

import { useEditorInstance } from './use-editor-instance';
import { useOnNodeSelect } from './use-on-node-select';
import { useOnSelectionUpdate } from './use-on-selection-update';

type UseNodeBubbleStateOptions<TState extends object> = {
  editor?: Editor;
  selector: (editor: Editor) => TState;
  type: string;
};

export function useNodeBubbleState<TState extends object>(
  options: UseNodeBubbleStateOptions<TState>
) {
  const { editor, selector, type } = options;

  const editorInstance = useEditorInstance(editor);
  const [open, setOpen] = useState(false);

  const state = useEditorState({
    editor: editorInstance,
    selector: ({ editor: instance }) => {
      return selector(instance);
    },
  });

  const handleSelectionUpdate = useCallback(() => {
    if (!editorInstance.isEditable) {
      return;
    }

    setOpen(editorInstance.isActive(type));
  }, [editorInstance, type]);

  useOnSelectionUpdate(editorInstance, handleSelectionUpdate);
  useOnNodeSelect(editorInstance, handleSelectionUpdate);

  return { ...state, open, setOpen };
}
