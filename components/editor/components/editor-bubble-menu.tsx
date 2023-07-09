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
  LinkIcon,
} from "lucide-react";
import { BubbleMenuButton } from "./bubble-menu-button";

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon?: typeof BoldIcon;
}

export type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

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
      isActive: () => props.editor.isActive({ textAlign: "left" }),
      command: () => {
        if (props.editor.isActive({ textAlign: "left" })) {
          props.editor.chain().focus().unsetTextAlign().run();
        } else {
          props.editor.chain().focus().setTextAlign("left").run();
        }
      },
      icon: AlignLeftIcon,
    },
    {
      name: "center",
      isActive: () => props.editor.isActive({ textAlign: "center" }),
      command: () => {
        if (props.editor.isActive({ textAlign: "center" })) {
          props.editor.chain().focus().unsetTextAlign().run();
        } else {
          props.editor.chain().focus().setTextAlign("center").run();
        }
      },
      icon: AlignCenterIcon,
    },
    {
      name: "right",
      isActive: () => props.editor.isActive({ textAlign: "right" }),
      command: () => {
        if (props.editor.isActive({ textAlign: "right" })) {
          props.editor.chain().focus().unsetTextAlign().run();
        } else {
          props.editor.chain().focus().setTextAlign("right").run();
        }
      },
      icon: AlignRightIcon,
    },
    {
      name: "link",
      command: () => {
        const previousUrl = props.editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // If the user cancels the prompt, we don't want to toggle the link
        if (url === null) {
          return;
        }

        // If the user deletes the URL entirely, we'll unlink the selected text
        if (url === "") {
          props.editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .unsetLink()
            .run();

          return;
        }

        // Otherwise, we set the link to the given URL
        props.editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      },
      isActive: () => props.editor.isActive("link"),
      icon: LinkIcon,
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor, view, state, oldState, from, to }) => {
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
        editor.isActive("image") ||
        editor.isActive("logo") ||
        editor.isActive("spacer")
      ) {
        return false;
      }

      return true;
    },
    tippyOptions: {
      moveTransition: "transform 0.15s ease-out",
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
