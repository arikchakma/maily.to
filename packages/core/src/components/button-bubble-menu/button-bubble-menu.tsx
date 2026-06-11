import { BUTTON_KINDS, TEXT_ALIGNMENTS } from '@maily-to/shared';
import { Maximize2Icon, Minimize2Icon, Trash2Icon } from 'lucide-react';
import { useMemo, useRef } from 'react';

import { useButtonState } from '~/hooks/use-button-state';
import { useEditorInstance } from '~/hooks/use-editor-instance';
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
import { LinkPopover } from '../link-popover/link-popover';
import { ButtonStylePopover } from './button-style-popover';

type ButtonBubbleMenuProps = {};

export function ButtonBubbleMenu(_props: ButtonBubbleMenuProps) {
  const editor = useEditorInstance();
  const state = useButtonState(editor);
  const container = useRef<HTMLDivElement | null>(null);

  const { open, setOpen, kind, alignment, url, backgroundColor, color } = state;
  const isFullWidth = kind === BUTTON_KINDS.FULL_WIDTH;
  const handleAttributeChange = (attribute: string, value: string | null) => {
    editor
      .chain()
      .updateButtonAttributes({ [attribute]: value })
      .run();
  };

  const [textColorSwatch, backgroundColorSwatch] = useMemo(() => {
    const textColors: ColorSwatchItem[] = [
      { id: 'reset', label: 'Remove Text Color', color: '', icon: Trash2Icon },
    ];
    const backgroundColors: ColorSwatchItem[] = [
      {
        id: 'reset',
        label: 'Remove Background Color',
        color: '',
        icon: Trash2Icon,
      },
    ];

    DEFAULT_COLOR_SWATCHES.forEach((swatch) => {
      textColors.push({
        id: swatch.id,
        label: swatch.label,
        color: swatch.text,
      });
      backgroundColors.push({
        id: swatch.id,
        label: swatch.label,
        color: swatch.background,
      });
    });

    textColors.push({
      id: 'transparent',
      label: 'Transparent',
      color: TRANSPARENT_COLOR,
    });

    backgroundColors.push({
      id: 'transparent',
      label: 'Transparent',
      color: TRANSPARENT_COLOR,
    });

    return [textColors, backgroundColors];
  }, []);

  if (!open) {
    return null;
  }

  const WidthIcon = isFullWidth ? Minimize2Icon : Maximize2Icon;

  return (
    <BubbleMenu
      ref={container}
      open={open}
      onOpenChange={setOpen}
      floatingId={FLOATING_ELEMENT_IDS.BUTTON_BUBBLE_MENU}
    >
      <ToggleAlignPopover
        container={container}
        align={alignment ?? TEXT_ALIGNMENTS.LEFT}
        onAlignChange={(align) => handleAttributeChange('alignment', align)}
      />
      <LinkPopover
        container={container}
        url={url}
        onUrlChange={(url) => handleAttributeChange('url', url)}
      />

      <ButtonStylePopover container={container} editor={editor} />

      <Divider />

      <BubbleButton
        label={isFullWidth ? 'Tight' : 'Full Width'}
        tooltip={isFullWidth ? 'Tight' : 'Full Width'}
        container={container}
        isActive={isFullWidth}
        onClick={() => {
          const next =
            kind === BUTTON_KINDS.FULL_WIDTH
              ? BUTTON_KINDS.TIGHT
              : BUTTON_KINDS.FULL_WIDTH;
          handleAttributeChange('kind', next);
        }}
      >
        <WidthIcon className="mly:size-3.5 mly:rotate-45 mly:disabled:opacity-50" />
      </BubbleButton>

      <ColorSwatchPopover
        container={container}
        color={backgroundColor ?? ''}
        onColorChange={(color, item) => {
          if (item?.id === 'reset') {
            handleAttributeChange('backgroundColor', null);
            return;
          }

          handleAttributeChange('backgroundColor', color);
        }}
        items={backgroundColorSwatch}
        renderTrigger={(props, renderState) => (
          <ColorTrigger
            group="background"
            backgroundColor={backgroundColor ?? ''}
            active={renderState.open}
            label="Background Color"
            tooltip="Background Color"
            container={container}
            {...props}
          />
        )}
      />

      <ColorSwatchPopover
        container={container}
        color={color ?? ''}
        onColorChange={(color, item) => {
          if (item?.id === 'reset') {
            handleAttributeChange('color', null);
            return;
          }

          handleAttributeChange('color', color);
        }}
        items={textColorSwatch}
        renderTrigger={(props, renderState) => (
          <ColorTrigger
            group="text"
            textColor={color ?? ''}
            active={renderState.open}
            label="Text Color"
            tooltip="Text Color"
            container={container}
            {...props}
          />
        )}
      />
    </BubbleMenu>
  );
}
