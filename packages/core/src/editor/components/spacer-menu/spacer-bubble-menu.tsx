import { BubbleMenu } from '@tiptap/react';

import { BubbleMenuButton } from '../bubble-menu-button';
import { allowedSpacerSize } from '../../nodes/spacer';
import {
  BubbleMenuItem,
  EditorBubbleMenuProps,
} from '../text-menu/text-bubble-menu';
import { Divider } from '../ui/divider';
import { useSpacerState } from './use-spacer-state';
import { ShowPopover } from '../show-popover';
import { TooltipProvider } from '../ui/tooltip';

export function SpacerBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;
  if (!editor) {
    return null;
  }

  const items: BubbleMenuItem[] = allowedSpacerSize.map((height) => ({
    name: height,
    isActive: () => editor?.isActive('spacer', { height })!,
    command: () => {
      editor?.chain().focus().setSpacer({ height }).run();
    },
  }));

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      if (!editor.isEditable) {
        return false;
      }

      return editor.isActive('spacer');
    },
    tippyOptions: {
      maxWidth: '100%',
      moveTransition: 'mly-transform 0.15s mly-ease-out',
    },
  };

  const state = useSpacerState(editor);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-gap-0.5 mly-rounded-lg mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        {items.map((item, index) => (
          <BubbleMenuButton
            key={index}
            className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
            iconClassName="mly-w-3 mly-h-3"
            nameClassName="mly-text-xs"
            {...item}
          />
        ))}
        <Divider />
        <ShowPopover
          showIfKey={state.currentShowIfKey}
          onShowIfKeyValueChange={(value) => {
            editor.commands.setSpacerShowIfKey(value);
          }}
          editor={editor}
        />
      </TooltipProvider>
    </BubbleMenu>
  );
}
