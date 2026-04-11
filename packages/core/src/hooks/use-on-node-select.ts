import type { Editor } from '@tiptap/react';
import { isNodeSelection } from '@tiptap/react';
import { useEffect } from 'react';

import { useEditorInstance } from './use-editor-instance';

export function useOnNodeSelect(editor: Editor, onSelect: () => void) {
  const editorInstance = useEditorInstance(editor);

  useEffect(() => {
    const view = editorInstance.view;
    if (!view) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      const isLeftButton = event.button === 0;
      if (!isLeftButton) {
        return;
      }

      const selection = editorInstance.state.selection;
      if (!isNodeSelection(selection)) {
        return;
      }

      onSelect();
    };

    view.dom.addEventListener('mousedown', handleMouseDown);
    return () => {
      view.dom.removeEventListener('mousedown', handleMouseDown);
    };
  }, [editorInstance]);
}
