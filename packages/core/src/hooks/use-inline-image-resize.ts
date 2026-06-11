import { clamp } from '@maily-to/shared';
import { useValueAsRef } from '@maily-to/ui';
import { useCallback, useRef, useState } from 'react';

export const MIN_INLINE_IMAGE_SIZE = 10;
export const MAX_INLINE_IMAGE_SIZE = 96;

type UseInlineImageResizeOptions = {
  size: number;
  onSizeChange?: (size: number) => void;
  onSizeCommitted?: (size: number) => void;
};

export function useInlineImageResize(options: UseInlineImageResizeOptions) {
  const { size, onSizeChange, onSizeCommitted } = options;

  const imageRef = useRef<HTMLImageElement | null>(null);
  const [shouldShowHandle, setShouldShowHandle] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sizeRef = useValueAsRef(size);

  const handleResize = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      const initialClientX = event.clientX;
      const initialSize = sizeRef.current;

      let nextSize = initialSize;

      const targetElement = event.currentTarget;
      targetElement.setPointerCapture(event.pointerId);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const image = imageRef.current;
        if (!image) {
          return;
        }

        const deltaX = moveEvent.clientX - initialClientX;
        const newSize = clamp(Math.round(initialSize + deltaX), [
          MIN_INLINE_IMAGE_SIZE,
          MAX_INLINE_IMAGE_SIZE,
        ]);

        nextSize = newSize;

        image.style.width = `${newSize}px`;
        image.style.height = `${newSize}px`;
        onSizeChange?.(newSize);
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        setIsResizing(false);
        targetElement.releasePointerCapture(upEvent.pointerId);

        onSizeChange?.(nextSize);
        onSizeCommitted?.(nextSize);

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);

      setIsResizing(true);
    },
    [onSizeChange, onSizeCommitted]
  );

  return {
    handleResize,
    isResizing,
    imageRef,
    shouldShowHandle,
    setShouldShowHandle,
  };
}
