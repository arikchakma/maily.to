import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import {
  FootprintsIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  LetterTextIcon,
  ListIcon,
  ListOrderedIcon,
} from 'lucide-react';

import type { TurnIntoItems } from '~/utils/turn-into';

export function useTurnIntoBlockItems(editor: Editor) {
  return useEditorState({
    editor,
    selector: ({ editor: instance }): TurnIntoItems => {
      const liftOut = () => {
        return instance
          .chain()
          .focus()
          .liftListItem(MAILY_NODE_TYPES.LIST_ITEM);
      };

      return [
        { id: 'hierarchy', label: 'Hierarchy', type: 'category' },
        {
          disabled: !instance.can().setParagraph(),
          icon: LetterTextIcon,
          id: MAILY_NODE_TYPES.PARAGRAPH,
          isActive:
            instance.isActive(MAILY_NODE_TYPES.PARAGRAPH) &&
            !instance.isActive(MAILY_NODE_TYPES.ORDERED_LIST) &&
            !instance.isActive(MAILY_NODE_TYPES.BULLET_LIST),
          label: 'Paragraph',
          onClick: () => liftOut().setParagraph().run(),
          type: 'option',
        },
        {
          disabled: !instance.can().setHeading({ level: 1 }),
          icon: Heading1Icon,
          id: 'heading1',
          isActive: instance.isActive(MAILY_NODE_TYPES.HEADING, { level: 1 }),
          label: 'Heading 1',
          onClick: () => liftOut().setHeading({ level: 1 }).run(),
          type: 'option',
        },
        {
          disabled: !instance.can().setHeading({ level: 2 }),
          icon: Heading2Icon,
          id: 'heading2',
          isActive: instance.isActive(MAILY_NODE_TYPES.HEADING, { level: 2 }),
          label: 'Heading 2',
          onClick: () => liftOut().setHeading({ level: 2 }).run(),
          type: 'option',
        },
        {
          disabled: !instance.can().setHeading({ level: 3 }),
          icon: Heading3Icon,
          id: 'heading3',
          isActive: instance.isActive(MAILY_NODE_TYPES.HEADING, { level: 3 }),
          label: 'Heading 3',
          onClick: () => liftOut().setHeading({ level: 3 }).run(),
          type: 'option',
        },
        {
          disabled: !instance.can().setFooter(),
          icon: FootprintsIcon,
          id: MAILY_NODE_TYPES.FOOTER,
          isActive: instance.isActive(MAILY_NODE_TYPES.FOOTER),
          label: 'Footer',
          onClick: () => liftOut().setFooter().run(),
          type: 'option',
        },
        { id: 'lists', label: 'Lists', type: 'category' },
        {
          disabled: !instance.can().toggleBulletList(),
          icon: ListIcon,
          id: MAILY_NODE_TYPES.BULLET_LIST,
          isActive: instance.isActive(MAILY_NODE_TYPES.BULLET_LIST),
          label: 'Bullet list',
          onClick: () => instance.chain().focus().toggleBulletList().run(),
          type: 'option',
        },
        {
          disabled: !instance.can().toggleOrderedList(),
          icon: ListOrderedIcon,
          id: MAILY_NODE_TYPES.ORDERED_LIST,
          isActive: instance.isActive(MAILY_NODE_TYPES.ORDERED_LIST),
          label: 'Numbered list',
          onClick: () => instance.chain().focus().toggleOrderedList().run(),
          type: 'option',
        },
      ];
    },
  });
}
