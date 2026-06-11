import { PencilRulerIcon } from 'lucide-react';
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

type ImageMetadataPopoverProps = {
  container: FloatingUIContainer;
  altText: string;
  onAltTextChange: (altText: string) => void;
  title: string;
  onTitleChange: (title: string) => void;

  onClose?: () => void;
};

export function ImageMetadataPopover(props: ImageMetadataPopoverProps) {
  const { container, altText, onAltTextChange, title, onTitleChange, onClose } =
    props;

  const [open, setOpen] = useState(false);
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose?.();
    }

    setOpen(nextOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <BubbleButton
            label="Image Metadata"
            icon={PencilRulerIcon}
            tooltip="Image Metadata"
            container={container}
            isActive={open || !!altText || !!title}
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
            content={altText}
            onContentChange={onAltTextChange}
            placeholder="Describe the image"
            autofocus="end"
            label="Alt Text"
          />
          <Divider type="horizontal" className="mly:my-1" />
          <ImageMetadataField
            content={title}
            onContentChange={onTitleChange}
            placeholder="Tooltip or short title"
            autofocus={false}
            label="Title"
          />
          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
