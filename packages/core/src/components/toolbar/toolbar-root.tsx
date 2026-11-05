import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';

import { TooltipProvider } from '../interface/tooltip';

export type ToolbarRootProps = ToolbarPrimitive.Root.Props;

export function ToolbarRoot(props: ToolbarRootProps) {
  const { children, ...rest } = props;

  return (
    <TooltipProvider>
      <ToolbarPrimitive.Root data-mly-toolbar="" {...rest}>
        {children}
      </ToolbarPrimitive.Root>
    </TooltipProvider>
  );
}
