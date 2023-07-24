import { useMemo } from 'react';
import { Editor as EditorType } from '@tiptap/core';
import copy from 'copy-to-clipboard';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  EraserIcon,
  ItalicIcon,
  LinkIcon,
  MailIcon,
  SeparatorHorizontal,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';

import { tiptapToHtml } from '@/components/editor/utils/email';
import { cn } from '@/utils/classname';

import { BubbleMenuButton } from '../editor/components/bubble-menu-button';
import { BubbleMenuItem } from '../editor/components/editor-bubble-menu';
import { useToast } from '../ui/use-toast';

interface EditorMenuItem extends BubbleMenuItem {
  group: 'alignment' | 'image' | 'mark' | 'custom' | 'email';
}

type EditorMenuBarProps = {
  editor: EditorType;
};

export const AppEditorMenuBar = (props: EditorMenuBarProps) => {
  const { editor } = props;

  const { toast } = useToast();
  const items: EditorMenuItem[] = useMemo(
    () => [
      {
        name: 'bold',
        command: () => editor.chain().focus().toggleBold().run(),
        isActive: () => editor.isActive('bold'),
        group: 'mark',
        icon: BoldIcon,
      },
      {
        name: 'italic',
        command: () => editor.chain().focus().toggleItalic().run(),
        isActive: () => editor.isActive('italic'),
        group: 'mark',
        icon: ItalicIcon,
      },
      {
        name: 'underline',
        command: () => editor.chain().focus().toggleUnderline().run(),
        isActive: () => editor.isActive('underline'),
        group: 'mark',
        icon: UnderlineIcon,
      },
      {
        name: 'strike',
        command: () => editor.chain().focus().toggleStrike().run(),
        isActive: () => editor.isActive('strike'),
        group: 'mark',
        icon: StrikethroughIcon,
      },
      {
        name: 'delete-line',
        command: () =>
          editor.chain().focus().selectParentNode().deleteSelection().run(),
        isActive: () => false,
        group: 'mark',
        icon: EraserIcon,
      },
      {
        name: 'divider',
        command: () => editor.chain().focus().setHorizontalRule().run(),
        isActive: () => editor.isActive('horizontalRule'),
        group: 'custom',
        icon: SeparatorHorizontal,
      },
      {
        name: 'link',
        command: () => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('URL', previousUrl);
          // If the user cancels the prompt, we don't want to toggle the link
          if (url === null) return;
          // If the user deletes the URL entirely, we'll unlink the selected text
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }

          // Otherwise, we set the link to the given URL
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
        },
        isActive: () => editor.isActive('link'),
        group: 'custom',
        icon: LinkIcon,
      },
      {
        name: 'left',
        command: () => editor.chain().focus().setTextAlign('left').run(),
        isActive: () => editor.isActive({ textAlign: 'left' }),
        group: 'alignment',
        icon: AlignLeft,
      },
      {
        name: 'center',
        command: () => editor.chain().focus().setTextAlign('center').run(),
        isActive: () => editor.isActive({ textAlign: 'center' }),
        group: 'alignment',
        icon: AlignCenter,
      },
      {
        name: 'right',
        command: () => editor.chain().focus().setTextAlign('right').run(),
        isActive: () => editor.isActive({ textAlign: 'right' }),
        group: 'alignment',
        icon: AlignRight,
      },
      {
        name: 'email',
        command: () => {
          const json = editor.getJSON();
          const html = tiptapToHtml(json.content!);
          copy(html);
          toast({
            title: 'Copied to clipboard',
            description: 'The HTML code has been copied!',
          });
        },
        isActive: () => false,
        group: 'email',
        icon: MailIcon,
      },
    ],
    [editor, toast]
  );

  const groups = useMemo(
    () =>
      items.reduce((acc, item) => {
        if (!acc.includes(item.group)) {
          acc.push(item.group);
        }
        return acc;
      }, [] as string[]),
    [items]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-0.5 overflow-y-auto border-b">
      {groups.map((group, index) => (
        <div
          key={index}
          className={cn('flex items-center gap-0.5 border-l bg-white p-1', {
            'border-l-0': index === 0,
          })}
        >
          {items
            .filter((item) => item.group === group)
            .map((item, index) => (
              <BubbleMenuButton key={index} {...item} />
            ))}
        </div>
      ))}
    </div>
  );
};
