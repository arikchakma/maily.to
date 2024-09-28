import { DEFAULT_SECTION_BACKGROUND_COLOR } from '@/editor/extensions/section/section';
import { Editor, useEditorState } from '@tiptap/react';
import deepEql from 'fast-deep-equal';

export const useColumnsState = (editor: Editor) => {
  const states = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        width: ctx.editor.getAttributes('columns')?.width || '100%',

        isSectionActive: ctx.editor.isActive('section'),

        currentVerticalAlignment:
          ctx.editor.getAttributes('column')?.verticalAlign || 'top',
        isVerticalAlignTop:
          ctx.editor.getAttributes('column')?.verticalAlign === 'top',
        isVerticalAlignMiddle:
          ctx.editor.getAttributes('column')?.verticalAlign === 'middle',
        isVerticalAlignBottom:
          ctx.editor.getAttributes('column')?.verticalAlign === 'bottom',
        isColumnActive: ctx.editor.isActive('column'),
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
