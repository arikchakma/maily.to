import { ImageIcon } from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const image: SlashCommandItem = {
  title: 'Image',
  description: 'Insert an image',
  searchTerms: ['image', 'picture', 'logo'],
  icon: <ImageIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor
      .chain()
      .focus()
      .deleteRange(range)
      .setImage({ src: '' })
      .run();
  },
};
