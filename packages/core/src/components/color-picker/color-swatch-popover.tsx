import type { useRender } from '@base-ui/react/use-render';
import type { ReactNode } from 'react';
import { useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { arrowAlignOffset } from '~/utils/base-ui';

import {
  Popover,
  PopoverArrow,
  PopoverBack,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';
import { TooltipProvider } from '../interface/tooltip';
import { ColorPicker } from './color-picker';
import type { ColorSwatchItem } from './color-swatch';
import { ColorSwatch } from './color-swatch';

export type ColorSwatchTriggerState = {
  isActive: boolean;
  render: useRender.RenderProp;
};

export type ColorSwatchPopoverProps = {
  color: string;
  container: FloatingUIContainer;
  items: ColorSwatchItem[];
  onColorChange: (color: string, item?: ColorSwatchItem) => void;
  renderTrigger: (state: ColorSwatchTriggerState) => ReactNode;
};

export function ColorSwatchPopover(props: ColorSwatchPopoverProps) {
  const { color, container, items, onColorChange, renderTrigger } = props;

  const [open, setOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIsColorPickerOpen(false);
    }

    setOpen(nextOpen);
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      {renderTrigger({ isActive: open, render: <PopoverTrigger /> })}

      <PopoverPositioner
        alignOffset={arrowAlignOffset}
        container={container}
        side="bottom"
      >
        <PopoverPopup
          data-picker={isColorPickerOpen ? '' : undefined}
          data-variant="color-swatch"
        >
          <TooltipProvider>
            {isColorPickerOpen ? (
              <>
                <PopoverBack onClick={() => setIsColorPickerOpen(false)}>
                  Back to Color Picker
                </PopoverBack>

                <ColorPicker color={color} onColorChange={onColorChange} />
              </>
            ) : (
              <ColorSwatch
                color={color}
                container={container}
                items={items}
                onColorClick={onColorChange}
                onCustomColorClick={() => setIsColorPickerOpen(true)}
              />
            )}
          </TooltipProvider>

          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
