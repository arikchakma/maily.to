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
  searchTerms: string[];
  shouldBeHidden?: (editor: Editor) => boolean;
  command: (options: CommandProps) => void;
} & (
  | { icon: JSX.Element; description: string; render?: never }
  | {
      render: (options: RenderCommandProps) => JSX.Element;
      icon?: never;
      description?: string;
    }
);
