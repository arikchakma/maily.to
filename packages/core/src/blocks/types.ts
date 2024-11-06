import type { Editor, Range } from '@tiptap/core';

interface CommandProps {
  editor: Editor;
  range: Range;
}

export type BlockItem = {
  title: string;
  description: string;
  searchTerms: string[];
  icon: JSX.Element;
  shouldBeHidden?: (editor: Editor) => boolean;
  command: (options: CommandProps) => void;
};
