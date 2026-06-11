import { TEXT_ALIGNMENTS } from '@maily-to/shared';

import { LogoWithCoverImageIcon } from '~/components/icons/logo-with-cover-image';
import { LogoWithTextHorizonIcon } from '~/components/icons/logo-with-text-horizon';
import { LogoWithTextVerticalIcon } from '~/components/icons/logo-with-text-vertical';
import type { SlashCommandItem } from '~/utils/slash-command';

export const headerLogoWithTextHorizontal: SlashCommandItem = {
  title: 'Logo with Text (Horizontal)',
  description: 'Logo and a text horizontally',
  searchTerms: ['logo', 'text'],
  icon: <LogoWithTextHorizonIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .deleteRange(range)
      .insertContent({
        type: 'columns',
        content: [
          {
            type: 'column',
            attrs: {
              columnId: '36de3eda-0677-47c3-a8b7-e071dec9ce30',
              width: 'auto',
              verticalAlign: 'middle',
            },
            content: [
              {
                type: 'image',
                attrs: {
                  src: 'https://maily.to/brand/logo.png',
                  alt: null,
                  title: null,
                  width: '32',
                  height: '32',
                  alignment: TEXT_ALIGNMENTS.LEFT,
                  externalLink: null,
                  isExternalLinkVariable: false,
                  isSrcVariable: false,
                },
              },
            ],
          },
          {
            type: 'column',
            attrs: {
              columnId: '6feb593e-374a-4479-a1c7-872c60c2f4e0',
              width: 'auto',
              verticalAlign: 'bottom',
            },
            content: [
              {
                type: 'heading',
                attrs: {
                  textAlign: TEXT_ALIGNMENTS.RIGHT,
                  level: 3,
                },
                content: [
                  {
                    type: 'text',
                    marks: [{ type: 'bold' }],
                    text: 'Weekly Newsletter',
                  },
                ],
              },
            ],
          },
        ],
      })
      .run();
  },
};

export const headerLogoWithTextVertical: SlashCommandItem = {
  title: 'Logo with Text (Vertical)',
  description: 'Logo and a text vertically',
  searchTerms: ['logo', 'text'],
  icon: <LogoWithTextVerticalIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .deleteRange(range)
      .insertContent([
        {
          type: 'image',
          attrs: {
            src: 'https://maily.to/brand/logo.png',
            alt: null,
            title: null,
            width: '48',
            height: '48',
            alignment: TEXT_ALIGNMENTS.CENTER,
            externalLink: null,
            isExternalLinkVariable: false,
            isSrcVariable: false,
          },
        },
        { type: 'spacer', attrs: { height: 8 } },
        {
          type: 'heading',
          attrs: {
            textAlign: TEXT_ALIGNMENTS.CENTER,
            level: 2,
          },
          content: [{ type: 'text', text: 'Maily' }],
        },
      ])
      .run();
  },
};

export const headerLogoWithCoverImage: SlashCommandItem = {
  title: 'Logo with Cover Image',
  description: 'Logo and a cover image',
  searchTerms: ['logo', 'cover', 'image'],
  icon: <LogoWithCoverImageIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    const todayFormatted = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    editor
      .chain()
      .deleteRange(range)
      .insertContent([
        {
          type: 'image',
          attrs: {
            src: 'https://maily.to/og-image.png',
            alt: null,
            title: null,
            width: 600,
            height: 314,
            alignment: TEXT_ALIGNMENTS.CENTER,
            externalLink: null,
            isExternalLinkVariable: false,
            isSrcVariable: false,
          },
        },
        {
          type: 'columns',
          content: [
            {
              type: 'column',
              attrs: {
                columnId: '36de3eda-0677-47c3-a8b7-e071dec9ce30',
                width: 'auto',
                verticalAlign: 'middle',
              },
              content: [
                {
                  type: 'image',
                  attrs: {
                    src: 'https://maily.to/brand/logo.png',
                    alt: null,
                    title: null,
                    width: '48',
                    height: '48',
                    alignment: TEXT_ALIGNMENTS.LEFT,
                    externalLink: null,
                    isExternalLinkVariable: false,
                    isSrcVariable: false,
                  },
                },
              ],
            },
            {
              type: 'column',
              attrs: {
                columnId: '6feb593e-374a-4479-a1c7-872c60c2f4e0',
                width: 'auto',
                verticalAlign: 'middle',
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: { textAlign: TEXT_ALIGNMENTS.RIGHT },
                  content: [
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'Weekly Newsletter',
                    },
                    { type: 'hardBreak' },
                    {
                      type: 'text',
                      marks: [
                        { type: 'textStyle', attrs: { color: '#929292' } },
                      ],
                      text: todayFormatted,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ])
      .run();
  },
};
