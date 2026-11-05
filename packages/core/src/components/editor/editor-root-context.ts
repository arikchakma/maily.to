import type { TextDirection } from '@maily-to/shared';
import { invariant } from '@maily-to/shared';
import { createContext, use } from 'react';

type EditorRootContext = {
  setTextDirection: (direction: TextDirection) => void;
  textDirection: TextDirection;
};

const EditorRootContext = createContext<EditorRootContext | null>(null);

export function useEditorRootContext() {
  const context = use(EditorRootContext);
  invariant(
    context,
    'EditorRootContext is missing. Editor parts must be placed within <Editor.Root>.'
  );

  return context;
}

export { EditorRootContext };
