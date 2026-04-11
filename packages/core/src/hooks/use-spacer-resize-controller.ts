import { clamp, noop } from '@maily-to/shared';
import { useValueAsRef } from '@maily-to/ui';
import { useCallback, useRef, useState } from 'react';

import type { SpacerHandleType } from '~/extensions/spacer/spacer-handle';

const MIN_SPACER_HEIGHT = 16;
const MAX_SPACER_HEIGHT = 1000;

type UseSpacerResizeControllerOptions = {
  height: number;
  onHeightChange?: (height: number) => void;
  onHeightCommitted?: (height: number) => void;
};

type ResizeParams = {
  initialHeight: number;
  initialClientY: number;
  handleUsed: SpacerHandleType;
};

export function useSpacerResizeController(
  options: UseSpacerResizeControllerOptions
) {
  const { height, onHeightChange = noop, onHeightCommitted = noop } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const spacerWrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldShowDragHandles, setShouldShowDragHandles] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const valueRef = useValueAsRef(height);

  const handleResize = useCallback(
    (
      event: React.PointerEvent<HTMLDivElement>,
      initialResizeParams: ResizeParams
    ) => {
      let activeResizeState: ResizeParams | null = initialResizeParams;
      let nextHeight = valueRef.current;

      const targetElement = event.currentTarget;
      targetElement.setPointerCapture(event.pointerId);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const spacerWrapper = spacerWrapperRef.current;
        if (!activeResizeState || !spacerWrapper) {
          return;
        }

        const pointerDeltaY =
          moveEvent.clientY - activeResizeState.initialClientY;
        const { initialHeight, handleUsed } = activeResizeState;

        let newHeightInPixels =
          initialHeight +
          (handleUsed === 'top' ? -pointerDeltaY : pointerDeltaY);

        nextHeight = clamp(Math.round(newHeightInPixels), [
          MIN_SPACER_HEIGHT,
          MAX_SPACER_HEIGHT,
        ]);

        spacerWrapper.style.height = `${nextHeight}px`;
        onHeightChange(nextHeight);
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        activeResizeState = null;
        setIsResizing(false);
        targetElement.releasePointerCapture(upEvent.pointerId);

        onHeightChange(nextHeight);
        onHeightCommitted(nextHeight);

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);

      setIsResizing(true);
    },
    [onHeightChange, onHeightCommitted]
  );

  return {
    handleResize,
    isResizing,
    spacerWrapperRef,
    shouldShowDragHandles,
    setShouldShowDragHandles,
    containerRef,
  };
}
