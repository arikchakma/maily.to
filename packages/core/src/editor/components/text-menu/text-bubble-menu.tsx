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
import { allowedLogoAlignment } from '../../nodes/logo';
import { BubbleMenuButton } from '../bubble-menu-button';
import { ColorPicker } from '../ui/color-picker';
import { BaseButton } from '../base-button';
import { useTextMenuState } from './use-text-menu-state';
import { isCustomNodeSelected } from '@/editor/utils/is-custom-node-selected';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { TooltipProvider } from '../ui/tooltip';

export interface BubbleMenuItem {
  name?: string;
  isActive?: () => boolean;
  command?: () => void;
  shouldShow?: () => boolean;
  icon?: LucideIcon;
  className?: string;
  iconClassName?: string;
  nameClassName?: string;
  disbabled?: boolean;

  tooltip?: string;
}

export type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'> & {
  appendTo?: React.RefObject<any>;
};

export function TextBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;

  if (!editor) {
    return null;
  }

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
      tooltip: alignment.charAt(0).toUpperCase() + alignment.slice(1),
    })
  );

  const items: BubbleMenuItem[] = [
    {
      name: 'bold',
      isActive: () => editor?.isActive('bold')!,
      command: () => editor?.chain().focus().toggleBold().run()!,
      icon: BoldIcon,
      tooltip: 'Bold',
    },
    {
      name: 'italic',
      isActive: () => editor?.isActive('italic')!,
      command: () => editor?.chain().focus().toggleItalic().run()!,
      icon: ItalicIcon,
      tooltip: 'Italic',
    },
    {
      name: 'underline',
      isActive: () => editor?.isActive('underline')!,
      command: () => editor?.chain().focus().toggleUnderline().run()!,
      icon: UnderlineIcon,
      tooltip: 'Underline',
    },
    {
      name: 'strike',
      isActive: () => editor?.isActive('strike')!,
      command: () => editor?.chain().focus().toggleStrike().run()!,
      icon: StrikethroughIcon,
      tooltip: 'Strikethrough',
    },
    ...alignmentItems,
    {
      name: 'code',
      isActive: () => editor?.isActive('code')!,
      command: () => editor?.chain().focus().toggleCode().run()!,
      icon: CodeIcon,
      tooltip: 'Code',
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
      tooltip: 'Link',
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    pluginKey: 'textMenu',
    shouldShow: ({ editor, state, from, to, view }) => {
      if (!view || editor.view.dragging) {
        return false;
      }

      const domAtPos = view.domAtPos(from || 0).node as HTMLElement;
      const nodeDOM = view.nodeDOM(from || 0) as HTMLElement;
      const node = nodeDOM || domAtPos;

      if (isCustomNodeSelected(editor, node)) {
        return false;
      }

      return isTextSelected(editor);
    },
    tippyOptions: {
      popperOptions: {
        placement: 'top-start',
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
              padding: 8,
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end'],
            },
          },
        ],
      },
      maxWidth: '100%',
    },
  };

  const state = useTextMenuState(editor);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-gap-1 mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-1 mly-shadow-md"
    >
      <TooltipProvider>
        {items.map((item, index) => (
          <BubbleMenuButton
            key={index}
            className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
            iconClassName="mly-w-3 mly-h-3"
            {...item}
          />
        ))}
        <ColorPicker
          color={state.currentTextColor}
          onColorChange={(color) => {
            editor?.chain().setColor(color).run();
          }}
          tooltip="Text Color"
        >
          <BaseButton
            variant="ghost"
            size="sm"
            type="button"
            className="!mly-h-7 mly-w-7 mly-shrink-0 mly-p-0"
          >
            <div className="mly-flex mly-flex-col mly-items-center mly-justify-center mly-gap-[1px]">
              <span className="mly-font-bolder mly-font-mono mly-text-xs mly-text-slate-700">
                A
              </span>
              <div
                className="mly-h-[2px] mly-w-3"
                style={{ backgroundColor: state.currentTextColor }}
              />
            </div>
          </BaseButton>
        </ColorPicker>
      </TooltipProvider>
    </BubbleMenu>
  );
}
