import { isNodeSelection } from '@tiptap/react';
import { ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useInlineImageState } from '~/hooks/use-inline-image-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { ImageMetadataPopover } from '../image-bubble-menu/image-metadata-popover';
import { BubbleMenu } from '../interface/bubble-menu';
import { Divider } from '../interface/divider';
import { UnitField } from '../interface/unit-field';
import { LinkPopover } from '../link-popover/link-popover';

export const MIN_INLINE_IMAGE_SIZE = 8;
export const MAX_INLINE_IMAGE_SIZE = 100;

export function InlineImageBubbleMenu() {
  const editor = useEditorInstance();
  const {
    alt,
    externalLink,
    open,
    setOpen,
    size: committedSize,
    src,
    title,
  } = useInlineImageState(editor);
  const container = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState(committedSize);
  const [previousSize, setPreviousSize] = useState(committedSize);

  if (previousSize !== committedSize) {
    setPreviousSize(committedSize);
    setSize(committedSize);
  }

  if (!open) {
    return null;
  }

  const updateInlineImage = (attrs: Record<string, number | string | null>) => {
    const { selection } = editor.state;
    const chain = editor.chain().updateInlineImageAttributes(attrs);

    // Preserve NodeSelection for inline atom nodes during non-focused
    // attribute updates (e.g. typing in the metadata popover).
    // Without this, the attribute update on the atom node causes ProseMirror
    // to remap the NodeSelection into a TextSelection, which makes
    // isActive('inlineImage') return false and closes the bubble menu.
    return isNodeSelection(selection)
      ? chain.setNodeSelection(selection.from).run()
      : chain.run();
  };

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.INLINE_IMAGE_BUBBLE_MENU}
      onOpenChange={setOpen}
      open={open}
      ref={container}
    >
      <UnitField
        label="Size"
        max={MAX_INLINE_IMAGE_SIZE}
        min={MIN_INLINE_IMAGE_SIZE}
        onValueChange={setSize}
        onValueCommitted={(value) =>
          updateInlineImage({ height: value, width: value })
        }
        suffix="px"
        value={size}
      />

      <Divider />

      <LinkPopover
        container={container}
        enterTooltip="Add External Link"
        onUrlChange={(url) => updateInlineImage({ externalLink: url })}
        tooltip="External Link"
        url={externalLink}
      />

      <LinkPopover
        container={container}
        enterTooltip="Add Source URL"
        icon={ImageIcon}
        onUrlChange={(url) => updateInlineImage({ src: url })}
        showOpenInNewTabButton={false}
        showRemoveButton={false}
        tooltip="Source URL"
        url={src}
      />

      <ImageMetadataPopover
        alt={alt}
        container={container}
        onAltChange={(next) => updateInlineImage({ alt: next })}
        onTitleChange={(next) => updateInlineImage({ title: next })}
        title={title}
      />
    </BubbleMenu>
  );
}
