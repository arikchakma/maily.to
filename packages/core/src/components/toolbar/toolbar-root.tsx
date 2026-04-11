import { useRef } from 'react';

import { cn } from '~/utils/classname';

import { TooltipProvider } from '../interface/tooltip';
import { ToolbarContext } from './toolbar-context';

type ToolbarRootProps = {
  children: React.ReactNode;
  className?: string;
};

export function ToolbarRoot(props: ToolbarRootProps) {
  const { children, className } = props;

  const container = useRef<HTMLDivElement | null>(null);

  return (
    <ToolbarContext value={{ container }}>
      <TooltipProvider>
        <div
          ref={container}
          className={cn(
            'mly:relative mly:z-10 mly:mb-4 mly:flex mly:items-stretch mly:gap-2',
            className
          )}
        >
          {children}
        </div>
      </TooltipProvider>
    </ToolbarContext>
  );
}
