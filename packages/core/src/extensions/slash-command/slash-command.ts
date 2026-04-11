import { Extension } from '@tiptap/core';
import type { SuggestionOptions } from '@tiptap/suggestion';
import Suggestion from '@tiptap/suggestion';

import type { SlashCommandGroupItem } from '~/utils/slash-command';

import { getSlashCommandSuggestions } from './slash-command-suggestion';

declare module '@tiptap/core' {
  interface Storage {
    slashCommand: SlashCommandStorage;
  }
}

type SlashCommandStorage = {
  commands: SlashCommandGroupItem[];
};

export type SlashCommandOptions = {
  suggestion: Omit<SuggestionOptions, 'editor'>;
  commands: SlashCommandGroupItem[];
};

export const SlashCommandExtension = Extension.create<
  SlashCommandOptions,
  SlashCommandStorage
>({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      },
      commands: [],
    };
  },
  addStorage() {
    return {
      commands: this.options.commands,
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
}).configure({
  suggestion: getSlashCommandSuggestions(),
});
