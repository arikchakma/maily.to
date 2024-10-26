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

        linkUrl: editor?.getAttributes('link').href,
        textAlign: editor?.getAttributes('paragraph')?.textAlign || 'left',
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
