import {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  END,
  ENTER,
  HOME,
} from '@maily-to/ui';
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from '@tiptap/suggestion';
import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Fader } from '~/components/interface/fader';
import {
  SuggestionFooter,
  SuggestionWrapper,
} from '~/components/interface/suggestion';
import { TooltipProvider } from '~/components/interface/tooltip';
import { useScrollIntoView } from '~/hooks/use-scroll-into-view';
import { useSuggestionFaderScroll } from '~/hooks/use-suggestion-fader-scroll';
import { cn } from '~/utils/classname';
import type { SlashCommandGroupItem } from '~/utils/slash-command';

import { SlashCommandItem } from './slash-command-item';

const MAGIC_ITEMS_THRESHOLD = 6;

const NAVIGATION_KEYS = new Set([
  ARROW_UP,
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ENTER,
  HOME,
  END,
]);

type SlashCommandSuggestionListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

type SlashCommandSuggestionListProps = SuggestionProps<SlashCommandGroupItem>;

export const SlashCommandSuggestionList = forwardRef<
  SlashCommandSuggestionListRef,
  SlashCommandSuggestionListProps
>((props, ref) => {
  const { items: groups, command, editor, range, query } = props;

  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const [hoveredItemKey, setHoveredItemKey] = useState<string | null>(null);
  const [prevGroups, setPrevGroups] = useState(groups);

  const prevQuery = useRef('');
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
    [command, groups]
  );

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      const isNavigationKey = NAVIGATION_KEYS.has(event.key);
      if (!isNavigationKey || !groups.length) {
        return false;
      }

      let newCommandIndex = selectedCommandIndex;
      let newGroupIndex = selectedGroupIndex;
      let shouldSelect = false;
      let shouldSavePrev = false;
      let shouldRestorePrev = false;

      switch (event.key) {
        case ARROW_LEFT: {
          const group = groups?.[selectedGroupIndex];
          const isInsideSubCommand = group && 'id' in group;
          if (!isInsideSubCommand) {
            return false;
          }

          shouldRestorePrev = true;
          break;
        }
        case ARROW_RIGHT: {
          const command =
            groups?.[selectedGroupIndex]?.commands?.[selectedCommandIndex];
          const isSelectingSubCommand = command && 'commands' in command;
          if (!isSelectingSubCommand) {
            return false;
          }

          shouldSelect = true;
          shouldSavePrev = true;
          break;
        }
        case ENTER:
          shouldSelect = true;
          shouldSavePrev = true;
          break;
        case HOME:
          newGroupIndex = 0;
          newCommandIndex = 0;
          break;
        case END:
          newGroupIndex = groups.length - 1;
          newCommandIndex = groups[newGroupIndex]?.commands.length - 1 || 0;
          break;
        case ARROW_UP:
          newCommandIndex = selectedCommandIndex - 1;
          newGroupIndex = selectedGroupIndex;
          if (newCommandIndex < 0) {
            newGroupIndex = selectedGroupIndex - 1;
            newCommandIndex = groups[newGroupIndex]?.commands.length - 1 || 0;
          }
          if (newGroupIndex < 0) {
            newGroupIndex = groups.length - 1;
            newCommandIndex = groups[newGroupIndex]?.commands.length - 1 || 0;
          }
          break;
        case ARROW_DOWN: {
          const commands = groups[selectedGroupIndex].commands;
          newCommandIndex = selectedCommandIndex + 1;
          newGroupIndex = selectedGroupIndex;
          if (commands.length - 1 < newCommandIndex) {
            newCommandIndex = 0;
            newGroupIndex = selectedGroupIndex + 1;
          }
          if (groups.length - 1 < newGroupIndex) {
            newGroupIndex = 0;
          }
          break;
        }
        default:
          return false;
      }

      event.preventDefault();

      if (shouldRestorePrev) {
        editor
          .chain()
          .focus()
          .insertContentAt(range, `/${prevQuery.current}`)
          .run();
        setTimeout(() => {
          setSelectedGroupIndex(prevSelectedGroupIndex.current);
          setSelectedCommandIndex(prevSelectedCommandIndex.current);
        }, 0);
        return true;
      }

      if (shouldSelect) {
        selectItem(selectedGroupIndex, selectedCommandIndex);
      }

      if (shouldSavePrev) {
        prevQuery.current = query;
        prevSelectedGroupIndex.current = selectedGroupIndex;
        prevSelectedCommandIndex.current = selectedCommandIndex;
      }

      if (
        newGroupIndex !== selectedGroupIndex ||
        newCommandIndex !== selectedCommandIndex
      ) {
        setSelectedGroupIndex(newGroupIndex);
        setSelectedCommandIndex(newCommandIndex);
      }

      return true;
    },
  }));

  const { containerRef: commandListContainer, activeRef: activeCommandRef } =
    useScrollIntoView<HTMLDivElement, HTMLButtonElement>([
      selectedGroupIndex,
      selectedCommandIndex,
    ]);

  if (prevGroups !== groups) {
    setPrevGroups(groups);
    setSelectedGroupIndex(0);
    setSelectedCommandIndex(0);
  }

  useEffect(() => {
    return () => {
      prevQuery.current = '';
      prevSelectedGroupIndex.current = 0;
      prevSelectedCommandIndex.current = 0;
    };
  }, []);

  const totalCommands = groups.reduce(
    (acc, group) => acc + group.commands.length,
    0
  );

  const { showFaders, topFaderRef, bottomFaderRef, onScroll } =
    useSuggestionFaderScroll({
      itemCount: totalCommands,
      threshold: MAGIC_ITEMS_THRESHOLD,
    });

  if (!groups || groups.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <SuggestionWrapper className="mly:w-68">
        <div className="mly:relative">
          <div
            ref={commandListContainer}
            className="mly:hide-scrollbar mly:max-h-78 mly:overflow-y-auto"
            onScroll={onScroll}
          >
            {groups.map((group, groupIndex) => {
              const isFirstGroup = groupIndex === 0;

              return (
                <Fragment key={groupIndex}>
                  <span
                    className={cn(
                      'mly:block mly:border-b mly:border-gray-200/70 mly:bg-soft-gray mly:p-2 mly:text-xs mly:text-gray-400 mly:uppercase',
                      !isFirstGroup && 'mly:border-t'
                    )}
                  >
                    {group.title}
                  </span>
                  <div className="mly:space-y-0.5 mly:p-1">
                    {group.commands.map((item, commandIndex) => {
                      const itemKey = `${groupIndex}-${commandIndex}`;
                      return (
                        <SlashCommandItem
                          key={itemKey}
                          item={item}
                          groupIndex={groupIndex}
                          commandIndex={commandIndex}
                          selectedGroupIndex={selectedGroupIndex}
                          selectedCommandIndex={selectedCommandIndex}
                          selectItem={() =>
                            selectItem(groupIndex, commandIndex)
                          }
                          editor={editor}
                          activeCommandRef={activeCommandRef}
                          hoveredItemKey={hoveredItemKey}
                          onHover={(isHovered) =>
                            setHoveredItemKey(isHovered ? itemKey : null)
                          }
                        />
                      );
                    })}
                  </div>
                </Fragment>
              );
            })}
          </div>

          {showFaders && (
            <>
              <Fader
                side="top"
                stop="50%"
                className="mly:opacity-0"
                ref={topFaderRef}
              />
              <Fader
                side="bottom"
                stop="50%"
                className="mly:opacity-100"
                ref={bottomFaderRef}
              />
            </>
          )}
        </div>

        <SuggestionFooter showFaders={showFaders} />
      </SuggestionWrapper>
    </TooltipProvider>
  );
});

SlashCommandSuggestionList.displayName = 'SlashCommandSuggestionList';
