import { invariant, MAILY_BUG_REPORT_URL } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useCurrentEditor } from '@tiptap/react';
import { useMemo } from 'react';

const EDITOR_INSTANCE_NOT_FOUND_ERROR = `Editor instance not found. Make sure to use the EditorContext.Provider or useEditor hook.

Please create an issue at ${MAILY_BUG_REPORT_URL} if you think this is a bug.
`;

/**
 * Returns the active Tiptap editor instance, preferring the explicitly
 * passed editor over the one from EditorContext. Throws if neither exists.
 */
export function useEditorInstance(editor?: Editor | null) {
  const { editor: currentEditor } = useCurrentEditor();
  const editorInstance = useMemo(
    () => editor || currentEditor,
    [editor, currentEditor]
  );

  invariant(editorInstance, EDITOR_INSTANCE_NOT_FOUND_ERROR);

  return editorInstance;
}
