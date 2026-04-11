import type { AllowedTextAlignment } from '@maily-to/shared';
import { isAllowedTextAlignment } from '@maily-to/shared';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { INVALID_ALIGNMENT_VALUE_ERROR } from '~/utils/text-align';

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

type ToggleAlignPopoverProps = {
  container: FloatingUIContainer;
  align: AllowedTextAlignment;
  onAlignChange: (align: AllowedTextAlignment) => void;
  onClose?: () => void;
};

export function ToggleAlignPopover(props: ToggleAlignPopoverProps) {
  const { container, align, onAlignChange, onClose } = props;

  const actions = [
    {
      label: 'Align Left',
      icon: AlignLeftIcon,
      value: 'left',
    },
    {
      label: 'Align Center',
      icon: AlignCenterIcon,
      value: 'center',
    },
    {
      label: 'Align Right',
      icon: AlignRightIcon,
      value: 'right',
    },
  ];

  const activeAction = actions.find((action) => action.value === align);
  const { icon: ActiveIcon = AlignLeftIcon } = activeAction || {};

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
            label="Align"
            icon={ActiveIcon}
            tooltip="Alignment"
            container={container}
          />
        }
      />

      <PopoverPositioner container={container} align="center" side="bottom">
        <PopoverPopup className="mly:flex mly:w-auto mly:flex-col">
          <TooltipProvider>
            <ToggleGroup
              value={[align]}
              onValueChange={(value) => {
                const align = value[0];
                if (!isAllowedTextAlignment(align)) {
                  console.error(INVALID_ALIGNMENT_VALUE_ERROR);
                  return;
                }

                onAlignChange(align);
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
