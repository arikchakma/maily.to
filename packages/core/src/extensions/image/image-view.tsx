import type { ImageAttributes } from '@maily-to/shared';
import { hasVariableInText } from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewWrapper, useEditorState } from '@tiptap/react';
import { useCallback } from 'react';

import type { ImageUploadStatus } from '~/extensions/image-upload/image-upload';
import { IMAGE_UPLOAD_STATUSES } from '~/extensions/image-upload/image-upload';
import { uploadImageFile } from '~/extensions/image-upload/upload-image-file';
import { useImageResizeController } from '~/hooks/use-image-resize-controller';

import type { ImageHandleType } from './image-handle';
import { ImageHandle } from './image-handle';
import {
  ImageErrorState,
  ImageIdleState,
  ImageLoadingState,
  ImagePlaceholder,
  ImageVariableState,
} from './image-state';

function useUploadStatus(
  editor: Editor,
  src: string | undefined
): ImageUploadStatus {
  const status = useEditorState({
    editor,
    selector: (ctx) =>
      src ? ctx.editor.storage.imageUpload?.uploads.get(src) : undefined,
  });

  if (!src) {
    return IMAGE_UPLOAD_STATUSES.IDLE;
  }

  return status ?? IMAGE_UPLOAD_STATUSES.LOADED;
}

export function ImageView(props: ReactNodeViewProps) {
  const { editor, getPos, node, updateAttributes } = props;
  const { align, alt, src, width } = node.attrs as ImageAttributes;

  const isSrcVariable = !!src && hasVariableInText(src);
  const status = useUploadStatus(editor, isSrcVariable ? undefined : src);

  const {
    containerRef,
    handleResize,
    imageWrapperRef,
    isResizing,
    setShouldShowDragHandles,
    shouldShowDragHandles,
  } = useImageResizeController({
    align,
    onWidthCommitted: useCallback(
      (committed: number) => updateAttributes({ width: `${committed}%` }),
      [updateAttributes]
    ),
  });

  const handlePointerDown = useCallback(
    (handle: ImageHandleType, event: React.PointerEvent<HTMLDivElement>) => {
      const imageWrapper = imageWrapperRef.current;
      if (!imageWrapper) {
        return;
      }

      event.preventDefault();
      handleResize(event, {
        handleUsed: handle,
        initialClientX: event.clientX,
        initialWidth: imageWrapper.clientWidth,
      });
    },
    [handleResize, imageWrapperRef]
  );

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

  const isLoaded = status === IMAGE_UPLOAD_STATUSES.LOADED;

  return (
    <NodeViewWrapper
      data-drag-handle={editor.isEditable && isLoaded}
      data-mly-image-view=""
      draggable={editor.isEditable && isLoaded}
      onMouseEnter={() => setShouldShowDragHandles(editor.isEditable)}
      onMouseLeave={() => setShouldShowDragHandles(false)}
      ref={containerRef}
    >
      <div
        data-align={align}
        data-mly-image-wrapper=""
        ref={imageWrapperRef}
        style={{ width }}
      >
        {isSrcVariable ? <ImageVariableState /> : null}

        {!isSrcVariable && status === IMAGE_UPLOAD_STATUSES.IDLE ? (
          editor.isEditable ? (
            <ImagePlaceholder onFileSelect={handleFileSelect} />
          ) : (
            <ImageIdleState />
          )
        ) : null}

        {!isSrcVariable && status === IMAGE_UPLOAD_STATUSES.LOADING ? (
          <ImageLoadingState alt={alt} src={src} />
        ) : null}

        {status === IMAGE_UPLOAD_STATUSES.ERROR ? <ImageErrorState /> : null}

        {!isSrcVariable && isLoaded ? (
          <>
            <img
              alt={alt ?? undefined}
              contentEditable={false}
              data-mly-image=""
              draggable={editor.isEditable}
              src={src}
            />
            {shouldShowDragHandles || isResizing ? (
              <>
                <ImageHandle
                  handle="left"
                  onPointerDown={(event) => handlePointerDown('left', event)}
                />
                <ImageHandle
                  handle="right"
                  onPointerDown={(event) => handlePointerDown('right', event)}
                />
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </NodeViewWrapper>
  );
}
