import { BubbleMenu } from '@tiptap/react';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Unlink,
  Link,
  ArrowUpRight,
} from 'lucide-react';

import { BubbleMenuButton } from './bubble-menu-button';
import { BubbleMenuItem, EditorBubbleMenuProps } from './editor-bubble-menu';
import { allowedLogoAlignment, allowedLogoSize } from '../nodes/logo';

export function ImageBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor } = props;

  const icons = [AlignLeftIcon, AlignCenterIcon, AlignRightIcon];

  const alignmentItems: BubbleMenuItem[] = allowedLogoAlignment.map(
    (alignment, index) => ({
      name: alignment,
      isActive: () => editor?.isActive('logo', { alignment })!,
      shouldShow: () => editor?.isActive('logo')!,
      command: () => {
        editor?.chain().focus().setLogoAttributes({ alignment }).run();
      },
      icon: icons[index],
    })
  );

  const sizeItems: BubbleMenuItem[] = allowedLogoSize.map((size) => ({
    name: size,
    isActive: () => {
      return (
        editor?.isActive('logo', { size })! ||
        editor?.isActive('social', { size })!
      );
    },
    shouldShow: () => editor?.isActive('logo')! || editor?.isActive('social')!,
    command: () => {
      const activeNode = editor?.isActive('logo') ? 'logo' : 'social';
      return editor
        ?.chain()
        .focus()
        .updateAttributes(activeNode, { size })
        .run();
    },
  }));

  const items: BubbleMenuItem[] = [
    ...alignmentItems,
    {
      name: 'url',
      isActive: () => false,
      shouldShow: () => editor?.isActive('logo')!,
      command: () => {
        const { editor } = props;
        const currentUrl = editor?.getAttributes('logo')?.src;
        const url = window.prompt('Update logo URL', currentUrl);
        if (!url) {
          return;
        }

        const size = editor?.getAttributes('logo')?.size;
        const alignment = editor?.getAttributes('logo')?.alignment;

        const selection = editor?.state.selection;
        editor?.commands.setLogoImage({
          src: url,
          size: size,
          alignment: alignment,
        });
        editor?.commands.setNodeSelection(selection?.from || 0);
      },
      icon: Unlink,
    },
    {
      name: 'image-url',
      isActive: () => false,
      shouldShow: () => editor?.isActive('image')!,
      command: () => {
        const { editor } = props;
        const currentUrl = editor?.getAttributes('image')?.src;
        const url = window.prompt('Update Image URL', currentUrl);
        if (!url) {
          return;
        }

        const selection = editor?.state.selection;
        editor?.commands.setImage({
          src: url,
        });
        editor?.commands.setNodeSelection(selection?.from || 0);
      },
      icon: Unlink,
    },
    {
      name: 'social-url',
      isActive: () => false,
      shouldShow: () => editor?.isActive('social')!,
      command: () => {
        const { editor } = props;
        const currentNode = editor?.getAttributes('social');
        const { src: currUrl, size: currSize } = currentNode || {};

        const iconUrl = window.prompt('Update Icon URL', currUrl);
        if (!iconUrl) {
          return;
        }

        const selection = editor?.state.selection;
        editor?.commands.setSocialLinkImage({
          src: iconUrl,
          size: currSize,
        });
        editor?.commands.setNodeSelection(selection?.from || 0);
      },
      icon: Unlink,
    },
    {
      name: 'social-link',
      isActive: () => false,
      shouldShow: () => editor?.isActive('social')!,
      command: () => {
        const { editor } = props;
        const currentNode = editor?.getAttributes('anchor');
        const { href: currUrl } = currentNode || {};
        const socialLink = window.prompt('Update Social Link', currUrl);
        if (!socialLink) {
          return;
        }

        editor?.chain().focus().setLink({ href: socialLink }).run();
      },
      icon: ArrowUpRight,
    },
    ...sizeItems,
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      return (
        editor.isActive('logo') ||
        editor.isActive('image') ||
        editor.isActive('social')
      );
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
      {items
        .filter((item) => item.shouldShow?.())
        .map((item, index) => {
          return <BubbleMenuButton key={index} {...item} />;
        })}
    </BubbleMenu>
  );
}
