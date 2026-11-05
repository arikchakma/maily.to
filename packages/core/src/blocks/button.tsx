import { MousePointerIcon } from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const button: SlashCommandItem = {
  title: 'Button',
  icon: <MousePointerIcon size={16} />,
  description: 'Add a call to action button to email.',
  searchTerms: ['button', 'cta', 'link', 'action'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setButton().run();
  },
};
