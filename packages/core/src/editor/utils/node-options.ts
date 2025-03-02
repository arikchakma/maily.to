import type { Editor } from '@tiptap/core';
import { type VariableOptions } from '@/editor/nodes/variable/variable';
import { useMemo } from 'react';

export function getNodeOptions<T extends Record<string, unknown>>(
  editor: Editor,
  name: string
): T {
  const node = editor.extensionManager.extensions.find(
    (extension) => extension.name === name
  );

  if (!node) {
    throw new Error(`Node ${name} not found`);
  }

  return node.options as T;
}

export function getVariableOptions(editor: Editor) {
  return getNodeOptions<VariableOptions>(editor, 'variable');
}

export function useVariableOptions(editor: Editor) {
  return useMemo(() => {
    return getVariableOptions(editor);
  }, [editor]);
}
