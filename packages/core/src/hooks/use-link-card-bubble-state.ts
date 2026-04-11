import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { useCallback, useState } from 'react';

import { useEditorInstance } from './use-editor-instance';
import { useOnNodeSelect } from './use-on-node-select';
import { useOnSelectionUpdate } from './use-on-selection-update';

export function useLinkCardBubbleState(editor: Editor) {
  const editorInstance = useEditorInstance(editor);
  const [open, setOpen] = useState(false);

  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes(MAILY_NODE_TYPES.LINK_CARD);
      return {
        title: attrs.title as string,
        description: attrs.description as string,
        link: attrs.link as string,
        linkTitle: attrs.linkTitle as string,
        image: attrs.image as string,
        subTitle: attrs.subTitle as string,
        badgeText: attrs.badgeText as string,
      };
    },
  });

  const handleSelectionUpdate = useCallback(() => {
    if (!editorInstance.isEditable) {
      return;
    }

    const isLinkCardSelected = editorInstance.isActive(
      MAILY_NODE_TYPES.LINK_CARD
    );
    setOpen(isLinkCardSelected);
  }, [editorInstance]);

  useOnSelectionUpdate(editorInstance, handleSelectionUpdate);
  useOnNodeSelect(editorInstance, handleSelectionUpdate);

  return {
    ...state,
    open,
    setOpen,
  };
}
