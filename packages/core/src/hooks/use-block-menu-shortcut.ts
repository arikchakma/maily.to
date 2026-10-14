import type { Editor } from '@tiptap/react';
import { useEffect, useRef } from 'react';

import {
  BLOCK_MENU_PLUGIN_KEY,
  getBlockMenuPlugin,
} from '~/extensions/block-menu/block-menu';

export type UseBlockMenuShortcutOptions = {
  editor: Editor;
  onOpen: () => void;
};

export function useBlockMenuShortcut(options: UseBlockMenuShortcutOptions) {
  const { editor, onOpen } = options;

  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    if (editor.isDestroyed) {
      return;
    }

    const plugin = getBlockMenuPlugin({
      editor,
      onOpen: () => {
        onOpenRef.current();
      },
    });

    editor.registerPlugin(plugin);

    return () => {
      if (!editor.isDestroyed) {
        editor.unregisterPlugin(BLOCK_MENU_PLUGIN_KEY);
      }
    };
  }, [editor]);
}
