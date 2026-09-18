import {
  MAILY_MARK_TYPES,
  MAILY_NODE_TYPES,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';

import { LogoWithCoverImageIcon } from '~/components/icons/logo-with-cover-image';
import { LogoWithTextHorizonIcon } from '~/components/icons/logo-with-text-horizon';
import { LogoWithTextVerticalIcon } from '~/components/icons/logo-with-text-vertical';
import type { SlashCommandItem } from '~/utils/slash-command';

export const headerLogoWithTextHorizontal: SlashCommandItem = {
  title: 'Logo with Text (Horizontal)',
  icon: <LogoWithTextHorizonIcon />,
  description: 'Logo and a text horizontally',
  searchTerms: ['logo', 'text'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: MAILY_NODE_TYPES.COLUMNS,
        content: [
          {
            type: MAILY_NODE_TYPES.COLUMN,
            attrs: { width: null, verticalAlign: 'middle' },
            content: [
              {
                type: MAILY_NODE_TYPES.IMAGE,
                attrs: {
                  src: 'https://maily.to/brand/logo.png',
                  width: '32px',
                  align: TEXT_ALIGNMENTS.LEFT,
                  style: 'height:32px',
                },
              },
            ],
          },
          {
            type: MAILY_NODE_TYPES.COLUMN,
            attrs: { width: null, verticalAlign: 'bottom' },
            content: [
              {
                type: MAILY_NODE_TYPES.HEADING,
                attrs: { level: 3, style: 'text-align:right' },
                content: [
                  {
                    type: MAILY_NODE_TYPES.TEXT,
                    marks: [{ type: MAILY_MARK_TYPES.BOLD }],
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
  icon: <LogoWithTextVerticalIcon />,
  description: 'Logo and a text vertically',
  searchTerms: ['logo', 'text'],
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
            width: '48px',
            align: TEXT_ALIGNMENTS.CENTER,
            style: 'height:48px',
          },
        },
        { type: MAILY_NODE_TYPES.SPACER, attrs: { height: 8 } },
        {
          type: MAILY_NODE_TYPES.HEADING,
          attrs: { level: 2, style: 'text-align:center' },
          content: [{ type: MAILY_NODE_TYPES.TEXT, text: 'Maily' }],
        },
      ])
      .run();
  },
};

export const headerLogoWithCoverImage: SlashCommandItem = {
  title: 'Logo with Cover Image',
  icon: <LogoWithCoverImageIcon />,
  description: 'Logo and a cover image',
  searchTerms: ['logo', 'cover', 'image'],
  command: ({ editor, range }) => {
    const todayFormatted = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent([
        {
          type: MAILY_NODE_TYPES.IMAGE,
          attrs: {
            src: 'https://maily.to/og-image.png',
            width: '600px',
            align: TEXT_ALIGNMENTS.CENTER,
            style: 'height:314px',
          },
        },
        {
          type: MAILY_NODE_TYPES.COLUMNS,
          content: [
            {
              type: MAILY_NODE_TYPES.COLUMN,
              attrs: { width: null, verticalAlign: 'middle' },
              content: [
                {
                  type: MAILY_NODE_TYPES.IMAGE,
                  attrs: {
                    src: 'https://maily.to/brand/logo.png',
                    width: '48px',
                    align: TEXT_ALIGNMENTS.LEFT,
                    style: 'height:48px',
                  },
                },
              ],
            },
            {
              type: MAILY_NODE_TYPES.COLUMN,
              attrs: { width: null, verticalAlign: 'middle' },
              content: [
                {
                  type: MAILY_NODE_TYPES.PARAGRAPH,
                  attrs: { style: 'text-align:right' },
                  content: [
                    {
                      type: MAILY_NODE_TYPES.TEXT,
                      marks: [{ type: MAILY_MARK_TYPES.BOLD }],
                      text: 'Weekly Newsletter',
                    },
                    { type: MAILY_NODE_TYPES.HARD_BREAK },
                    {
                      type: MAILY_NODE_TYPES.TEXT,
                      marks: [
                        {
                          type: MAILY_MARK_TYPES.TEXT_STYLE,
                          attrs: { color: '#929292' },
                        },
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
