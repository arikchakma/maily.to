import type { LinkCardAttributes } from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { SquareArrowOutUpRightIcon } from 'lucide-react';
import { useCallback } from 'react';

import { ImageState } from '~/extensions/resizable-image/image-state/image-state';

export function LinkCardView(props: ReactNodeViewProps) {
  const { editor, node, getPos } = props;
  const attrs = node.attrs as LinkCardAttributes;
  const { title, description, link, linkTitle, image, subTitle, badgeText } =
    attrs;

  const handleClick = useCallback(() => {
    if (!editor.isEditable) {
      return;
    }

    const pos = getPos();
    if (pos === undefined) {
      return;
    }

    editor.commands.setNodeSelection(pos);
  }, [editor, getPos]);

  const isEmpty = !title && !description && !image;

  return (
    <NodeViewWrapper
      className="not-prose mly:cursor-default"
      draggable={editor.isEditable}
      data-drag-handle={editor.isEditable}
      onClick={handleClick}
    >
      {isEmpty ? (
        <ImageState.Root>
          <ImageState.Icon icon={SquareArrowOutUpRightIcon} />
          <ImageState.Label>Link Card</ImageState.Label>
        </ImageState.Root>
      ) : (
        <div className="mly:flex mly:flex-col mly:rounded-lg mly:border mly:border-gray-300">
          <>
            {image && (
              <div className="mly:relative mly:mb-1.5 mly:w-full mly:shrink-0">
                <img
                  src={image}
                  alt="link-card"
                  className="mly:mb-0! mly:h-full mly:w-full mly:rounded-t-lg"
                  draggable={editor.isEditable}
                />
              </div>
            )}
            <div className="mly:flex mly:items-stretch mly:p-3">
              <div className="mly:flex mly:flex-col">
                <div className="mly:mb-1.5! mly:flex mly:items-center mly:gap-1.5">
                  <h2 className="mly:mb-0! mly:text-lg! mly:font-semibold">
                    {title}
                  </h2>
                  {badgeText && (
                    <span className="mly:font-base! mly:rounded-md mly:bg-yellow-200 mly:px-2 mly:py-1 mly:text-xs mly:leading-none mly:font-semibold">
                      {badgeText}
                    </span>
                  )}{' '}
                  {subTitle && !badgeText && (
                    <span className="mly:font-base! mly:rounded-md mly:text-xs mly:leading-none mly:text-gray-400">
                      {subTitle}
                    </span>
                  )}
                </div>
                <p className="mly:my-0! mly:text-base! mly:text-gray-500">
                  {description}{' '}
                  {linkTitle ? (
                    <a href={link} className="mly:font-semibold">
                      {linkTitle}
                    </a>
                  ) : null}
                </p>
              </div>
            </div>
          </>
        </div>
      )}
    </NodeViewWrapper>
  );
}
