import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { Trash2Icon } from 'lucide-react';
import { useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useSectionState } from '~/hooks/use-section-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';
import { getBackgroundColorSwatches } from '~/utils/color-swatch';

import { ColorTrigger } from '../color-picker/color-picker-trigger';
import { ColorSwatchPopover } from '../color-picker/color-swatch-popover';
import { BubbleButton } from '../interface/bubble-button';
import { BubbleMenu } from '../interface/bubble-menu';
import { Divider } from '../interface/divider';
import { ToggleAlignPopover } from '../interface/toggle-align-popover';
import { SectionStylePopover } from './section-style-popover';

export function SectionBubbleMenu() {
  const editor = useEditorInstance();
  const { align, backgroundColor, open, setOpen } = useSectionState(editor);
  const container = useRef<HTMLDivElement>(null);

  if (!open) {
    return null;
  }

  const updateStyle = (declarations: Record<string, string | null>) =>
    editor
      .chain()
      .updateNodeStyle(MAILY_NODE_TYPES.SECTION, declarations)
      .run();

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.SECTION_BUBBLE_MENU}
      onOpenChange={setOpen}
      open={open}
      ref={container}
    >
      <ToggleAlignPopover
        align={align}
        container={container}
        onAlignChange={(textAlign) => updateStyle({ textAlign })}
      />

      <Divider />

      <SectionStylePopover container={container} />

      <ColorSwatchPopover
        color={backgroundColor}
        container={container}
        items={getBackgroundColorSwatches()}
        onColorChange={(color) => updateStyle({ backgroundColor: color })}
        renderTrigger={(state) => (
          <ColorTrigger
            {...state}
            color={backgroundColor}
            container={container}
            group="background"
            label="Background Color"
            tooltip="Background Color"
          />
        )}
      />

      <Divider />

      <BubbleButton
        container={container}
        icon={Trash2Icon}
        label="Delete Section"
        tooltip="Delete Section"
        onClick={() =>
          editor.chain().focus().deleteNode(MAILY_NODE_TYPES.SECTION).run()
        }
      />
    </BubbleMenu>
  );
}
