import type { SectionAttributes } from '@maily-to/shared';
import {
  BORDER_STYLES,
  FIELD_MODE,
  MAILY_NODE_TYPES,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { useCallback, useState } from 'react';

import {
  DEFAULT_SECTION_BACKGROUND_COLOR,
  DEFAULT_SECTION_BORDER_COLOR,
  DEFAULT_SECTION_BORDER_WIDTH,
} from '~/extensions/section/section';

import { useEditorInstance } from './use-editor-instance';
import { useOnNodeSelect } from './use-on-node-select';
import { useOnSelectionUpdate } from './use-on-selection-update';

export function useSectionState(editor: Editor) {
  const editorInstance = useEditorInstance(editor);
  const [open, setOpen] = useState(false);

  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes(
        MAILY_NODE_TYPES.SECTION
      ) as Partial<SectionAttributes>;

      return {
        align: attrs.align ?? TEXT_ALIGNMENTS.LEFT,
        backgroundColor:
          attrs.backgroundColor ?? DEFAULT_SECTION_BACKGROUND_COLOR,

        marginMode: attrs.marginMode ?? FIELD_MODE.UNIFORM,
        marginTop: Number(attrs.marginTop) || 0,
        marginRight: Number(attrs.marginRight) || 0,
        marginBottom: Number(attrs.marginBottom) || 0,
        marginLeft: Number(attrs.marginLeft) || 0,

        paddingMode: attrs.paddingMode ?? FIELD_MODE.UNIFORM,
        paddingTop: Number(attrs.paddingTop) || 0,
        paddingRight: Number(attrs.paddingRight) || 0,
        paddingBottom: Number(attrs.paddingBottom) || 0,
        paddingLeft: Number(attrs.paddingLeft) || 0,

        // Border
        borderStyle: attrs.borderStyle ?? BORDER_STYLES.SOLID,
        borderColor: attrs.borderColor ?? DEFAULT_SECTION_BORDER_COLOR,

        borderWidthMode: attrs.borderWidthMode ?? FIELD_MODE.UNIFORM,
        borderTopWidth:
          Number(attrs.borderTopWidth) || DEFAULT_SECTION_BORDER_WIDTH,
        borderRightWidth:
          Number(attrs.borderRightWidth) || DEFAULT_SECTION_BORDER_WIDTH,
        borderBottomWidth:
          Number(attrs.borderBottomWidth) || DEFAULT_SECTION_BORDER_WIDTH,
        borderLeftWidth:
          Number(attrs.borderLeftWidth) || DEFAULT_SECTION_BORDER_WIDTH,

        borderRadiusMode: attrs.borderRadiusMode ?? FIELD_MODE.UNIFORM,
        borderTopLeftRadius: Number(attrs.borderTopLeftRadius) || 0,
        borderTopRightRadius: Number(attrs.borderTopRightRadius) || 0,
        borderBottomLeftRadius: Number(attrs.borderBottomLeftRadius) || 0,
        borderBottomRightRadius: Number(attrs.borderBottomRightRadius) || 0,
      };
    },
  });

  const handleSelectionUpdate = useCallback(() => {
    if (!editorInstance.isEditable) {
      return;
    }

    const isSectionSelected = editorInstance.isActive(MAILY_NODE_TYPES.SECTION);
    setOpen(isSectionSelected);
  }, [editorInstance]);

  useOnSelectionUpdate(editorInstance, handleSelectionUpdate);
  useOnNodeSelect(editorInstance, handleSelectionUpdate);

  return {
    ...state,
    open,
    setOpen,
  };
}
