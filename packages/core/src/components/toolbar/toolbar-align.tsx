import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import {
  DEFAULT_TEXT_ALIGN,
  isAllowedTextAlignment,
  MAILY_NODE_TYPES,
  parseInlineStyles,
} from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';

import { useEditorInstance } from '~/hooks/use-editor-instance';

import { ToggleAlignPopover } from '../interface/toggle-align-popover';

export function ToolbarAlign() {
  const editor = useEditorInstance();

  const { align, blockType } = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const type = instance.isActive(MAILY_NODE_TYPES.HEADING)
        ? MAILY_NODE_TYPES.HEADING
        : MAILY_NODE_TYPES.PARAGRAPH;
      const declarations = parseInlineStyles(
        (instance.getAttributes(type).style as string) ?? ''
      );

      return {
        align: isAllowedTextAlignment(declarations.textAlign)
          ? declarations.textAlign
          : DEFAULT_TEXT_ALIGN,
        blockType: type,
      };
    },
  });

  return (
    <ToggleAlignPopover
      align={align}
      trigger={<ToolbarPrimitive.Button />}
      onAlignChange={(textAlign) =>
        editor.chain().focus().updateNodeStyle(blockType, { textAlign }).run()
      }
    />
  );
}
