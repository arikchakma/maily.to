import type { InlineImageAttributes } from '@maily-to/shared';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { useCallback, useState } from 'react';

import { useEditorInstance } from './use-editor-instance';
import { useOnNodeSelect } from './use-on-node-select';
import { useOnSelectionUpdate } from './use-on-selection-update';

export function useInlineImageState(editor: Editor) {
  const editorInstance = useEditorInstance(editor);
  const [open, setOpen] = useState(false);

  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes(
        MAILY_NODE_TYPES.INLINE_IMAGE
      ) as InlineImageAttributes;

      return {
        src: attrs.src,
        alt: attrs.alt ?? '',
        title: attrs.title ?? '',
        size: attrs.width,
        externalLink: attrs.externalLink,
      };
    },
  });

  const handleSelectionUpdate = useCallback(() => {
    if (!editorInstance.isEditable) {
      return;
    }

    const isSelected = editorInstance.isActive(MAILY_NODE_TYPES.INLINE_IMAGE);
    setOpen(isSelected);
  }, [editorInstance]);

  useOnSelectionUpdate(editorInstance, handleSelectionUpdate);
  useOnNodeSelect(editorInstance, handleSelectionUpdate);

  return {
    ...state,
    open,
    setOpen,
  };
}
