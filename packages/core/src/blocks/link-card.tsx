import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { SquareArrowOutUpRightIcon } from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const linkCard: SlashCommandItem = {
  title: 'Link Card',
  icon: <SquareArrowOutUpRightIcon size={16} />,
  description: 'Add a rich preview card with link.',
  searchTerms: ['link', 'card', 'button', 'image'],
  render: (editor) => {
    const hasExtension = editor.extensionManager.extensions.some(
      (extension) => extension.name === MAILY_NODE_TYPES.LINK_CARD
    );

    return hasExtension ? true : null;
  },
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setLinkCard().run();
  },
};
