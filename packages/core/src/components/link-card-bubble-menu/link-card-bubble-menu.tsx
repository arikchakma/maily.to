import { useCallback, useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useLinkCardBubbleState } from '~/hooks/use-link-card-bubble-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { BubbleMenu } from '../interface/bubble-menu';
import { LinkCardFieldsPopover } from './link-card-fields-popover';

export function LinkCardBubbleMenu() {
  const editor = useEditorInstance();
  const state = useLinkCardBubbleState(editor);
  const container = useRef<HTMLDivElement | null>(null);

  const handleAttributeChange = useCallback(
    (attribute: string, value: string | null) => {
      editor
        .chain()
        .updateAttributes('linkCard', { [attribute]: value ?? '' })
        .run();
    },
    [editor]
  );

  const handleLinkChange = useCallback(
    (url: string | null) => {
      handleAttributeChange('link', url);
    },
    [handleAttributeChange]
  );

  const handleTitleChange = useCallback(
    (title: string) => {
      handleAttributeChange('title', title);
    },
    [handleAttributeChange]
  );

  const handleDescriptionChange = useCallback(
    (description: string) => {
      handleAttributeChange('description', description);
    },
    [handleAttributeChange]
  );

  const handleLinkTitleChange = useCallback(
    (linkTitle: string) => {
      handleAttributeChange('linkTitle', linkTitle);
    },
    [handleAttributeChange]
  );

  const handleImageChange = useCallback(
    (image: string) => {
      handleAttributeChange('image', image);
    },
    [handleAttributeChange]
  );

  const handleBadgeTextChange = useCallback(
    (badgeText: string) => {
      handleAttributeChange('badgeText', badgeText);
    },
    [handleAttributeChange]
  );

  const handleSubTitleChange = useCallback(
    (subTitle: string) => {
      handleAttributeChange('subTitle', subTitle);
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
      floatingId={FLOATING_ELEMENT_IDS.LINK_CARD_BUBBLE_MENU}
    >
      <LinkCardFieldsPopover
        container={container}
        title={state.title}
        onTitleChange={handleTitleChange}
        description={state.description}
        onDescriptionChange={handleDescriptionChange}
        linkTitle={state.linkTitle}
        onLinkTitleChange={handleLinkTitleChange}
        link={state.link}
        onLinkChange={handleLinkChange}
        image={state.image}
        onImageChange={handleImageChange}
        badgeText={state.badgeText}
        onBadgeTextChange={handleBadgeTextChange}
        subTitle={state.subTitle}
        onSubTitleChange={handleSubTitleChange}
      />
    </BubbleMenu>
  );
}
