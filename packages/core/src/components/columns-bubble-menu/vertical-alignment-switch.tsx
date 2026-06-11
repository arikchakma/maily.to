import {
  AlignVerticalDistributeCenterIcon,
  AlignVerticalDistributeEndIcon,
  AlignVerticalDistributeStartIcon,
} from 'lucide-react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { BubbleButton } from '../interface/bubble-button';
import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';
import { ToggleGroup, ToggleGroupItem } from '../interface/toggle';
import { TooltipProvider } from '../interface/tooltip';

export type AllowedColumnVerticalAlign = 'top' | 'middle' | 'bottom';

type VerticalAlignmentSwitchProps = {
  container: FloatingUIContainer;
  alignment: AllowedColumnVerticalAlign;
  onAlignmentChange: (alignment: AllowedColumnVerticalAlign) => void;
};

const VERTICAL_ALIGNMENTS = [
  {
    value: 'top' as const,
    label: 'Align Top',
    icon: AlignVerticalDistributeStartIcon,
  },
  {
    value: 'middle' as const,
    label: 'Align Middle',
    icon: AlignVerticalDistributeCenterIcon,
  },
  {
    value: 'bottom' as const,
    label: 'Align Bottom',
    icon: AlignVerticalDistributeEndIcon,
  },
];

export function VerticalAlignmentSwitch(props: VerticalAlignmentSwitchProps) {
  const { container, alignment = 'top', onAlignmentChange } = props;

  const active = VERTICAL_ALIGNMENTS.find((a) => a.value === alignment);
  const ActiveIcon = active?.icon ?? AlignVerticalDistributeStartIcon;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <BubbleButton
            label="Vertical Align"
            icon={ActiveIcon}
            tooltip="Vertical Alignment"
            container={container}
          />
        }
      />
      <PopoverPositioner container={container} align="center" side="bottom">
        <PopoverPopup className="mly:flex mly:w-auto mly:flex-col">
          <TooltipProvider>
            <ToggleGroup
              value={[alignment]}
              onValueChange={(value) => {
                const next = value[0] as AllowedColumnVerticalAlign;
                if (next) {
                  onAlignmentChange(next);
                }
              }}
              className="mly:flex mly:gap-0.5"
            >
              {VERTICAL_ALIGNMENTS.map((item) => (
                <ToggleGroupItem
                  key={item.value}
                  render={
                    <BubbleButton
                      label={item.label}
                      icon={item.icon}
                      tooltip={item.label}
                      container={container}
                    />
                  }
                  value={item.value}
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
