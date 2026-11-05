import type { Popover } from '@base-ui/react/popover';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Computes the arrow alignment offset for base-ui popover positioners.
 * Shifts the arrow so it stays centered over the anchor element.
 */
export const arrowAlignOffset: ComponentPropsWithoutRef<
  typeof Popover.Positioner
>['alignOffset'] = (options) => {
  const { anchor, side } = options;
  const { height, width } = anchor;

  return side === 'top' || side === 'bottom'
    ? -(width < 28 ? 0 : width / 2)
    : height;
};
