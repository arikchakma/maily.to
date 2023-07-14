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
    <div className="mx-auto my-[40px] max-w-[600px]">
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
        contentHtml={`
          <p>Hey <a data-mailbox-component="variable" id="username" label="Username">Username</a>,</p>
          <a data-mailbox-component="button" count="0"></a>
          `}
      />
    </div>
  );
}
