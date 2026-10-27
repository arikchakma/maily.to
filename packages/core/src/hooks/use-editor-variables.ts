import type { Editor } from '@tiptap/react';

import type { Variables } from '~/utils/variable';

import { useEditorInstance } from './use-editor-instance';

export function useEditorVariables(editor?: Editor | null): Variables {
  const editorInstance = useEditorInstance(editor);

  return editorInstance.storage.variable?.variables ?? [];
}
