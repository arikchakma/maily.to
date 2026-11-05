import { BracesIcon } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';

import {
  SuggestionFooter,
  SuggestionHeader,
  SuggestionKeyIcon,
  SuggestionWrapper,
} from '~/components/interface/suggestion';
import { useScrollIntoView } from '~/hooks/use-scroll-into-view';
import { ARROW_DOWN, ARROW_UP, END, ENTER, HOME } from '~/utils/composite';
import type { Variable } from '~/utils/variable';

// the faders are only shown when the number of items
// is greater than or equal to 7, and 28*7 = 196px
// which is the height of the container
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

    const { activeRef: activeItemRef, containerRef: scrollContainerRef } =
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
        if (!NAVIGATION_KEYS.has(event.key) || !items.length) {
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

    return (
      <SuggestionWrapper>
        <SuggestionHeader>
          <span>Variables</span>
          <SuggestionKeyIcon>
            <BracesIcon size={12} />
          </SuggestionKeyIcon>
        </SuggestionHeader>

        <div data-mly-suggestion-body="">
          <div
            data-axis="y"
            data-mly-scroll-fade=""
            data-mly-suggestion-scroll=""
            ref={scrollContainerRef}
          >
            <div data-mly-suggestion-items="">
              {items.map((item, index) => (
                <button
                  data-mly-suggestion-item=""
                  data-selected={index === selectedIndex ? '' : undefined}
                  key={item.id ?? index}
                  onClick={() => onSelectItem(item)}
                  ref={index === selectedIndex ? activeItemRef : null}
                  type="button"
                >
                  <BracesIcon data-mly-suggestion-item-icon="" size={12} />
                  {item.label || item.id}
                </button>
              ))}

              {items.length === 0 ? (
                <div data-mly-suggestion-empty="">No result</div>
              ) : null}
            </div>
          </div>
        </div>

        <SuggestionFooter />
      </SuggestionWrapper>
    );
  });

VariableSuggestionsPopover.displayName = 'VariableSuggestionsPopover';
