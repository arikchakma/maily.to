"use client";

import React, { useEffect } from "react";
import {
  EditorContent,
  JSONContent,
  useEditor,
  Editor as TipTapEditor,
} from "@tiptap/react";
import { EditorBubbleMenu } from "./components/editor-bubble-menu";
import { TiptapExtensions } from "./extensions";
import { LogoBubbleMenu } from "./components/logo-bubble-menu";
import { EditorMenuBar } from "./components/editor-menu-bar";
import { SpacerBubbleMenu } from "./components/spacer-bubble-menu";
import { Toaster } from "@/components/editor/components/toaster";
import { Inter } from "next/font/google";

import "./editor.css";
import { tiptapToHtml } from "@/components/editor/utils/email";
const inter = Inter({
  subsets: ["latin"],
});

export type MailEditor = {
  getEmailHtml: () => string;
  getJSON: () => JSONContent[];
  getEditor: () => TipTapEditor;
};

export type EditorProps = {
  contentHtml?: string;
  contentJson?: JSONContent[];
  onMount?: (editor: MailEditor) => void;
  config?: {
    hasMenuBar?: boolean;
    spellCheck?: boolean;
    wrapClassName?: string;
    toolbarClassName?: string;
    contentClassName?: string;
  };
};

export function Editor(props: EditorProps) {
  const {
    onMount,
    config: {
      wrapClassName = "",
      contentClassName = "",
      hasMenuBar = true,
      spellCheck = false,
    } = {},
    contentHtml,
    contentJson,
  } = props;

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
        class: `prose w-full ${contentClassName}`,
        spellCheck: spellCheck ? "true" : "false",
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

  useEffect(() => {
    if (!editor || !onMount) {
      return;
    }

    const editorJson = editor.getJSON();

    onMount?.({
      getJSON: () => editorJson.content || [],
      getEmailHtml: () => tiptapToHtml(editorJson.content || []),
      getEditor: () => editor,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={`mail-editor antialiased ${inter.className} ${wrapClassName}`}
    >
      <Toaster />

      {hasMenuBar && <EditorMenuBar config={props.config} editor={editor} />}
      <div className="p-4 rounded border bg-white mt-4">
        <EditorBubbleMenu editor={editor} />
        <LogoBubbleMenu editor={editor} />
        <SpacerBubbleMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
