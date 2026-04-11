import { Select as SelectPrimitive } from '@base-ui/react/select';
import { invariant, noop } from '@maily-to/shared';
import { UnitField as UnitFieldPrimitive } from '@maily-to/ui';
import { BoxIcon, ChevronDownIcon } from 'lucide-react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { cn } from '~/utils/classname';

import { buttonVariants } from './button';
import { Select, SelectContent, SelectItem, SelectPositioner } from './select';

export type UnitFieldPreset = {
  value: number;
  label: string;
  displayValue?: string;
};

export type UnitFieldProps = Omit<
  UnitFieldPrimitive.Root.Props,
  'format' | 'parse'
> & {
  suffix?: string;
  presets?: UnitFieldPreset[];
  onSelectPreset?: (value: number) => void;
  wrapperClassName?: string;
  container?: FloatingUIContainer;
  dragAreaIcon?: React.ReactNode;
  decimal?: boolean;
};

export function UnitField(props: UnitFieldProps) {
  const {
    className,
    presets,
    suffix = '',
    onSelectPreset = noop,
    value,
    displayValue,
    wrapperClassName,
    dragAreaIcon: dragAreaIconProp,
    container,
    decimal = false,
    ...rest
  } = props;

  const dragAreaIcon = dragAreaIconProp ?? (
    <BoxIcon className="mly:size-3.5 mly:text-midnight-gray" />
  );

  const format = (value: number) => {
    return `${value}${suffix}`;
  };

  const parse = (value: string) => {
    const cleaned = value.replace(suffix, '');
    const nextValue = decimal ? parseFloat(cleaned) : parseInt(cleaned, 10);
    if (isNaN(nextValue)) {
      return null;
    }

    return nextValue;
  };

  const hasPresets = presets !== undefined && presets.length > 0;

  return (
    <div
      className={cn(
        'mly:flex mly:h-7 mly:w-full mly:items-center',
        wrapperClassName
      )}
    >
      <UnitFieldPrimitive.Root
        id="mly-unit-field"
        className={cn(
          'mly:relative mly:z-10 mly:flex mly:h-full mly:w-full mly:items-stretch mly:rounded-lg mly:bg-soft-gray mly:has-focus-within:ring-1 mly:has-focus-within:ring-gray-300',
          hasPresets && 'mly:rounded-r-none',
          className
        )}
        format={format}
        parse={parse}
        value={value}
        displayValue={displayValue}
        {...rest}
      >
        <UnitFieldPrimitive.DragArea className="mly:pointer-events-auto mly:flex mly:aspect-square mly:w-7 mly:shrink-0 mly:cursor-ew-resize mly:items-center mly:justify-center">
          {dragAreaIcon}
        </UnitFieldPrimitive.DragArea>

        <UnitFieldPrimitive.Input className="mly:w-full mly:appearance-none mly:pr-1.5 mly:text-sm mly:tabular-nums mly:outline-none mly:focus-visible:outline-none" />
      </UnitFieldPrimitive.Root>

      {hasPresets && (
        <Select
          items={presets}
          value={
            displayValue !== null && displayValue !== 'Mixed' ? value : null
          }
          onValueChange={(value) => {
            invariant(typeof value === 'number', 'Value must be a number');
            onSelectPreset(value);
          }}
        >
          <SelectPrimitive.Trigger
            className={(state) =>
              cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'mly:shrink-0 mly:cursor-default mly:rounded-lg mly:rounded-l-none mly:border-l mly:border-white mly:bg-soft-gray',
                state.open && 'mly:bg-soft-gray'
              )
            }
          >
            <ChevronDownIcon className="mly:size-4 mly:opacity-50" />
          </SelectPrimitive.Trigger>
          <SelectPositioner
            container={container}
            align="end"
            className="mly:z-99"
          >
            <SelectContent className="mly:w-30.5 mly:p-0.5">
              {presets?.map((preset) => {
                const { value, label } = preset;

                return (
                  <SelectItem key={label} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </SelectPositioner>
        </Select>
      )}
    </div>
  );
}
