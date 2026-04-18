import type { AllowedTextAlignment } from '@maily-to/shared';
import { DEFAULT_TEXT_ALIGN, TEXT_ALIGNMENTS } from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
import { useCallback } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';

import { ToggleAlignPopover } from '../interface/toggle-align-popover';
import { useToolbarContext } from './toolbar-context';

type ToolbarAlignProps = {
  className?: string;
};

export function ToolbarAlign(props: ToolbarAlign.Props) {
  const { className: _className } = props;

  const editor = useEditorInstance();
  const { container } = useToolbarContext();

  const align = useEditorState({
    editor,
    selector: (ctx) => {
      if (ctx.editor.isActive({ textAlign: TEXT_ALIGNMENTS.LEFT })) {
        return TEXT_ALIGNMENTS.LEFT;
      }
      if (ctx.editor.isActive({ textAlign: TEXT_ALIGNMENTS.CENTER })) {
        return TEXT_ALIGNMENTS.CENTER;
      }
      if (ctx.editor.isActive({ textAlign: TEXT_ALIGNMENTS.RIGHT })) {
        return TEXT_ALIGNMENTS.RIGHT;
      }
      return DEFAULT_TEXT_ALIGN;
    },
  });

  const handleAlignChange = useCallback(
    (align: AllowedTextAlignment) => {
      editor.chain().focus().setTextAlign(align).run();
    },
    [editor]
  );

  return (
    <ToggleAlignPopover
      container={container}
      align={align}
      onAlignChange={handleAlignChange}
    />
  );
}

export namespace ToolbarAlign {
  export type Props = ToolbarAlignProps;
}
