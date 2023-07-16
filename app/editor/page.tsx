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
    <img src="https://roadmap.sh/images/brand.png" data-mailbox-component="logo" data-size="sm" data-alignment="left" style="position:relative;margin-top:0;height:48px;margin-right:auto;margin-left:0"><div data-mailbox-component="spacer" data-height="xl" style="width: 100%; height: 64px;" class="spacer" contenteditable="false"></div><h3>Forgot your password?</h3><p>Use the link below to set a new password for your account. You can safely ignore this email if you did not request to reset your password.</p><a data-mailbox-component="button" mailboxcomponent="button" text="Set new password →" url="" alignment="left" variant="filled" borderradius="round" buttoncolor="#141313" textcolor="#ffffff"></a><p>Just so you know, the link expires in <strong>60 minutes</strong>.</p><p></p><p>If you have any trouble with the button, you can copy and paste the link below into your browser:<br><span data-type="variable" class="py-1 px-2 bg-slate-100 border border-blue-300 rounded-md" data-id="password_reset_link">password_reset_link</span></p><hr><small data-mailbox-component="footer" class="footer">© 2023 roadmap.sh</small>
          `}
      />
    </div>
  );
}
