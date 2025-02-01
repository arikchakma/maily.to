import type { Editor, Range } from '@tiptap/core';

interface CommandProps {
  editor: Editor;
  range: Range;
}

type RenderCommandProps = {
  editor: Editor;
  index: number;
  activeIndex: number;
  onSelect: () => void;
};

export type BlockItem = {
  title: string;
  description?: string;
  searchTerms: string[];
  command: (options: CommandProps) => void;
  icon?: JSX.Element;
  render?: (editor: Editor) => JSX.Element | null;
};
