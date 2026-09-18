import { Extension } from '@tiptap/core';
import type { SuggestionOptions } from '@tiptap/suggestion';
import { Suggestion } from '@tiptap/suggestion';

import type { SlashCommandGroupItem } from '~/utils/slash-command';

import { DEFAULT_SLASH_COMMANDS } from './default-slash-commands';
import { getSlashCommandSuggestions } from './slash-command-suggestion';

type SlashCommandStorage = {
  commands: SlashCommandGroupItem[];
};

declare module '@tiptap/core' {
  interface Storage {
    slashCommand: SlashCommandStorage;
  }
}

export type SlashCommandOptions = {
  commands: SlashCommandGroupItem[];
  suggestion: Omit<SuggestionOptions, 'editor'>;
};

export const SlashCommandExtension = Extension.create<
  SlashCommandOptions,
  SlashCommandStorage
>({
  name: 'slashCommand',
  priority: 101,

  addOptions() {
    return {
      commands: DEFAULT_SLASH_COMMANDS,
      suggestion: getSlashCommandSuggestions() as Omit<
        SuggestionOptions,
        'editor'
      >,
    };
  },

  addStorage() {
    return {
      commands: this.options.commands,
    };
  },

  addProseMirrorPlugins() {
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
  },
});
