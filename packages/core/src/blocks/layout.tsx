import {
  CodeXmlIcon,
  ColumnsIcon,
  SquareIcon,
  MinusIcon,
  MoveVerticalIcon,
  Repeat2Icon,
  TableIcon,
} from 'lucide-react';

import type { SlashCommandItem } from '~/utils/slash-command';

export const spacer: SlashCommandItem = {
  title: 'Spacer',
  icon: <MoveVerticalIcon size={16} />,
  description: 'Add space between blocks.',
  searchTerms: ['space', 'gap'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setSpacer().run();
  },
};

export const divider: SlashCommandItem = {
  title: 'Divider',
  icon: <MinusIcon size={16} />,
  description: 'Add a horizontal divider.',
  searchTerms: ['divider', 'line', 'rule'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setHorizontalRule().run();
  },
};

export const section: SlashCommandItem = {
  title: 'Section',
  icon: <SquareIcon size={16} />,
  description: 'Add a section container.',
  searchTerms: ['section', 'container', 'box', 'wrapper'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setSection().run();
  },
};

export const columns: SlashCommandItem = {
  title: 'Columns',
  icon: <ColumnsIcon size={16} />,
  description: 'Add a multi-column layout.',
  searchTerms: ['columns', 'layout', 'grid', 'split'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setColumns().run();
  },
};

export const table: SlashCommandItem = {
  title: 'Table',
  icon: <TableIcon size={16} />,
  description: 'Add a table.',
  searchTerms: ['table', 'grid', 'rows'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertTable({ cols: 3, rows: 3, withHeaderRow: true })
      .run();
  },
};

export const htmlCodeBlock: SlashCommandItem = {
  title: 'Custom HTML',
  icon: <CodeXmlIcon size={16} />,
  description: 'Insert a custom HTML block.',
  searchTerms: ['html', 'code', 'custom'],
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setHtmlCodeBlock({ language: 'html' })
      .run();
  },
};

export const repeat: SlashCommandItem = {
  title: 'Repeat',
  icon: <Repeat2Icon size={16} />,
  description: 'Render the content once for every item in a list.',
  searchTerms: ['repeat', 'loop', 'iterate', 'for', 'each', 'list', 'array'],
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setRepeat().run();
  },
};
