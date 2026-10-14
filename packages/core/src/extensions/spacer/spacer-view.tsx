import type { SpacerAttributes } from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { useCallback } from 'react';

import { useSpacerResizeController } from '~/hooks/use-spacer-resize-controller';

import type { SpacerHandleType } from './spacer-handle';
import { SpacerHandle } from './spacer-handle';

export function SpacerView(props: ReactNodeViewProps) {
  const { editor, getPos, node, updateAttributes } = props;
  const { height } = node.attrs as SpacerAttributes;

  const {
    containerRef,
    handleResize,
    isResizing,
    setShouldShowDragHandles,
    shouldShowDragHandles,
    spacerWrapperRef,
  } = useSpacerResizeController({
    height,
    onHeightCommitted: useCallback(
      (committed: number) => updateAttributes({ height: committed }),
      [updateAttributes]
    ),
  });

  const handlePointerDown = useCallback(
    (handle: SpacerHandleType, event: React.PointerEvent<HTMLDivElement>) => {
      const spacerWrapper = spacerWrapperRef.current;
      if (!spacerWrapper) {
        return;
      }

      event.preventDefault();
      handleResize(event, {
        handleUsed: handle,
        initialClientY: event.clientY,
        initialHeight: spacerWrapper.clientHeight,
      });
    },
    [handleResize, spacerWrapperRef]
  );

  const handleSelect = useCallback(() => {
    const position = getPos();
    if (typeof position !== 'number') {
      return;
    }

    editor.commands.setNodeSelection(position);
  }, [editor, getPos]);

  return (
    <NodeViewWrapper
      data-drag-handle={editor.isEditable}
      data-mly-spacer-view=""
      draggable={editor.isEditable}
      onMouseEnter={() => setShouldShowDragHandles(editor.isEditable)}
      onMouseLeave={() => setShouldShowDragHandles(false)}
      onPointerDown={handleSelect}
      ref={containerRef}
    >
      <div
        data-mly-spacer-wrapper=""
        ref={spacerWrapperRef}
        style={{ height: `${height}px` }}
      >
        {shouldShowDragHandles || isResizing ? (
          <>
            <SpacerHandle
              handle="top"
              onPointerDown={(event) => handlePointerDown('top', event)}
            />
            <SpacerHandle
              handle="bottom"
              onPointerDown={(event) => handlePointerDown('bottom', event)}
            />
          </>
        ) : null}
      </div>
    </NodeViewWrapper>
  );
}
