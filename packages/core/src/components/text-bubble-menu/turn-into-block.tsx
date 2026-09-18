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

export type TurnIntoBlockProps = {
  container?: FloatingUIContainer;
  items: TurnIntoItems;
};

export function TurnIntoBlock(props: TurnIntoBlockProps) {
  const { container, items } = props;

  const [open, setOpen] = useState(false);

  const activeItem = items.find(isActiveTurnIntoItem);
  const { icon: ActiveIcon = LetterTextIcon } = activeItem ?? {};

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <BubbleButton
        container={container}
        data-variant="turn-into"
        isActive={open}
        label="Turn into"
        render={<DropdownMenuTrigger />}
        tooltip="Turn into"
      >
        <ActiveIcon size={14} />
        <ChevronDownIcon size={12} />
      </BubbleButton>

      <DropdownPositioner container={container}>
        <DropdownMenuPopup data-variant="turn-into">
          {items.map((item) => {
            if (isTurnIntoCategory(item)) {
              return (
                <span data-mly-dropdown-menu-category="" key={item.id}>
                  {item.label}
                </span>
              );
            }

            return (
              <DropdownMenuItem
                disabled={item.disabled}
                key={item.id}
                onClick={item.onClick}
              >
                <item.icon size={15} />
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuPopup>
      </DropdownPositioner>
    </DropdownMenu>
  );
}
