import type { Editor } from '@tiptap/react';

import { useEditorInstance } from './use-editor-instance';

/** Returns the current variable list from the variable extension's storage. */
export function useEditorVariables(editor?: Editor | null) {
  const editorInstance = useEditorInstance(editor);
  return editorInstance.storage.variable?.variables;
}
