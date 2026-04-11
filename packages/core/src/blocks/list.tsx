import { ListIcon, ListOrderedIcon } from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const bulletList: SlashCommandItem = {
  title: 'Bullet List',
  description: 'Create a simple bullet list.',
  searchTerms: ['unordered', 'point'],
  icon: <ListIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor.chain().focus().deleteRange(range).toggleBulletList().run();
  },
};

export const orderedList: SlashCommandItem = {
  title: 'Numbered List',
  description: 'Create a list with numbering.',
  searchTerms: ['ordered'],
  icon: <ListOrderedIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor.chain().focus().deleteRange(range).toggleOrderedList().run();
  },
};
