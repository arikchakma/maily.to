import type { AllowedFieldMode } from '@maily-to/shared';
import { FIELD_MODE } from '@maily-to/shared';
import { useMailyId } from '@maily-to/ui';
import { ScanIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { BubbleButton } from './bubble-button';
import type { UnitFieldPreset } from './unit-field';
import { UnitField } from './unit-field';

export const CORNER_AXES = [
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
] as const;
export type Corner = (typeof CORNER_AXES)[number];
export const SIDE_AXES = ['left', 'top', 'bottom', 'right'] as const;
export type Side = (typeof SIDE_AXES)[number];
export type AxisKey = Corner | Side;
export type MultiValue<T extends AxisKey> = Record<T, number>;

type MultiUnitFieldProps<T extends AxisKey> = {
  container: FloatingUIContainer;
  mode: AllowedFieldMode;
  onModeChange: (mode: AllowedFieldMode) => void;
  values: MultiValue<T>;
  onValuesChange: (values: MultiValue<T>) => void;
  presets?: UnitFieldPreset[];
  min?: number;
  max?: number;
  suffix?: string;
  axes: readonly T[];
  axisIcons: Record<T, React.ReactNode>;
  label?: string;
  dragAreaIcon?: React.ReactNode;
};

export function MultiUnitField<T extends AxisKey>(
  props: MultiUnitFieldProps<T>
) {
  const {
    container,
    mode,
    onModeChange,
    values,
    onValuesChange,
    presets = [],
    min = 0,
    max = 9999,
    suffix = 'px',
    axes,
    axisIcons,
    label,
    dragAreaIcon,
  } = props;

  const step = 1;
  const largeStep = 5;

  const fieldId = useMailyId();
  const [unifiedValue, setUnifiedValue] = useState(() => {
    return getMaxValue(values);
  });

  const isMixedMode = mode === FIELD_MODE.MIXED;
  const displayValue = useMemo(() => {
    if (mode !== FIELD_MODE.PRESET) {
      return null;
    }

    const preset = presets.find((preset) => preset.value === unifiedValue);
    return preset?.label ?? null;
  }, [mode, presets, unifiedValue]);

  const handleUpdateAllValues = (value: number) => {
    const allUpdated = Object.fromEntries(
      Object.entries(values).map(([key, _]) => [key, value])
    ) as MultiValue<T>;

    setUnifiedValue(value);
    onValuesChange(allUpdated);
  };

  return (
    <div className="mly:flex mly:flex-col mly:gap-1">
      <div className="mly:flex mly:w-full mly:items-center mly:justify-between mly:gap-2">
        <label
          htmlFor={fieldId}
          className="mly:min-w-16 mly:pl-2 mly:text-sm mly:text-gray-500"
        >
          {label}
        </label>
        <div className="mly:flex mly:items-start mly:gap-1">
          <UnitField
            id={fieldId}
            suffix={suffix}
            dragAreaIcon={dragAreaIcon}
            className="mly:pl-px"
            min={min}
            max={max}
            step={step}
            largeStep={largeStep}
            value={unifiedValue}
            onValueChange={(nextValue) => {
              setUnifiedValue(nextValue);
              onModeChange(FIELD_MODE.UNIFORM);
            }}
            displayValue={isMixedMode ? 'Mixed' : displayValue}
            presets={presets}
            onSelectPreset={(value) => {
              handleUpdateAllValues(value);
              onModeChange(FIELD_MODE.PRESET);
            }}
            onValueCommitted={handleUpdateAllValues}
          />
          <BubbleButton
            label={isMixedMode ? 'Uniform' : 'Mixed'}
            icon={ScanIcon}
            tooltip={isMixedMode ? 'Uniform' : 'Mixed'}
            onClick={() => {
              onModeChange(isMixedMode ? FIELD_MODE.UNIFORM : FIELD_MODE.MIXED);
              handleUpdateAllValues(getMaxValue(values));
            }}
            container={container}
            isActive={isMixedMode}
          />
        </div>
      </div>
      {isMixedMode && (
        <div className="mly:grid mly:grid-cols-2 mly:gap-1 mly:pl-18">
          {axes.map((axis) => (
            <UnitField
              key={axis}
              id={`${fieldId}-${axis}`}
              suffix={suffix}
              dragAreaIcon={axisIcons[axis]}
              className="mly:pl-px"
              min={min}
              max={max}
              step={step}
              largeStep={largeStep}
              defaultValue={values[axis]}
              onValueCommitted={(value) => {
                const nextValues = {
                  ...values,
                  [axis]: value,
                } as MultiValue<T>;
                onValuesChange(nextValues);
                setUnifiedValue(getMaxValue(nextValues));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getMaxValue<T extends AxisKey>(values: MultiValue<T>): number {
  const allValues: number[] = Object.values(values);
  return Math.max(...allValues);
}
