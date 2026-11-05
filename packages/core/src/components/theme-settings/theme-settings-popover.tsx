import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';
import {
  Tooltip,
  TooltipArrow,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from '../interface/tooltip';
import { useThemeSettingsContext } from './theme-settings-context';

export type ThemeSettingsPopoverProps = {
  children: ReactNode;
  icon: LucideIcon;
  label: string;
};

export function ThemeSettingsPopover(props: ThemeSettingsPopoverProps) {
  const { children, icon: Icon, label } = props;

  const { container } = useThemeSettingsContext();
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <Tooltip disableHoverablePopup>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <ToolbarPrimitive.Button
                  aria-label={label}
                  data-mly-theme-settings-trigger=""
                  data-open={open ? '' : undefined}
                  type="button"
                />
              }
            />
          }
        >
          <Icon size={14} />
        </PopoverTrigger>

        <TooltipPositioner container={container} side="top">
          <TooltipPopup>
            {label}
            <TooltipArrow />
          </TooltipPopup>
        </TooltipPositioner>
      </Tooltip>

      <PopoverPositioner align="center" container={container} side="top">
        <PopoverPopup data-variant="theme-settings">
          {children}
          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
