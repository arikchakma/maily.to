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

type LinkCardFieldsPopoverProps = {
  container: FloatingUIContainer;

  title: string;
  onTitleChange: (title: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  linkTitle: string;
  onLinkTitleChange: (linkTitle: string) => void;
  link: string;
  onLinkChange: (link: string) => void;
  image: string;
  onImageChange: (image: string) => void;
  badgeText: string;
  onBadgeTextChange: (badgeText: string) => void;
  subTitle: string;
  onSubTitleChange: (subTitle: string) => void;
};

export function LinkCardFieldsPopover(props: LinkCardFieldsPopoverProps) {
  const {
    container,
    title,
    onTitleChange,
    description,
    onDescriptionChange,
    linkTitle,
    onLinkTitleChange,
    link,
    onLinkChange,
    image,
    onImageChange,
    badgeText,
    onBadgeTextChange,
    subTitle,
    onSubTitleChange,
  } = props;

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <BubbleButton
            label="Card Fields"
            icon={PencilRulerIcon}
            tooltip="Card Fields"
            container={container}
            isActive={open}
          />
        }
      />
      <PopoverPositioner
        container={container}
        alignOffset={arrowAlignOffset}
        side="bottom"
      >
        <PopoverPopup className="mly:w-auto mly:p-1">
          <ImageMetadataField
            content={image}
            onContentChange={onImageChange}
            placeholder="https://example.com/image.png"
            autofocus="end"
            label="Image"
          />
          <Divider type="horizontal" className="mly:my-1" />
          <ImageMetadataField
            content={title}
            onContentChange={onTitleChange}
            placeholder="Card title"
            autofocus={false}
            label="Title"
          />
          <Divider type="horizontal" className="mly:my-1" />
          <ImageMetadataField
            content={description}
            onContentChange={onDescriptionChange}
            placeholder="Card description"
            autofocus={false}
            label="Desc."
          />
          <Divider type="horizontal" className="mly:my-1" />
          <ImageMetadataField
            content={link}
            onContentChange={onLinkChange}
            placeholder="https://example.com"
            autofocus={false}
            label="URL"
          />
          <Divider type="horizontal" className="mly:my-1" />
          <ImageMetadataField
            content={linkTitle}
            onContentChange={onLinkTitleChange}
            placeholder="Link display text"
            autofocus={false}
            label="CTA"
          />
          <Divider type="horizontal" className="mly:my-1" />
          <ImageMetadataField
            content={badgeText}
            onContentChange={onBadgeTextChange}
            placeholder="Badge label"
            autofocus={false}
            label="Badge"
          />
          <Divider type="horizontal" className="mly:my-1" />
          <ImageMetadataField
            content={subTitle}
            onContentChange={onSubTitleChange}
            placeholder="Subtitle text"
            autofocus={false}
            label="Sub."
          />
          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
