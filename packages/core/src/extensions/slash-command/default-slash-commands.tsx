import { FootprintsIcon, Heading1Icon } from 'lucide-react';

import { button } from '~/blocks/button';
import {
  footerCommunityFeedbackCta,
  footerCompanySignature,
  footerCopyrightText,
} from '~/blocks/footers';
import {
  headerLogoWithCoverImage,
  headerLogoWithTextHorizontal,
  headerLogoWithTextVertical,
} from '~/blocks/headers';
import { image } from '~/blocks/image';
import { inlineImage } from '~/blocks/inline-image';
import {
  columns,
  divider,
  htmlCodeBlock,
  repeat,
  section,
  spacer,
} from '~/blocks/layout';
import { linkCard } from '~/blocks/link-card';
import { bulletList, orderedList } from '~/blocks/list';
import {
  blockquote,
  clearLine,
  footer,
  hardBreak,
  heading1,
  heading2,
  heading3,
  text,
} from '~/blocks/typography';
import type { SlashCommandGroupItem } from '~/utils/slash-command';

export const DEFAULT_SLASH_COMMANDS: SlashCommandGroupItem[] = [
  {
    title: 'Blocks',
    commands: [
      text,
      heading1,
      heading2,
      heading3,
      bulletList,
      orderedList,
      blockquote,
      image,
      inlineImage,
      divider,
      spacer,
      section,
      columns,
      repeat,
      button,
      linkCard,
      footer,
      hardBreak,
      clearLine,
    ],
  },
  {
    title: 'Components',
    commands: [
      {
        id: 'headers',
        title: 'Headers',
        description: 'Pre-designed headers block',
        searchTerms: ['header', 'headers'],
        icon: <Heading1Icon className="mly:h-4 mly:w-4" />,
        preview: 'https://cdn.usemaily.com/previews/header-preview-xyz.png',
        commands: [
          headerLogoWithTextVertical,
          headerLogoWithTextHorizontal,
          headerLogoWithCoverImage,
        ],
      },
      {
        id: 'footers',
        title: 'Footers',
        description: 'Pre-designed footers block',
        searchTerms: ['footer', 'footers'],
        icon: <FootprintsIcon className="mly:h-4 mly:w-4" />,
        commands: [
          footerCopyrightText,
          footerCommunityFeedbackCta,
          footerCompanySignature,
        ],
      },
      htmlCodeBlock,
    ],
  },
];
