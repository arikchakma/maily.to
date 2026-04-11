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
    selector: ({ editor }): TurnIntoItems => [
      {
        type: 'category',
        id: 'hierarchy',
        label: 'Hierarchy',
      },
      {
        type: 'option',
        id: 'paragraph',
        label: 'Paragraph',
        icon: LetterTextIcon,
        disabled: !editor.can().setParagraph(),
        isActive:
          editor.isActive('paragraph') &&
          !editor.isActive('orderedList') &&
          !editor.isActive('bulletList'),
        onClick: () =>
          editor.chain().focus().liftListItem('listItem').setParagraph().run(),
      },
      {
        type: 'option',
        id: 'heading1',
        label: 'Heading 1',
        icon: Heading1Icon,
        disabled: !editor.can().setHeading({ level: 1 }),
        isActive: editor.isActive('heading', { level: 1 }),
        onClick: () =>
          editor
            .chain()
            .focus()
            .liftListItem('listItem')
            .setHeading({ level: 1 })
            .run(),
      },
      {
        type: 'option',
        id: 'heading2',
        label: 'Heading 2',
        icon: Heading2Icon,
        disabled: !editor.can().setHeading({ level: 2 }),
        isActive: editor.isActive('heading', { level: 2 }),
        onClick: () =>
          editor
            .chain()
            .focus()
            .liftListItem('listItem')
            .setHeading({ level: 2 })
            .run(),
      },
      {
        type: 'option',
        id: 'heading3',
        label: 'Heading 3',
        icon: Heading3Icon,
        disabled: !editor.can().setHeading({ level: 3 }),
        isActive: editor.isActive('heading', { level: 3 }),
        onClick: () =>
          editor
            .chain()
            .focus()
            .liftListItem('listItem')
            .setHeading({ level: 3 })
            .run(),
      },
      {
        type: 'option',
        id: 'footer',
        label: 'Footer',
        icon: FootprintsIcon,
        disabled: !editor.can().setFooter(),
        isActive: editor.isActive('footer'),
        onClick: () =>
          editor.chain().focus().liftListItem('listItem').setFooter().run(),
      },
      {
        type: 'category',
        id: 'lists',
        label: 'Lists',
      },
      {
        type: 'option',
        id: 'bulletList',
        label: 'Bullet list',
        icon: ListIcon,
        disabled: !editor.can().toggleBulletList(),
        isActive: editor.isActive('bulletList'),
        onClick: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        type: 'option',
        id: 'orderedList',
        label: 'Numbered list',
        icon: ListOrderedIcon,
        disabled: !editor.can().toggleOrderedList(),
        isActive: editor.isActive('orderedList'),
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
      },
    ],
  });
}
