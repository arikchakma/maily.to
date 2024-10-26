import { Editor, useEditorState } from '@tiptap/react';
import deepEql from 'fast-deep-equal';

export const DEFAULT_TEXT_COLOR = '#374151';

export const useTextMenuState = (editor: Editor) => {
  const states = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        currentTextColor:
          ctx.editor.getAttributes('textStyle').color || DEFAULT_TEXT_COLOR,

        linkUrl: ctx.editor?.getAttributes('link').href,
        textAlign: ctx.editor?.getAttributes('paragraph')?.textAlign || 'left',

        isListActive:
          ctx.editor.isActive('bulletList') ||
          ctx.editor.isActive('orderedList'),
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
