import { isNodeSelection } from '@tiptap/react';
import { BoxIcon, ImageIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import {
  MAX_INLINE_IMAGE_SIZE,
  MIN_INLINE_IMAGE_SIZE,
} from '~/hooks/use-inline-image-resize';
import { useInlineImageState } from '~/hooks/use-inline-image-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { ImageMetadataPopover } from '../image-bubble-menu/image-metadata-popover';
import { BubbleMenu } from '../interface/bubble-menu';
import { Divider } from '../interface/divider';
import { UnitField } from '../interface/unit-field';
import { LinkPopover } from '../link-popover/link-popover';

export function InlineImageBubbleMenu() {
  const editor = useEditorInstance();
  const state = useInlineImageState(editor);
  const container = useRef<HTMLDivElement | null>(null);

  const { size: stateSize } = state;
  const [size, setSize] = useState(stateSize);
  const [prevStateSize, setPrevStateSize] = useState(stateSize);

  if (prevStateSize !== stateSize) {
    setPrevStateSize(stateSize);
    setSize(stateSize);
  }

  const handleAttributeChange = useCallback(
    (attribute: string, value: string | null, focus = true) => {
      let chain = editor.chain();
      if (focus) {
        chain = chain.focus();
      }
      chain = chain.updateInlineImageAttributes({ [attribute]: value });

      // Preserve NodeSelection for inline atom nodes during non-focused
      // attribute updates (e.g. typing in the metadata popover).
      // Without this, the attribute update on the atom node causes ProseMirror
      // to remap the NodeSelection into a TextSelection, which makes
      // isActive('inlineImage') return false and closes the bubble menu.
      const { selection } = editor.state;
      if (!focus && isNodeSelection(selection)) {
        chain = chain.setNodeSelection(selection.from);
      }

      return chain.run();
    },
    [editor]
  );

  const handleSizeCommitted = useCallback(
    (nextSize: number) => {
      setSize(nextSize);
      editor
        .chain()
        .focus()
        .updateInlineImageAttributes({
          width: nextSize,
          height: nextSize,
        })
        .run();
    },
    [editor]
  );

  const handleSrcChange = useCallback(
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

  const handleAltChange = useCallback(
    (alt: string | null) => {
      return handleAttributeChange('alt', alt, false);
    },
    [handleAttributeChange]
  );

  const handleTitleChange = useCallback(
    (title: string | null) => {
      return handleAttributeChange('title', title, false);
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
      floatingId={FLOATING_ELEMENT_IDS.INLINE_IMAGE_BUBBLE_MENU}
    >
      <UnitField
        value={size}
        onValueChange={setSize}
        onValueCommitted={handleSizeCommitted}
        suffix="px"
        min={MIN_INLINE_IMAGE_SIZE}
        max={MAX_INLINE_IMAGE_SIZE}
        className="mly:w-20"
        container={container}
        dragAreaIcon={
          <BoxIcon className="mly:size-3.5 mly:text-midnight-gray" />
        }
      />
      <Divider />
      <LinkPopover
        container={container}
        url={state.externalLink ?? ''}
        onUrlChange={handleExternalLinkChange}
        tooltip="External Link"
        enterTooltip="Add External Link"
      />
      <LinkPopover
        container={container}
        icon={ImageIcon}
        tooltip="Source URL"
        enterTooltip="Add Source URL"
        url={state.src ?? ''}
        onUrlChange={handleSrcChange}
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
