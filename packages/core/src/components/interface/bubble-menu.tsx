import { forwardRef } from 'react';

import { cn } from '~/utils/classname';

import type { FloatingElementProps } from './floating-element';
import { FloatingElement } from './floating-element';
import { TooltipProvider } from './tooltip';

export const BubbleMenu = forwardRef<HTMLDivElement, FloatingElementProps>(
  (props, ref) => {
    const { className, children, ...rest } = props;

    return (
      <FloatingElement ref={ref} {...rest}>
        <TooltipProvider>
          <div
            className={cn(
              'mly:flex mly:items-stretch mly:gap-0.5 mly:rounded-xl mly:border mly:border-gray-200/70 mly:bg-white mly:p-0.5 mly:shadow-md mly:outline-none',
              className
            )}
          >
            {children}
          </div>
        </TooltipProvider>
      </FloatingElement>
    );
  }
);

BubbleMenu.displayName = FloatingElement.displayName;
