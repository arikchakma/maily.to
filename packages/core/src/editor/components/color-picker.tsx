'use client';

import { useState } from 'react';
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful';

type ColorPickerProps = {
  color: string;
  onChange?: (color: string) => void;
};

export function ColorPicker(props: ColorPickerProps) {
  const { color: initialColor, onChange } = props;

  const [color, setColor] = useState(initialColor);

  const handleColorChange = (color: string) => {
    setColor(color);
    onChange?.(color);
  };

  return (
    <div className="mly-min-w-[260px] mly-rounded-xl mly-border mly-bg-white mly-p-4">
      <HexAlphaColorPicker
        color={color}
        onChange={handleColorChange}
        className="mly-flex !mly-w-full mly-flex-col mly-gap-4"
      />
      <HexColorInput
        alpha={true}
        color={color}
        onChange={handleColorChange}
        className="mly-mt-4 mly-w-full mly-min-w-0 mly-rounded-lg mly-border mly-px-2 mly-py-1.5 mly-text-sm mly-uppercase focus-visible:mly-border-gray-400 focus-visible:mly-outline-none"
        prefixed
      />
    </div>
  );
}
