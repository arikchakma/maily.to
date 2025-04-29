import { BlockGroupItem, BlockItem } from '@/blocks';
import { Editor } from '@tiptap/core';

type SlashCommandFilterOptions = {
  readonly groups: BlockGroupItem[];
  query: string;
  editor: Editor;
};

export function filterSlashCommands(options: SlashCommandFilterOptions) {
  const { groups, query, editor } = options;
  const newGroups = [...groups];
  let searchQuery = query?.toLowerCase();

  const subCommandMatch = searchQuery.match(/^([^.]+)\./);

  // so if we are inside a subcommand we need to
  // filter the commands based on the remaining search
  if (subCommandMatch) {
    const [match, subCommandId] = subCommandMatch;
    const subCommandGroup = findSubCommandGroup(groups, subCommandId);

    if (subCommandGroup) {
      // headers.something -> headers. -> something (remainingSearch)
      const remainingSearch = searchQuery.slice(match.length);
      const filteredCommands = subCommandGroup.commands.filter(
        (item) => !remainingSearch || isCommandMatch(item, remainingSearch)
      );

      return filteredCommands.length
        ? [
            {
              ...subCommandGroup,
              commands: filteredCommands,
            },
          ]
        : [];
    }
  }

  const filteredGroups = newGroups
    .map((group) => {
      return {
        ...group,
        commands: group.commands.flatMap((item) =>
          processCommand({ item, search: searchQuery, editor })
        ),
      };
    })
    .filter((group) => group.commands.length > 0);

  return filteredGroups;
}

type SubCommandGroup = BlockItem & {
  id: string;
  commands: BlockItem[];
};

function findSubCommandGroup(
  groups: BlockGroupItem[],
  subCommandId: string
): SubCommandGroup | undefined {
  return groups
    .flatMap((group) => group.commands)
    .find(
      (item) =>
        'commands' in item &&
        item.id?.toLowerCase() === subCommandId.toLowerCase()
    ) as SubCommandGroup | undefined;
}

function containsText(text: string | undefined, search: string): boolean {
  if (!text) {
    return false;
  }

  return text.toLowerCase().includes(search.toLowerCase());
}

function isCommandMatch(item: BlockItem, search: string): boolean {
  return (
    containsText(item.title, search) ||
    containsText(item.description, search) ||
    (item.searchTerms?.some((term) => containsText(term, search)) ?? false)
  );
}

function isSubCommand(item: BlockItem): item is SubCommandGroup {
  return 'commands' in item && Array.isArray(item.commands) && !!item.id;
}

type ProcessCommandOptions = {
  item: BlockItem;
  search: string;
  editor: Editor;
};

function processCommand(options: ProcessCommandOptions): BlockItem[] {
  const { item, search, editor } = options;

  const show = item?.render?.(editor);
  if (show === null) {
    return [];
  }

  const isSearching = search.length > 0;
  if (isSubCommand(item)) {
    // if we are not searching, we want to return a navigable command
    // that will navigate to the group so that we can navigate into it
    // using the arrow keys / enter key
    // @ts-expect-error
    const navigableCommand: BlockItem = {
      ...item,
      command: (options) => {
        const { editor, range } = options;
        editor.chain().focus().insertContentAt(range, `/${item.id}.`).run();
      },
    };

    // first check if the item matches the search
    const matched = isCommandMatch(navigableCommand, search);
    if (matched) {
      return [navigableCommand];
    }

    // so the main command does not match the search
    // we need to check if any of the commands match the search
    // if they do, we return the commands instead of the main command
    const hasMatchingCommands =
      navigableCommand?.commands?.some((command) =>
        isCommandMatch(command, search)
      ) ?? false;

    if (!hasMatchingCommands) {
      return [];
    }

    return navigableCommand?.commands ?? [];
  }

  return !isSearching || isCommandMatch(item, search) ? [item] : [];
}
