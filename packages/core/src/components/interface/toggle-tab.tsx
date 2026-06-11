import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import type { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import {
  Tooltip,
  ToolTipArrow,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from './tooltip';

type ToggleTabGroupProps = Omit<
  React.ComponentProps<typeof ToggleGroupPrimitive>,
  'multiple'
>;

const ToggleTabGroup = forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive>,
  ToggleTabGroupProps
>((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <ToggleGroupPrimitive
      ref={ref}
      className={cn('mly:flex mly:items-center', className)}
      {...rest}
    >
      {children}
    </ToggleGroupPrimitive>
  );
});

ToggleTabGroup.displayName = 'ToggleTabGroup';

type ToggleTabItemProps = {
  label: string;
  icon: LucideIcon;
} & Omit<React.ComponentProps<typeof TogglePrimitive>, 'children'> &
  (
    | { tooltip?: never; container?: never }
    | { tooltip: string; container: FloatingUIContainer }
  );

const ToggleTabItem = forwardRef<
  React.ComponentRef<typeof TogglePrimitive>,
  ToggleTabItemProps
>((props, ref) => {
  const { label, icon: Icon, tooltip, container, className, ...rest } = props;

  const content = (
    <TogglePrimitive
      ref={ref}
      aria-label={label}
      className={cn(
        'mly:flex mly:size-7 mly:shrink-0 mly:cursor-default mly:items-center mly:justify-center mly:rounded-bubble-button mly:bg-soft-gray/40 mly:text-gray-500 mly:outline-none',
        'mly:hover:bg-gray-200/70 mly:hover:text-gray-900',
        'mly:data-pressed:bg-gray-200/50 mly:data-pressed:text-gray-900',
        'mly:focus-visible:relative mly:focus-visible:z-10 mly:focus-visible:ring-1 mly:focus-visible:ring-gray-300',
        className
      )}
      {...rest}
    >
      <Icon className="mly:size-3.5 mly:shrink-0" />
    </TogglePrimitive>
  );

  if (!tooltip) {
    return content;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={content} />
      <TooltipPositioner container={container}>
        <TooltipPopup className="mly:whitespace-nowrap">
          {tooltip}
          <ToolTipArrow />
        </TooltipPopup>
      </TooltipPositioner>
    </Tooltip>
  );
});

ToggleTabItem.displayName = 'ToggleTabItem';

export { ToggleTabGroup, ToggleTabItem };
