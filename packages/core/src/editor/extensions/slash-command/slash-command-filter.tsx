// let newGroups = groups;

import { BlockGroupItem, BlockItem } from '@/blocks';
import { Editor } from '@tiptap/core';

//       let search = query.toLowerCase();
//       const subCommandIds = newGroups
//         .map((group) => {
//           return (
//             group.commands
//               .filter((item) => 'commands' in item)
//               // @ts-ignore
//               .map((item) => item?.id.toLowerCase())
//           );
//         })
//         .flat()
//         .map((id) => `${id}.`);

//       const shouldEnterSubCommand = subCommandIds.some((id) =>
//         search.startsWith(id)
//       );

//       if (shouldEnterSubCommand) {
//         const subCommandId = subCommandIds.find((id) => search.startsWith(id));
//         const sanitizedSubCommandId = subCommandId?.slice(0, -1);

//         const group = newGroups
//           .find((group) => {
//             return group.commands.some(
//               // @ts-ignore
//               (item) => item?.id?.toLowerCase() === sanitizedSubCommandId
//             );
//           })
//           ?.commands.find(
//             // @ts-ignore
//             (item) => item?.id?.toLowerCase() === sanitizedSubCommandId
//           );

//         if (!group) {
//           return groups;
//         }

//         search = search.replace(subCommandId || '', '');
//         newGroups = [
//           {
//             ...group,
//             commands: group?.commands || [],
//           },
//         ];
//       }

//       const filteredGroups = newGroups
//         .map((group) => {
//           return {
//             ...group,
//             commands: group.commands
//               .filter((item) => {
//                 if (typeof query === 'string' && query.length > 0) {
//                   const show = item?.render?.(editor);
//                   if (show === null) {
//                     return false;
//                   }

//                   return (
//                     item.title.toLowerCase().includes(search) ||
//                     (item?.description &&
//                       item?.description.toLowerCase().includes(search)) ||
//                     (item.searchTerms &&
//                       item.searchTerms.some((term: string) =>
//                         term.includes(search)
//                       ))
//                   );
//                 }
//                 return true;
//               })
//               .map((item) => {
//                 const isSubCommandItem = 'commands' in item;
//                 if (isSubCommandItem) {
//                   // so to make it work with the enter key
//                   // we make it a command
//                   // @ts-ignore
//                   item = {
//                     ...item,
//                     command: (options) => {
//                       const { editor, range } = options;
//                       editor
//                         .chain()
//                         .focus()
//                         .insertContentAt(range, `/${item.id}.`)
//                         .run();
//                     },
//                   };
//                 }

//                 return item;
//               }),
//           };
//         })
//         .filter((group) => group.commands.length > 0);

//       return filteredGroups;

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
    if (!isSearching) {
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

      return [navigableCommand];
    }

    // now if we are searching, we will flatten the commands
    // if and only if the comamnds match the search
    const hasMatchingCommands = item.commands.some((command) =>
      isCommandMatch(command, search)
    );

    if (!hasMatchingCommands) {
      return [];
    }

    return item.commands;
  }

  const matched = isCommandMatch(item, search);
  if (!matched) {
    return [];
  }

  return !isSearching || isCommandMatch(item, search) ? [item] : [];
}
