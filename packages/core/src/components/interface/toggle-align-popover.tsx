import type { AllowedTextAlignment } from '@maily-to/shared';
import { TEXT_ALIGNMENTS } from '@maily-to/shared';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react';
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

const ALIGNMENTS = [
  { icon: AlignLeftIcon, label: 'Align Left', value: TEXT_ALIGNMENTS.LEFT },
  {
    icon: AlignCenterIcon,
    label: 'Align Center',
    value: TEXT_ALIGNMENTS.CENTER,
  },
  { icon: AlignRightIcon, label: 'Align Right', value: TEXT_ALIGNMENTS.RIGHT },
] as const;

export type ToggleAlignPopoverProps = {
  align: AllowedTextAlignment;
  container?: FloatingUIContainer;
  onAlignChange: (align: AllowedTextAlignment) => void;
  trigger?: ComponentProps<typeof PopoverTrigger>['render'];
};

export function ToggleAlignPopover(props: ToggleAlignPopoverProps) {
  const { align, container, onAlignChange, trigger } = props;
  const [open, setOpen] = useState(false);

  const active = ALIGNMENTS.find((item) => item.value === align);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <BubbleButton
        container={container}
        icon={active?.icon ?? AlignLeftIcon}
        isActive={open}
        label="Alignment"
        render={<PopoverTrigger render={trigger} />}
        tooltip="Alignment"
      />

      <PopoverPositioner align="center" container={container} side="bottom">
        <PopoverPopup data-variant="align">
          <TooltipProvider>
            <div data-mly-align-group="" role="group">
              {ALIGNMENTS.map((item) => (
                <BubbleButton
                  container={container}
                  icon={item.icon}
                  isActive={item.value === align}
                  key={item.value}
                  label={item.label}
                  onClick={() => onAlignChange(item.value)}
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
