import type { TextDirection } from '@maily-to/shared';
import { TEXT_DIRECTIONS } from '@maily-to/shared';
import { PilcrowIcon, PilcrowLeftIcon, PilcrowRightIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { BubbleButton } from './bubble-button';
import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from './popover';
import { TooltipProvider } from './tooltip';

const DIRECTIONS = [
  {
    icon: PilcrowLeftIcon,
    label: 'Left to Right',
    value: TEXT_DIRECTIONS.LTR,
  },
  { icon: PilcrowIcon, label: 'Auto', value: TEXT_DIRECTIONS.AUTO },
  {
    icon: PilcrowRightIcon,
    label: 'Right to Left',
    value: TEXT_DIRECTIONS.RTL,
  },
] as const;

export type ToggleDirectionPopoverProps = {
  container?: FloatingUIContainer;
  direction: TextDirection;
  onDirectionChange: (direction: TextDirection) => void;
  trigger?: ComponentProps<typeof PopoverTrigger>['render'];
};

export function ToggleDirectionPopover(props: ToggleDirectionPopoverProps) {
  const { container, direction, onDirectionChange, trigger } = props;
  const [open, setOpen] = useState(false);

  const active = DIRECTIONS.find((item) => item.value === direction);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <BubbleButton
        container={container}
        icon={active?.icon ?? PilcrowIcon}
        isActive={open}
        label="Direction"
        render={<PopoverTrigger render={trigger} />}
        tooltip="Text Direction"
      />

      <PopoverPositioner align="center" container={container} side="bottom">
        <PopoverPopup data-variant="align">
          <TooltipProvider>
            <div data-mly-align-group="" role="group">
              {DIRECTIONS.map((item) => (
                <BubbleButton
                  container={container}
                  icon={item.icon}
                  isActive={item.value === direction}
                  key={item.value}
                  label={item.label}
                  onClick={() => onDirectionChange(item.value)}
                  tooltip={item.label}
                />
              ))}
            </div>
          </TooltipProvider>

          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
