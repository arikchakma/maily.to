import type { InlineImageAttributes } from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { ImageIcon } from 'lucide-react';
import { useCallback } from 'react';

import { useInlineImageResize } from '~/hooks/use-inline-image-resize';
import { cn } from '~/utils/classname';

export function InlineImageView(props: ReactNodeViewProps) {
  const { node, editor, updateAttributes } = props;
  const { src, alt, width } = node.attrs as InlineImageAttributes;
  const size = width;

  const handleSizeCommitted = useCallback(
    (nextSize: number) => {
      updateAttributes({ width: nextSize, height: nextSize });
    },
    [updateAttributes]
  );

  const {
    handleResize,
    isResizing,
    imageRef,
    shouldShowHandle,
    setShouldShowHandle,
  } = useInlineImageResize({
    size,
    onSizeCommitted: handleSizeCommitted,
  });

  const isEditable = editor.isEditable;
  const showHandle = isEditable && (shouldShowHandle || isResizing);
  const isEmpty = !src;

  return (
    <NodeViewWrapper
      as="span"
      className="mly:relative mly:inline-block mly:cursor-default"
      onMouseEnter={() => setShouldShowHandle(true)}
      onMouseLeave={() => {
        if (isResizing) {
          return;
        }

        setShouldShowHandle(false);
      }}
    >
      {isEmpty ? (
        <span
          className="mly:inline-flex mly:items-center mly:justify-center mly:rounded mly:bg-soft-gray"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            verticalAlign: 'middle',
          }}
        >
          <ImageIcon
            className="mly:text-gray-400"
            style={{
              width: `${Math.max(Math.round(size * 0.5), 10)}px`,
              height: `${Math.max(Math.round(size * 0.5), 10)}px`,
            }}
          />
        </span>
      ) : (
        <img
          ref={imageRef}
          src={src}
          alt={alt ?? ''}
          style={{
            display: 'inline',
            verticalAlign: 'middle',
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      )}
      {showHandle && (
        <span
          role="separator"
          aria-orientation="vertical"
          className={cn(
            'mly:absolute mly:right-0 mly:bottom-0 mly:z-10',
            'mly:flex mly:size-1.5 mly:cursor-nwse-resize mly:items-center mly:justify-center',
            'mly:rounded-full mly:bg-rose-500 mly:ring-2 mly:ring-white'
          )}
          onPointerDown={handleResize}
        />
      )}
    </NodeViewWrapper>
  );
}
