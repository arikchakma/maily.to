import { mergeProps, useRender } from '@base-ui/react';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '~/utils/classname';

const buttonVariants = cva(
  'mly:inline-flex mly:items-center mly:justify-center mly:rounded-lg mly:text-sm mly:font-medium mly:focus-visible:relative mly:focus-visible:z-10 mly:focus-visible:ring-1 mly:focus-visible:ring-gray-300 mly:focus-visible:ring-offset-0 mly:focus-visible:ring-offset-white mly:focus-visible:outline-hidden mly:disabled:opacity-60 mly:aria-disabled:opacity-60',
  {
    variants: {
      variant: {
        default:
          'mly:bg-gray-900 mly:text-gray-50 mly:hover:bg-soft-gray mly:data-pressed:bg-soft-gray/80',
        destructive: 'mly:bg-red-500 mly:text-gray-50 mly:hover:bg-red-500/90',
        outline:
          'mly:border mly:border-gray-200 mly:bg-white mly:hover:bg-gray-100 mly:hover:text-gray-900',
        secondary: 'mly:bg-gray-100 mly:text-gray-900 mly:hover:bg-gray-100/80',
        ghost:
          'mly:bg-transparent mly:text-gray-500 mly:hover:bg-soft-gray mly:hover:text-gray-900 mly:focus-visible:bg-soft-gray mly:focus-visible:text-gray-900 mly:data-pressed:bg-soft-gray/80',
        link: 'mly:text-gray-900 mly:underline-offset-4 mly:hover:underline',
        reset:
          'mly:bg-transparent mly:text-gray-500 mly:outline-none mly:hover:bg-transparent mly:hover:text-gray-900 mly:focus-visible:ring-0 mly:focus-visible:ring-transparent',
      },
      size: {
        default: 'mly:h-7 mly:px-4 mly:py-2',
        icon: 'mly:size-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  render?: useRender.RenderProp;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { className, variant, size, render, ...rest } = props;
    const defaultProps: useRender.ElementProps<'button'> = {
      className: cn(buttonVariants({ variant, size, className })),
      type: 'button',
    };

    return useRender({
      defaultTagName: 'button',
      render,
      ref,
      props: mergeProps<'button'>(defaultProps, rest),
    });
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
