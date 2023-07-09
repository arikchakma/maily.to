import { BubbleMenu, BubbleMenuProps, isTextSelection } from "@tiptap/react";
import { FC } from "react";
import { BubbleMenuItem, EditorBubbleMenuProps } from "./editor-bubble-menu";
import { BubbleMenuButton } from "./bubble-menu-button";

export const SpacerBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const items: BubbleMenuItem[] = [
    {
      name: "sm",
      isActive: () => props.editor.isActive("spacer", { height: "sm" }),
      command: () =>
        props.editor.chain().focus().setSpacer({ height: "sm" }).run(),
    },
    {
      name: "md",
      isActive: () => props.editor.isActive("spacer", { height: "md" }),
      command: () =>
        props.editor.chain().focus().setSpacer({ height: "md" }).run(),
    },
    {
      name: "lg",
      isActive: () => props.editor.isActive("spacer", { height: "lg" }),
      command: () =>
        props.editor.chain().focus().setSpacer({ height: "lg" }).run(),
    },
    {
      name: "xl",
      isActive: () => props.editor.isActive("spacer", { height: "xl" }),
      command: () =>
        props.editor.chain().focus().setSpacer({ height: "xl" }).run(),
    },
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      if (!editor.isActive("spacer")) {
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
