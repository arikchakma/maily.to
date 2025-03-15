import { BlockGroupItem, BlockItem } from '@/blocks/types';
import { cn } from '@/editor/utils/classname';
import { Editor, Range } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import { SuggestionOptions } from '@tiptap/suggestion';
import {
  forwardRef,
  Fragment,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import tippy, { GetReferenceClientRect } from 'tippy.js';
import { DEFAULT_SLASH_COMMANDS } from './default-slash-commands';
import { TooltipProvider } from '@/editor/components/ui/tooltip';
import { SlashCommandItem } from './slash-command-item';

type CommandListProps = {
  items: BlockGroupItem[];
  command: (item: BlockItem) => void;
  editor: Editor;
  range: Range;
  query: string;
};

const CommandList = forwardRef(function CommandList(
  props: CommandListProps,
  ref
) {
  const { items: groups, command, editor, range } = props;

  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  const prevSelectedGroupIndex = useRef(0);
  const prevSelectedCommandIndex = useRef(0);

  const selectItem = useCallback(
    (groupIndex: number, commandIndex: number) => {
      const item = groups[groupIndex].commands[commandIndex];
      if (!item) {
        return;
      }

      command(item);
    },
    [command]
  );

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      const navigationKeys = [
        'ArrowUp',
        'ArrowDown',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
      ];
      if (navigationKeys.includes(event.key)) {
        switch (event.key) {
          case 'ArrowLeft': {
            const isInsideSubCommand = 'id' in groups[selectedGroupIndex];
            if (!isInsideSubCommand) {
              return false;
            }

            event.preventDefault();
            editor
              .chain()
              .focus()
              .deleteRange({
                // so that we don't delete the slash
                from: range.from + 1,
                to: range.to,
              })
              .run();
            setTimeout(() => {
              setSelectedGroupIndex(prevSelectedGroupIndex.current);
              setSelectedCommandIndex(prevSelectedCommandIndex.current);
            }, 0);
            return true;
          }
          case 'ArrowRight': {
            const isSelectingSubCommand =
              'commands' in
              groups[selectedGroupIndex].commands[selectedCommandIndex];
            if (!isSelectingSubCommand) {
              return false;
            }
            event.preventDefault();
            selectItem(selectedGroupIndex, selectedCommandIndex);
            prevSelectedGroupIndex.current = selectedGroupIndex;
            prevSelectedCommandIndex.current = selectedCommandIndex;
            return true;
          }
          case 'Enter': {
            if (!groups.length) {
              return false;
            }
            selectItem(selectedGroupIndex, selectedCommandIndex);
            prevSelectedGroupIndex.current = selectedGroupIndex;
            prevSelectedCommandIndex.current = selectedCommandIndex;
            return true;
          }
          case 'ArrowUp': {
            if (!groups.length) {
              return false;
            }
            let newCommandIndex = selectedCommandIndex - 1;
            let newGroupIndex = selectedGroupIndex;
            if (newCommandIndex < 0) {
              newGroupIndex = selectedGroupIndex - 1;
              newCommandIndex = groups[newGroupIndex]?.commands.length - 1 || 0;
            }
            if (newGroupIndex < 0) {
              newGroupIndex = groups.length - 1;
              newCommandIndex = groups[newGroupIndex]?.commands.length - 1 || 0;
            }
            setSelectedGroupIndex(newGroupIndex);
            setSelectedCommandIndex(newCommandIndex);
            return true;
          }
          case 'ArrowDown': {
            if (!groups.length) {
              return false;
            }
            const commands = groups[selectedGroupIndex].commands;
            let newCommandIndex = selectedCommandIndex + 1;
            let newGroupIndex = selectedGroupIndex;
            if (commands.length - 1 < newCommandIndex) {
              newCommandIndex = 0;
              newGroupIndex = selectedGroupIndex + 1;
            }
            if (groups.length - 1 < newGroupIndex) {
              newGroupIndex = 0;
            }
            setSelectedGroupIndex(newGroupIndex);
            setSelectedCommandIndex(newCommandIndex);
            return true;
          }
          default: {
            return false;
          }
        }
      }
    },
  }));

  const commandListContainer = useRef<HTMLDivElement>(null);
  const activeCommandRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;
    const activeCommandContainer = activeCommandRef?.current;
    if (!container || !activeCommandContainer) {
      return;
    }

    const { offsetTop, offsetHeight } = activeCommandContainer;
    container.style.transition = 'none';
    container.scrollTop = offsetTop - offsetHeight;
  }, [
    selectedGroupIndex,
    selectedCommandIndex,
    commandListContainer,
    activeCommandRef,
  ]);

  useEffect(() => {
    setSelectedGroupIndex(0);
    setSelectedCommandIndex(0);
  }, [groups]);

  useEffect(() => {
    return () => {
      prevSelectedGroupIndex.current = 0;
      prevSelectedCommandIndex.current = 0;
    };
  }, []);

  return groups.length > 0 ? (
    <TooltipProvider>
      <div className="mly-z-50 mly-w-72 mly-overflow-hidden mly-rounded-md mly-border mly-border-gray-200 mly-bg-white mly-shadow-md mly-transition-all">
        <div
          id="slash-command"
          ref={commandListContainer}
          className="mly-no-scrollbar mly-h-auto mly-max-h-[330px] mly-overflow-y-auto"
        >
          {groups.map((group, groupIndex) => (
            <Fragment key={groupIndex}>
              <span
                className={cn(
                  'mly-block mly-border-b mly-border-gray-200 mly-bg-soft-gray mly-p-2 mly-text-xs mly-uppercase mly-text-gray-400',
                  groupIndex > 0 ? 'mly-border-t' : ''
                )}
              >
                {group.title}
              </span>
              <div className="mly-space-y-0.5 mly-p-1">
                {group.commands.map((item, commandIndex) => {
                  return (
                    <SlashCommandItem
                      key={commandIndex}
                      item={item}
                      groupIndex={groupIndex}
                      commandIndex={commandIndex}
                      selectedGroupIndex={selectedGroupIndex}
                      selectedCommandIndex={selectedCommandIndex}
                      selectItem={() => selectItem(groupIndex, commandIndex)}
                      editor={editor}
                      activeCommandRef={activeCommandRef}
                    />
                  );
                })}
              </div>
            </Fragment>
          ))}
        </div>
        <div className="mly-border-t mly-border-gray-200 mly-px-1 mly-py-3 mly-pl-4">
          <div className="mly-flex mly-items-center">
            <p className="mly-text-center mly-text-xs mly-text-gray-400">
              <kbd className="mly-rounded mly-border mly-border-gray-200 mly-p-1 mly-px-2 mly-font-medium">
                ↑
              </kbd>
              <kbd className="mly-ml-1 mly-rounded mly-border mly-border-gray-200 mly-p-1 mly-px-2 mly-font-medium">
                ↓
              </kbd>{' '}
              to navigate
            </p>
            <span aria-hidden="true" className="mly-select-none mly-px-1">
              ·
            </span>
            <p className="mly-text-center mly-text-xs mly-text-gray-400">
              <kbd className="mly-rounded mly-border mly-border-gray-200 mly-p-1 mly-px-1.5 mly-font-medium">
                Enter
              </kbd>{' '}
              to select
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  ) : null;
});

