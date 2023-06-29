import { BubbleMenu, BubbleMenuProps, isTextSelection } from "@tiptap/react";
import { FC } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: typeof BoldIcon;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      isActive: () => props.editor.isActive("bold"),
      command: () => props.editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: () => props.editor.isActive("italic"),
      command: () => props.editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: () => props.editor.isActive("underline"),
      command: () => props.editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: () => props.editor.isActive("strike"),
      command: () => props.editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "left",
      isActive: () => props.editor.isActive({ textAlign: 'left' }),
      command: () => {
        if (props.editor.isActive({ textAlign: 'left' })) {
          props.editor.chain().focus().unsetTextAlign().run()
        } else {
          props.editor.chain().focus().setTextAlign('left').run()
        }
      },
      icon: AlignLeftIcon,
    },
    {
      name: "center",
      isActive: () => props.editor.isActive({ textAlign: 'center' }),
      command: () => {
        if (props.editor.isActive({ textAlign: 'center' })) {
          props.editor.chain().focus().unsetTextAlign().run()
        } else {
          props.editor.chain().focus().setTextAlign('center').run()
        }
      },
      icon: AlignCenterIcon,
    },
    {
      name: "right",
      isActive: () => props.editor.isActive({ textAlign: 'right' }),
      command: () => {
        if (props.editor.isActive({ textAlign: 'right' })) {
          props.editor.chain().focus().unsetTextAlign().run()
        } else {
          props.editor.chain().focus().setTextAlign('right').run()
        }
      },
      icon: AlignRightIcon,
    },

  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor, view, state, oldState, from, to }) => {
      const { doc, selection } = state
      const { empty } = selection

      // Sometime check for `empty` is not enough.
      // Doubleclick an empty paragraph returns a node size of 2.
      // So we check also for an empty text size.
      const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection)

      const hasEditorFocus = view.hasFocus()

      if (!hasEditorFocus || empty || isEmptyTextBlock || !editor.isEditable || editor.isActive("image")) {
        return false
      }

      return true
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className='flex gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-md'
    >
      {items.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={item.command}
          data-state={item.isActive()}
          className={cn('px-2.5')}
        >
          <item.icon
            className={cn("h-3.5 w-3.5")}
          />
        </Button>
      ))}
    </BubbleMenu>
  );
};
