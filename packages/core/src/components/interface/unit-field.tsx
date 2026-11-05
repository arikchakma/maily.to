import { BoxIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { UnitField as UnitFieldPrimitive } from 'unit-field';

import type { FloatingUIContainer } from '~/types/floating-ui';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
} from './select';

export type UnitFieldPreset = {
  displayValue?: string;
  label: string;
  value: number;
};

export type UnitFieldProps = Omit<
  UnitFieldPrimitive.Root.Props,
  'format' | 'parse'
> & {
  container?: FloatingUIContainer;
  decimal?: boolean;
  dragAreaIcon?: ReactNode;
  label: string;
  onSelectPreset?: (value: number) => void;
  presets?: UnitFieldPreset[];
  suffix?: string;
};

export function UnitField(props: UnitFieldProps) {
  const {
    container,
    decimal = false,
    displayValue,
    dragAreaIcon = <BoxIcon size={14} />,
    label,
    onSelectPreset,
    presets = [],
    suffix = '',
    value,
    ...rest
  } = props;

  const format = (next: number) => `${next}${suffix}`;

  const parse = (next: string) => {
    const cleaned = next.replace(suffix, '');
    const parsed = decimal
      ? Number.parseFloat(cleaned)
      : Number.parseInt(cleaned, 10);

    return Number.isNaN(parsed) ? null : parsed;
  };

  const matchedPreset = presets.find((preset) => preset.value === value);
  const presetDisplayValue = matchedPreset
    ? (matchedPreset.displayValue ?? matchedPreset.label)
    : null;

  return (
    <div data-mly-unit-field-wrapper="">
      <UnitFieldPrimitive.Root
        {...rest}
        data-mly-unit-field=""
        data-with-presets={presets.length > 0 ? '' : undefined}
        displayValue={displayValue ?? presetDisplayValue}
        format={format}
        parse={parse}
        value={value}
      >
        <UnitFieldPrimitive.DragArea>
          {dragAreaIcon}
        </UnitFieldPrimitive.DragArea>
        <UnitFieldPrimitive.Input aria-label={label} />
      </UnitFieldPrimitive.Root>

      {presets.length > 0 ? (
        <Select
          items={presets}
          onValueChange={(next) => onSelectPreset?.(Number(next))}
          value={matchedPreset ? matchedPreset.value : null}
        >
          <SelectTrigger aria-label={`${label} presets`} />

          <SelectPositioner align="end" container={container}>
            <SelectContent>
              {presets.map((preset) => (
                <SelectItem key={preset.label} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPositioner>
        </Select>
      ) : null}
    </div>
  );
}
