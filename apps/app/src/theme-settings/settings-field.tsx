import { Popover } from '@base-ui/react/popover';
import {
  ColorPicker,
  SettingsField,
  UnitField,
  useSettingsFieldContext,
  useThemeSettingsContext,
} from '@maily-to/ui';
import { BoxIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { cn } from '../utils/classname';

type FieldContainerProps = { children: React.ReactNode; className?: string };

function Root(props: FieldContainerProps) {
  const { children, className } = props;

  return (
    <SettingsField.Root
      className={cn('grid grid-cols-[90px_1fr] items-center gap-2', className)}
    >
      {children}
    </SettingsField.Root>
  );
}

function Label(props: FieldContainerProps) {
  const { children, className } = props;

  return (
    <SettingsField.Label
      className={cn('pl-1 text-[13px] text-gray-400', className)}
    >
      {children}
    </SettingsField.Label>
  );
}

type UnitFieldInputProps = {
  suffix?: string;
  min?: number;
  max?: number;
  value: number;
  onValueChange: (value: number) => void;
  dragAreaIcon?: React.ReactNode;
};

function UnitFieldInput(props: UnitFieldInputProps) {
  const { suffix = '', value, onValueChange, min, max, dragAreaIcon } = props;
  const { id } = useSettingsFieldContext();

  const format = useCallback((v: number) => `${v}${suffix}`, [suffix]);

  const parse = useCallback(
    (v: string) => {
      const cleaned = v.replace(suffix, '');
      const nextValue = parseInt(cleaned, 10);
      if (isNaN(nextValue)) {
        return null;
      }
      return nextValue;
    },
    [suffix]
  );

  return (
    <UnitField.Root
      id={id}
      className="relative z-10 flex h-7 w-full items-stretch rounded-lg bg-gray-50 has-focus-within:ring-1 has-focus-within:ring-gray-300"
      format={format}
      parse={parse}
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
    >
      <UnitField.DragArea className="pointer-events-auto flex aspect-square w-7 shrink-0 cursor-ew-resize items-center justify-center text-gray-400">
        {dragAreaIcon ?? <BoxIcon className="size-3.5" />}
      </UnitField.DragArea>
      <UnitField.Input className="w-full appearance-none pr-1.5 text-[13px] tabular-nums outline-none focus-visible:outline-none" />
    </UnitField.Root>
  );
}

type ColorFieldProps = {
  color: string;
  onColorChange: (color: string) => void;
};

function ColorField(props: ColorFieldProps) {
  const { id } = useSettingsFieldContext();
  const { container } = useThemeSettingsContext();
  const [open, setOpen] = useState(false);

  return (
    <ColorPicker.Root
      color={props.color}
      onColorChange={props.onColorChange}
      onColorCommitted={props.onColorChange}
    >
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          render={
            <button
              id={id}
              type="button"
              className={cn(
                'flex h-7 w-full cursor-default items-center gap-2 rounded-lg bg-gray-50 px-2 text-[13px] text-gray-600 uppercase',
                'hover:ring-1 hover:ring-gray-200',
                open && 'ring-1 ring-gray-300'
              )}
            >
              <div
                className="block size-3.5 shrink-0 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(0,0,0,0.05)]"
                style={{ backgroundColor: props.color || '#ffffff' }}
              />
              <span className="truncate">{props.color || 'None'}</span>
            </button>
          }
        />
        <Popover.Portal container={container}>
          <Popover.Positioner
            side="top"
            sideOffset={8}
            align="center"
            className="z-99"
          >
            <Popover.Popup className="mly-editor w-56 cursor-default rounded-2xl border border-gray-200/50 bg-white p-2.5 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.05)] outline-none">
              <ColorPicker.Area className="relative h-40 w-full cursor-crosshair rounded-lg">
                <ColorPicker.AreaBackground className="overflow-hidden rounded-lg bg-[linear-gradient(to_top,#000,transparent),linear-gradient(to_right,#fff,transparent)]" />
                <ColorPicker.AreaThumb className="size-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
              </ColorPicker.Area>
              <ColorPicker.ChannelSlider
                channel="hue"
                className="relative mt-2.5 h-2.5 w-full"
              >
                <ColorPicker.ChannelSliderTrack className="h-full w-full rounded-full" />
                <ColorPicker.ChannelSliderThumb className="size-3.5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
              </ColorPicker.ChannelSlider>
              <ColorPicker.Input
                channel="hex"
                className="mt-2 w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-[13px] uppercase focus-visible:border-gray-300 focus-visible:outline-hidden"
              />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </ColorPicker.Root>
  );
}

function FieldGroup(props: FieldContainerProps) {
  const { children, className } = props;

  return (
    <SettingsField.Group className={cn('flex items-center gap-1', className)}>
      {children}
    </SettingsField.Group>
  );
}

export const Field = {
  Root,
  Label,
  UnitField: UnitFieldInput,
  ColorField,
  FieldGroup,
};
