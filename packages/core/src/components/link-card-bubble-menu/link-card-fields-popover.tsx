import { PencilRulerIcon } from 'lucide-react';
import { useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { arrowAlignOffset } from '~/utils/base-ui';

import { ImageMetadataField } from '../image-bubble-menu/image-metadata-field';
import { BubbleButton } from '../interface/bubble-button';
import { Divider } from '../interface/divider';
import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';

export type LinkCardFieldsPopoverProps = {
  badgeText: string;
  container?: FloatingUIContainer;
  description: string;
  image: string;
  link: string;
  linkTitle: string;
  onBadgeTextChange: (badgeText: string) => void;
  onDescriptionChange: (description: string) => void;
  onImageChange: (image: string) => void;
  onLinkChange: (link: string) => void;
  onLinkTitleChange: (linkTitle: string) => void;
  onSubTitleChange: (subTitle: string) => void;
  onTitleChange: (title: string) => void;
  subTitle: string;
  title: string;
};

export function LinkCardFieldsPopover(props: LinkCardFieldsPopoverProps) {
  const {
    badgeText,
    container,
    description,
    image,
    link,
    linkTitle,
    onBadgeTextChange,
    onDescriptionChange,
    onImageChange,
    onLinkChange,
    onLinkTitleChange,
    onSubTitleChange,
    onTitleChange,
    subTitle,
    title,
  } = props;

  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <BubbleButton
        container={container}
        icon={PencilRulerIcon}
        isActive={open}
        label="Card Fields"
        render={<PopoverTrigger />}
        tooltip="Card Fields"
      />

      <PopoverPositioner
        alignOffset={arrowAlignOffset}
        container={container}
        side="bottom"
      >
        <PopoverPopup data-variant="link-card">
          <ImageMetadataField
            content={image}
            label="Image"
            onContentChange={onImageChange}
            placeholder="https://example.com/image.png"
          />
          <Divider type="horizontal" />
          <ImageMetadataField
            content={title}
            label="Title"
            onContentChange={onTitleChange}
            placeholder="Card title"
          />
          <Divider type="horizontal" />
          <ImageMetadataField
            content={description}
            label="Desc."
            onContentChange={onDescriptionChange}
            placeholder="Card description"
          />
          <Divider type="horizontal" />
          <ImageMetadataField
            content={link}
            label="URL"
            onContentChange={onLinkChange}
            placeholder="https://example.com"
          />
          <Divider type="horizontal" />
          <ImageMetadataField
            content={linkTitle}
            label="CTA"
            onContentChange={onLinkTitleChange}
            placeholder="Link display text"
          />
          <Divider type="horizontal" />
          <ImageMetadataField
            content={badgeText}
            label="Badge"
            onContentChange={onBadgeTextChange}
            placeholder="Badge label"
          />
          <Divider type="horizontal" />
          <ImageMetadataField
            content={subTitle}
            label="Sub."
            onContentChange={onSubTitleChange}
            placeholder="Subtitle text"
          />

          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
