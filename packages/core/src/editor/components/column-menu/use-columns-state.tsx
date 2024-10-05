import {
  DEFAULT_COLUMN_BACKGROUND_COLOR,
  DEFAULT_COLUMN_BORDER_COLOR,
  DEFAULT_COLUMN_BORDER_RADIUS,
  DEFAULT_COLUMN_BORDER_WIDTH,
  DEFAULT_COLUMN_PADDING,
} from '@/editor/extensions/columns/column';
import { getColumnCount } from '@/editor/utils/columns';
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

        columnsCount: getColumnCount(ctx.editor),

        columnBorderRadius:
          ctx.editor.getAttributes('column')?.borderRadius ||
          DEFAULT_COLUMN_BORDER_RADIUS,
        columnPadding:
          ctx.editor.getAttributes('column')?.padding || DEFAULT_COLUMN_PADDING,
        columnBackgroundColor:
          ctx.editor.getAttributes('column')?.backgroundColor ||
          DEFAULT_COLUMN_BACKGROUND_COLOR,
        columnBorderWidth:
          ctx.editor.getAttributes('column')?.borderWidth ||
          DEFAULT_COLUMN_BORDER_WIDTH,
        columnBorderColor:
          ctx.editor.getAttributes('column')?.borderColor ||
          DEFAULT_COLUMN_BORDER_COLOR,
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
