import { ColorPicker as ColorPickerPrimitive } from '@maily-to/ui';
import { useState } from 'react';

import { useDebouncedCallback } from '~/hooks/use-debounced-callback';

const DEBOUNCE_MS = 150;

type ColorPickerProps = {
  color: string;
  onColorChange: (color: string) => void;
};

export function ColorPicker(props: ColorPickerProps) {
  const { color, onColorChange } = props;

  const [localColor, setLocalColor] = useState(color);
  const [prevColor, setPrevColor] = useState(color);
  const debouncedColorChange = useDebouncedCallback(onColorChange, DEBOUNCE_MS);

  if (prevColor !== color) {
    setPrevColor(color);
    setLocalColor(color);
  }

  const handleColorChange = (hex: string) => {
    setLocalColor(hex);
    debouncedColorChange(hex);
  };

  return (
    <ColorPickerPrimitive.Root
      color={localColor}
      onColorChange={handleColorChange}
    >
      <ColorPickerPrimitive.Area className="mly:relative mly:h-40 mly:w-full mly:cursor-crosshair mly:rounded-lg">
        <ColorPickerPrimitive.AreaBackground className="mly:overflow-hidden mly:rounded-lg mly:bg-[linear-gradient(to_top,#000,transparent),linear-gradient(to_right,#fff,transparent)]" />
        <ColorPickerPrimitive.AreaThumb className="mly:size-3.5 mly:rounded-full mly:border-2 mly:border-white mly:shadow-[0_0_0_1px_rgba(0,0,0,0.1)]" />
      </ColorPickerPrimitive.Area>
      <ColorPickerPrimitive.ChannelSlider
        channel="hue"
        className="mly:relative mly:mt-2 mly:h-4 mly:w-full"
      >
        <ColorPickerPrimitive.ChannelSliderTrack className="mly:h-full mly:w-full mly:rounded-full" />
        <ColorPickerPrimitive.ChannelSliderThumb className="mly:size-3.5 mly:rounded-full mly:border-2 mly:border-white mly:shadow-[0_0_0_1px_rgba(0,0,0,0.1)]" />
      </ColorPickerPrimitive.ChannelSlider>
      <ColorPickerPrimitive.Input
        channel="hex"
        className="mly:mt-1 mly:w-full mly:min-w-0 mly:rounded-bubble-button mly:border mly:border-gray-200 mly:bg-white mly:px-2 mly:py-1.5 mly:text-sm mly:uppercase mly:focus-visible:border-gray-300 mly:focus-visible:outline-hidden"
      />
    </ColorPickerPrimitive.Root>
  );
}
