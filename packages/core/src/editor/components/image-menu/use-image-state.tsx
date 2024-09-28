import { DEFAULT_SECTION_BACKGROUND_COLOR } from '@/editor/extensions/section/section';
import { Editor, useEditorState } from '@tiptap/react';
import deepEql from 'fast-deep-equal';

export const useImageState = (editor: Editor) => {
  const states = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        width: ctx.editor.getAttributes('image').width,
        height: ctx.editor.getAttributes('image').height,
        isImageActive: ctx.editor.isActive('image'),
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
