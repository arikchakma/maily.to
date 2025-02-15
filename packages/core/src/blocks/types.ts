import type { Editor, Range } from '@tiptap/core';

interface CommandProps {
  editor: Editor;
  range: Range;
}

export type BlockItem = {
  title: string;
  description?: string;
  searchTerms: string[];
  command: (options: CommandProps) => void;
  icon?: JSX.Element;
  render?: (editor: Editor) => JSX.Element | null;
};

export type BlockGroupItem = {
  title: string;
  commands: BlockItem[];
};
