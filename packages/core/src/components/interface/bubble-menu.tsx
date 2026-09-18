import { forwardRef } from 'react';

import type { FloatingElementProps } from './floating-element';
import { FloatingElement } from './floating-element';
import { TooltipProvider } from './tooltip';

export type BubbleMenuProps = FloatingElementProps;

export const BubbleMenu = forwardRef<HTMLDivElement, BubbleMenuProps>(
  (props, ref) => {
    const { children, ...rest } = props;

    return (
      <FloatingElement ref={ref} {...rest}>
        <TooltipProvider>
          <div data-mly-bubble-menu="">{children}</div>
        </TooltipProvider>
      </FloatingElement>
    );
  }
);

BubbleMenu.displayName = 'BubbleMenu';
