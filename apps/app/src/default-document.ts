import type { DocumentNode } from '@maily-to/shared';

export const DEFAULT_DOCUMENT: DocumentNode = {
  type: 'doc',
  attrs: { version: 2 },
  content: [
    {
      type: 'body',
      attrs: { style: 'background-color:#f9fafb;padding:24px 0' },
      content: [
        {
          type: 'container',
          attrs: {
            style:
              'background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;max-width:600px;padding:16px',
          },
          content: [
            {
              type: 'paragraph',
              attrs: { style: 'margin:0 0 20px' },
              content: [
                {
                  type: 'text',
                  text: 'Edit this paragraph and watch the email output change.',
                },
              ],
            },
            {
              type: 'table',
              attrs: { responsive: true, style: 'width:100%' },
              content: [
                {
                  type: 'tableRow',
                  attrs: { style: 'width:100%' },
                  content: [
                    {
                      type: 'tableCell',
                      attrs: {
                        colspan: 1,
                        colwidth: null,
                        rowspan: 1,
                        style:
                          'background-color:#fff1e8;padding:20px;width:50%',
                      },
                      content: [
                        {
                          type: 'paragraph',
                          attrs: { style: 'color:#9f2d16;margin:0' },
                          content: [{ type: 'text', text: 'Left column' }],
                        },
                      ],
                    },
                    {
                      type: 'tableCell',
                      attrs: {
                        colspan: 1,
                        colwidth: null,
                        rowspan: 1,
                        style:
                          'background-color:#eef2ff;padding:20px;width:50%',
                      },
                      content: [
                        {
                          type: 'paragraph',
                          attrs: { style: 'color:#3730a3;margin:0' },
                          content: [{ type: 'text', text: 'Right column' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
