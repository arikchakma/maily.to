import { Editor, useEditorState } from '@tiptap/react';
import deepEql from 'fast-deep-equal';

export const useForState = (editor: Editor) => {
  const states = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        each: ctx.editor.getAttributes('for')?.each,
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
