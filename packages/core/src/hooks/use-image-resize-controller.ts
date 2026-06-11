import type { AllowedTextAlignment } from '@maily-to/shared';
import {
  clamp,
  MAX_IMAGE_WIDTH_PERCENTAGE,
  MIN_IMAGE_WIDTH_PERCENTAGE,
  noop,
  percentage,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import { useValueAsRef } from '@maily-to/ui';
import { useCallback, useRef, useState } from 'react';

import type { ResizableImageHandleType } from '~/extensions/resizable-image/resizable-image-handle';

type UseImageResizeControllerOptions = {
  width: number;
  align: AllowedTextAlignment;
  onWidthChange?: (width: number) => void;
  onWidthCommitted?: (width: number) => void;
};

type ResizeParams = {
  initialWidth: number;
  initialClientX: number;
  handleUsed: ResizableImageHandleType;
};

export function useImageResizeController(
  options: UseImageResizeControllerOptions
) {
  const {
    width,
    align,
    onWidthChange = noop,
    onWidthCommitted = noop,
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldShowDragHandles, setShouldShowDragHandles] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const valueRef = useValueAsRef(width);

  const handleResize = useCallback(
    (
      event: React.PointerEvent<HTMLDivElement>,
      initialResizeParams: ResizeParams
    ) => {
      let activeResizeState: ResizeParams | null = initialResizeParams;
      let nextWidth = valueRef.current;

      const targentElement = event.currentTarget;
      targentElement.setPointerCapture(event.pointerId);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const imageWrapper = imageWrapperRef.current;
        const container = containerRef.current;
        if (!activeResizeState || !imageWrapper || !container) {
          return;
        }

        const pointerDeltaX =
          moveEvent.clientX - activeResizeState.initialClientX;
        const { initialWidth, handleUsed } = activeResizeState;

        let newWidthInPixels =
          align === TEXT_ALIGNMENTS.CENTER
            ? initialWidth +
              (handleUsed === 'left' ? -pointerDeltaX * 2 : pointerDeltaX * 2)
            : initialWidth +
              (handleUsed === 'left' ? -pointerDeltaX : pointerDeltaX);

        const maxWidth = container.clientWidth;
        newWidthInPixels = clamp(newWidthInPixels, [0, maxWidth]);

        nextWidth = clamp(Math.round(percentage(newWidthInPixels, maxWidth)), [
          MIN_IMAGE_WIDTH_PERCENTAGE,
          MAX_IMAGE_WIDTH_PERCENTAGE,
        ]);

        imageWrapper.style.width = `${nextWidth}%`;
        onWidthChange(nextWidth);
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        activeResizeState = null;
        setIsResizing(false);
        targentElement.releasePointerCapture(upEvent.pointerId);

        onWidthChange(nextWidth);
        onWidthCommitted(nextWidth);

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);

      setIsResizing(true);
    },
    [align, shouldShowDragHandles, onWidthChange, onWidthCommitted]
  );

  return {
    handleResize,
    isResizing,
    imageWrapperRef,
    shouldShowDragHandles,
    setShouldShowDragHandles,
    containerRef,
  };
}
