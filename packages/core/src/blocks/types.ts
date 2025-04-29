import type { Editor, Range } from '@tiptap/core';
import { ReactElement } from 'react';

export interface CommandProps {
  editor: Editor;
  range: Range;
}

export type BlockItem = {
  title: string;
  description?: string;
  searchTerms: string[];
  icon?: ReactElement;
  render?: (editor: Editor) => ReactElement | null | true;
  preview?: string | ((editor: Editor) => ReactElement | null);
} & (
  | {
      command: (options: CommandProps) => void;
      id?: never;
      commands?: never;
    }
  | {
      /**
       * id to be used for the slash command query
       * `headers.` will go inside the header subcommand
       */
      id: string;
      command?: never;
      commands: BlockItem[];
    }
);

export type BlockGroupItem = {
  title: string;
  commands: BlockItem[];
};
