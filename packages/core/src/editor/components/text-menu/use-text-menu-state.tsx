import { Editor, useEditorState } from '@tiptap/react';
import deepEql from 'fast-deep-equal';

export const useTextMenuState = (editor: Editor) => {
  const states = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        currentTextColor: ctx.editor.getAttributes('textStyle').color || '',
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
