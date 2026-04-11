import {
  DEFAULT_TEXT_ALIGN,
  MAILY_NODE_TYPES,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';

import { useEditorInstance } from './use-editor-instance';

export function useTextBubbleState(editor: Editor) {
  const editorInstance = useEditorInstance(editor);
  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const isParagraph = ctx.editor.isActive(MAILY_NODE_TYPES.PARAGRAPH);
      const isHeading = ctx.editor.isActive(MAILY_NODE_TYPES.HEADING);
      const blockType: 'heading' | 'paragraph' | null = isHeading
        ? 'heading'
        : isParagraph
          ? 'paragraph'
          : null;

      return {
        blockType,
        isButtonSelected: ctx.editor.isActive(MAILY_NODE_TYPES.BUTTON),
        isBold: ctx.editor.isActive('bold'),
        isItalic: ctx.editor.isActive('italic'),
        isStrike: ctx.editor.isActive('strike'),
        isUnderline: ctx.editor.isActive('underline'),
        isLink: ctx.editor.isActive('link'),
        linkHref: ctx.editor.getAttributes('link').href,
        isCode: ctx.editor.isActive('code'),
        align: ctx.editor.isActive({ textAlign: TEXT_ALIGNMENTS.LEFT })
          ? TEXT_ALIGNMENTS.LEFT
          : ctx.editor.isActive({ textAlign: TEXT_ALIGNMENTS.CENTER })
            ? TEXT_ALIGNMENTS.CENTER
            : ctx.editor.isActive({ textAlign: TEXT_ALIGNMENTS.RIGHT })
              ? TEXT_ALIGNMENTS.RIGHT
              : DEFAULT_TEXT_ALIGN,
        textColor: ctx.editor.getAttributes('textStyle')?.color,
        backgroundColor: ctx.editor.getAttributes('highlight')?.color,
      };
    },
  });

  return state;
}
