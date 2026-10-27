import { ColorPicker as ColorPickerPrimitive } from 'cromia';
import { useState } from 'react';

import { useDebouncedCallback } from '~/hooks/use-debounced-callback';

const DEBOUNCE_MS = 150;

export type ColorPickerProps = {
  color: string;
  onColorChange: (color: string) => void;
};

export function ColorPicker(props: ColorPickerProps) {
  const { color, onColorChange } = props;

  const [localColor, setLocalColor] = useState(color);
  const [previousColor, setPreviousColor] = useState(color);
  const debouncedColorChange = useDebouncedCallback(onColorChange, DEBOUNCE_MS);

  if (previousColor !== color) {
    setPreviousColor(color);
    setLocalColor(color);
  }

  const handleColorChange = (hex: string) => {
    setLocalColor(hex);
    debouncedColorChange(hex);
  };

  return (
    <ColorPickerPrimitive.Root
      color={localColor}
      data-mly-color-picker=""
      onColorChange={handleColorChange}
    >
      <ColorPickerPrimitive.Area data-mly-color-picker-area="">
        <ColorPickerPrimitive.AreaBackground data-mly-color-picker-area-background="" />
        <ColorPickerPrimitive.AreaThumb data-mly-color-picker-thumb="" />
      </ColorPickerPrimitive.Area>

      <ColorPickerPrimitive.ChannelSlider
        channel="hue"
        data-mly-color-picker-slider=""
      >
        <ColorPickerPrimitive.ChannelSliderTrack data-mly-color-picker-slider-track="" />
        <ColorPickerPrimitive.ChannelSliderThumb data-mly-color-picker-thumb="" />
      </ColorPickerPrimitive.ChannelSlider>

      <ColorPickerPrimitive.Input
        channel="hex"
        data-mly-color-picker-input=""
      />
    </ColorPickerPrimitive.Root>
  );
}
