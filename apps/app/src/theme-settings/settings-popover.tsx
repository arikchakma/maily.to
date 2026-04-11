import { Popover } from '@base-ui/react/popover';
import { Tooltip } from '@base-ui/react/tooltip';
import type { LucideIcon } from 'lucide-react';

import { cn } from '../utils/classname';

type SettingsPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: React.RefObject<HTMLElement | null>;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  children: React.ReactNode;
};

export function SettingsPopover(props: SettingsPopoverProps) {
  const {
    open,
    onOpenChange,
    container,
    icon: Icon,
    label,
    isActive,
    children,
  } = props;

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Tooltip.Root>
        <Popover.Trigger
          render={
            <Tooltip.Trigger
              render={
                <button
                  type="button"
                  aria-label={label}
                  className={cn(
                    'inline-flex size-7 shrink-0 items-center justify-center rounded-[10px] text-gray-400 hover:bg-gray-100 hover:text-gray-700',
                    isActive && 'bg-gray-100 text-gray-700'
                  )}
                >
                  <Icon className="size-3.5" />
                </button>
              }
            />
          }
        />
        <Tooltip.Portal container={container}>
          <Tooltip.Positioner sideOffset={8}>
            <Tooltip.Popup className="z-50 rounded-lg bg-gray-800 px-2 py-1 text-xs text-white shadow-lg">
              {label}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Popover.Portal container={container}>
        <Popover.Positioner side="top" sideOffset={8} align="center">
          <Popover.Popup className="w-72 cursor-default rounded-2xl border border-gray-200/50 bg-white p-2 text-gray-950 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.05)] outline-none">
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
