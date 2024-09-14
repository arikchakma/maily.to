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
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
