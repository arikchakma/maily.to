import { memo, useRef, useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { arrowAlignOffset } from '~/utils/base-ui';
import { cn } from '~/utils/classname';

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

type ColorSwatchPopoverProps = {
  container: FloatingUIContainer;
  onClose?: () => void;
  color: string;
  onColorChange: (color: string, item?: ColorSwatchItem) => void;
  renderTrigger: React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
  >['render'];
  items: ColorSwatchItem[];
};

function _ColorSwatchPopover(props: ColorSwatchPopoverProps) {
  const {
    container,
    color: initialColor,
    onColorChange,
    onClose,
    renderTrigger,
    items,
  } = props;

  const popoverRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose?.();
          setIsColorPickerOpen(false);
        }

        setIsOpen(open);
      }}
    >
      <PopoverTrigger render={renderTrigger} />
      <PopoverPositioner
        container={container}
        side="bottom"
        alignOffset={arrowAlignOffset}
      >
        <PopoverPopup
          ref={popoverRef}
          className={cn(
            'mly:relative mly:flex mly:w-fit mly:flex-col mly:gap-0 mly:p-1',
            isColorPickerOpen && 'mly:min-w-[220px]'
          )}
        >
          <TooltipProvider>
            {isColorPickerOpen && (
              <>
                <PopoverBack
                  onClick={() => setIsColorPickerOpen(false)}
                  className="mly:mb-1"
                >
                  Back to Color Picker
                </PopoverBack>

                <ColorPicker
                  color={initialColor}
                  onColorChange={onColorChange}
                />
              </>
            )}

            {!isColorPickerOpen && (
              <ColorSwatch
                color={initialColor}
                container={container}
                items={items}
                onCustomColorClick={() => setIsColorPickerOpen(true)}
                onResetColorClick={onColorChange}
                onColorClick={onColorChange}
              />
            )}

            <PopoverArrow />
          </TooltipProvider>
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}

export const ColorSwatchPopover = memo(_ColorSwatchPopover);
