import type { SectionAttributes } from '@maily-to/shared';
import { Trash2Icon } from 'lucide-react';
import { useMemo, useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useSectionState } from '~/hooks/use-section-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';
import {
  DEFAULT_COLOR_SWATCHES,
  TRANSPARENT_COLOR,
} from '~/utils/color-swatch';

import { ColorTrigger } from '../color-picker/color-picker-trigger';
import type { ColorSwatchItem } from '../color-picker/color-swatch';
import { ColorSwatchPopover } from '../color-picker/color-swatch-popover';
import { BubbleButton } from '../interface/bubble-button';
import { BubbleMenu } from '../interface/bubble-menu';
import { Divider } from '../interface/divider';
import { ToggleAlignPopover } from '../interface/toggle-align-popover';
import { SectionStylePopover } from './section-style-popover';

type SectionBubbleMenuProps = {};

export function SectionBubbleMenu(_props: SectionBubbleMenuProps) {
  const editor = useEditorInstance();
  const state = useSectionState(editor);
  const container = useRef<HTMLDivElement | null>(null);

  const { open, setOpen, align, backgroundColor } = state;

  const handleAttributeChange = (attrs: Partial<SectionAttributes>) => {
    editor.chain().updateSection(attrs).run();
  };

  const handleDelete = () => {
    editor.chain().focus().deleteNode('section').run();
  };

  const backgroundColorSwatch = useMemo(() => {
    const backgroundColors: ColorSwatchItem[] = [
      {
        id: 'reset',
        label: 'Remove Background',
        color: '',
        icon: Trash2Icon,
      },
    ];

    DEFAULT_COLOR_SWATCHES.forEach((swatch) => {
      backgroundColors.push({
        id: swatch.id,
        label: swatch.label,
        color: swatch.background,
      });
    });

    backgroundColors.push({
      id: 'transparent',
      label: 'Transparent',
      color: TRANSPARENT_COLOR,
    });

    return backgroundColors;
  }, []);

  if (!open) {
    return null;
  }

  return (
    <BubbleMenu
      ref={container}
      open={open}
      onOpenChange={setOpen}
      floatingId={FLOATING_ELEMENT_IDS.SECTION_BUBBLE_MENU}
    >
      <ToggleAlignPopover
        container={container}
        align={align}
        onAlignChange={(align) => handleAttributeChange({ align })}
      />

      <Divider />

      <SectionStylePopover container={container} editor={editor} />

      <ColorSwatchPopover
        container={container}
        color={backgroundColor ?? ''}
        onColorChange={(color, item) => {
          if (item?.id === 'reset') {
            handleAttributeChange({ backgroundColor: '' });
            return;
          }

          handleAttributeChange({ backgroundColor: color });
        }}
        items={backgroundColorSwatch}
        renderTrigger={(props, renderState) => (
          <ColorTrigger
            group="background"
            backgroundColor={backgroundColor ?? ''}
            active={renderState.open}
            label="Background"
            tooltip="Background Color"
            container={container}
            {...props}
          />
        )}
      />

      <Divider />

      <BubbleButton
        label="Delete Section"
        icon={Trash2Icon}
        tooltip="Delete Section"
        container={container}
        onClick={handleDelete}
        className="mly:text-red-500 mly:hover:bg-red-50 mly:hover:text-red-600"
      />
    </BubbleMenu>
  );
}
