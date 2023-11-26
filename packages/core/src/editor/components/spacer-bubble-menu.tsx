import { BubbleMenu } from '@tiptap/react';

import { BubbleMenuButton } from './bubble-menu-button';
import { BubbleMenuItem, EditorBubbleMenuProps } from './editor-bubble-menu';
import { AllowedSpacerSize, allowedSpacerSize } from '../nodes/spacer';

export function SpacerBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor } = props;

  const heights: AllowedSpacerSize[] = [...allowedSpacerSize];
  const items: BubbleMenuItem[] = heights.map((height) => ({
    name: height,
    isActive: () => editor?.isActive('spacer', { height })!,
    command: () => {
      editor?.chain().focus().setSpacer({ height }).run();
    },
  }));

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => editor.isActive('spacer'),
    tippyOptions: {
      moveTransition: 'mly-transform 0.15s mly-ease-out',
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-gap-1 mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-1 mly-shadow-md"
    >
      {items.map((item, index) => (
        <BubbleMenuButton key={index} {...item} />
      ))}
    </BubbleMenu>
  );
}
