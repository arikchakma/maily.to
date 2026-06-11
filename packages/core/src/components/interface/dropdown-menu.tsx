import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import * as React from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import { ArrowIcon } from '../icons/arrow-icon';
import { buttonVariants } from './button';
import { FLOATING_ELEMENT_PADDING } from './floating-element';

const DropdownMenu = MenuPrimitive.Root;

const DropdownMenuTrigger = MenuPrimitive.Trigger;

const DropdownMenuGroup = MenuPrimitive.Group;

const DropdownMenuGroupLabel = MenuPrimitive.GroupLabel;

const DropdownMenuSubmenuRoot = MenuPrimitive.SubmenuRoot;

const DropdownMenuSubmenuTrigger = MenuPrimitive.SubmenuTrigger;

const DropdownMenuPortal = MenuPrimitive.Portal;

const DropdownPositioner = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Positioner>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Positioner> & {
    container?: FloatingUIContainer;
  }
>((props, ref) => {
  const {
    className,
    sideOffset = FLOATING_ELEMENT_PADDING,
    align = 'start',
    side = 'bottom',
    container,
    ...rest
  } = props;

  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Backdrop />
      <MenuPrimitive.Positioner
        ref={ref}
        className={className}
        sideOffset={sideOffset}
        align={align}
        side={side}
        {...rest}
      />
    </MenuPrimitive.Portal>
  );
});
DropdownPositioner.displayName = MenuPrimitive.Positioner.displayName;

const DropdownMenuPopup = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <MenuPrimitive.Popup
      ref={ref}
      className={cn(
        'mly:z-50 mly:min-w-32 mly:cursor-default mly:rounded-xl mly:border mly:border-gray-200 mly:bg-white mly:p-1 mly:shadow-md mly:outline-none',
        className
      )}
      {...rest}
    />
  );
});
DropdownMenuPopup.displayName = MenuPrimitive.Popup.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & {
    inset?: boolean;
  }
>((props, ref) => {
  const { className, inset, ...rest } = props;

  return (
    <MenuPrimitive.Item
      ref={ref}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        'mly:w-full mly:cursor-default mly:justify-start mly:gap-2 mly:px-2 mly:py-1 mly:font-normal',
        inset && 'pl-8',
        className
      )}
      {...rest}
    />
  );
});
DropdownMenuItem.displayName = MenuPrimitive.Item.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <MenuPrimitive.Separator
      ref={ref}
      className={cn('mly:-mx-1 mly:my-1 mly:h-px mly:bg-gray-200', className)}
      {...rest}
    />
  );
});
DropdownMenuSeparator.displayName = MenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = (props: React.HTMLAttributes<HTMLSpanElement>) => {
  const { className, ...rest } = props;

  return (
    <span
      className={cn(
        'mly:ml-auto mly:text-xs mly:tracking-widest mly:opacity-60',
        className
      )}
      {...rest}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

const DropdownMenuArrow = React.forwardRef<
  React.ComponentRef<typeof MenuPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <MenuPrimitive.Arrow
      ref={ref}
      className={cn(
        'mly:data-[side=bottom]:top-[-7px] mly:data-[side=left]:right-[-13px] mly:data-[side=left]:rotate-90 mly:data-[side=right]:left-[-13px] mly:data-[side=right]:-rotate-90 mly:data-[side=top]:bottom-[-7px] mly:data-[side=top]:rotate-180',
        className
      )}
      {...rest}
    >
      <ArrowIcon />
    </MenuPrimitive.Arrow>
  );
});

DropdownMenuArrow.displayName = MenuPrimitive.Arrow.displayName;

export {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubmenuRoot,
  DropdownMenuSubmenuTrigger,
  DropdownMenuTrigger,
  DropdownPositioner,
};
