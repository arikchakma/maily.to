import type { LucideIcon } from 'lucide-react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { ColorPaletteIcon } from '../icons/color-palette-icon';
import { BubbleButton } from '../interface/bubble-button';

export type ColorSwatchItem = {
  color: string;
  icon?: LucideIcon;
  id: string;
  label: string;
};

export type ColorSwatchProps = {
  color: string;
  container: FloatingUIContainer;
  items: ColorSwatchItem[];
  onColorClick: (color: string, item: ColorSwatchItem) => void;
  onCustomColorClick: () => void;
};

export function ColorSwatch(props: ColorSwatchProps) {
  const { color, container, items, onColorClick, onCustomColorClick } = props;

  const isItemSelected = items.some((item) => item.color === color);

  return (
    <div data-mly-color-swatch="" role="group">
      <BubbleButton
        container={container}
        isActive={!isItemSelected}
        label="Custom Color"
        onClick={onCustomColorClick}
        tooltip="Custom Color"
      >
        <ColorPaletteIcon data-mly-color-palette-icon="" />
      </BubbleButton>

      {items.map((item) => (
        <BubbleButton
          container={container}
          isActive={item.color === color}
          key={item.id}
          label={item.label}
          onClick={() => onColorClick(item.color, item)}
          tooltip={item.label}
        >
          {item.icon ? (
            <item.icon size={14} />
          ) : (
            <span
              data-mly-color-swatch-preview=""
              data-transparent={item.color === 'transparent' ? '' : undefined}
              style={{
                backgroundColor: item.color,
                borderColor: `color-mix(in srgb, ${item.color} 95%, black)`,
              }}
            />
          )}
        </BubbleButton>
      ))}
    </div>
  );
}
