import { BUTTON_KINDS, MAILY_NODE_TYPES } from '@maily-to/shared';
import { Maximize2Icon, Minimize2Icon } from 'lucide-react';
import { useRef } from 'react';

import { useButtonState } from '~/hooks/use-button-state';
import { useEditorInstance } from '~/hooks/use-editor-instance';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';
import {
  getBackgroundColorSwatches,
  getTextColorSwatches,
} from '~/utils/color-swatch';

import { ColorTrigger } from '../color-picker/color-picker-trigger';
import { ColorSwatchPopover } from '../color-picker/color-swatch-popover';
import { BubbleButton } from '../interface/bubble-button';
import { BubbleMenu } from '../interface/bubble-menu';
import { Divider } from '../interface/divider';
import { ToggleAlignPopover } from '../interface/toggle-align-popover';
import { LinkPopover } from '../link-popover/link-popover';
import { ButtonStylePopover } from './button-style-popover';

export function ButtonBubbleMenu() {
  const editor = useEditorInstance();
  const { align, backgroundColor, color, kind, open, setOpen, url } =
    useButtonState(editor);
  const container = useRef<HTMLDivElement>(null);

  if (!open) {
    return null;
  }

  const isFullWidth = kind === BUTTON_KINDS.FULL_WIDTH;
  const WidthIcon = isFullWidth ? Minimize2Icon : Maximize2Icon;

  const updateStyle = (declarations: Record<string, string | null>) =>
    editor.chain().updateNodeStyle(MAILY_NODE_TYPES.BUTTON, declarations).run();

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.BUTTON_BUBBLE_MENU}
      onOpenChange={setOpen}
      open={open}
      ref={container}
    >
      <ToggleAlignPopover
        align={align}
        container={container}
        onAlignChange={(next) =>
          editor.chain().updateButtonAttributes({ align: next }).run()
        }
      />

      <LinkPopover
        container={container}
        onUrlChange={(next) =>
          editor
            .chain()
            .updateButtonAttributes({ url: next ?? '' })
            .run()
        }
        url={url}
      />

      <ButtonStylePopover container={container} />

      <Divider />

      <BubbleButton
        container={container}
        icon={WidthIcon}
        isActive={isFullWidth}
        label={isFullWidth ? 'Tight' : 'Full Width'}
        tooltip={isFullWidth ? 'Tight' : 'Full Width'}
        onClick={() =>
          editor
            .chain()
            .updateButtonAttributes({
              kind: isFullWidth ? BUTTON_KINDS.TIGHT : BUTTON_KINDS.FULL_WIDTH,
            })
            .run()
        }
      />

      <ColorSwatchPopover
        color={backgroundColor}
        container={container}
        items={getBackgroundColorSwatches()}
        onColorChange={(next) => updateStyle({ backgroundColor: next })}
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

      <ColorSwatchPopover
        color={color}
        container={container}
        items={getTextColorSwatches()}
        onColorChange={(next) => updateStyle({ color: next })}
        renderTrigger={(state) => (
          <ColorTrigger
            {...state}
            color={color}
            container={container}
            group="text"
            label="Text Color"
            tooltip="Text Color"
          />
        )}
      />
    </BubbleMenu>
  );
}
