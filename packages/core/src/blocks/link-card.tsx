import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { SquareArrowOutUpRightIcon } from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const linkCard: SlashCommandItem = {
  title: 'Link Card',
  description: 'Add a rich preview card with link.',
  searchTerms: ['link', 'card', 'button', 'image'],
  icon: <SquareArrowOutUpRightIcon className="mly:h-4 mly:w-4" />,
  render: (editor) => {
    const hasExtension = editor.extensionManager.extensions.some(
      (ext) => ext.name === MAILY_NODE_TYPES.LINK_CARD
    );
    return hasExtension ? true : null;
  },
  command: ({ editor, range }) => {
    return editor.chain().focus().deleteRange(range).setLinkCard().run();
  },
};
