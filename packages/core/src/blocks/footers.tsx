import { TEXT_ALIGNMENTS } from '@maily-to/shared';
import {
  CopyrightIcon,
  LayoutTemplateIcon,
  RectangleHorizontalIcon,
} from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const footerCopyrightText: SlashCommandItem = {
  title: 'Footer Copyright',
  description: 'Copyright text for the footer.',
  searchTerms: ['footer', 'copyright'],
  icon: <CopyrightIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    const currentYear = new Date().getFullYear();

    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: 'paragraph',
        attrs: { textAlign: TEXT_ALIGNMENTS.CENTER },
        content: [
          {
            type: 'text',
            marks: [{ type: 'textStyle', attrs: { color: '#AAAAAA' } }],
            text: `Maily \u00A9 ${currentYear}. All rights reserved.`,
          },
        ],
      })
      .run();
  },
};

export const footerCommunityFeedbackCta: SlashCommandItem = {
  title: 'Footer Community Feedback',
  description: 'Community feedback CTA for the footer.',
  searchTerms: ['footer', 'community', 'feedback', 'cta'],
  icon: <RectangleHorizontalIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent([
        {
          type: 'image',
          attrs: {
            src: 'https://maily.to/brand/logo.png',
            alt: null,
            title: null,
            width: '8%',
            alignment: TEXT_ALIGNMENTS.LEFT,
            externalLink: null,
          },
        },
        { type: 'spacer', attrs: { height: 16 } },
        {
          type: 'footer',
          attrs: { textAlign: null },
          content: [
            {
              type: 'text',
              marks: [],
              text: "Enjoyed this month's update?",
            },
            { type: 'hardBreak' },
            {
              type: 'text',
              marks: [],
              text: "And, as always, we'd love your feedback \u2013 simply reply to the email or reach out via the Discord community!",
            },
          ],
        },
      ])
      .run();
  },
};

export const footerCompanySignature: SlashCommandItem = {
  title: 'Footer Company Signature',
  description: 'Company signature for the footer.',
  searchTerms: ['footer', 'company', 'signature'],
  icon: <LayoutTemplateIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent([
        { type: 'horizontalRule' },
        {
          type: 'image',
          attrs: {
            src: 'https://maily.to/brand/logo.png',
            alt: null,
            title: null,
            width: '8%',
            align: TEXT_ALIGNMENTS.CENTER,
            externalLink: null,
          },
        },
        { type: 'spacer', attrs: { height: 16 } },
        {
          type: 'heading',
          attrs: {
            textAlign: TEXT_ALIGNMENTS.CENTER,
            level: 3,
          },
          content: [{ type: 'text', text: 'Maily' }],
        },
        { type: 'spacer', attrs: { height: 4 } },
        {
          type: 'footer',
          attrs: { textAlign: TEXT_ALIGNMENTS.CENTER },
          content: [
            {
              type: 'text',
              marks: [],
              text: '1234 Example Street, Example, DE 19801, United States',
            },
            { type: 'hardBreak' },
            {
              type: 'text',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://maily.to',
                    target: '_blank',
                    rel: 'noopener noreferrer nofollow',
                    class: 'mly:no-underline',
                  },
                },
                { type: 'textStyle', attrs: { color: '#64748b' } },
                { type: 'underline' },
              ],
              text: 'VISIT COMPANY',
            },
            {
              type: 'text',
              marks: [{ type: 'textStyle', attrs: { color: '#64748b' } }],
              text: '  |  ',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://maily.to',
                    target: '_blank',
                    rel: 'noopener noreferrer nofollow',
                    class: 'mly:no-underline',
                  },
                },
                { type: 'textStyle', attrs: { color: '#64748b' } },
                { type: 'underline' },
              ],
              text: 'VISIT OUR BLOG',
            },
            {
              type: 'text',
              marks: [{ type: 'textStyle', attrs: { color: '#64748b' } }],
              text: '  |  ',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://maily.to',
                    target: '_blank',
                    rel: 'noopener noreferrer nofollow',
                    class: 'mly:no-underline',
                  },
                },
                { type: 'textStyle', attrs: { color: '#64748b' } },
                { type: 'underline' },
              ],
              text: 'UNSUBSCRIBE',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: { textAlign: TEXT_ALIGNMENTS.CENTER },
          content: [
            {
              type: 'inlineImage',
              attrs: {
                height: 20,
                width: 20,
                src: 'https://cdn.usemaily.com/images/icons/linkedin.png',
                alt: null,
                title: null,
                externalLink: 'https://www.linkedin.com/in/arikchakma/',
              },
            },
            { type: 'text', text: '  ' },
            {
              type: 'inlineImage',
              attrs: {
                height: 20,
                width: 20,
                src: 'https://cdn.usemaily.com/images/icons/youtube.png',
                alt: null,
                title: null,
                externalLink: 'https://www.youtube.com/arikchakma',
              },
            },
            { type: 'text', text: '  ' },
            {
              type: 'inlineImage',
              attrs: {
                height: 20,
                width: 20,
                src: 'https://cdn.usemaily.com/images/icons/twitter.png',
                alt: null,
                title: null,
                externalLink: 'https://x.com/imarikchakma',
              },
            },
          ],
        },
      ])
      .run();
  },
};
