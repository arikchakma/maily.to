import type { TextDirection } from '@maily-to/shared';
import { isAllowedTextDirection, TEXT_DIRECTIONS } from '@maily-to/shared';
import { PilcrowIcon, PilcrowLeftIcon, PilcrowRightIcon } from 'lucide-react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { BubbleButton } from './bubble-button';
import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from './popover';
import { ToggleGroup, ToggleGroupItem } from './toggle';
import { TooltipProvider } from './tooltip';

type ToggleDirectionPopoverProps = {
  container: FloatingUIContainer;
  direction: TextDirection;
  onDirectionChange: (direction: TextDirection) => void;
  onClose?: () => void;
};

export function ToggleDirectionPopover(props: ToggleDirectionPopoverProps) {
  const { container, direction, onDirectionChange, onClose } = props;

  const actions = [
    {
      label: 'Left to Right',
      icon: PilcrowLeftIcon,
      value: TEXT_DIRECTIONS.LTR,
    },
    {
      label: 'Auto',
      icon: PilcrowIcon,
      value: TEXT_DIRECTIONS.AUTO,
    },
    {
      label: 'Right to Left',
      icon: PilcrowRightIcon,
      value: TEXT_DIRECTIONS.RTL,
    },
  ];

  const activeAction = actions.find((action) => action.value === direction);
  const { icon: ActiveIcon = PilcrowIcon } = activeAction || {};

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          onClose?.();
        }
      }}
    >
      <PopoverTrigger
        render={
          <BubbleButton
            label="Direction"
            icon={ActiveIcon}
            tooltip="Text Direction"
            container={container}
          />
        }
      />

      <PopoverPositioner container={container} align="center" side="bottom">
        <PopoverPopup className="mly:flex mly:w-auto mly:flex-col">
          <TooltipProvider>
            <ToggleGroup
              value={[direction]}
              onValueChange={(value) => {
                const dir = value[0];
                if (!isAllowedTextDirection(dir)) {
                  return;
                }
                onDirectionChange(dir);
              }}
              className="mly:flex mly:gap-0.5"
            >
              {actions.map((action) => (
                <ToggleGroupItem
                  key={action.value}
                  render={
                    <BubbleButton
                      label={action.label}
                      icon={action.icon}
                      tooltip={action.label}
                      container={container}
                    />
                  }
                  value={action.value}
                />
              ))}
            </ToggleGroup>
          </TooltipProvider>

          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
