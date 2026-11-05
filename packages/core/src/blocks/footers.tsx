import {
  MAILY_MARK_TYPES,
  MAILY_NODE_TYPES,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import {
  CopyrightIcon,
  LayoutTemplateIcon,
  RectangleHorizontalIcon,
} from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

const COMPANY_LINK_MARKS = [
  {
    type: MAILY_MARK_TYPES.LINK,
    attrs: {
      href: 'https://maily.to',
      target: '_blank',
      rel: 'noopener noreferrer nofollow',
    },
  },
  { type: MAILY_MARK_TYPES.TEXT_STYLE, attrs: { color: '#64748b' } },
  { type: MAILY_MARK_TYPES.UNDERLINE },
];

const COMPANY_LINK_SEPARATOR = {
  type: MAILY_NODE_TYPES.TEXT,
  marks: [{ type: MAILY_MARK_TYPES.TEXT_STYLE, attrs: { color: '#64748b' } }],
  text: '  |  ',
};

export const footerCopyrightText: SlashCommandItem = {
  title: 'Footer Copyright',
  icon: <CopyrightIcon size={16} />,
  description: 'Copyright text for the footer.',
  searchTerms: ['footer', 'copyright'],
  command: ({ editor, range }) => {
    const currentYear = new Date().getFullYear();

    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: MAILY_NODE_TYPES.PARAGRAPH,
        attrs: { style: 'text-align:center' },
        content: [
          {
            type: MAILY_NODE_TYPES.TEXT,
            marks: [
              {
                type: MAILY_MARK_TYPES.TEXT_STYLE,
                attrs: { color: '#AAAAAA' },
              },
            ],
            text: `Maily © ${currentYear}. All rights reserved.`,
          },
        ],
      })
      .run();
  },
};

export const footerCommunityFeedbackCta: SlashCommandItem = {
  title: 'Footer Community Feedback',
  icon: <RectangleHorizontalIcon size={16} />,
  description: 'Community feedback CTA for the footer.',
  searchTerms: ['footer', 'community', 'feedback', 'cta'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent([
        {
          type: MAILY_NODE_TYPES.IMAGE,
          attrs: {
            src: 'https://maily.to/brand/logo.png',
            width: '8%',
            align: TEXT_ALIGNMENTS.LEFT,
          },
        },
        { type: MAILY_NODE_TYPES.SPACER, attrs: { height: 16 } },
        {
          type: MAILY_NODE_TYPES.FOOTER,
          content: [
            {
              type: MAILY_NODE_TYPES.TEXT,
              text: "Enjoyed this month's update?",
            },
            { type: MAILY_NODE_TYPES.HARD_BREAK },
            {
              type: MAILY_NODE_TYPES.TEXT,
              text: "And, as always, we'd love your feedback – simply reply to the email or reach out via the Discord community!",
            },
          ],
        },
      ])
      .run();
  },
};

export const footerCompanySignature: SlashCommandItem = {
  title: 'Footer Company Signature',
  icon: <LayoutTemplateIcon size={16} />,
  description: 'Company signature for the footer.',
  searchTerms: ['footer', 'company', 'signature'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent([
        { type: MAILY_NODE_TYPES.HORIZONTAL_RULE },
        {
          type: MAILY_NODE_TYPES.IMAGE,
          attrs: {
            src: 'https://maily.to/brand/logo.png',
            width: '8%',
            align: TEXT_ALIGNMENTS.CENTER,
          },
        },
        { type: MAILY_NODE_TYPES.SPACER, attrs: { height: 16 } },
        {
          type: MAILY_NODE_TYPES.HEADING,
          attrs: { level: 3, style: 'text-align:center' },
          content: [{ type: MAILY_NODE_TYPES.TEXT, text: 'Maily' }],
        },
        { type: MAILY_NODE_TYPES.SPACER, attrs: { height: 4 } },
        {
          type: MAILY_NODE_TYPES.FOOTER,
          attrs: { style: 'text-align:center' },
          content: [
            {
              type: MAILY_NODE_TYPES.TEXT,
              text: '1234 Example Street, Example, DE 19801, United States',
            },
            { type: MAILY_NODE_TYPES.HARD_BREAK },
            {
              type: MAILY_NODE_TYPES.TEXT,
              marks: COMPANY_LINK_MARKS,
              text: 'VISIT COMPANY',
            },
            COMPANY_LINK_SEPARATOR,
            {
              type: MAILY_NODE_TYPES.TEXT,
              marks: COMPANY_LINK_MARKS,
              text: 'VISIT OUR BLOG',
            },
            COMPANY_LINK_SEPARATOR,
            {
              type: MAILY_NODE_TYPES.TEXT,
              marks: COMPANY_LINK_MARKS,
              text: 'UNSUBSCRIBE',
            },
          ],
        },
        {
          type: MAILY_NODE_TYPES.PARAGRAPH,
          attrs: { style: 'text-align:center' },
          content: [
            {
              type: MAILY_NODE_TYPES.INLINE_IMAGE,
              attrs: {
                src: 'https://cdn.usemaily.com/images/icons/linkedin.png',
                width: 20,
                height: 20,
                externalLink: 'https://www.linkedin.com/in/arikchakma/',
              },
            },
            { type: MAILY_NODE_TYPES.TEXT, text: '  ' },
            {
              type: MAILY_NODE_TYPES.INLINE_IMAGE,
              attrs: {
                src: 'https://cdn.usemaily.com/images/icons/youtube.png',
                width: 20,
                height: 20,
                externalLink: 'https://www.youtube.com/arikchakma',
              },
            },
            { type: MAILY_NODE_TYPES.TEXT, text: '  ' },
            {
              type: MAILY_NODE_TYPES.INLINE_IMAGE,
              attrs: {
                src: 'https://cdn.usemaily.com/images/icons/twitter.png',
                width: 20,
                height: 20,
                externalLink: 'https://x.com/imarikchakma',
              },
            },
          ],
        },
      ])
      .run();
  },
};
