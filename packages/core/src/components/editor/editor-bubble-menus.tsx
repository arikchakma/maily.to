import { ButtonBubbleMenu } from '../button-bubble-menu/button-bubble-menu';
import { ColumnsBubbleMenu } from '../columns-bubble-menu/columns-bubble-menu';
import { HtmlCodeBlockBubbleMenu } from '../html-code-block-bubble-menu/html-code-block-bubble-menu';
import { ImageBubbleMenu } from '../image-bubble-menu/image-bubble-menu';
import { InlineImageBubbleMenu } from '../inline-image-bubble-menu/inline-image-bubble-menu';
import { LinkCardBubbleMenu } from '../link-card-bubble-menu/link-card-bubble-menu';
import { RepeatBubbleMenu } from '../repeat-bubble-menu/repeat-bubble-menu';
import { SectionBubbleMenu } from '../section-bubble-menu/section-bubble-menu';
import { SpacerBubbleMenu } from '../spacer-bubble-menu/spacer-bubble-menu';
import { TextBubbleMenu } from '../text-bubble-menu/text-bubble-menu';
import { VariableBubbleMenu } from '../variable-bubble-menu/variable-bubble-menu';

export function EditorBubbleMenus() {
  return (
    <>
      <TextBubbleMenu />
      <ButtonBubbleMenu />
      <SectionBubbleMenu />
      <ColumnsBubbleMenu />
      <ImageBubbleMenu />
      <InlineImageBubbleMenu />
      <SpacerBubbleMenu />
      <VariableBubbleMenu />
      <HtmlCodeBlockBubbleMenu />
      <RepeatBubbleMenu />
      <LinkCardBubbleMenu />
    </>
  );
}
