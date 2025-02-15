import { Heading1 } from 'lucide-react';
import { button, linkCard } from '@/blocks/button';
import { htmlCodeBlock } from '@/blocks/code';
import { image, inlineImage, logo } from '@/blocks/image';
import { columns, divider, repeat, section, spacer } from '@/blocks/layout';
import { bulletList, orderedList } from '@/blocks/list';
import { BlockGroupItem } from '@/blocks/types';
import {
  blockquote,
  clearLine,
  footer,
  hardBreak,
  heading1,
  heading2,
  heading3,
  text,
} from '@/blocks/typography';

export const DEFAULT_SLASH_COMMANDS: BlockGroupItem[] = [
  {
    title: 'Blocks',
    commands: [
      text,
      heading1,
      heading2,
      heading3,
      bulletList,
      orderedList,
      image,
      logo,
      inlineImage,
      columns,
      section,
      repeat,
      divider,
      spacer,
      button,
      linkCard,
      hardBreak,
      blockquote,
      footer,
      clearLine,
    ],
  },
  {
    title: 'Components',
    commands: [
      {
        id: 'headers',
        title: 'Headers',
        description: 'Add pre-designed headers block',
        searchTerms: ['header', 'headers'],
        icon: <Heading1 className="mly-h-4 mly-w-4" />,
        subCommands: [
          {
            title: 'Logo with Header',
            description: 'Header with logo',
            searchTerms: ['logo', 'header'],
            icon: <Heading1 className="mly-h-4 mly-w-4" />,
            command: ({ editor, range }) => {
              editor.commands.insertContentAt(range, heading1);
            },
          },
        ],
      },
      htmlCodeBlock,
    ],
  },
];
