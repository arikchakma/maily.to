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
  icon: <TextIcon size={16} />,
  description: 'Just start typing with plain text.',
  searchTerms: ['p', 'paragraph', 'text'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setParagraph().run();
  },
};

export const heading1: SlashCommandItem = {
  title: 'Heading 1',
  icon: <Heading1Icon size={16} />,
  description: 'Big heading.',
  searchTerms: ['h1', 'title', 'big', 'large'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 1 })
      .run();
  },
};

export const heading2: SlashCommandItem = {
  title: 'Heading 2',
  icon: <Heading2Icon size={16} />,
  description: 'Medium heading.',
  searchTerms: ['h2', 'subtitle', 'medium'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 2 })
      .run();
  },
};

export const heading3: SlashCommandItem = {
  title: 'Heading 3',
  icon: <Heading3Icon size={16} />,
  description: 'Small heading.',
  searchTerms: ['h3', 'subtitle', 'small'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode('heading', { level: 3 })
      .run();
  },
};

export const hardBreak: SlashCommandItem = {
  title: 'Hard Break',
  icon: <DivideIcon size={16} />,
  description: 'Add a break between lines.',
  searchTerms: ['break', 'line'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setHardBreak().run();
  },
};

export const blockquote: SlashCommandItem = {
  title: 'Blockquote',
  icon: <TextQuoteIcon size={16} />,
  description: 'Add a blockquote.',
  searchTerms: ['quote', 'blockquote', 'citation'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setBlockquote().run();
  },
};

export const footer: SlashCommandItem = {
  title: 'Footer',
  icon: <FootprintsIcon size={16} />,
  description: 'Add a footer text.',
  searchTerms: ['footer', 'small', 'legal', 'unsubscribe'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setFooter().run();
  },
};

export const clearLine: SlashCommandItem = {
  title: 'Clear Line',
  icon: <EraserIcon size={16} />,
  description: 'Clear the current line.',
  searchTerms: ['clear', 'line'],
  command: ({ editor }) => {
    editor.chain().focus().selectParentNode().deleteSelection().run();
  },
};
