import type { MailyNodeType } from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import { useMemo } from 'react';

import { useEditorInstance } from './use-editor-instance';

export function getNodeOptions<T extends Record<string, unknown>>(
  name: MailyNodeType,
  editor: Editor
): T {
  const node = editor.extensionManager.extensions.find(
    (extension) => extension.name === name
  );

  if (!node) {
    throw new Error(`Node ${name} not found`);
  }

  return node.options as T;
}

export function useExtensionOptions<T extends Record<string, unknown>>(
  type: MailyNodeType,
  editor?: Editor
): T {
  const editorInstance = useEditorInstance(editor);
  return useMemo(
    () => getNodeOptions<T>(type, editorInstance),
    [editorInstance, type]
  );
}
