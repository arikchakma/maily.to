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
  description?: string;
  icon?: ReactNode;
  /**
   * Controls visibility in the suggestion list. Return `null` to hide the
   * item, `true` to show it with defaults, or a ReactNode to replace the row.
   */
  render?: (editor: Editor) => ReactNode | null | true;
  preview?: string | ((editor: Editor) => ReactNode | null);
  searchTerms: string[];
  title: string;
};

type ExecutableSlashCommandItem = BaseSlashCommandItem & {
  command: SlashCommandItemCommand;
  commands?: never;
  id?: never;
};

type NestedSlashCommandItem = BaseSlashCommandItem & {
  command?: never;
  commands: SlashCommandItem[];
  id: string;
};

export type SlashCommandItem =
  | ExecutableSlashCommandItem
  | NestedSlashCommandItem;

export type SlashCommandGroupItem = {
  commands: SlashCommandItem[];
  title: string;
};

type FilterSlashCommandsOptions = {
  editor: Editor;
  groups: readonly SlashCommandGroupItem[];
  query: string;
};

function isNestedCommand(
  item: SlashCommandItem
): item is NestedSlashCommandItem {
  return 'commands' in item && Array.isArray(item.commands) && !!item.id;
}

function match(item: SlashCommandItem, search: string): boolean {
  return (
    item.title.toLowerCase().includes(search) ||
    (item.description?.toLowerCase().includes(search) ?? false) ||
    item.searchTerms.some((term) => term.toLowerCase().includes(search))
  );
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

type VisibleGroupsOptions = {
  editor: Editor;
  groups: readonly SlashCommandGroupItem[];
};

function getVisibleGroups(
  options: VisibleGroupsOptions
): SlashCommandGroupItem[] {
  const { editor, groups } = options;

  const isVisible = (item: SlashCommandItem) => {
    return item.render?.(editor) !== null;
  };

  return groups.map((group) => {
    return {
      ...group,
      commands: group.commands.filter(isVisible).map((item) => {
        return isNestedCommand(item)
          ? { ...item, commands: item.commands.filter(isVisible) }
          : item;
      }),
    };
  });
}

/**
 * Filters slash command groups by query. Supports nested commands
 * via dot notation (e.g. "headers.h1"). When a nested group matches,
 * it's expanded inline and made navigable.
 */
export function filterSlashCommands(
  options: FilterSlashCommandsOptions
): SlashCommandGroupItem[] {
  const { editor, query } = options;
  const groups = getVisibleGroups({ editor, groups: options.groups });
  const search = query.toLowerCase();

  // handle subcommand filtering (e.g., "headers.something")
  const subCommandMatch = /^([^.]+)\./.exec(search);
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

        return item.commands.some((child) => match(child, search))
          ? item.commands
          : [];
      }),
    }))
    .filter((group) => group.commands.length > 0);
}
