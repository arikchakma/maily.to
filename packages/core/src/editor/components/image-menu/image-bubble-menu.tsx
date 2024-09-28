import { BubbleMenu } from '@tiptap/react';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowUpRight,
  Link,
  Unlink,
} from 'lucide-react';
import {
  BubbleMenuItem,
  EditorBubbleMenuProps,
} from '../text-menu/text-bubble-menu';
import { allowedLogoAlignment, allowedLogoSize } from '@/editor/nodes/logo';
import { BubbleMenuButton } from '../bubble-menu-button';
import { ImageSize } from './image-size';
import { Divider } from '../ui/divider';
import { useImageState } from './use-image-state';

export function ImageBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;
  if (!editor) {
    return null;
  }

  const icons = [AlignLeftIcon, AlignCenterIcon, AlignRightIcon];

  const alignmentItems: BubbleMenuItem[] = allowedLogoAlignment.map(
    (alignment, index) => ({
      name: alignment,
      isActive: () =>
        editor?.isActive('logo', { alignment })! ||
        editor?.isActive('image', { alignment })!,
      shouldShow: () => editor?.isActive('logo')! || editor?.isActive('image')!,
      command: () => {
        const isCurrentNodeLogo = editor?.isActive('logo')!;
        if (isCurrentNodeLogo) {
          props?.editor?.chain().focus().setLogoAttributes({ alignment }).run();
        } else {
          props?.editor
            ?.chain()
            .focus()
            .updateAttributes('image', { alignment })
            .run();
        }
      },
      icon: icons[index],
    })
  );

  const sizeItems: BubbleMenuItem[] = allowedLogoSize.map((size) => ({
    name: size,
    isActive: () => props?.editor?.isActive('logo', { size })!,
    shouldShow: () => editor?.isActive('logo')!,
    command: () => {
      props?.editor?.chain().focus().setLogoAttributes({ size }).run();
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

        // Remove the current logo
        // and insert a new one
        const selection = editor?.state.selection;
        editor?.commands.setImage({
          src: url,
        });
        editor?.commands.setNodeSelection(selection?.from || 0);
      },
      icon: Unlink,
    },
    {
      name: 'image-external-url',
      isActive: () => false,
      shouldShow: () => editor?.isActive('image')!,
      command: () => {
        const { editor } = props;
        // const currentUrl = editor?.getAttributes('image')?.ex
        const externalLink = editor?.getAttributes('image')?.externalLink;

        const url = window.prompt(
          'Update Image External URL',
          externalLink || ''
        );

        editor?.commands.updateAttributes('image', { externalLink: url || '' });
      },
      icon: ArrowUpRight,
    },

    ...sizeItems,
  ];

  const state = useImageState(editor);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      return editor.isActive('logo') || editor.isActive('image');
    },
    tippyOptions: {
      maxWidth: '100%',
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

      <Divider />
      <ImageSize
        dimension="width"
        value={state?.width ?? 0}
        onValueChange={(value) => {
          editor?.chain().updateAttributes('image', { width: value }).run();
        }}
      />
      <Divider />
      <ImageSize
        dimension="height"
        value={state?.height ?? 0}
        onValueChange={(value) => {
          editor?.chain().updateAttributes('image', { height: value }).run();
        }}
      />
    </BubbleMenu>
  );
}
