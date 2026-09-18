import type { AllowedTextAlignment } from '@maily-to/shared';
import {
  clamp,
  clampImageWidthPercentage,
  MAX_IMAGE_WIDTH_PERCENTAGE,
  MIN_IMAGE_WIDTH_PERCENTAGE,
  noop,
  percentage,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import { useCallback, useRef, useState } from 'react';

import type { ImageHandleType } from '~/extensions/image/image-handle';
import { capturePointer, releasePointer } from '~/utils/pointer';

type UseImageResizeControllerOptions = {
  align: AllowedTextAlignment;
  onWidthChange?: (width: number) => void;
  onWidthCommitted?: (width: number) => void;
};

type ResizeParams = {
  handleUsed: ImageHandleType;
  initialClientX: number;
  initialWidth: number;
};

export function useImageResizeController(
  options: UseImageResizeControllerOptions
) {
  const { align, onWidthChange = noop, onWidthCommitted = noop } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldShowDragHandles, setShouldShowDragHandles] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const handleResize = useCallback(
    (
      event: React.PointerEvent<HTMLDivElement>,
      initialResizeParams: ResizeParams
    ) => {
      let activeResizeState: ResizeParams | null = initialResizeParams;
      let nextWidth = clampImageWidthPercentage(
        Math.round(
          percentage(
            initialResizeParams.initialWidth,
            containerRef.current?.clientWidth ?? 0
          )
        )
      );

      const targetElement = event.currentTarget;
      capturePointer({ element: targetElement, pointerId: event.pointerId });

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const imageWrapper = imageWrapperRef.current;
        const container = containerRef.current;
        if (!activeResizeState || !imageWrapper || !container) {
          return;
        }

        const pointerDeltaX =
          moveEvent.clientX - activeResizeState.initialClientX;
        const { handleUsed, initialWidth } = activeResizeState;
        const delta = handleUsed === 'left' ? -pointerDeltaX : pointerDeltaX;

        const maxWidth = container.clientWidth;
        const newWidthInPixels = clamp(
          initialWidth + (align === TEXT_ALIGNMENTS.CENTER ? delta * 2 : delta),
          [0, maxWidth]
        );

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
        releasePointer({
          element: targetElement,
          pointerId: upEvent.pointerId,
        });

        onWidthChange(nextWidth);
        onWidthCommitted(nextWidth);

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);

      setIsResizing(true);
    },
    [align, onWidthChange, onWidthCommitted]
  );

  return {
    containerRef,
    handleResize,
    imageWrapperRef,
    isResizing,
    setShouldShowDragHandles,
    shouldShowDragHandles,
  };
}
