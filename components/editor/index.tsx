"use client";

import React from "react";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { EditorBubbleMenu } from "./components/editor-bubble-menu";
import { TiptapExtensions } from "./extensions";
import { LogoBubbleMenu } from "./components/logo-bubble-menu";
import { EditorMenuBar } from "./components/editor-menu-bar";
import { SpacerBubbleMenu } from "./components/spacer-bubble-menu";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";

import "./editor.css";
const inter = Inter({ subsets: ["latin"] });

type EditorProps = {
  editorClassName?: string;
  contentHtml?: string;
  contentJson?: JSONContent[];
};

export function Editor(props: EditorProps) {
  const { contentHtml, contentJson } = props;

  let formattedContent: any = null;
  if (contentJson) {
    formattedContent = {
      type: "doc",
      content: contentJson,
    };
  } else if (contentHtml) {
    formattedContent = contentHtml;
  } else {
    formattedContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "",
            },
          ],
        },
      ],
    };
  }

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `prose ${props.editorClassName}`,
        spellCheck: "false",
      },
      handleDOMEvents: {
        keydown: (_view, event) => {
          // prevent default event listeners from firing when slash command is active
          if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
            const slashCommand = document.querySelector("#slash-command");
            if (slashCommand) {
              return true;
            }
          }
        },
      },
    },
    extensions: TiptapExtensions,
    content: formattedContent,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={`max-w-[600px] mx-auto antialiased ${inter.className}`}>
      <Toaster />

      <EditorMenuBar editor={editor} />
      <div className="p-4 rounded border bg-white mt-4">
        <EditorBubbleMenu editor={editor} />
        <LogoBubbleMenu editor={editor} />
        <SpacerBubbleMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
