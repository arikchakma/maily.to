import { clamp, noop } from '@maily-to/shared';
import { useCallback, useRef, useState } from 'react';

import type { SpacerHandleType } from '~/extensions/spacer/spacer-handle';
import { capturePointer, releasePointer } from '~/utils/pointer';
import { MAX_SPACER_HEIGHT, MIN_SPACER_HEIGHT } from '~/utils/spacing';

import { useValueAsRef } from './use-value-as-ref';

type UseSpacerResizeControllerOptions = {
  height: number;
  onHeightChange?: (height: number) => void;
  onHeightCommitted?: (height: number) => void;
};

type ResizeParams = {
  handleUsed: SpacerHandleType;
  initialClientY: number;
  initialHeight: number;
};

export function useSpacerResizeController(
  options: UseSpacerResizeControllerOptions
) {
  const { height, onHeightChange = noop, onHeightCommitted = noop } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const spacerWrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldShowDragHandles, setShouldShowDragHandles] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const heightRef = useValueAsRef(height);

  const handleResize = useCallback(
    (
      event: React.PointerEvent<HTMLDivElement>,
      initialResizeParams: ResizeParams
    ) => {
      let activeResizeState: ResizeParams | null = initialResizeParams;
      let nextHeight = heightRef.current;

      const targetElement = event.currentTarget;
      capturePointer({ element: targetElement, pointerId: event.pointerId });

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const spacerWrapper = spacerWrapperRef.current;
        if (!activeResizeState || !spacerWrapper) {
          return;
        }

        const pointerDeltaY =
          moveEvent.clientY - activeResizeState.initialClientY;
        const { handleUsed, initialHeight } = activeResizeState;
        const delta = handleUsed === 'top' ? -pointerDeltaY : pointerDeltaY;

        nextHeight = clamp(Math.round(initialHeight + delta), [
          MIN_SPACER_HEIGHT,
          MAX_SPACER_HEIGHT,
        ]);

        spacerWrapper.style.height = `${nextHeight}px`;
        onHeightChange(nextHeight);
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        activeResizeState = null;
        setIsResizing(false);
        releasePointer({
          element: targetElement,
          pointerId: upEvent.pointerId,
        });

        onHeightChange(nextHeight);
        onHeightCommitted(nextHeight);

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);

      setIsResizing(true);
    },
    [heightRef, onHeightChange, onHeightCommitted]
  );

  return {
    containerRef,
    handleResize,
    isResizing,
    setShouldShowDragHandles,
    shouldShowDragHandles,
    spacerWrapperRef,
  };
}
