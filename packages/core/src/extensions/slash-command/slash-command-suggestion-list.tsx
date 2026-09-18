import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from '@tiptap/suggestion';
import { Fragment, forwardRef, useImperativeHandle, useState } from 'react';

import {
  SuggestionFooter,
  SuggestionWrapper,
} from '~/components/interface/suggestion';
import { useScrollIntoView } from '~/hooks/use-scroll-into-view';
import { ARROW_DOWN, ARROW_UP, END, ENTER, HOME } from '~/utils/composite';
import type {
  SlashCommandGroupItem,
  SlashCommandItem as SlashCommandItemType,
} from '~/utils/slash-command';

import { SlashCommandItem } from './slash-command-item';

const NAVIGATION_KEYS = new Set([ARROW_UP, ARROW_DOWN, ENTER, HOME, END]);

export type SlashCommandSuggestionListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

export type SlashCommandSuggestionListProps =
  SuggestionProps<SlashCommandGroupItem>;

export const SlashCommandSuggestionList = forwardRef<
  SlashCommandSuggestionListRef,
  SlashCommandSuggestionListProps
>((props, ref) => {
  const { command: selectItem, editor, items: groups } = props;

  const flattened = groups.flatMap((group) => group.commands);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [prevGroups, setPrevGroups] = useState(groups);

  const { activeRef: activeItemRef, containerRef: scrollContainerRef } =
    useScrollIntoView<HTMLDivElement, HTMLButtonElement>([selectedIndex]);

  if (prevGroups !== groups) {
    setPrevGroups(groups);
    setSelectedIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }

  const selectCommand = (item: SlashCommandItemType) => {
    selectItem(item as unknown as SlashCommandGroupItem);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (!NAVIGATION_KEYS.has(event.key) || !flattened.length) {
        return false;
      }

      let newIndex = selectedIndex;
      let shouldSelect = false;

      switch (event.key) {
        case HOME:
          newIndex = 0;
          break;
        case END:
          newIndex = flattened.length - 1;
          break;
        case ARROW_UP:
          newIndex = (selectedIndex + flattened.length - 1) % flattened.length;
          break;
        case ARROW_DOWN:
          newIndex = (selectedIndex + 1) % flattened.length;
          break;
        case ENTER:
          shouldSelect = true;
          break;
        default:
          return false;
      }

      event.preventDefault();

      if (shouldSelect) {
        const item = flattened[selectedIndex];
        if (item) {
          selectCommand(item);
        }

        return true;
      }

      if (newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
      }

      return true;
    },
  }));

  if (!groups || groups.length === 0) {
    return null;
  }

  let itemIndex = -1;

  return (
    <SuggestionWrapper data-variant="slash-command">
      <div data-mly-suggestion-body="">
        <div
          data-axis="y"
          data-mly-scroll-fade=""
          data-mly-suggestion-scroll=""
          ref={scrollContainerRef}
        >
          {groups.map((group, groupIndex) => (
            <Fragment key={group.title}>
              <span
                data-first={groupIndex === 0 ? '' : undefined}
                data-mly-slash-command-group=""
              >
                {group.title}
              </span>
              <div data-mly-suggestion-items="">
                {group.commands.map((item) => {
                  itemIndex += 1;
                  const isSelected = itemIndex === selectedIndex;
                  const itemKey = `${groupIndex}-${itemIndex}`;

                  return (
                    <SlashCommandItem
                      editor={editor}
                      hoveredKey={hoveredKey}
                      isSelected={isSelected}
                      item={item}
                      itemKey={itemKey}
                      key={item.title}
                      onClick={() => selectCommand(item)}
                      onHover={(isHovered) =>
                        setHoveredKey(isHovered ? itemKey : null)
                      }
                      ref={isSelected ? activeItemRef : null}
                    />
                  );
                })}
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      <SuggestionFooter />
    </SuggestionWrapper>
  );
});

SlashCommandSuggestionList.displayName = 'SlashCommandSuggestionList';
