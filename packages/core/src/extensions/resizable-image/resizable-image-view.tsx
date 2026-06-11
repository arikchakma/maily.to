import {
  getBorderStyle,
  hasVariableInText,
  parseWidthToPercentage,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewWrapper, useEditorState } from '@tiptap/react';
import { useCallback } from 'react';

import type { ImageUploadStatus } from '~/extensions/image-upload/image-upload';
import { IMAGE_UPLOAD_STATUSES } from '~/extensions/image-upload/image-upload';
import { uploadImageFile } from '~/extensions/image-upload/upload-image-file';
import { useImageResizeController } from '~/hooks/use-image-resize-controller';
import { cn } from '~/utils/classname';

import { ImageErrorState } from './image-state/image-error-state';
import { ImageIdleState } from './image-state/image-idle-state';
import { ImageLoadingState } from './image-state/image-loading-state';
import { ImagePlaceholder } from './image-state/image-placeholder';
import { ImageVariableState } from './image-state/image-variable-state';
import type { ResizableImageAttributes } from './resizable-image';
import { DEFAULT_IMAGE_ALIGN } from './resizable-image';
import type { ResizableImageHandleType } from './resizable-image-handle';
import { ResizableImageHandle } from './resizable-image-handle';

function useEffectiveUploadStatus(
  editor: Editor,
  src: string | undefined
): ImageUploadStatus {
  const uploadStatus = useEditorState({
    editor,
    selector: (ctx) => {
      if (!src) {
        return undefined;
      }

      const uploads = ctx.editor.storage.imageUpload?.uploads;
      return uploads?.get(src);
    },
  });

  if (!src) {
    return IMAGE_UPLOAD_STATUSES.IDLE;
  }

  return uploadStatus ?? IMAGE_UPLOAD_STATUSES.LOADED;
}

export function ResizableImageView(props: ReactNodeViewProps) {
  const { editor, node, updateAttributes, getPos } = props;
  const attrs = node.attrs as ResizableImageAttributes;
  const { width: initWidth, align = DEFAULT_IMAGE_ALIGN, src, alt } = attrs;

  const isSrcVariable = !!src && hasVariableInText(src);
  const effectiveStatus = useEffectiveUploadStatus(
    editor,
    isSrcVariable ? undefined : src
  );

  const handleResizeCommitted = useCallback(
    (finalWidthPercentage: number) => {
      updateAttributes({ width: `${finalWidthPercentage}%` });
    },
    [updateAttributes]
  );

  const {
    isResizing,
    handleResize,
    containerRef,
    imageWrapperRef,
    shouldShowDragHandles,
    setShouldShowDragHandles,
  } = useImageResizeController({
    width: parseWidthToPercentage(initWidth, 100),
    align,
    onWidthCommitted: handleResizeCommitted,
  });

  const handleResizeHandleMouseDown = useCallback(
    (
      resizeHandle: ResizableImageHandleType,
      event: React.PointerEvent<HTMLDivElement>
    ) => {
      const imageWrapperElement = imageWrapperRef.current;
      if (!imageWrapperElement) {
        return;
      }

      event.preventDefault();
      handleResize(event, {
        initialWidth: imageWrapperElement.clientWidth,
        initialClientX: event.clientX,
        handleUsed: resizeHandle,
      });
    },
    [handleResize]
  );

  const handleImageWrapperMouseEnter = useCallback(() => {
    if (!editor.isEditable) {
      return;
    }

    setShouldShowDragHandles(true);
  }, [setShouldShowDragHandles, editor.isEditable]);

  const handleImageWrapperMouseLeave = useCallback(() => {
    setShouldShowDragHandles(false);
  }, [setShouldShowDragHandles]);

  const handleFileSelect = useCallback(
    (file: File) => {
      const pos = getPos();
      if (pos == null) {
        return;
      }

      editor.view.dispatch(editor.state.tr.delete(pos, pos + node.nodeSize));
      uploadImageFile(editor, file, pos);
    },
    [editor, getPos, node.nodeSize]
  );

  const isLoaded = effectiveStatus === IMAGE_UPLOAD_STATUSES.LOADED;

  return (
    <NodeViewWrapper
      ref={containerRef}
      className="mly:h-full mly:cursor-default"
      onMouseEnter={handleImageWrapperMouseEnter}
      onMouseLeave={handleImageWrapperMouseLeave}
      draggable={editor.isEditable && isLoaded}
      data-drag-handle={editor.isEditable && isLoaded}
    >
      <div
        ref={imageWrapperRef}
        className={cn('mly:@container/resizable-image mly:h-full', {
          'mly:ml-0': align === TEXT_ALIGNMENTS.LEFT,
          'mly:ml-auto': align === TEXT_ALIGNMENTS.RIGHT,
          'mly:mx-auto': align === TEXT_ALIGNMENTS.CENTER,
        })}
        style={{
          width: `${parseWidthToPercentage(initWidth, 100)}%`,
        }}
      >
        <div className="mly:relative mly:max-w-full">
          {isSrcVariable && <ImageVariableState />}

          {!isSrcVariable && (
            <>
              {effectiveStatus === IMAGE_UPLOAD_STATUSES.IDLE &&
                editor.isEditable && (
                  <ImagePlaceholder onFileSelect={handleFileSelect} />
                )}

              {effectiveStatus === IMAGE_UPLOAD_STATUSES.IDLE &&
                !editor.isEditable && <ImageIdleState />}

              {effectiveStatus === IMAGE_UPLOAD_STATUSES.LOADING && (
                <ImageLoadingState src={src} alt={alt} />
              )}
            </>
          )}

          {effectiveStatus === IMAGE_UPLOAD_STATUSES.ERROR && (
            <ImageErrorState />
          )}

          {effectiveStatus === IMAGE_UPLOAD_STATUSES.LOADED && (
            <>
              <img
                src={src}
                alt={alt}
                draggable={editor.isEditable}
                contentEditable={false}
                className="mly:h-auto mly:w-full mly:max-w-full"
                style={getBorderStyle(attrs)}
              />

              {(shouldShowDragHandles || isResizing) && (
                <>
                  <ResizableImageHandle
                    handle="left"
                    onPointerDown={(e) =>
                      handleResizeHandleMouseDown('left', e)
                    }
                  />
                  <ResizableImageHandle
                    handle="right"
                    onPointerDown={(e) =>
                      handleResizeHandleMouseDown('right', e)
                    }
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
