import {
  DEFAULT_COLUMN_BACKGROUND_COLOR,
  DEFAULT_COLUMN_BORDER_COLOR,
  DEFAULT_COLUMN_BORDER_RADIUS,
  DEFAULT_COLUMN_BORDER_WIDTH,
  DEFAULT_COLUMN_PADDING,
} from '@/editor/nodes/columns/column';
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

        columnPaddingTop:
          Number(ctx.editor.getAttributes('column')?.paddingTop) || 0,
        columnPaddingRight:
          Number(ctx.editor.getAttributes('column')?.paddingRight) || 0,
        columnPaddingBottom:
          Number(ctx.editor.getAttributes('column')?.paddingBottom) || 0,
        columnPaddingLeft:
          Number(ctx.editor.getAttributes('column')?.paddingLeft) || 0,
      };
    },
    equalityFn: deepEql,
  });

  return states;
};