export function getSlashCommandSuggestions(
  groups: BlockGroupItem[] = DEFAULT_SLASH_COMMANDS
): Omit<SuggestionOptions, 'editor'> {
  return {
    items: ({ query, editor }) => {
      let newGroups = groups;

      let search = query.toLowerCase();
      const subCommandIds = newGroups
        .map((group) => {
          return (
            group.commands
              .filter((item) => 'commands' in item)
              // @ts-ignore
              .map((item) => item?.id.toLowerCase())
          );
        })
        .flat()
        .map((id) => `${id}.`);

      const shouldEnterSubCommand = subCommandIds.some((id) =>
        search.startsWith(id)
      );

      if (shouldEnterSubCommand) {
        const subCommandId = subCommandIds.find((id) => search.startsWith(id));
        const sanitizedSubCommandId = subCommandId?.slice(0, -1);

        const group = newGroups
          .find((group) => {
            return group.commands.some(
              // @ts-ignore
              (item) => item?.id?.toLowerCase() === sanitizedSubCommandId
            );
          })
          ?.commands.find(
            // @ts-ignore
            (item) => item?.id?.toLowerCase() === sanitizedSubCommandId
          );

        if (!group) {
          return groups;
        }

        search = search.replace(subCommandId || '', '');
        newGroups = [
          {
            ...group,
            commands: group?.commands || [],
          },
        ];
      }

      const filteredGroups = newGroups
        .map((group) => {
          return {
            ...group,
            commands: group.commands
              .filter((item) => {
                if (typeof query === 'string' && query.length > 0) {
                  const show = item?.render?.(editor);
                  if (show === null) {
                    return false;
                  }

                  return (
                    item.title.toLowerCase().includes(search) ||
                    (item?.description &&
                      item?.description.toLowerCase().includes(search)) ||
                    (item.searchTerms &&
                      item.searchTerms.some((term: string) =>
                        term.includes(search)
                      ))
                  );
                }
                return true;
              })
              .map((item) => {
                const isSubCommandItem = 'commands' in item;
                if (isSubCommandItem) {
                  // so to make it work with the enter key
                  // we make it a command
                  // @ts-ignore
                  item = {
                    ...item,
                    command: (options) => {
                      const { editor, range } = options;
                      editor
                        .chain()
                        .focus()
                        .insertContentAt(range, `/${item.id}.`)
                        .run();
                    },
                  };
                }

                return item;
              }),
          };
        })
        .filter((group) => group.commands.length > 0);

      return filteredGroups;
    },
    allow: ({ editor }) => {
      const isInsideHTMLCodeBlock = editor.isActive('htmlCodeBlock');
      if (isInsideHTMLCodeBlock) {
        return false;
      }

      return true;
    },
    render: () => {
      let component: ReactRenderer<any>;
      let popup: InstanceType<any> | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(CommandList, {
            props,
            editor: props.editor,
          });

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect as GetReferenceClientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
          });
        },
        onUpdate: (props) => {
          component?.updateProps(props);

          popup &&
            popup[0].setProps({
              getReferenceClientRect: props.clientRect,
            });
        },
        onKeyDown: (props) => {
          if (props.event.key === 'Escape') {
            popup?.[0].hide();

            return true;
          }

          return component?.ref?.onKeyDown(props);
        },
        onExit: () => {
          if (!popup || !popup?.[0] || !component) {
            return;
          }

          popup?.[0].destroy();
          component?.destroy();
        },
      };
    },
  };
}
