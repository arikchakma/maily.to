import type { Editor } from '@tiptap/react';
import { useEffect } from 'react';

import { useValueAsRef } from './use-value-as-ref';

export function useOnSelectionUpdate(
  editor: Editor,
  onSelectionUpdate: () => void
) {
  const callback = useValueAsRef(onSelectionUpdate);

  useEffect(() => {
    const handler = () => {
      callback.current();
    };

    handler();
    editor.on('selectionUpdate', handler);

    return () => {
      editor.off('selectionUpdate', handler);
    };
  }, [callback, editor]);
}
