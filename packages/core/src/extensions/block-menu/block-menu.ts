import type { Editor } from '@tiptap/core';
import { isMacOS } from '@tiptap/core';
import { keydownHandler } from '@tiptap/pm/keymap';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const BLOCK_MENU_SHORTCUT = 'Mod-Shift-.';

export const BLOCK_MENU_PLUGIN_KEY = new PluginKey('blockMenu');

export function getBlockMenuShortcutKeys() {
  return isMacOS() ? 'Meta+Shift+.' : 'Control+Shift+.';
}

export function getBlockMenuShortcutLabel() {
  return isMacOS() ? '⌘⇧.' : 'Ctrl+Shift+.';
}

function getSelectionPoint(editor: Editor) {
  const coords = editor.view.coordsAtPos(editor.state.selection.from);

  return { x: coords.left, y: (coords.top + coords.bottom) / 2 };
}

export type BlockMenuPluginOptions = {
  editor: Editor;
  onOpen: () => void;
};

export function getBlockMenuPlugin(options: BlockMenuPluginOptions) {
  const { editor, onOpen } = options;

  const hoverSelectedBlock = () => {
    const point = getSelectionPoint(editor);

    editor.view.dom.dispatchEvent(
      new MouseEvent('mousemove', {
        bubbles: true,
        clientX: point.x,
        clientY: point.y,
      })
    );
  };

  const openBlockMenu = () => {
    if (!editor.isEditable) {
      return false;
    }

    editor.commands.scrollIntoView();
    hoverSelectedBlock();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (editor.isDestroyed) {
          return;
        }

        onOpen();
      });
    });

    return true;
  };

  return new Plugin({
    key: BLOCK_MENU_PLUGIN_KEY,
    props: {
      handleKeyDown: keydownHandler({ [BLOCK_MENU_SHORTCUT]: openBlockMenu }),
    },
  });
}
