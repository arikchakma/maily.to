import type { FontWeight } from '@maily-to/shared';
import { getNodeFontStyleDefaults, MAILY_NODE_TYPES } from '@maily-to/shared';
import { MousePointerIcon } from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const button: SlashCommandItem = {
  title: 'Button',
  description: 'Add a call to action button to email.',
  searchTerms: ['link', 'button', 'cta'],
  icon: <MousePointerIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    const { fontSize, lineHeight, fontWeight } = getNodeFontStyleDefaults(
      MAILY_NODE_TYPES.BUTTON
    );
    return editor
      .chain()
      .focus()
      .deleteRange(range)
      .setButton({ fontSize, lineHeight, fontWeight: fontWeight as FontWeight })
      .run();
  },
};
