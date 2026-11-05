import { MAILY_MARK_TYPES } from '@maily-to/shared';
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useTextBubbleState } from '~/hooks/use-text-bubble-state';
import { useTurnIntoBlockItems } from '~/hooks/use-turn-into-block-items';
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
import { AIActionsDropdown } from './ai-actions-dropdown';
import { TurnIntoBlock } from './turn-into-block';

const MARKS = [
  {
    activeKey: 'isBold',
    command: 'toggleBold',
    icon: BoldIcon,
    label: 'Bold',
    name: MAILY_MARK_TYPES.BOLD,
  },
  {
    activeKey: 'isItalic',
    command: 'toggleItalic',
    icon: ItalicIcon,
    label: 'Italic',
    name: MAILY_MARK_TYPES.ITALIC,
  },
  {
    activeKey: 'isUnderline',
    command: 'toggleUnderline',
    icon: UnderlineIcon,
    label: 'Underline',
    name: MAILY_MARK_TYPES.UNDERLINE,
  },
  {
    activeKey: 'isStrike',
    command: 'toggleStrike',
    icon: StrikethroughIcon,
    label: 'Strikethrough',
    name: MAILY_MARK_TYPES.STRIKE,
  },
  {
    activeKey: 'isCode',
    command: 'toggleCode',
    icon: CodeIcon,
    label: 'Code',
    name: MAILY_MARK_TYPES.CODE,
  },
] as const;

export function TextBubbleMenu() {
  const editor = useEditorInstance();
  const state = useTextBubbleState(editor);
  const turnIntoBlockItems = useTurnIntoBlockItems(editor);
  const container = useRef<HTMLDivElement>(null);

  const {
    align,
    backgroundColor,
    blockType,
    color,
    isButtonSelected,
    linkHref,
  } = state;

  const hasAIActions = 'runAIAction' in editor.commands;

  const handleLinkChange = (url: string | null) => {
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.TEXT_BUBBLE_MENU}
      ref={container}
    >
      {isButtonSelected || !hasAIActions ? null : (
        <>
          <AIActionsDropdown container={container} />

          <Divider />
        </>
      )}

      {isButtonSelected ? null : (
        <>
          <TurnIntoBlock container={container} items={turnIntoBlockItems} />

          <Divider />
        </>
      )}

      {MARKS.map((mark) => (
        <BubbleButton
          container={container}
          icon={mark.icon}
          isActive={state[mark.activeKey]}
          key={mark.name}
          label={mark.label}
          onClick={() => editor.chain().focus()[mark.command]().run()}
          tooltip={mark.label}
        />
      ))}

      {isButtonSelected ? null : (
        <>
          <ToggleAlignPopover
            align={align}
            container={container}
            onAlignChange={(textAlign) =>
              editor
                .chain()
                .focus()
                .updateNodeStyle(blockType, { textAlign })
                .run()
            }
          />

          <Divider />

          <LinkPopover
            container={container}
            onUrlChange={handleLinkChange}
            url={linkHref}
          />

          <ColorSwatchPopover
            color={backgroundColor}
            container={container}
            items={getBackgroundColorSwatches()}
            onColorChange={(next) =>
              next
                ? editor.chain().focus().setHighlight({ color: next }).run()
                : editor.chain().focus().unsetHighlight().run()
            }
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
            onColorChange={(next) =>
              next
                ? editor.chain().focus().setColor(next).run()
                : editor.chain().focus().unsetColor().run()
            }
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
        </>
      )}
    </BubbleMenu>
  );
}
