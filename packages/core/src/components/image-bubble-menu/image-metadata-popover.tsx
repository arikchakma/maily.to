import { TypeIcon } from 'lucide-react';
import { useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';
import { arrowAlignOffset } from '~/utils/base-ui';

import { BubbleButton } from '../interface/bubble-button';
import { Divider } from '../interface/divider';
import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';
import { ImageMetadataField } from './image-metadata-field';

export type ImageMetadataPopoverProps = {
  alt: string;
  container: FloatingUIContainer;
  onAltChange: (alt: string) => void;
  onTitleChange: (title: string) => void;
  title: string;
};

export function ImageMetadataPopover(props: ImageMetadataPopoverProps) {
  const { alt, container, onAltChange, onTitleChange, title } = props;

  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <BubbleButton
        container={container}
        icon={TypeIcon}
        isActive={open || Boolean(alt) || Boolean(title)}
        label="Image Metadata"
        render={<PopoverTrigger />}
        tooltip="Image Metadata"
      />

      <PopoverPositioner
        alignOffset={arrowAlignOffset}
        container={container}
        side="bottom"
      >
        <PopoverPopup data-variant="image-metadata">
          <ImageMetadataField
            content={alt}
            label="Alt text"
            onContentChange={onAltChange}
            placeholder="ie. A cat sitting on a laptop"
          />
          <Divider type="horizontal" />
          <ImageMetadataField
            content={title}
            label="Title"
            onContentChange={onTitleChange}
            placeholder="ie. Cat on a laptop"
          />

          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
