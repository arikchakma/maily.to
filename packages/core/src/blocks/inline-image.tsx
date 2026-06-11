import { SmilePlusIcon } from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const inlineImage: SlashCommandItem = {
  title: 'Inline Image',
  description: 'Insert an icon, emoji, etc.',
  searchTerms: ['inline', 'icon', 'emoji', 'social', 'inline-image'],
  icon: <SmilePlusIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setInlineImage({ src: '' }).run();

    const { from } = editor.state.selection;
    editor.commands.setNodeSelection(from - 1);
  },
};
