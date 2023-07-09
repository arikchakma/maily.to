"use client";

import { Editor, MailEditor } from "@/components/editor";
import { useState } from "react";
import { IFrame } from "@/app/iframe";

export default function Home() {
  const [mailEditor, setMailEditor] = useState<MailEditor>();
  const [emailHtml, setEmailHtml] = useState("");
  const defaultContent = [
    {
      type: "logo",
      attrs: {
        src: "https://roadmap.sh/images/brand.png",
        alt: null,
        title: null,
        "mailbox-component": "logo",
        size: "sm",
        alignment: "left",
      },
    },
    {
      type: "spacer",
      attrs: {
        "mailbox-component": "spacer",
        height: "xl",
      },
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Hey ",
        },
        {
          type: "variable",
          attrs: {
            id: "username",
            label: null,
          },
        },
        {
          type: "text",
          text: ",",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Thank you so much for joining the waitlist. We are excited to welcome you to the [product name] community.",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Stay tuned. And we're just an email away if you have any questions. We'd be more than happy to answer your questions.",
        },
      ],
    },
    {
      type: "spacer",
      attrs: {
        "mailbox-component": "spacer",
        height: "xl",
      },
    },
    {
      type: "paragraph",
      attrs: {
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Cheers,",
        },
        {
          type: "hardBreak",
        },
        {
          type: "text",
          text: "James, ",
        },
        {
          type: "text",
          marks: [
            {
              type: "italic",
            },
          ],
          text: "creator of [product name]",
        },
      ],
    },
    {
      type: "horizontalRule",
    },
    {
      type: "footer",
      attrs: {
        "mailbox-component": "footer",
      },
      content: [
        {
          type: "text",
          text: "You are receiving this email because you joined the waitlist for [product name].",
        },
      ],
    },
    {
      type: "footer",
      attrs: {
        "mailbox-component": "footer",
      },
      content: [
        {
          type: "text",
          text: "© 2023 [Product name]",
        },
        {
          type: "hardBreak",
        },
        {
          type: "text",
          text: "[address]",
        },
      ],
    },
    {
      type: "footer",
      attrs: {
        "mailbox-component": "footer",
      },
      content: [
        {
          type: "text",
          text: "Unsubscribe from emails",
        },
      ],
    },
  ];

  return (
    <div className="p-10 bg-white opacity-100 bg-[radial-gradient(#000000_0.65px,transparent_0.65px),radial-gradient(#000000_0.65px,#ffffff_0.65px)] [background-size:26px_26px] [background-position:0_0,13px_13px] min-h-screen">
      <div className="grid grid-cols-2 gap-4 items-stretch">
        <div className="">
          <Editor
            config={{
              hasMenuBar: true,
              wrapClassName: "editor-wrap",
              contentClassName: "editor-content",
              toolbarClassName: "editor-toolbar",
              spellCheck: false,
            }}
            onMount={(editor) => {
              setMailEditor(editor);
            }}
            contentJson={defaultContent}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                console.log(mailEditor?.getEmailHtml());
              }}
              className="w-full block p-2 text-white rounded-md bg-black mt-2"
            >
              Get HTML
            </button>
            <button
              onClick={() => {
                setEmailHtml(mailEditor?.getEmailHtml()!);
              }}
              className="w-full block p-2 text-black border-2 border-black rounded-md bg-white mt-2"
            >
              Preview HTML
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="h-[46px] flex items-center mb-4 bg-white">
            <span className="font-semibold text-xl">&nbsp;</span>
          </div>
          <div className="flex-1 border rounded-md p-4 bg-white">
            {!emailHtml && (
              <div className="flex items-center justify-center h-full">
                <span className="font-semibold text-4xl text-gray-400">Preview HTML</span>
              </div>
            )}
            {emailHtml && (
              <IFrame className="w-full h-full" innerHTML={emailHtml} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
