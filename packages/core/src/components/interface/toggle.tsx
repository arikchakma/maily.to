import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '~/utils/classname';

import type { buttonVariants } from './button';

const ToggleGroupContext = React.createContext<
  VariantProps<typeof buttonVariants>
>({
  size: 'default',
  variant: 'default',
});

const ToggleGroup = React.forwardRef<
  React.ComponentRef<typeof ToggleGroupPrimitive>,
  React.ComponentProps<typeof ToggleGroupPrimitive> &
    VariantProps<typeof buttonVariants>
>((props, ref) => {
  const {
    className,
    variant = 'default',
    size = 'default',
    children,
    ...rest
  } = props;

  return (
    <ToggleGroupPrimitive
      ref={ref}
      data-variant={variant}
      data-size={size}
      className={cn('mly:group/toggle-group', className)}
      {...rest}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
});

ToggleGroup.displayName = 'ToggleGroup';

const ToggleGroupItem = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive>,
  React.ComponentProps<typeof TogglePrimitive> &
    VariantProps<typeof buttonVariants>
>((props, ref) => {
  const context = React.useContext(ToggleGroupContext);
  const { className, variant, size, children, ...rest } = props;

  return (
    <TogglePrimitive
      ref={ref}
      data-variant={variant || context.variant}
      data-size={size || context.size}
      className={cn(
        'mly:group/toggle-group-item mly:data-pressed:bg-soft-gray',
        className
      )}
      {...rest}
    >
      {children}
    </TogglePrimitive>
  );
});

ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroup, ToggleGroupItem };
