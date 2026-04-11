import {
  CodeXmlIcon,
  ColumnsIcon,
  MinusIcon,
  MoveVerticalIcon,
  Repeat2Icon,
  SquareIcon,
} from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const spacer: SlashCommandItem = {
  title: 'Spacer',
  description: 'Add space between blocks.',
  searchTerms: ['space', 'gap', 'divider'],
  icon: <MoveVerticalIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor.chain().focus().deleteRange(range).setSpacer().run();
  },
};

export const divider: SlashCommandItem = {
  title: 'Divider',
  description: 'Add a horizontal divider.',
  searchTerms: ['divider', 'line'],
  icon: <MinusIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor.chain().focus().deleteRange(range).setHorizontalRule().run();
  },
};

export const section: SlashCommandItem = {
  title: 'Section',
  description: 'Add a section container.',
  searchTerms: ['section', 'container', 'box', 'wrapper'],
  icon: <SquareIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor.chain().focus().deleteRange(range).setSection().run();
  },
};

export const columns: SlashCommandItem = {
  title: 'Columns',
  description: 'Add a multi-column layout.',
  searchTerms: ['columns', 'layout', 'grid', 'two', 'split'],
  icon: <ColumnsIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor.chain().focus().deleteRange(range).setColumns(2).run();
  },
};

export const repeat: SlashCommandItem = {
  title: 'Repeat',
  description: 'Repeat content for each item in a list.',
  searchTerms: ['repeat', 'loop', 'iterate', 'for', 'each', 'array'],
  icon: <Repeat2Icon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor.chain().focus().deleteRange(range).setRepeat().run();
  },
};

export const htmlCodeBlock: SlashCommandItem = {
  title: 'Custom HTML',
  description: 'Insert a custom HTML block.',
  searchTerms: ['html', 'code', 'custom'],
  icon: <CodeXmlIcon className="mly:h-4 mly:w-4" />,
  command: ({ editor, range }) => {
    return editor
      .chain()
      .focus()
      .deleteRange(range)
      .setHtmlCodeBlock({ language: 'html' })
      .run();
  },
};
