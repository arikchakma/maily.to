import { cn } from '@/editor/utils/classname';
import { useEvent } from '@/editor/utils/use-event';
import { type NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { Ban, BracesIcon, ImageOffIcon, Loader2 } from 'lucide-react';
import { type CSSProperties, useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 20;
const MAX_WIDTH = 600;

export type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

export function ImageView(props: NodeViewProps) {
  const { node, updateAttributes, selected, editor } = props;

  const [status, setStatus] = useState<ImageStatus>('idle');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [resizingStyle, setResizingStyle] = useState<
    Pick<CSSProperties, 'width' | 'height'> | undefined
  >();

  const handleMouseDown = useEvent(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const imageParent = document.querySelector(
        '.ProseMirror-selectednode'
      ) as HTMLDivElement;

      if (!imgRef.current || !imageParent || !selected) {
        return;
      }

      const imageParentWidth = Math.max(imageParent.offsetWidth, MAX_WIDTH);

      event.preventDefault();
      const direction = event.currentTarget.dataset.direction || '--';
      const initialXPosition = event.clientX;
      const currentWidth = imgRef.current.width;
      const currentHeight = imgRef.current.height;
      let newWidth = currentWidth;
      let newHeight = currentHeight;
      const transform = direction[1] === 'w' ? -1 : 1;

      const removeListeners = () => {
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', removeListeners);
        updateAttributes({ width: newWidth, height: newHeight });
        setResizingStyle(undefined);
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        newWidth = Math.max(
          currentWidth + transform * (event.clientX - initialXPosition),
          MIN_WIDTH
        );

        if (newWidth > imageParentWidth) {
          newWidth = imageParentWidth;
        }

        newHeight = (newWidth / currentWidth) * currentHeight;

        setResizingStyle({ width: newWidth, height: newHeight });
        // If mouse is up, remove event listeners
        if (!event.buttons) {
          return removeListeners();
        }
      };

      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('mouseup', removeListeners);
    }
  );

  function dragCornerButton(direction: string) {
    return (
      <div
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        data-direction={direction}
        className="mly-bg-rose-500"
        style={{
          position: 'absolute',
          height: '10px',
          width: '10px',
          ...{ n: { top: 0 }, s: { bottom: 0 } }[direction[0]],
          ...{ w: { left: 0 }, e: { right: 0 } }[direction[1]],
          cursor: `${direction}-resize`,
        }}
      />
    );
  }

  let { alignment = 'center', width, height, src } = node.attrs || {};
  const {
    externalLink,
    isExternalLinkVariable,
    isSrcVariable,
    showIfKey,
    ...attrs
  } = node.attrs || {};

  const hasImageSrc = !!attrs.src;

  // load the image using new Image() to avoid layout shift
  // then if the image is loaded, set the status to loaded
  useEffect(() => {
    if (!src) {
      return;
    }

    setStatus('loading');
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setStatus('loaded');
      // for some reason Apple Mail doesn't respect the width and height attributes
      // update the dimensions to ensure that the image is not stretched
      const { naturalWidth, naturalHeight } = img;
      const wrapper = wrapperRef?.current;
      if (!wrapper || width !== 'auto' || !naturalWidth) {
        return;
      }

      const wrapperWidth = wrapper.offsetWidth;
      const aspectRatio = naturalWidth / naturalHeight;
      const calculatedHeight = Math.min(
        wrapperWidth / aspectRatio,
        naturalHeight
      );

      updateAttributes({
        width: Math.min(wrapperWidth, naturalWidth),
        height: Math.min(calculatedHeight, naturalHeight),
      });
    };
    img.onerror = () => {
      setStatus('error');
    };

    return () => {
      img.src = '';
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <NodeViewWrapper
      as="div"
      draggable={editor.isEditable}
      data-drag-handle={editor.isEditable}
      style={{
        ...(hasImageSrc && status === 'loaded'
          ? {
              width: `${width}px`,
              height: `${height}px`,
              ...resizingStyle,
            }
          : {}),
        overflow: 'hidden',
        position: 'relative',
        // Weird! Basically tiptap/prose wraps this in a span and the line height causes an annoying buffer.
        lineHeight: '0px',
        display: 'block',
        ...({
          center: { marginLeft: 'auto', marginRight: 'auto' },
          left: { marginRight: 'auto' },
          right: { marginLeft: 'auto' },
        }[alignment as string] || {}),
      }}
      ref={wrapperRef}
    >
      {!hasImageSrc && <ImageStatusLabel status="idle" minHeight={height} />}
      {hasImageSrc && isSrcVariable && (
        <ImageStatusLabel status="variable" minHeight={height} />
      )}

      {hasImageSrc && status === 'loading' && !isSrcVariable && (
        <ImageStatusLabel status="loading" minHeight={height} />
      )}
      {hasImageSrc && status === 'error' && !isSrcVariable && (
        <ImageStatusLabel status="error" minHeight={height} />
      )}

      {hasImageSrc && status === 'loaded' && !isSrcVariable && (
        <>
          <img
            {...attrs}
            ref={imgRef}
            style={{
              ...resizingStyle,
              cursor: 'default',
              marginBottom: 0,
            }}
            draggable={editor.isEditable}
          />

          {selected && editor.isEditable && (
            <>
              {/* Don't use a simple border as it pushes other content around. */}
              {[
                { left: 0, top: 0, height: '100%', width: '1px' },
                { right: 0, top: 0, height: '100%', width: '1px' },
                { top: 0, left: 0, width: '100%', height: '1px' },
                { bottom: 0, left: 0, width: '100%', height: '1px' },
              ].map((style, i) => (
                <div
                  key={i}
                  className="mly-bg-rose-500"
                  style={{
                    position: 'absolute',
                    ...style,
                  }}
                />
              ))}
              {dragCornerButton('nw')}
              {dragCornerButton('ne')}
              {dragCornerButton('sw')}
              {dragCornerButton('se')}
            </>
          )}
        </>
      )}
    </NodeViewWrapper>
  );
}

type ImageStatusLabelProps = {
  status: ImageStatus | 'variable';
  minHeight?: number | string;
};

export function ImageStatusLabel(props: ImageStatusLabelProps) {
  const { status, minHeight } = props;

  return (
    <div
      className={cn(
        'mly-flex mly-items-center mly-justify-center mly-gap-2 mly-rounded-lg mly-bg-soft-gray mly-px-4 mly-py-2 mly-text-sm mly-font-medium',
        {
          'mly-text-gray-500 hover:mly-bg-soft-gray/60': status === 'loading',
          'mly-text-red-500 hover:mly-bg-soft-gray/60': status === 'error',
        }
      )}
      style={{
        ...(minHeight
          ? {
              minHeight,
            }
          : {}),
      }}
    >
      {status === 'idle' && (
        <>
          <ImageOffIcon className="mly-size-4 mly-stroke-[2.5]" />
          <span>No image selected</span>
        </>
      )}
      {status === 'loading' && (
        <>
          <Loader2 className="mly-size-4 mly-animate-spin mly-stroke-[2.5]" />
          <span>Loading image...</span>
        </>
      )}
      {status === 'error' && (
        <>
          <Ban className="mly-size-4 mly-stroke-[2.5]" />
          <span>Error loading image</span>
        </>
      )}
      {status === 'variable' && (
        <>
          <BracesIcon className="mly-size-4 mly-stroke-[2.5]" />
          <span>Variable Image URL</span>
        </>
      )}
    </div>
  );
}
