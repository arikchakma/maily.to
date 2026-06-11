import { ChevronDownIcon, LetterTextIcon } from 'lucide-react';
import { useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import type { TurnIntoItems } from '~/utils/turn-into';
import { isActiveTurnIntoItem, isTurnIntoCategory } from '~/utils/turn-into';

import { BubbleButton } from '../interface/bubble-button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPopup,
  DropdownMenuTrigger,
  DropdownPositioner,
} from '../interface/dropdown-menu';

type TurnIntoBlockProps = {
  items: TurnIntoItems;
  container: FloatingUIContainer;
};

export function TurnIntoBlock(props: TurnIntoBlockProps) {
  const { items, container } = props;

  const [open, setOpen] = useState(false);

  const activeItem = items.find(isActiveTurnIntoItem);
  const { icon: ActiveIcon = LetterTextIcon } = activeItem || {};

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <BubbleButton
            label="Turn into"
            variant="ghost"
            size="default"
            className="mly:gap-1 mly:px-1.5"
            data-active={open}
            tooltip="Turn into"
            container={container}
          >
            <ActiveIcon className="mly:size-3.5" />
            <ChevronDownIcon className="mly:size-3" />
          </BubbleButton>
        }
      />

      <DropdownPositioner container={container}>
        <DropdownMenuPopup className="mly:flex mly:w-[160px] mly:flex-col">
          {items.map((item) => {
            if (isTurnIntoCategory(item)) {
              return (
                <label
                  key={item.id}
                  className="mly:my-2 mly:px-2 mly:text-xs mly:font-medium mly:text-midnight-gray/60 mly:first:mt-1"
                >
                  {item.label}
                </label>
              );
            }

            return (
              <DropdownMenuItem key={item.id} onClick={item.onClick}>
                <item.icon className="mly:size-[15px] mly:shrink-0" />
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuPopup>
      </DropdownPositioner>
    </DropdownMenu>
  );
}
