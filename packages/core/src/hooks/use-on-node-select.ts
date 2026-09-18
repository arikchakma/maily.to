import type { Editor } from '@tiptap/react';
import { isNodeSelection } from '@tiptap/react';
import { useEffect } from 'react';

import { useValueAsRef } from './use-value-as-ref';

export function useOnNodeSelect(editor: Editor, onNodeSelect: () => void) {
  const callback = useValueAsRef(onNodeSelect);

  useEffect(() => {
    const editorViewDom = editor.view.dom;

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0 || !isNodeSelection(editor.state.selection)) {
        return;
      }

      callback.current();
    };

    editorViewDom.addEventListener('mousedown', handleMouseDown);

    return () => {
      editorViewDom.removeEventListener('mousedown', handleMouseDown);
    };
  }, [callback, editor]);
}
