import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import * as React from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import { ArrowIcon } from '../icons/arrow-icon';
import { FLOATING_ELEMENT_PADDING } from './floating-element';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipPositioner = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Positioner>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Positioner> & {
    container?: FloatingUIContainer;
  }
>((props, ref) => {
  const {
    className,
    sideOffset = FLOATING_ELEMENT_PADDING,
    container,
    ...rest
  } = props;

  return (
    <TooltipPrimitive.Portal container={container}>
      <TooltipPrimitive.Positioner
        ref={ref}
        className={className}
        sideOffset={sideOffset}
        {...rest}
      />
    </TooltipPrimitive.Portal>
  );
});

TooltipPositioner.displayName = TooltipPrimitive.Positioner.displayName;

const TooltipPopup = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <TooltipPrimitive.Popup
      ref={ref}
      className={cn(
        'mly:z-50 mly:w-fit mly:overflow-hidden mly:rounded-xl mly:border mly:border-gray-200 mly:bg-white mly:px-2 mly:py-1 mly:text-xs',
        className
      )}
      {...rest}
    />
  );
});

TooltipPopup.displayName = TooltipPrimitive.Popup.displayName;

export const ToolTipArrow = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <TooltipPrimitive.Arrow
      ref={ref}
      className={cn(
        'mly:data-[side=bottom]:top-[-7px] mly:data-[side=left]:right-[-13px] mly:data-[side=left]:rotate-90 mly:data-[side=right]:left-[-13px] mly:data-[side=right]:-rotate-90 mly:data-[side=top]:bottom-[-7px] mly:data-[side=top]:rotate-180',
        'mly:data-[align=end]:right-[calc(var(--anchor-width)/2+5px)] mly:data-[align=start]:left-[calc(var(--anchor-width)/2+2px)]!',
        className
      )}
      {...rest}
    >
      <ArrowIcon />
    </TooltipPrimitive.Arrow>
  );
});

ToolTipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export {
  Tooltip,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
};
