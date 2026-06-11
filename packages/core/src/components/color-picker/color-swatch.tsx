import type { LucideIcon } from 'lucide-react';
import { RotateCcwIcon } from 'lucide-react';
import { useMemo } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { ColorPaletteIcon } from '../icons/color-palette-icon';
import { BubbleButton } from '../interface/bubble-button';

export type ColorSwatchItem = {
  id: string;
  label: string;
  color: string;
  icon?: LucideIcon;
};

type ColorSwatchProps = {
  color: string;
  container: FloatingUIContainer;
  items: ColorSwatchItem[];
  onCustomColorClick: () => void;
  onResetColorClick: (color: string, item: ColorSwatchItem) => void;
  onColorClick: (color: string, item: ColorSwatchItem) => void;
};

export function ColorSwatch(props: ColorSwatchProps) {
  const {
    color,
    container,
    items,
    onCustomColorClick,
    onResetColorClick,
    onColorClick,
  } = props;

  const isItemSelected = useMemo(() => {
    return items.some((item) => item.color === color);
  }, [color, items]);

  return (
    <div className="mly:grid mly:grid-cols-[repeat(5,1fr)] mly:gap-0.5">
      <BubbleButton
        label="Custom Color"
        tooltip="Custom Color"
        container={container}
        className="mly:px-0 mly:py-0"
        onClick={onCustomColorClick}
        isActive={!isItemSelected}
      >
        <ColorPaletteIcon className="mly:size-3.5 mly:shrink-0" />
      </BubbleButton>

      {items.map((item) => {
        if (item.id === 'reset') {
          return (
            <BubbleButton
              key={item.id}
              label={item.label}
              tooltip={item.label}
              container={container}
              className="mly:px-0 mly:py-0"
              icon={item.icon ?? RotateCcwIcon}
              onClick={() => onResetColorClick(item.color, item)}
            />
          );
        }

        if (item.id === 'transparent') {
          return (
            <BubbleButton
              key={item.id}
              label={item.label}
              tooltip={item.label}
              container={container}
              className="mly:px-0 mly:py-0"
              onClick={() => onColorClick(item.color, item)}
              isActive={item.color === color}
            >
              <span
                style={{
                  backgroundImage:
                    'conic-gradient(#eee 25%, #fff 25% 50%, #eee 50% 75%, #fff 75%)',
                  backgroundSize: '8px 8px',
                }}
                className="mly:block mly:size-5 mly:shrink-0 mly:rounded-lg mly:border mly:border-gray-300"
              />
            </BubbleButton>
          );
        }

        const label = `${item.label} Color`;
        const isActive = item.color === color;

        return (
          <BubbleButton
            key={item.id}
            label={label}
            tooltip={label}
            container={container}
            className="mly:px-0 mly:py-0"
            onClick={() => onColorClick(item.color, item)}
            isActive={isActive}
          >
            <span
              style={{
                backgroundColor: item.color,
                borderColor: `color-mix(in srgb, ${item.color} 95%, black)`,
              }}
              className="mly:block mly:size-5 mly:shrink-0 mly:rounded-lg mly:border"
            />
          </BubbleButton>
        );
      })}
    </div>
  );
}
