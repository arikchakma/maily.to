import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useLinkCardBubbleState } from '~/hooks/use-link-card-bubble-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { BubbleMenu } from '../interface/bubble-menu';
import { LinkCardFieldsPopover } from './link-card-fields-popover';

export function LinkCardBubbleMenu() {
  const editor = useEditorInstance();
  const {
    badgeText,
    description,
    image,
    link,
    linkTitle,
    open,
    setOpen,
    subTitle,
    title,
  } = useLinkCardBubbleState(editor);
  const container = useRef<HTMLDivElement>(null);

  if (!open) {
    return null;
  }

  const updateLinkCard = (attrs: Record<string, string>) =>
    editor.chain().updateAttributes(MAILY_NODE_TYPES.LINK_CARD, attrs).run();

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.LINK_CARD_BUBBLE_MENU}
      onOpenChange={setOpen}
      open={open}
      ref={container}
    >
      <LinkCardFieldsPopover
        badgeText={badgeText}
        container={container}
        description={description}
        image={image}
        link={link}
        linkTitle={linkTitle}
        onBadgeTextChange={(value) => updateLinkCard({ badgeText: value })}
        onDescriptionChange={(value) => updateLinkCard({ description: value })}
        onImageChange={(value) => updateLinkCard({ image: value })}
        onLinkChange={(value) => updateLinkCard({ link: value })}
        onLinkTitleChange={(value) => updateLinkCard({ linkTitle: value })}
        onSubTitleChange={(value) => updateLinkCard({ subTitle: value })}
        onTitleChange={(value) => updateLinkCard({ title: value })}
        subTitle={subTitle}
        title={title}
      />
    </BubbleMenu>
  );
}
