import { ListIcon, ListOrderedIcon } from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const bulletList: SlashCommandItem = {
  title: 'Bullet List',
  icon: <ListIcon size={16} />,
  description: 'Create a simple bullet list.',
  searchTerms: ['unordered', 'point', 'bullet'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleBulletList().run();
  },
};

export const orderedList: SlashCommandItem = {
  title: 'Numbered List',
  icon: <ListOrderedIcon size={16} />,
  description: 'Create a list with numbering.',
  searchTerms: ['ordered', 'number'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleOrderedList().run();
  },
};
