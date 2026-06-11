import { AI_ACTIONS_PLUGIN_KEY } from '@maily-to/extension-ai-actions';
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useTextBubbleState } from '~/hooks/use-text-bubble-state';
import { useTurnIntoBlockItems } from '~/hooks/use-turn-into-block-items';
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
import { AIActionsDropdown } from './ai-actions-dropdown';
import { TurnIntoBlock } from './turn-into-block';

export function TextBubbleMenu() {
  const editor = useEditorInstance();
  const state = useTextBubbleState(editor);
  const turnIntoBlockItems = useTurnIntoBlockItems(editor);

  const container = useRef<HTMLDivElement | null>(null);

  const actions = [
    {
      label: 'Bold',
      icon: BoldIcon,
      tooltip: 'Bold',
      isActive: state.isBold,
      command: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: 'Italic',
      icon: ItalicIcon,
      tooltip: 'Italic',
      isActive: state.isItalic,
      command: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: 'Underline',
      icon: UnderlineIcon,
      tooltip: 'Underline',
      isActive: state.isUnderline,
      command: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: 'Strikethrough',
      icon: StrikethroughIcon,
      tooltip: 'Strikethrough',
      isActive: state.isStrike,
      command: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: 'Code',
      icon: CodeIcon,
      tooltip: 'Code',
      isActive: state.isCode,
      command: () => editor.chain().focus().toggleCode().run(),
    },
  ];

  const handleTextColorChange = useCallback(
    (color: string) => {
      if (!color) {
        return editor.chain().unsetColor().run();
      }

      return editor.chain().setColor(color).run();
    },
    [editor]
  );

  const handleBackgroundColorChange = useCallback(
    (color: string) => {
      if (!color) {
        return editor.chain().unsetHighlight().run();
      }

      return editor.chain().setHighlight({ color }).run();
    },
    [editor]
  );

  const handleAlignChange = useCallback(
    (align: string) => {
      return editor.chain().focus().setTextAlign(align).run();
    },
    [editor]
  );

  const handleUrlChange = useCallback(
    (url: string | null) => {
      if (!url) {
        return editor
          .chain()
          .extendMarkRange('link')
          .unsetLink()
          .unsetUnderline()
          .run();
      }

      return editor
        .chain()
        .extendMarkRange('link')
        .setLink({ href: url })
        .setUnderline()
        .run();
    },
    [editor]
  );

  const [textColorSwatch, backgroundColorSwatch] = useMemo(() => {
    const textColors: ColorSwatchItem[] = [
      { id: 'reset', label: 'Reset Color', color: '' },
    ];
    const backgroundColors: ColorSwatchItem[] = [
      { id: 'reset', label: 'Reset Color', color: '' },
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

  const { isButtonSelected } = state;

  const hasAIActions = editor.extensionManager.extensions.some(
    (ext) => ext.name === AI_ACTIONS_PLUGIN_KEY
  );

  return (
    <BubbleMenu
      ref={container}
      floatingId={FLOATING_ELEMENT_IDS.TEXT_BUBBLE_MENU}
    >
      {!isButtonSelected && hasAIActions && (
        <>
          <AIActionsDropdown container={container} />

          <Divider />
        </>
      )}

      {!isButtonSelected && (
        <>
          <TurnIntoBlock items={turnIntoBlockItems} container={container} />

          <Divider />
        </>
      )}

      {actions.map((action) => (
        <BubbleButton
          key={action.label}
          label={action.label}
          icon={action.icon}
          tooltip={action.tooltip}
          container={container}
          isActive={action.isActive}
          onClick={action.command}
        />
      ))}

      {!isButtonSelected && (
        <ToggleAlignPopover
          container={container}
          align={state.align}
          onAlignChange={handleAlignChange}
        />
      )}

      {!isButtonSelected && (
        <>
          <Divider />

          <LinkPopover
            container={container}
            url={state.linkHref}
            onUrlChange={handleUrlChange}
          />

          <ColorSwatchPopover
            container={container}
            color={state.backgroundColor}
            onColorChange={handleBackgroundColorChange}
            items={backgroundColorSwatch}
            renderTrigger={(props, renderState) => (
              <ColorTrigger
                group="background"
                backgroundColor={state.backgroundColor}
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
            color={state.textColor}
            onColorChange={handleTextColorChange}
            items={textColorSwatch}
            renderTrigger={(props, renderState) => (
              <ColorTrigger
                group="text"
                textColor={state.textColor}
                active={renderState.open}
                label="Text Color"
                tooltip="Text Color"
                container={container}
                {...props}
              />
            )}
          />
        </>
      )}
    </BubbleMenu>
  );
}
