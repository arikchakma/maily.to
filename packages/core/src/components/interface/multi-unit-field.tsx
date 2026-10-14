import type { BoxCorner, BoxSide } from '@maily-to/shared';
import { ScanIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useId, useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { BubbleButton } from './bubble-button';
import type { UnitFieldPreset } from './unit-field';
import { UnitField } from './unit-field';

// Display order, which reads round the box rather than following the CSS
// shorthand order that `BOX_SIDES` and `BOX_CORNERS` use.
export const SIDE_AXES: readonly BoxSide[] = ['left', 'top', 'bottom', 'right'];
export const CORNER_AXES: readonly BoxCorner[] = [
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
];

export type AxisKey = BoxCorner | BoxSide;
export type MultiValue<T extends AxisKey> = Record<T, number>;

export type MultiUnitFieldProps<T extends AxisKey> = {
  axisIcons: Record<T, ReactNode>;
  axes: readonly T[];
  container: FloatingUIContainer;
  dragAreaIcon?: ReactNode;
  label: string;
  max?: number;
  min?: number;
  onValuesChange: (values: MultiValue<T>) => void;
  presets?: UnitFieldPreset[];
  suffix?: string;
  values: MultiValue<T>;
};

function getMaxValue<T extends AxisKey>(values: MultiValue<T>) {
  return Math.max(...Object.values<number>(values));
}

export function MultiUnitField<T extends AxisKey>(
  props: MultiUnitFieldProps<T>
) {
  const {
    axes,
    axisIcons,
    container,
    dragAreaIcon,
    label,
    max = 9999,
    min = 0,
    onValuesChange,
    presets,
    suffix = 'px',
    values,
  } = props;

  const fieldId = useId();
  const isUniform = axes.every((axis) => values[axis] === values[axes[0]]);

  const [isExpanded, setIsExpanded] = useState(!isUniform);
  const [unifiedValue, setUnifiedValue] = useState(() => getMaxValue(values));
  const [draft, setDraft] = useState(values);

  const signature = axes.map((axis) => values[axis]).join(',');
  const [previousSignature, setPreviousSignature] = useState(signature);

  if (previousSignature !== signature) {
    setPreviousSignature(signature);
    setUnifiedValue(getMaxValue(values));
    setDraft(values);
  }

  const updateEveryAxis = (value: number) => {
    setUnifiedValue(value);
    onValuesChange(
      Object.fromEntries(axes.map((axis) => [axis, value])) as MultiValue<T>
    );
  };

  return (
    <div data-mly-multi-unit-field="">
      <div data-mly-multi-unit-field-row="">
        <label data-mly-field-label="" htmlFor={fieldId}>
          {label}
        </label>

        <div data-mly-multi-unit-field-controls="">
          <UnitField
            container={container}
            displayValue={isUniform ? null : 'Mixed'}
            dragAreaIcon={dragAreaIcon}
            id={fieldId}
            label={label}
            largeStep={5}
            max={max}
            min={min}
            onSelectPreset={updateEveryAxis}
            onValueChange={setUnifiedValue}
            onValueCommitted={updateEveryAxis}
            presets={presets}
            suffix={suffix}
            value={unifiedValue}
          />

          <BubbleButton
            container={container}
            icon={ScanIcon}
            isActive={isExpanded}
            label={isExpanded ? `Uniform ${label}` : `Mixed ${label}`}
            onClick={() => setIsExpanded(!isExpanded)}
            tooltip={isExpanded ? 'Uniform' : 'Mixed'}
          />
        </div>
      </div>

      {isExpanded ? (
        <div data-mly-multi-unit-field-axes="">
          {axes.map((axis) => (
            <UnitField
              dragAreaIcon={axisIcons[axis]}
              key={axis}
              label={`${label} ${axis}`}
              largeStep={5}
              max={max}
              min={min}
              onValueChange={(value) => setDraft({ ...draft, [axis]: value })}
              onValueCommitted={(value) =>
                onValuesChange({ ...values, [axis]: value })
              }
              suffix={suffix}
              value={draft[axis]}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
