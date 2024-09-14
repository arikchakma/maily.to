import { Editor, useEditorState } from '@tiptap/react';
import deepEql from 'fast-deep-equal';

export const useColumnState = (editor: Editor) => {
  const states = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        currentVerticalAlignment:
          ctx.editor.getAttributes('column')?.verticalAlign || 'top',
        isVerticalAlignTop:
          ctx.editor.getAttributes('column')?.verticalAlign === 'top',
        isVerticalAlignMiddle:
          ctx.editor.getAttributes('column')?.verticalAlign === 'middle',
        isVerticalAlignBottom:
          ctx.editor.getAttributes('column')?.verticalAlign === 'bottom',
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
