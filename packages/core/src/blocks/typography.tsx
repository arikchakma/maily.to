import { getNodeFontStyleDefaults, MAILY_NODE_TYPES } from '@maily-to/shared';
import {
  DivideIcon,
  EraserIcon,
  FootprintsIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  TextIcon,
  TextQuoteIcon,
} from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const text: SlashCommandItem = {
  title: 'Text',
  description: 'Just start typing with plain text.',
  searchTerms: ['p', 'paragraph'],
  icon: <TextIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .toggleNode(
        'paragraph',
        'paragraph',
        getNodeFontStyleDefaults(MAILY_NODE_TYPES.PARAGRAPH)
      )
      .run();
  },
};

export const heading1: SlashCommandItem = {
  title: 'Heading 1',
  description: 'Big heading.',
  searchTerms: ['h1', 'title', 'big', 'large'],
  icon: <Heading1Icon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', {
        level: 1,
        ...getNodeFontStyleDefaults(MAILY_NODE_TYPES.HEADING, 1),
      })
      .run();
  },
};

export const heading2: SlashCommandItem = {
  title: 'Heading 2',
  description: 'Medium heading.',
  searchTerms: ['h2', 'subtitle', 'medium'],
  icon: <Heading2Icon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', {
        level: 2,
        ...getNodeFontStyleDefaults(MAILY_NODE_TYPES.HEADING, 2),
      })
      .run();
  },
};

export const heading3: SlashCommandItem = {
  title: 'Heading 3',
  description: 'Small heading.',
  searchTerms: ['h3', 'subtitle', 'small'],
  icon: <Heading3Icon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', {
        level: 3,
        ...getNodeFontStyleDefaults(MAILY_NODE_TYPES.HEADING, 3),
      })
      .run();
  },
};

export const hardBreak: SlashCommandItem = {
  title: 'Hard Break',
  description: 'Add a break between lines.',
  searchTerms: ['break', 'line'],
  icon: <DivideIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor.chain().focus().deleteRange(range).setHardBreak().run();
  },
};

export const blockquote: SlashCommandItem = {
  title: 'Blockquote',
  description: 'Add a blockquote.',
  searchTerms: ['quote', 'blockquote'],
  icon: <TextQuoteIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor.chain().focus().deleteRange(range).toggleBlockquote().run();
  },
};

export const footer: SlashCommandItem = {
  title: 'Footer',
  description: 'Add a footer text.',
  searchTerms: ['footer', 'muted', 'small', 'copyright'],
  icon: <FootprintsIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setFooter().run();
  },
};

export const clearLine: SlashCommandItem = {
  title: 'Clear Line',
  description: 'Clear the current line.',
  searchTerms: ['clear', 'line'],
  icon: <EraserIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range: _range }) => {
    return editor.chain().focus().selectParentNode().deleteSelection().run();
  },
};
