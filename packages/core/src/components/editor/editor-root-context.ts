import { MAILY_ERROR_PREFIX } from '@maily-to/shared';
import type { EditorThemeOptions, TextDirection } from '@maily-to/shared';
import * as React from 'react';

export type EditorRootContext = {
  textDirection: TextDirection;
  setTextDirection: (direction: TextDirection) => void;
  theme: EditorThemeOptions;
};

export const EditorRootContext = React.createContext<EditorRootContext | null>(
  null
);

export function useEditorRootContext() {
  const context = React.useContext(EditorRootContext);
  if (!context) {
    throw new Error(
      `${MAILY_ERROR_PREFIX}: EditorRootContext is missing. Editor parts must be placed within <Editor.Root>.`
    );
  }

  return context;
}
