import type { Menu } from '@base-ui/react/menu';
import React from 'react';

/**
 * Computes the arrow alignment offset for base-ui popover positioners.
 * Shifts the arrow so it stays centered over the anchor element.
 */
export const arrowAlignOffset: React.ComponentPropsWithoutRef<
  typeof Menu.Positioner
>['alignOffset'] = (options) => {
  const { side, anchor } = options;
  const { width, height } = anchor;
  return side === 'top' || side === 'bottom'
    ? -(width < 28 ? 0 : width / 2)
    : height;
};
