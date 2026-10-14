import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { ArrowIcon } from '../icons/arrow-icon';
import { FLOATING_ELEMENT_PADDING } from './floating-element';

export const Tooltip = TooltipPrimitive.Root;
export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipPositionerProps = TooltipPrimitive.Positioner.Props & {
  container?: FloatingUIContainer;
};

export function TooltipPositioner(props: TooltipPositionerProps) {
  const { container, sideOffset = FLOATING_ELEMENT_PADDING, ...rest } = props;

  return (
    <TooltipPrimitive.Portal container={container}>
      <TooltipPrimitive.Positioner sideOffset={sideOffset} {...rest} />
    </TooltipPrimitive.Portal>
  );
}

export type TooltipPopupProps = TooltipPrimitive.Popup.Props;

export function TooltipPopup(props: TooltipPopupProps) {
  return <TooltipPrimitive.Popup data-mly-tooltip="" {...props} />;
}

export type TooltipArrowProps = TooltipPrimitive.Arrow.Props;

export function TooltipArrow(props: TooltipArrowProps) {
  return (
    <TooltipPrimitive.Arrow data-mly-tooltip-arrow="" {...props}>
      <ArrowIcon />
    </TooltipPrimitive.Arrow>
  );
}
