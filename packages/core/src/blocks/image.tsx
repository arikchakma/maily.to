import { ImageIcon, SmilePlusIcon } from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const image: SlashCommandItem = {
  title: 'Image',
  icon: <ImageIcon size={16} />,
  description: 'Add a full-width image.',
  searchTerms: ['image', 'picture', 'photo', 'media'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setImage({ src: '' }).run();
  },
};

export const inlineImage: SlashCommandItem = {
  title: 'Inline Image',
  icon: <SmilePlusIcon size={16} />,
  description: 'Add an image inside a line of text.',
  searchTerms: ['inline', 'image', 'icon', 'emoji'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setInlineImage({ src: '' }).run();
  },
};
