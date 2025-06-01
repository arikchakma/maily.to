import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '~/lib/classname';

export function SelectNative(props: React.ComponentProps<'select'>) {
  const { className, children, ...rest } = props;
  return (
    <div className="relative flex">
      <select
        data-slot="select-native"
        className={cn(
          'aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 peer inline-flex w-full cursor-pointer appearance-none items-center rounded-lg border border-gray-200 text-sm text-black outline-none transition-[color,box-shadow] focus-visible:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 has-[option[disabled]:checked]:text-gray-500',
          props.multiple
            ? '[&_option:checked]:bg-accent py-1 *:px-3 *:py-1'
            : 'h-9 pe-8 ps-3',
          className
        )}
        {...rest}
      >
        {children}
      </select>
      {!props.multiple && (
        <span className="peer-aria-invalid:text-red-500/80 pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-gray-500/80 peer-disabled:opacity-50">
          <ChevronDownIcon size={16} aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
