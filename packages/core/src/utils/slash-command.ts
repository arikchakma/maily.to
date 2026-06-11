import type { Editor, Range } from '@tiptap/core';
import type { ReactNode } from 'react';

export const SLASH_COMMAND_SUGGESTION_POPOVER_ID =
  'mly-slash-command-suggestion-popover';

export type SlashCommandOptions = {
  editor: Editor;
  range: Range;
};

export type SlashCommandItemCommand = (options: SlashCommandOptions) => void;

type BaseSlashCommandItem = {
  title: string;
  description?: string;
  searchTerms: string[];
  icon?: ReactNode;
  /**
   * Controls visibility in the suggestion list. Return `null` to hide,
   * `true` to show with defaults, or a ReactNode for custom rendering.
   */
  render?: (editor: Editor) => ReactNode | null | true;
  preview?: string | ((editor: Editor) => ReactNode | null);
};

type ExecutableSlashCommandItem = BaseSlashCommandItem & {
  command: SlashCommandItemCommand;
  id?: never;
  commands?: never;
};

type NestedSlashCommandItem = BaseSlashCommandItem & {
  id: string;
  command?: never;
  commands: SlashCommandItem[];
};

export type SlashCommandItem =
  | ExecutableSlashCommandItem
  | NestedSlashCommandItem;

export type SlashCommandGroupItem = {
  title: string;
  commands: SlashCommandItem[];
};

type FilterSlashCommandsOptions = {
  groups: readonly SlashCommandGroupItem[];
  query: string;
  editor: Editor;
};

/**
 * Filters slash command groups by query. Supports nested commands
 * via dot notation (e.g. "headers.h1"). When a nested group matches,
 * it's expanded inline and made navigable.
 */
export function filterSlashCommands(
  options: FilterSlashCommandsOptions
): SlashCommandGroupItem[] {
  const { groups, query, editor } = options;
  const search = query.toLowerCase();

  // handle subcommand filtering (e.g., "headers.something")
  const subCommandMatch = search.match(/^([^.]+)\./);
  if (subCommandMatch) {
    const [fullMatch, subCommandId] = subCommandMatch;
    const subCommand = findNestedCommand(groups, subCommandId);
    if (!subCommand) {
      return [];
    }

    const remainingSearch = search.slice(fullMatch.length);
    const filtered = subCommand.commands.filter(
      (item) => !remainingSearch || match(item, remainingSearch)
    );

    return filtered.length ? [{ ...subCommand, commands: filtered }] : [];
  }

  return groups
    .map((group) => ({
      ...group,
      commands: group.commands.flatMap((item) => {
        if (item.render?.(editor) === null) {
          return [];
        }

        if (!isNestedCommand(item)) {
          return !search || match(item, search) ? [item] : [];
        }

        // we make item navigable by adding a command function
        // so that we can navigate to it and execute it
        const navigable = {
          ...item,
          command: ({ editor, range }: SlashCommandOptions) => {
            editor.chain().focus().insertContentAt(range, `/${item.id}.`).run();
          },
        } as unknown as ExecutableSlashCommandItem;

        if (match(navigable, search)) {
          return [navigable];
        }

        const hasMatchingChildren = item.commands.some((child) =>
          match(child, search)
        );

        return hasMatchingChildren ? item.commands : [];
      }),
    }))
    .filter((group) => group.commands.length > 0);
}

function findNestedCommand(
  groups: readonly SlashCommandGroupItem[],
  id: string
): NestedSlashCommandItem | undefined {
  const lowerId = id.toLowerCase();

  for (const group of groups) {
    for (const command of group.commands) {
      if (isNestedCommand(command) && command.id.toLowerCase() === lowerId) {
        return command;
      }
    }
  }

  return undefined;
}

function isNestedCommand(
  item: SlashCommandItem
): item is NestedSlashCommandItem {
  return 'commands' in item && Array.isArray(item.commands) && !!item.id;
}

function match(item: SlashCommandItem, search: string): boolean {
  const lower = search.toLowerCase();

  return (
    item.title.toLowerCase().includes(lower) ||
    item.description?.toLowerCase().includes(lower) ||
    item.searchTerms.some((term) => term.toLowerCase().includes(lower))
  );
}
