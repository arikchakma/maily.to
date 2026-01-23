import { Pilcrow } from 'lucide-react';
import { BubbleMenuButton } from './bubble-menu-button';
import {
  AllowedTextDirection,
  allowedTextDirection,
} from '../nodes/paragraph/paragraph';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../utils/classname';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type TextDirectionSwitchProps = {
  direction: AllowedTextDirection;
  onDirectionChange: (direction: AllowedTextDirection) => void;
};

function LtrIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 5h6" />
      <path d="M11 5v14" />
      <path d="M15 5v14" />
      <path d="M6 18l-3-3 3-3" />
      <path d="M3 15h5" />
    </svg>
  );
}

function RtlIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 5h6" />
      <path d="M10 5v14" />
      <path d="M14 5v14" />
      <path d="M18 18l3-3-3-3" />
      <path d="M16 15h5" />
    </svg>
  );
}

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
