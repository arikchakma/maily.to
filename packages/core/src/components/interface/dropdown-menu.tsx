import { Menu as MenuPrimitive } from '@base-ui/react/menu';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { ArrowIcon } from '../icons/arrow-icon';
import { FLOATING_ELEMENT_PADDING } from './floating-element';

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuGroupLabel = MenuPrimitive.GroupLabel;
export const DropdownMenuPortal = MenuPrimitive.Portal;
export const DropdownMenuSubmenuRoot = MenuPrimitive.SubmenuRoot;
export const DropdownMenuSubmenuTrigger = MenuPrimitive.SubmenuTrigger;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;

export type DropdownPositionerProps = MenuPrimitive.Positioner.Props & {
  container?: FloatingUIContainer;
};

export function DropdownPositioner(props: DropdownPositionerProps) {
  const {
    align = 'start',
    container,
    side = 'bottom',
    sideOffset = FLOATING_ELEMENT_PADDING,
    ...rest
  } = props;

  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...rest}
      />
    </MenuPrimitive.Portal>
  );
}

export type DropdownMenuPopupProps = MenuPrimitive.Popup.Props;

export function DropdownMenuPopup(props: DropdownMenuPopupProps) {
  return <MenuPrimitive.Popup data-mly-dropdown-menu="" {...props} />;
}

export type DropdownMenuItemProps = MenuPrimitive.Item.Props;

export function DropdownMenuItem(props: DropdownMenuItemProps) {
  return <MenuPrimitive.Item data-mly-dropdown-menu-item="" {...props} />;
}

export type DropdownMenuSeparatorProps = MenuPrimitive.Separator.Props;

export function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  return (
    <MenuPrimitive.Separator data-mly-dropdown-menu-separator="" {...props} />
  );
}

export type DropdownMenuArrowProps = MenuPrimitive.Arrow.Props;

export function DropdownMenuArrow(props: DropdownMenuArrowProps) {
  return (
    <MenuPrimitive.Arrow data-mly-popover-arrow="" {...props}>
      <ArrowIcon />
    </MenuPrimitive.Arrow>
  );
}
