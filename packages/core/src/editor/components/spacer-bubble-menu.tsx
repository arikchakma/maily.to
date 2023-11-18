import { FC } from 'react';
import { BubbleMenu } from '@tiptap/react';
import { Editor } from '@tiptap/core';

import { BubbleMenuButton } from './bubble-menu-button';
import { BubbleMenuItem, EditorBubbleMenuProps } from './editor-bubble-menu';
import { SpacerOptions } from '../nodes/spacer';

function createSpacerCommand(
  editor: Editor | undefined,
  height: SpacerOptions['height']
): () => void {
  return () => {
    editor?.chain().focus().setSpacer({ height }).run();
  };
}

function createSpacerIsActive(
  editor: Editor | undefined,
  height: string
): () => boolean {
  return () => {
    return editor?.isActive('spacer', { height })!;
  };
}

export const SpacerBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const { editor } = props;
  const heights = ['sm', 'md', 'lg', 'xl'];

  const items: BubbleMenuItem[] = heights.map((height) => ({
    name: height,
    isActive: createSpacerIsActive(editor, height),
    command: createSpacerCommand(editor, height as SpacerOptions['height']),
  }));

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => editor.isActive('spacer'),
    tippyOptions: {
      moveTransition: 'transform 0.15s ease-out',
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="flex gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-md"
    >
      {items.map((item, index) => (
        <BubbleMenuButton key={index} {...item} />
      ))}
    </BubbleMenu>
  );
};
