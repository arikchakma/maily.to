'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '~/lib/classname';

const Popover: React.FC<
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>
> = PopoverPrimitive.Root;

const PopoverTrigger: React.FC<
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
> = PopoverPrimitive.Trigger;

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
        'z-[9999] w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
)) as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
    React.RefAttributes<React.ElementRef<typeof PopoverPrimitive.Content>>
>;

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
