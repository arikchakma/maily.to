'use client';

import { useState } from 'react';

import { Editor, MailEditor } from '@/components/editor';
import { IFrame } from '@/app/iframe';

export default function Home() {
  const [mailEditor, setMailEditor] = useState<MailEditor>();
  const [emailHtml, setEmailHtml] = useState('');
  const defaultContent = [
    {
      type: 'logo',
      attrs: {
        src: 'https://roadmap.sh/images/brand.png',
        alt: null,
        title: null,
        'mailbox-component': 'logo',
        size: 'sm',
        alignment: 'left',
      },
    },
    {
      type: 'spacer',
      attrs: {
        'mailbox-component': 'spacer',
        height: 'xl',
      },
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Hey ',
        },
        {
          type: 'variable',
          attrs: {
            id: 'username',
            label: null,
          },
        },
        {
          type: 'text',
          text: ',',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Thank you so much for joining the waitlist. We are excited to welcome you to the [product name] community.',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
      },
      content: [
        {
          type: 'text',
          text: "Stay tuned. And we're just an email away if you have any questions. We'd be more than happy to answer your questions.",
        },
      ],
    },
    {
      type: 'spacer',
      attrs: {
        'mailbox-component': 'spacer',
        height: 'xl',
      },
    },
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Cheers,',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: 'James, ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'italic',
            },
          ],
          text: 'creator of [product name]',
        },
      ],
    },
    {
      type: 'horizontalRule',
    },
    {
      type: 'footer',
      attrs: {
        'mailbox-component': 'footer',
      },
      content: [
        {
          type: 'text',
          text: 'You are receiving this email because you joined the waitlist for [product name].',
        },
      ],
    },
    {
      type: 'footer',
      attrs: {
        'mailbox-component': 'footer',
      },
      content: [
        {
          type: 'text',
          text: '© 2023 [Product name]',
        },
        {
          type: 'hardBreak',
        },
        {
          type: 'text',
          text: '[address]',
        },
      ],
    },
    {
      type: 'footer',
      attrs: {
        'mailbox-component': 'footer',
      },
      content: [
        {
          type: 'text',
          text: 'Unsubscribe from emails',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white bg-[radial-gradient(#000000_0.65px,transparent_0.65px),radial-gradient(#000000_0.65px,#ffffff_0.65px)] p-10 opacity-100 [background-position:0_0,13px_13px] [background-size:26px_26px]">
      <div className="grid grid-cols-2 items-stretch gap-4">
        <div className="">
          <Editor
            config={{
              hasMenuBar: true,
              wrapClassName: 'editor-wrap',
              contentClassName: 'editor-content',
              toolbarClassName: 'editor-toolbar',
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
              className="mt-2 block w-full rounded-md bg-black p-2 text-white"
            >
              Get HTML
            </button>
            <button
              onClick={() => {
                setEmailHtml(mailEditor?.getEmailHtml()!);
              }}
              className="mt-2 block w-full rounded-md border-2 border-black bg-white p-2 text-black"
            >
              Preview HTML
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mb-4 flex h-[46px] items-center bg-white">
            <span className="text-xl font-semibold">&nbsp;</span>
          </div>
          <div className="flex-1 rounded-md border bg-white p-4">
            {!emailHtml && (
              <div className="flex h-full items-center justify-center">
                <span className="text-4xl font-semibold text-gray-400">
                  Preview HTML
                </span>
              </div>
            )}
            {emailHtml && (
              <IFrame className="h-full w-full" innerHTML={emailHtml} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
