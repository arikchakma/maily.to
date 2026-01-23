import { BubbleMenuButton } from './bubble-menu-button';
import {
  AllowedTextDirection,
  allowedTextDirection,
} from '../nodes/paragraph/paragraph';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../utils/classname';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { LtrIcon, RtlIcon } from './icons/text-direction-icon';

type TextDirectionSwitchProps = {
  direction: AllowedTextDirection;
  onDirectionChange: (direction: AllowedTextDirection) => void;
};

export function TextDirectionSwitch(props: TextDirectionSwitchProps) {
  const { direction: rawDirection, onDirectionChange } = props;
  const direction = allowedTextDirection.includes(
    rawDirection as AllowedTextDirection
  )
    ? rawDirection
    : 'ltr';

  const directions = {
    ltr: {
      icon: LtrIcon,
      tooltip: 'Left to Right',
      onClick: () => {
        onDirectionChange('ltr');
      },
    },
    rtl: {
      icon: RtlIcon,
      tooltip: 'Right to Left',
      onClick: () => {
        onDirectionChange('rtl');
      },
    },
  };

  const activeDirection = directions[direction];

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger
            className={cn(
              'mly:flex mly:size-7 mly:items-center mly:justify-center mly:gap-1 mly:rounded-md mly:px-1.5 mly:text-sm mly:data-[state=open]:bg-soft-gray mly:hover:bg-soft-gray mly:focus-visible:relative mly:focus-visible:z-10 mly:focus-visible:outline-hidden mly:focus-visible:ring-2 mly:focus-visible:ring-gray-400 mly:focus-visible:ring-offset-2'
            )}
          >
            <activeDirection.icon className="mly:h-3 mly:w-3 mly:stroke-[2.5]" />
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>Text Direction</TooltipContent>
      </Tooltip>
      <PopoverContent
        className="mly:flex mly:w-max mly:gap-0.5 mly:rounded-lg mly:p-0.5!"
        side="top"
        sideOffset={8}
        align="center"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        {Object.entries(directions).map(([key, value]) => {
          return (
            <BubbleMenuButton
              key={key}
              icon={value.icon}
              tooltip={value.tooltip}
              command={value.onClick}
              isActive={() => key === direction}
            />
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
