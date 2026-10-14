import {
  DEFAULT_TEXT_ALIGN,
  isAllowedTextAlignment,
  MAILY_MARK_TYPES,
  MAILY_NODE_TYPES,
  parseInlineStyles,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';

import { useEditorInstance } from './use-editor-instance';

export function useTextBubbleState(editor?: Editor) {
  const editorInstance = useEditorInstance(editor);

  return useEditorState({
    editor: editorInstance,
    selector: ({ editor: instance }) => {
      const blockType = instance.isActive(MAILY_NODE_TYPES.HEADING)
        ? MAILY_NODE_TYPES.HEADING
        : MAILY_NODE_TYPES.PARAGRAPH;
      const declarations = parseInlineStyles(
        (instance.getAttributes(blockType).style as string) ?? ''
      );

      return {
        align: isAllowedTextAlignment(declarations.textAlign)
          ? declarations.textAlign
          : DEFAULT_TEXT_ALIGN,
        backgroundColor:
          (instance.getAttributes(MAILY_MARK_TYPES.HIGHLIGHT)
            .color as string) ?? '',
        blockType,
        color:
          (instance.getAttributes(MAILY_MARK_TYPES.TEXT_STYLE)
            .color as string) ?? '',
        isBold: instance.isActive(MAILY_MARK_TYPES.BOLD),
        isButtonSelected: instance.isActive(MAILY_NODE_TYPES.BUTTON),
        isCode: instance.isActive(MAILY_MARK_TYPES.CODE),
        isItalic: instance.isActive(MAILY_MARK_TYPES.ITALIC),
        isStrike: instance.isActive(MAILY_MARK_TYPES.STRIKE),
        isUnderline: instance.isActive(MAILY_MARK_TYPES.UNDERLINE),
        linkHref:
          (instance.getAttributes(MAILY_MARK_TYPES.LINK).href as string) ?? '',
      };
    },
  });
}
