import {
  NodeViewWrapper,
  type NodeViewProps,
  ReactNodeViewRenderer,
} from '@tiptap/react';
import { type CSSProperties, useRef, useState } from 'react';
import TipTapImage from '@tiptap/extension-image';
import { useEvent } from '../utils/use-event';
import { useEffect } from 'react';
import { DEFAULT_SECTION_SHOW_IF_KEY } from '../nodes/section/section';
import { ImageOffIcon } from 'lucide-react';

const MIN_WIDTH = 20;
const MAX_WIDTH = 600;

function ResizableImageTemplate(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props;

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

  let { alignment = 'center', width, height } = node.attrs || {};
  const { externalLink, showIfKey, ...attrs } = node.attrs || {};

  const hasImageSrc = !!attrs.src;

  return (
    <NodeViewWrapper
      as="div"
      draggable
      data-drag-handle
      style={{
        ...(hasImageSrc
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
    >
      {!hasImageSrc && (
        <div className="mly-flex mly-items-center mly-gap-2 mly-rounded-lg mly-bg-soft-gray mly-p-4 mly-text-sm mly-font-medium mly-text-gray-500 hover:mly-bg-soft-gray/60">
          <ImageOffIcon className="mly-size-4 mly-stroke-[2.5]" />
          <span>No image selected</span>
        </div>
      )}

      {hasImageSrc && (
        <>
          <img
            {...attrs}
            ref={imgRef}
            style={{
              ...resizingStyle,
              cursor: 'default',
              marginBottom: 0,
            }}
          />
          {selected && (
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

export const ResizableImageExtension = TipTapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 'auto',
        parseHTML: (element) => {
          const width = element.style.width;
          return width ? { width } : null;
        },
        renderHTML: ({ width }) => ({ style: `width: ${width}` }),
      },
      height: {
        default: 'auto',
        parseHTML: (element) => {
          const height = element.style.height;
          return height ? { height } : null;
        },
        renderHTML: ({ height }) => ({ style: `height: ${height}` }),
      },
      alignment: {
        default: 'center',
        renderHTML: ({ alignment }) => ({ 'data-alignment': alignment }),
        parseHTML: (element) =>
          element.getAttribute('data-alignment') || 'center',
      },
      externalLink: {
        default: null,
        renderHTML: ({ externalLink }) => {
          if (!externalLink) {
            return {};
          }
          return {
            'data-external-link': externalLink,
          };
        },
        parseHTML: (element) => {
          const externalLink = element.getAttribute('data-external-link');
          return externalLink ? { externalLink } : null;
        },
      },

      showIfKey: {
        default: DEFAULT_SECTION_SHOW_IF_KEY,
        parseHTML: (element) => {
          return (
            element.getAttribute('data-show-if-key') ||
            DEFAULT_SECTION_SHOW_IF_KEY
          );
        },
        renderHTML(attributes) {
          if (!attributes.showIfKey) {
            return {};
          }

          return {
            'data-show-if-key': attributes.showIfKey,
          };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageTemplate);
  },
});
