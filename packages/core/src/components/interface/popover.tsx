import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { ChevronLeftIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { ArrowIcon } from '../icons/arrow-icon';
import { Button } from './button';
import { FLOATING_ELEMENT_PADDING } from './floating-element';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export type PopoverPositionerProps = PopoverPrimitive.Positioner.Props & {
  container?: FloatingUIContainer;
};

export function PopoverPositioner(props: PopoverPositionerProps) {
  const {
    align = 'start',
    container,
    side = 'top',
    sideOffset = FLOATING_ELEMENT_PADDING,
    ...rest
  } = props;

  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...rest}
      />
    </PopoverPrimitive.Portal>
  );
}

// Only a keyboard needs focus moved into the popup; a pointer opening it would
// land on the first control and pop that control's tooltip over the panel.
const getInitialFocus: PopoverPrimitive.Popup.Props['initialFocus'] = (
  openType
) => {
  return openType === 'keyboard';
};

export type PopoverPopupProps = PopoverPrimitive.Popup.Props;

export function PopoverPopup(props: PopoverPopupProps) {
  return (
    <PopoverPrimitive.Popup
      data-mly-popover=""
      initialFocus={getInitialFocus}
      {...props}
    />
  );
}

export type PopoverArrowProps = PopoverPrimitive.Arrow.Props;

export function PopoverArrow(props: PopoverArrowProps) {
  return (
    <PopoverPrimitive.Arrow data-mly-popover-arrow="" {...props}>
      <ArrowIcon />
    </PopoverPrimitive.Arrow>
  );
}

export type PopoverBackProps = ComponentPropsWithRef<'button'>;

export function PopoverBack(props: PopoverBackProps) {
  const { children, ...rest } = props;

  return (
    <Button {...rest} data-mly-popover-back="">
      <ChevronLeftIcon size={14} />
      {children}
    </Button>
  );
}
