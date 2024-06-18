import { BubbleMenu, BubbleMenuProps, isTextSelection } from '@tiptap/react';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  LucideIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { allowedLogoAlignment } from '../nodes/logo';
import { BubbleMenuButton } from './bubble-menu-button';

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  shouldShow?: () => boolean;
  icon?: LucideIcon;
}

export type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'>;

export function EditorBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor } = props;

  const icons = [AlignLeftIcon, AlignCenterIcon, AlignRightIcon];
  const alignmentItems: BubbleMenuItem[] = allowedLogoAlignment.map(
    (alignment, index) => ({
      name: alignment,
      isActive: () => editor?.isActive({ textAlign: alignment })!,
      command: () => {
        if (props?.editor?.isActive({ textAlign: alignment })) {
          props?.editor?.chain()?.focus().unsetTextAlign().run();
        } else {
          props?.editor?.chain().focus().setTextAlign(alignment).run()!;
        }
      },
      icon: icons[index],
    })
  );

  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => editor?.isActive('bold')!,
      command: () => editor?.chain().focus().toggleBold().run()!,
      icon: BoldIcon,
    },
    {
      name: 'italic',
      isActive: () => editor?.isActive('italic')!,
      command: () => editor?.chain().focus().toggleItalic().run()!,
      icon: ItalicIcon,
    },
    {
      name: 'underline',
      isActive: () => editor?.isActive('underline')!,
      command: () => editor?.chain().focus().toggleUnderline().run()!,
      icon: UnderlineIcon,
    },
    {
      name: 'strike',
      isActive: () => editor?.isActive('strike')!,
      command: () => editor?.chain().focus().toggleStrike().run()!,
      icon: StrikethroughIcon,
    },
    ...alignmentItems,
    {
      name: 'code',
      isActive: () => editor?.isActive('code')!,
      command: () => editor?.chain().focus().toggleCode().run()!,
      icon: CodeIcon,
    },
    {
      name: 'link',
      command: () => {
        const previousUrl = editor?.getAttributes('link').href!;
        const url = window.prompt('URL', previousUrl);

        // If the user cancels the prompt, we don't want to toggle the link
        if (url === null) {
          return;
        }

        // If the user deletes the URL entirely, we'll unlink the selected text
        if (url === '') {
          editor?.chain().focus().extendMarkRange('link').unsetLink().run();

          return;
        }

        // Otherwise, we set the link to the given URL
        editor
          ?.chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .run()!;
      },
      isActive: () => editor?.isActive('link')!,
      icon: LinkIcon,
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor, state, from, to }) => {
      const { doc, selection } = state;
      const { empty } = selection;

      // Sometime check for `empty` is not enough.
      // Doubleclick an empty paragraph returns a node size of 2.
      // So we check also for an empty text size.
      const isEmptyTextBlock =
        !doc.textBetween(from, to).length && isTextSelection(state.selection);

      if (
        empty ||
        isEmptyTextBlock ||
        !editor.isEditable ||
        editor.isActive('image') ||
        editor.isActive('logo') ||
        editor.isActive('spacer') ||
        editor.isActive('variable') ||
        editor.isActive({
          mailyComponent: 'button',
        }) ||
        editor.isActive({
          mailyComponent: 'linkCard',
        })
      ) {
        return false;
      }

      return true;
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
      {items.map((item, index) => (
        <BubbleMenuButton key={index} {...item} />
      ))}
    </BubbleMenu>
  );
}
