import type { BlockItem } from './types';
import {
  ColumnsIcon,
  Repeat2,
  MoveVertical,
  RectangleHorizontal,
  Minus,
} from 'lucide-react';

export const columns: BlockItem = {
  title: 'Columns',
  description: 'Add columns to email.',
  searchTerms: ['layout', 'columns'],
  icon: <ColumnsIcon className="mly-h-4 mly-w-4" />,
  shouldBeHidden: (editor) => {
    return editor.isActive('columns');
  },
  command: ({ editor, range }) => {
    // @ts-ignore
    editor
      .chain()
      .focus()
      .deleteRange(range)
      // @ts-ignore
      .setColumns()
      .focus(editor.state.selection.head - 2)
      .run();
  },
};

export const section: BlockItem = {
  title: 'Section',
  description: 'Add a section to email.',
  searchTerms: ['layout', 'section'],
  icon: <RectangleHorizontal className="mly-h-4 mly-w-4" />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setSection().run();
  },
};

export const forLoop: BlockItem = {
  title: 'For',
  description: 'Loop over an array of items.',
  searchTerms: ['for', 'loop'],
  icon: <Repeat2 className="mly-h-4 mly-w-4" />,
  shouldBeHidden: (editor) => {
    return editor.isActive('for');
  },
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setFor().run();
  },
};

export const spacer: BlockItem = {
  title: 'Spacer',
  description: 'Add space between blocks.',
  searchTerms: ['space', 'gap', 'divider'],
  icon: <MoveVertical className="mly-h-4 mly-w-4" />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setSpacer({ height: 'sm' }).run();
  },
};

export const divider: BlockItem = {
  title: 'Divider',
  description: 'Add a horizontal divider.',
  searchTerms: ['divider', 'line'],
  icon: <Minus className="mly-h-4 mly-w-4" />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setHorizontalRule().run();
  },
};
