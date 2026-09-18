import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { ImageIcon } from 'lucide-react';
import { useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useImageBubbleState } from '~/hooks/use-image-bubble-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { BubbleMenu } from '../interface/bubble-menu';
import { ToggleAlignPopover } from '../interface/toggle-align-popover';
import { LinkPopover } from '../link-popover/link-popover';
import { ImageMetadataPopover } from './image-metadata-popover';
import { ImageStylePopover } from './image-style-popover';

export function ImageBubbleMenu() {
  const editor = useEditorInstance();
  const { align, alt, externalLink, open, setOpen, src, title } =
    useImageBubbleState(editor);
  const container = useRef<HTMLDivElement>(null);

  if (!open) {
    return null;
  }

  const updateImage = (attrs: Record<string, string | null>) =>
    editor.chain().updateAttributes(MAILY_NODE_TYPES.IMAGE, attrs).run();

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.IMAGE_BUBBLE_MENU}
      onOpenChange={setOpen}
      open={open}
      ref={container}
    >
      <ToggleAlignPopover
        align={align}
        container={container}
        onAlignChange={(next) => updateImage({ align: next })}
      />

      <LinkPopover
        container={container}
        enterTooltip="Add External Link"
        onUrlChange={(url) => updateImage({ externalLink: url })}
        tooltip="External Link"
        url={externalLink}
      />

      <ImageStylePopover container={container} />

      <LinkPopover
        container={container}
        enterTooltip="Add Source URL"
        icon={ImageIcon}
        onUrlChange={(url) => updateImage({ src: url })}
        showOpenInNewTabButton={false}
        showRemoveButton={false}
        tooltip="Source URL"
        url={src}
      />

      <ImageMetadataPopover
        alt={alt}
        container={container}
        onAltChange={(next) => updateImage({ alt: next })}
        onTitleChange={(next) => updateImage({ title: next })}
        title={title}
      />
    </BubbleMenu>
  );
}
