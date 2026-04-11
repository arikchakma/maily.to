import { Select as SelectPrimitive } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import * as React from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import { buttonVariants } from './button';

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  placeholder,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value> & {
  placeholder?: string;
}) {
  if (!placeholder) {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />;
  }

  return (
    <SelectPrimitive.Value
      render={(_, { value }) => {
        if (value) {
          return <SelectPrimitive.Value data-slot="select-value" {...props} />;
        }

        // Placeholder
        return (
          <span data-slot="select-value" className="mly:opacity-60">
            {placeholder}
          </span>
        );
      }}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={(state) =>
        cn(
          buttonVariants({ variant: 'ghost', size: 'default' }),
          'mly:shrink-0 mly:grow mly:rounded-lg mly:bg-soft-gray mly:px-2 mly:pr-0 mly:font-normal',
          state.open && 'mly:bg-soft-gray',
          className
        )
      }
      {...props}
    >
      {children}
      <div className="mly:ml-auto mly:flex mly:size-7 mly:shrink-0 mly:items-center mly:justify-center mly:border-l mly:border-white">
        <SelectPrimitive.Icon
          render={<ChevronDownIcon className="mly:size-4" />}
        />
      </div>
    </SelectPrimitive.Trigger>
  );
}

function SelectPositioner(
  props: React.ComponentProps<typeof SelectPrimitive.Positioner> & {
    container?: FloatingUIContainer;
  }
) {
  const { sideOffset = 2, container, className, ...rest } = props;
  return (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Positioner
        data-slot="select-positioner"
        alignItemWithTrigger={false}
        sideOffset={sideOffset}
        className={cn('mly:z-99', className)}
        {...rest}
      />
    </SelectPrimitive.Portal>
  );
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup>) {
  return (
    <>
      <SelectScrollUpButton />
      <SelectPrimitive.Popup
        data-slot="select-content"
        className={cn(
          'mly:relative mly:z-99 mly:max-h-(--available-height) mly:min-w-(--anchor-width) mly:origin-(--transform-origin) mly:cursor-default mly:overflow-x-hidden mly:overflow-y-auto mly:rounded-xl mly:border mly:border-gray-200 mly:bg-white mly:p-1 mly:shadow-md mly:outline-none',
          className
        )}
        {...props}
      >
        {children}
      </SelectPrimitive.Popup>
      <SelectScrollDownButton />
    </>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        'mly:px-2 mly:py-1.5 mly:text-xs mly:opacity-60',
        className
      )}
      {...props}
    />
  );
}

type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item> & {
  showIndicator?: boolean;
};

function SelectItem(props: SelectItemProps) {
  const { className, children, showIndicator = true, ...rest } = props;

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        'mly:relative mly:w-full mly:cursor-default mly:justify-start mly:gap-2 mly:px-2 mly:py-1 mly:font-normal',
        showIndicator && 'mly:pr-8',
        className
      )}
      {...rest}
    >
      {showIndicator && (
        <SelectPrimitive.ItemIndicator className="mly:absolute mly:top-1/2 mly:right-2 mly:-translate-y-1/2">
          <CheckIcon className="mly:size-3.5" />
        </SelectPrimitive.ItemIndicator>
      )}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        'mly:pointer-events-none mly:-mx-1 mly:my-1 mly:h-px mly:bg-gray-200',
        className
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        'mly:text-md mly:z-51 mly:flex mly:h-6 mly:w-full mly:cursor-default mly:items-center mly:justify-center mly:border mly:bg-white mly:text-center mly:data-[direction=down]:rounded-b-xl mly:data-[direction=down]:border-t-0 mly:data-[direction=up]:rounded-t-xl mly:data-[direction=up]:border-b-0',
        "mly:before:absolute mly:before:left-0 mly:before:h-full mly:before:w-full mly:before:content-[''] mly:data-[direction=down]:bottom-0 mly:data-[direction=down]:before:-bottom-full mly:data-[direction=up]:before:top-full",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="mly:size-4" />
    </SelectPrimitive.ScrollUpArrow>
  );
}
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        'mly:text-md mly:z-51 mly:flex mly:h-6 mly:w-full mly:cursor-default mly:items-center mly:justify-center mly:border mly:bg-white mly:text-center mly:data-[direction=down]:rounded-b-xl mly:data-[direction=down]:border-t-0 mly:data-[direction=up]:rounded-t-xl mly:data-[direction=up]:border-b-0',
        "mly:before:absolute mly:before:left-0 mly:before:h-full mly:before:w-full mly:before:content-[''] mly:data-[direction=down]:bottom-0 mly:data-[direction=down]:before:-bottom-full mly:data-[direction=up]:before:top-full",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="mly:size-4" />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectPositioner,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
