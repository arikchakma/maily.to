import { BlockItem } from '@/blocks/types';
import { cn } from '@/editor/utils/classname';
import { updateScrollView } from '@/editor/utils/update-scroll-view';
import { Editor } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import { SuggestionOptions } from '@tiptap/suggestion';
import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import tippy, { GetReferenceClientRect } from 'tippy.js';
import { DEFAULT_SLASH_COMMANDS } from './default-slash-commands';

type CommandListProps = {
  items: BlockItem[];
  command: (item: BlockItem) => void;
  editor: Editor;
  range: any;
};

function CommandList(props: CommandListProps) {
  const { items, command, editor } = props;

  const [activeIndex, setActiveIndex] = useState(0);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [command, editor, items]
  );

  useEffect(() => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
          setActiveIndex((activeIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === 'ArrowDown') {
          setActiveIndex((activeIndex + 1) % items.length);
          return true;
        }
        if (e.key === 'Enter') {
          selectItem(activeIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [items, activeIndex, setActiveIndex, selectItem]);

  useEffect(() => {
    setActiveIndex(0);
  }, [items]);

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;

    const item = container?.children[activeIndex] as HTMLElement;

    if (item && container) {
      updateScrollView(container, item);
    }
  }, [activeIndex]);

  return items.length > 0 ? (
    <div className="mly-z-50 mly-w-72 mly-rounded-md mly-border mly-border-gray-200 mly-bg-white mly-shadow-md mly-transition-all">
      <div
        id="slash-command"
        ref={commandListContainer}
        className="mly-no-scrollbar mly-h-auto mly-max-h-[330px] mly-overflow-y-auto mly-scroll-smooth mly-p-1"
      >
        {items.map((item, index) => {
          return (
            <button
              className={cn(
                'mly-flex mly-w-full mly-items-center mly-space-x-2 mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-text-sm mly-text-gray-900 hover:mly-bg-gray-100 hover:mly-text-gray-900',
                index === activeIndex
                  ? 'mly-bg-gray-100 mly-text-gray-900'
                  : 'mly-bg-transparent'
              )}
              key={index}
              onClick={() => selectItem(index)}
              type="button"
            >
              {typeof item.render === 'function' ? (
                item.render(editor)
              ) : (
                <>
                  <div className="mly-flex mly-h-6 mly-w-6 mly-shrink-0 mly-items-center mly-justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="mly-font-medium">{item.title}</p>
                    <p className="mly-text-xs mly-text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </>
              )}
            </button>
          );
        })}
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
}

export function getSlashCommandSuggestions(
  commands: BlockItem[] = DEFAULT_SLASH_COMMANDS
): Omit<SuggestionOptions, 'editor'> {
  return {
    items: ({ query, editor }) => {
      return commands.filter((item) => {
        if (typeof query === 'string' && query.length > 0) {
          const search = query.toLowerCase();

          const show = item?.render?.(editor);
          if (show === null) {
            return false;
          }

          return (
            item.title.toLowerCase().includes(search) ||
            (item?.description &&
              item?.description.toLowerCase().includes(search)) ||
            (item.searchTerms &&
              item.searchTerms.some((term: string) => term.includes(search)))
          );
        }
        return true;
      });
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
