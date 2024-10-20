import { Editor, useEditorState } from '@tiptap/react';
import deepEql from 'fast-deep-equal';

export const useButtonState = (editor: Editor) => {
  const states = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        buttonText: ctx.editor.getAttributes('button').text,
        buttonBorderRadius: ctx.editor.getAttributes('button').borderRadius,
        buttonVariant: ctx.editor.getAttributes('button').variant,
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
