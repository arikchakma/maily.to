import { ImageIcon } from 'lucide-react';
import { useCallback, useRef } from 'react';

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
  const state = useImageBubbleState(editor);
  const container = useRef<HTMLDivElement | null>(null);

  const handleAttributeChange = useCallback(
    (attribute: string, value: string | null, focus = true) => {
      let chain = editor.chain();
      if (focus) {
        chain = chain.focus();
      }
      chain = chain.updateAttributes('image', { [attribute]: value });
      return chain.run();
    },
    [editor]
  );

  const handleAlignChange = useCallback(
    (align: string) => {
      return handleAttributeChange('align', align);
    },
    [handleAttributeChange]
  );

  const handleUrlChange = useCallback(
    (url: string | null) => {
      return handleAttributeChange('src', url);
    },
    [handleAttributeChange]
  );

  const handleExternalLinkChange = useCallback(
    (url: string | null) => {
      return handleAttributeChange('externalLink', url);
    },
    [handleAttributeChange]
  );

  const handleTitleChange = useCallback(
    (title: string | null) => {
      return handleAttributeChange('title', title, false);
    },
    [handleAttributeChange]
  );

  const handleAltChange = useCallback(
    (alt: string | null) => {
      return handleAttributeChange('alt', alt, false);
    },
    [handleAttributeChange]
  );

  if (!state.open) {
    return null;
  }

  return (
    <BubbleMenu
      ref={container}
      open={state.open}
      onOpenChange={state.setOpen}
      floatingId={FLOATING_ELEMENT_IDS.IMAGE_BUBBLE_MENU}
    >
      <ToggleAlignPopover
        container={container}
        align={state.align}
        onAlignChange={handleAlignChange}
      />
      <LinkPopover
        container={container}
        url={state.externalLink}
        onUrlChange={handleExternalLinkChange}
        tooltip="External Link"
        enterTooltip="Add External Link"
      />
      <ImageStylePopover container={container} editor={editor} />
      <LinkPopover
        container={container}
        icon={ImageIcon}
        tooltip="Source URL"
        enterTooltip="Add Source URL"
        url={state.src}
        onUrlChange={handleUrlChange}
        showRemoveButton={false}
      />
      <ImageMetadataPopover
        container={container}
        altText={state.alt}
        onAltTextChange={handleAltChange}
        title={state.title}
        onTitleChange={handleTitleChange}
      />
    </BubbleMenu>
  );
}
