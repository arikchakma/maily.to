import { ARROW_DOWN, ARROW_UP, END, ENTER, HOME } from '@maily-to/ui';
import { BracesIcon } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';

import { Fader } from '~/components/interface/fader';
import {
  SuggestionFooter,
  SuggestionKeyIcon,
  SuggestionWrapper,
} from '~/components/interface/suggestion';
import { useScrollIntoView } from '~/hooks/use-scroll-into-view';
import { useSuggestionFaderScroll } from '~/hooks/use-suggestion-fader-scroll';
import { cn } from '~/utils/classname';
import type { Variable } from '~/utils/variable';

// the faders are only shown when the number of items
// is greater than or equal to 7, and 28*7 = 196px
// which is the height of the container
const MAGIC_ITEMS_THRESHOLD = 7;

const NAVIGATION_KEYS = new Set([ARROW_UP, ARROW_DOWN, ENTER, HOME, END]);

export type VariableSuggestionsPopoverProps = {
  items: Variable[];
  onSelectItem: (item: Variable) => void;
};

export type VariableSuggestionsPopoverRef = {
  onKeyDown: (event: KeyboardEvent) => boolean;
};

export type VariableSuggestionsPopoverType = React.ForwardRefExoticComponent<
  VariableSuggestionsPopoverProps &
    React.RefAttributes<VariableSuggestionsPopoverRef>
>;

export const VariableSuggestionsPopover: VariableSuggestionsPopoverType =
  forwardRef((props, ref) => {
    const { items, onSelectItem } = props;

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [prevItems, setPrevItems] = useState(items);

    const { containerRef: scrollContainerRef, activeRef: activeItemRef } =
      useScrollIntoView<HTMLDivElement, HTMLButtonElement>([selectedIndex]);

    if (prevItems !== items) {
      setPrevItems(items);
      setSelectedIndex(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }

    useImperativeHandle(ref, () => ({
      onKeyDown: (event) => {
        const isNavigationKey = NAVIGATION_KEYS.has(event.key);
        if (!isNavigationKey || !items.length) {
          return false;
        }

        let newIndex = selectedIndex;
        let shouldSelect = false;

        switch (event.key) {
          case HOME:
            newIndex = 0;
            break;
          case END:
            newIndex = items.length - 1;
            break;
          case ARROW_UP:
            newIndex = (selectedIndex + items.length - 1) % items.length;
            break;
          case ARROW_DOWN:
            newIndex = (selectedIndex + 1) % items.length;
            break;
          case ENTER:
            shouldSelect = true;
            break;
          default:
            return false;
        }

        event.preventDefault();

        if (shouldSelect) {
          const item = items[selectedIndex];
          if (item) {
            onSelectItem(item);
          }
          return true;
        }

        if (newIndex !== selectedIndex) {
          setSelectedIndex(newIndex);
        }

        return true;
      },
    }));

    const { showFaders, topFaderRef, bottomFaderRef, onScroll } =
      useSuggestionFaderScroll({
        itemCount: items.length,
        threshold: MAGIC_ITEMS_THRESHOLD,
      });

    return (
      <SuggestionWrapper>
        <div
          className={cn(
            'mly:flex mly:items-center mly:justify-between mly:gap-2 mly:bg-gray-50 mly:p-1.5 mly:text-gray-500',
            !showFaders && 'mly:tiny-border mly:tiny-border-b'
          )}
        >
          <span className="mly:text-xs mly:uppercase">Variables</span>
          <SuggestionKeyIcon>
            <BracesIcon className="mly:size-3" />
          </SuggestionKeyIcon>
        </div>

        <div className="mly:relative">
          <div
            ref={scrollContainerRef}
            className="mly:hide-scrollbar mly:max-h-52 mly:overflow-y-auto"
            onScroll={onScroll}
          >
            <div className="mly:flex mly:w-fit mly:min-w-full mly:flex-col mly:gap-0.5 mly:p-1">
              {items?.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={index}
                    ref={isSelected ? activeItemRef : null}
                    onClick={() => onSelectItem(item)}
                    className={cn(
                      'mly:flex mly:w-fit mly:min-w-full mly:items-center mly:gap-2 mly:rounded-md mly:px-2 mly:py-1 mly:text-left mly:font-mono mly:text-sm mly:text-gray-900 mly:hover:bg-soft-gray',
                      isSelected ? 'mly:bg-soft-gray' : 'mly:bg-white'
                    )}
                  >
                    <BracesIcon className="mly:size-3 mly:text-rose-600" />
                    {item?.label || item.id || item.name}
                  </button>
                );
              })}

              {items.length === 0 && (
                <div className="mly:flex mly:h-7 mly:w-full mly:items-center mly:gap-2 mly:rounded-md mly:px-2 mly:py-1 mly:text-left mly:font-mono mly:text-sm mly:text-gray-900 mly:hover:bg-soft-gray">
                  No result
                </div>
              )}
            </div>
          </div>

          {showFaders && (
            <>
              <Fader
                side="top"
                stop="50%"
                className="mly:opacity-0"
                backgroundColor="var(--mly-color-gray-50)"
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
    );
  });
