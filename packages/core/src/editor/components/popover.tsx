'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '../utils/classname';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'mly-z-50 mly-w-72 mly-rounded-md mly-border mly-border-gray-200 mly-bg-white mly-p-4 mly-shadow-md mly-outline-none data-[state=open]:mly-animate-in data-[state=closed]:mly-animate-out data-[state=closed]:mly-fade-out-0 data-[state=open]:mly-fade-in-0 data-[state=closed]:mly-zoom-out-95 data-[state=open]:mly-zoom-in-95 data-[side=bottom]:mly-slide-in-from-top-2 data-[side=left]:mly-slide-in-from-right-2 data-[side=right]:mly-slide-in-from-left-2 data-[side=top]:mly-slide-in-from-bottom-2 text-gray-950',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
