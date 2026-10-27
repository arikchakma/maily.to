import type { LinkCardAttributes } from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { SquareArrowOutUpRightIcon } from 'lucide-react';

import { ImageState } from '~/extensions/image/image-state';

export function LinkCardView(props: ReactNodeViewProps) {
  const { editor, getPos, node } = props;
  const { badgeText, description, image, link, linkTitle, subTitle, title } =
    node.attrs as LinkCardAttributes;

  const handleClick = () => {
    if (!editor.isEditable) {
      return;
    }

    const pos = getPos();
    if (pos === undefined) {
      return;
    }

    editor.commands.setNodeSelection(pos);
  };

  const isEmpty = !(title || description || image);

  return (
    <NodeViewWrapper
      data-drag-handle={editor.isEditable}
      data-mly-link-card=""
      draggable={editor.isEditable}
      onClick={handleClick}
    >
      {isEmpty ? (
        <ImageState icon={SquareArrowOutUpRightIcon} state="idle">
          Link Card
        </ImageState>
      ) : (
        <>
          {image ? (
            <img
              alt={title || 'Link card'}
              data-mly-link-card-image=""
              draggable={false}
              src={image}
            />
          ) : null}

          <div data-mly-link-card-content="">
            <div data-mly-link-card-heading="">
              <span data-mly-link-card-title="">{title}</span>
              {badgeText ? (
                <span data-mly-link-card-badge="">{badgeText}</span>
              ) : null}
              {subTitle && !badgeText ? (
                <span data-mly-link-card-sub-title="">{subTitle}</span>
              ) : null}
            </div>

            <p data-mly-link-card-description="">
              {description}{' '}
              {linkTitle ? (
                <a data-mly-link-card-cta="" href={link}>
                  {linkTitle}
                </a>
              ) : null}
            </p>
          </div>
        </>
      )}
    </NodeViewWrapper>
  );
}
