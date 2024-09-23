import { DEFAULT_SECTION_BACKGROUND_COLOR } from '@/editor/extensions/section/section';
import { Editor, useEditorState } from '@tiptap/react';
import deepEql from 'fast-deep-equal';

export const useSectionState = (editor: Editor) => {
  const states = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        currentBorderRadius:
          Number(ctx.editor.getAttributes('section')?.borderRadius) || 0,
        currentPadding:
          Number(ctx.editor.getAttributes('section')?.padding) || 0,
        currentBackgroundColor:
          ctx.editor.getAttributes('section')?.backgroundColor ||
          DEFAULT_SECTION_BACKGROUND_COLOR,
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
