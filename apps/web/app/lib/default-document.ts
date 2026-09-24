import type { DocumentNode } from '@maily-to/shared';

export const DEFAULT_DOCUMENT: DocumentNode = {
  type: 'doc',
  attrs: { version: 2 },
  content: [
    {
      type: 'body',
      attrs: {
        style:
          'background-color:#ffffff;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
      },
      content: [
        {
          type: 'container',
          attrs: {
            style: 'max-width:600px;padding:48px 8px',
          },
          content: [
            {
              type: 'image',
              attrs: {
                align: 'left',
                alt: 'Maily',
                src: '/brand/logo.png',
                width: '40px',
              },
            },
            { type: 'spacer', attrs: { height: 40 } },
            {
              type: 'heading',
              attrs: {
                level: 2,
                style:
                  'color:#121110;font-size:30px;font-weight:600;letter-spacing:-0.6px;line-height:36px;margin:0 0 16px',
              },
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'bold' }],
                  text: 'Discover Maily',
                },
              ],
            },
            {
              type: 'paragraph',
              attrs: {
                style:
                  'color:#3f3f46;font-size:16px;line-height:26px;margin:0 0 16px',
              },
              content: [
                {
                  type: 'text',
                  text: 'Are you ready to transform your email communication? Maily is the email editor that helps you craft beautiful, responsive emails without fighting tables.',
                },
              ],
            },
            {
              type: 'paragraph',
              attrs: {
                style:
                  'color:#3f3f46;font-size:16px;line-height:26px;margin:0 0 28px',
              },
              content: [
                {
                  type: 'text',
                  text: 'Elevate your email communication with Maily. Click below to try it out:',
                },
              ],
            },
            {
              type: 'button',
              attrs: {
                align: 'left',
                kind: 'tight',
                style:
                  'background-color:#121110;border-radius:9999px;color:#ffffff;font-size:15px;font-weight:500;line-height:22px;padding:13px 24px',
                url: 'https://maily.to',
              },
              content: [{ type: 'text', text: 'Try Maily now →' }],
            },
            {
              type: 'horizontalRule',
              attrs: {
                style:
                  'border:none;border-top:1px solid #e7e5e4;margin:40px 0 32px',
              },
            },
            {
              type: 'paragraph',
              attrs: {
                style:
                  'color:#3f3f46;font-size:16px;line-height:26px;margin:0 0 24px',
              },
              content: [
                {
                  type: 'text',
                  text: 'Join our community of users and developers on GitHub, where Maily is an ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: 'https://github.com/arikchakma/maily.to',
                        rel: 'noopener noreferrer nofollow',
                        target: '_blank',
                        style: 'color:#121110',
                      },
                    },
                  ],
                  text: 'open-source',
                },
                {
                  type: 'text',
                  text: ' project. Together, we’ll shape the future of email editing.',
                },
              ],
            },
            {
              type: 'paragraph',
              attrs: {
                style: 'color:#121110;font-size:16px;line-height:26px;margin:0',
              },
              content: [
                { type: 'text', text: 'Regards,' },
                { type: 'hardBreak' },
                { type: 'text', text: 'Arikko' },
              ],
            },
            { type: 'spacer', attrs: { height: 40 } },
            {
              type: 'paragraph',
              attrs: {
                style: 'color:#71717a;font-size:13px;line-height:20px;margin:0',
              },
              content: [
                { type: 'text', text: 'maily.to · Open-source email editor' },
              ],
            },
            {
              type: 'paragraph',
              attrs: {
                style: 'color:#71717a;font-size:13px;line-height:20px;margin:0',
              },
              content: [
                {
                  type: 'text',
                  text: 'You received this email because you signed up. ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'link',
                      attrs: {
                        href: 'https://maily.to',
                        style: 'color:#71717a',
                      },
                    },
                  ],
                  text: 'Unsubscribe',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
