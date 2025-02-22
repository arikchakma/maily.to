import { BlockGroupItem, BlockItem } from '@/blocks/types';
import { cn } from '@/editor/utils/classname';
import { Editor } from '@tiptap/core';
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
import { ChevronRightIcon } from 'lucide-react';

type CommandListProps = {
  items: BlockGroupItem[];
  command: (item: BlockItem) => void;
  editor: Editor;
  range: any;
  query: string;
};

const CommandList = forwardRef(function CommandList(
  props: CommandListProps,
  ref
) {
  const { items: groups, command, editor } = props;

  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

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
      const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
      if (navigationKeys.includes(event.key)) {
        if (event.key === 'ArrowUp') {
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
        if (event.key === 'ArrowDown') {
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
        if (event.key === 'Enter') {
          if (!groups.length) {
            return false;
          }

          selectItem(selectedGroupIndex, selectedCommandIndex);
          return true;
        }
        return false;
      }
    },
  }));

  useEffect(() => {
    setSelectedGroupIndex(0);
    setSelectedCommandIndex(0);
  }, [groups]);

  const commandListContainer = useRef<HTMLDivElement>(null);
  const activeCommandRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;
    const activeCommandContainer = activeCommandRef?.current;
    if (!container || !activeCommandContainer) {
      return;
    }

    const { offsetTop, offsetHeight } = activeCommandContainer;
    container.scrollTop = offsetTop - offsetHeight;
  }, [
    selectedGroupIndex,
    selectedCommandIndex,
    commandListContainer,
    activeCommandRef,
  ]);

  return groups.length > 0 ? (
    <div className="mly-z-50 mly-w-72 mly-overflow-hidden mly-rounded-md mly-border mly-border-gray-200 mly-bg-white mly-shadow-md mly-transition-all">
      <div
        id="slash-command"
        ref={commandListContainer}
        className="mly-no-scrollbar mly-h-auto mly-max-h-[330px] mly-overflow-y-auto mly-scroll-smooth"
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
            <div className="mly-p-1">
              {group.commands.map((item, commandIndex) => {
                const isActive =
                  groupIndex === selectedGroupIndex &&
                  commandIndex === selectedCommandIndex;
                const isSubCommand = 'commands' in item;

                const hasRenderFunction = typeof item.render === 'function';
                const renderFunctionValue = hasRenderFunction
                  ? item.render?.(editor)
                  : null;

                let value = (
                  <>
                    <div className="mly-flex mly-h-6 mly-w-6 mly-shrink-0 mly-items-center mly-justify-center">
                      {item.icon}
                    </div>
                    <div className="mly-grow">
                      <p className="mly-font-medium">{item.title}</p>
                      <p className="mly-text-xs mly-text-gray-400">
                        {item.description}
                      </p>
                    </div>

                    {isSubCommand && (
                      <span className="mly-block mly-px-1 mly-text-gray-400">
                        <ChevronRightIcon className="mly-size-3.5 mly-stroke-[2.5]" />
                      </span>
                    )}
                  </>
                );

                if (
                  renderFunctionValue !== null &&
                  renderFunctionValue !== true
                ) {
                  value = renderFunctionValue!;
                }

                return (
                  <button
                    className={cn(
                      'mly-flex mly-w-full mly-items-center mly-gap-2 mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-text-sm mly-text-gray-900 hover:mly-bg-gray-100 hover:mly-text-gray-900',
                      isActive
                        ? 'mly-bg-gray-100 mly-text-gray-900'
                        : 'mly-bg-transparent'
                    )}
                    key={commandIndex}
                    onClick={() => selectItem(groupIndex, commandIndex)}
                    type="button"
                    ref={isActive ? activeCommandRef : null}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </Fragment>
        ))}
      </div>
      <div className="mly-border-t mly-border-gray-200 mly-px-1 mly-py-3 mly-pl-4">
        <div className="mly-flex mly-items-center">
          <p className="mly-text-center mly-text-xs mly-text-gray-400">
            <kbd className="mly-rounded mly-border mly-p-1 mly-px-2 mly-font-medium">
              ↑
            </kbd>
            <kbd className="mly-ml-1 mly-rounded mly-border mly-p-1 mly-px-2 mly-font-medium">
              ↓
            </kbd>{' '}
            to navigate
          </p>
          <span aria-hidden="true" className="mly-select-none mly-px-1">
            ·
          </span>
          <p className="mly-text-center mly-text-xs mly-text-gray-400">
            <kbd className="mly-rounded mly-border mly-p-1 mly-px-1.5 mly-font-medium">
              Enter
            </kbd>{' '}
            to select
          </p>
        </div>
      </div>
    </div>
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
