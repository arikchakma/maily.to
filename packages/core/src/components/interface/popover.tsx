import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { ChevronLeftIcon } from 'lucide-react';
import * as React from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import { ArrowIcon } from '../icons/arrow-icon';
import { Button } from './button';
import { FLOATING_ELEMENT_PADDING } from './floating-element';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverPositioner = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Positioner>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Positioner> & {
    container?: FloatingUIContainer;
  }
>((props, ref) => {
  const {
    className,
    container,
    align = 'start',
    side = 'top',
    sideOffset = FLOATING_ELEMENT_PADDING,
    ...rest
  } = props;
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Positioner
        ref={ref}
        className={className}
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...rest}
      />
    </PopoverPrimitive.Portal>
  );
});

const PopoverPopup = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Popup>
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <PopoverPrimitive.Popup
      ref={ref}
      className={cn(
        'mly:w-72 mly:cursor-default mly:rounded-xl mly:border mly:border-gray-200/70 mly:bg-white mly:p-0.5 mly:text-gray-950 mly:shadow-md mly:outline-none',
        'mly-editor',
        className
      )}
      {...rest}
    />
  );
});

PopoverPopup.displayName = PopoverPrimitive.Popup.displayName;

const PopoverArrow = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <PopoverPrimitive.Arrow
      ref={ref}
      className={cn(
        'mly:data-[side=bottom]:top-[-7px] mly:data-[side=left]:right-[-13px] mly:data-[side=left]:rotate-90 mly:data-[side=right]:left-[-13px] mly:data-[side=right]:-rotate-90 mly:data-[side=top]:bottom-[-7px] mly:data-[side=top]:rotate-180',
        'mly:data-[align=end]:right-[calc(var(--anchor-width)/2+5px)] mly:data-[align=start]:left-[calc(var(--anchor-width)/2+2px)]!',
        className
      )}
      {...rest}
    >
      <ArrowIcon />
    </PopoverPrimitive.Arrow>
  );
});

PopoverArrow.displayName = PopoverPrimitive.Arrow.displayName;

type PopoverBackProps = React.ComponentProps<'button'> & {};

const PopoverBack = (props: PopoverBackProps) => {
  const { onClick, children, className, ...rest } = props;
  return (
    <Button
      variant="ghost"
      className={cn(
        'mly:w-full mly:justify-start mly:gap-1.5 mly:px-2 mly:font-normal mly:text-gray-500 mly:hover:text-gray-900',
        className
      )}
      onClick={onClick}
      {...rest}
    >
      <ChevronLeftIcon className="mly:size-3.5 mly:shrink-0" />
      {children}
    </Button>
  );
};

export {
  Popover,
  PopoverArrow,
  PopoverBack,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
};
