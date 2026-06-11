import type { SpacerAttributes } from '@maily-to/shared';
import { FIELD_MODE } from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { useCallback } from 'react';

import { useSpacerResizeController } from '~/hooks/use-spacer-resize-controller';
import { cn } from '~/utils/classname';

import { DEFAULT_SPACER_HEIGHT } from './spacer';
import type { SpacerHandleType } from './spacer-handle';
import { SpacerHandle } from './spacer-handle';

export function SpacerView(props: ReactNodeViewProps) {
  const { editor, node, updateAttributes, selected: _selected } = props;
  const attrs = node.attrs as SpacerAttributes;
  const { height = DEFAULT_SPACER_HEIGHT } = attrs;

  const handleResizeCommitted = useCallback(
    (finalHeight: number) => {
      updateAttributes({ height: finalHeight, heightMode: FIELD_MODE.UNIFORM });
    },
    [updateAttributes]
  );

  const {
    isResizing,
    handleResize,
    containerRef,
    spacerWrapperRef,
    shouldShowDragHandles,
    setShouldShowDragHandles,
  } = useSpacerResizeController({
    height,
    onHeightCommitted: handleResizeCommitted,
  });

  const handleResizeHandleMouseDown = useCallback(
    (
      resizeHandle: SpacerHandleType,
      event: React.PointerEvent<HTMLDivElement>
    ) => {
      const spacerWrapperElement = spacerWrapperRef.current;
      if (!spacerWrapperElement) {
        return;
      }

      event.preventDefault();
      handleResize(event, {
        initialHeight: spacerWrapperElement.clientHeight,
        initialClientY: event.clientY,
        handleUsed: resizeHandle,
      });
    },
    [handleResize, spacerWrapperRef]
  );

  const handleSpacerWrapperMouseEnter = useCallback(() => {
    if (!editor.isEditable) {
      return;
    }

    setShouldShowDragHandles(true);
  }, [setShouldShowDragHandles, editor.isEditable]);

  const handleSpacerWrapperMouseLeave = useCallback(() => {
    setShouldShowDragHandles(false);
  }, [setShouldShowDragHandles]);

  return (
    <NodeViewWrapper
      ref={containerRef}
      className="mly:cursor-default"
      onMouseEnter={handleSpacerWrapperMouseEnter}
      onMouseLeave={handleSpacerWrapperMouseLeave}
      draggable={editor.isEditable}
      data-drag-handle={editor.isEditable}
    >
      <div
        ref={spacerWrapperRef}
        className="mly:relative mly:w-full"
        style={{
          height: `${height}px`,
          '--spacer-height': `${height}px`,
        }}
      >
        {(shouldShowDragHandles || isResizing) && (
          <>
            <SpacerHandle
              handle="top"
              onPointerDown={(e) => handleResizeHandleMouseDown('top', e)}
              className={cn(height < 16 && 'mly:-top-1')}
            />
            <SpacerHandle
              handle="bottom"
              onPointerDown={(e) => handleResizeHandleMouseDown('bottom', e)}
              className={cn(height < 16 && 'mly:-bottom-1')}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
