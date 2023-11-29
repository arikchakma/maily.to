import { BubbleMenu } from '@tiptap/react';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Link,
} from 'lucide-react';

import { BubbleMenuButton } from './bubble-menu-button';
import { BubbleMenuItem, EditorBubbleMenuProps } from './editor-bubble-menu';
import { allowedLogoAlignment, allowedLogoSize } from '../nodes/logo';

export function LogoBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor } = props;

  const icons = [AlignLeftIcon, AlignCenterIcon, AlignRightIcon];

  const alignmentItems: BubbleMenuItem[] = allowedLogoAlignment.map(
    (alignment, index) => ({
      name: alignment,
      isActive: () => editor?.isActive('logo', { alignment })!,
      command: () => {
        editor?.chain().focus().setLogoAttributes({ alignment }).run();
      },
      icon: icons[index],
    })
  );

  const sizeItems: BubbleMenuItem[] = allowedLogoSize.map((size) => ({
    name: size,
    isActive: () => props?.editor?.isActive('logo', { size })!,
    command: () => {
      props?.editor?.chain().focus().setLogoAttributes({ size }).run();
    },
  }));

  const items: BubbleMenuItem[] = [
    ...alignmentItems,
    {
      name: 'url',
      isActive: () => false,
      command: () => {
        const { editor } = props;
        const currentUrl = editor?.getAttributes('logo')?.src;
        const url = window.prompt('Update logo URL', currentUrl);
        if (!url) {
          return;
        }

        const size = editor?.getAttributes('logo')?.size;
        const alignment = editor?.getAttributes('logo')?.alignment;

        // Remove the current logo
        // and insert a new one
        const selection = editor?.state.selection;
        editor?.commands.setLogoImage({
          src: url,
          size: size,
          alignment: alignment,
        });
        editor?.commands.setNodeSelection(selection?.from || 0);
      },
      icon: Link,
    },
    ...sizeItems,
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      if (!editor.isActive('logo')) {
        return false;
      }

      return true;
    },
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
