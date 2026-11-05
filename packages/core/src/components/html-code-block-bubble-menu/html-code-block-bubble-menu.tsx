import type { AllowedHtmlCodeBlockTab } from '@maily-to/shared';
import { HTML_CODE_BLOCK_TABS, MAILY_NODE_TYPES } from '@maily-to/shared';
import { CodeXmlIcon, EyeIcon, Trash2Icon } from 'lucide-react';
import { useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useHtmlCodeBlockState } from '~/hooks/use-html-code-block-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { BubbleButton } from '../interface/bubble-button';
import { BubbleMenu } from '../interface/bubble-menu';
import { Divider } from '../interface/divider';
import { ToggleTabGroup, ToggleTabItem } from '../interface/toggle-tab';

export function HtmlCodeBlockBubbleMenu() {
  const editor = useEditorInstance();
  const { activeTab, open, setOpen } = useHtmlCodeBlockState(editor);
  const container = useRef<HTMLDivElement | null>(null);

  if (!open) {
    return null;
  }

  const handleTabChange = (value: unknown[]) => {
    const tab = value[0] as AllowedHtmlCodeBlockTab | undefined;
    if (!tab) {
      return;
    }

    editor.commands.updateHtmlCodeBlock({ activeTab: tab });
  };

  const handleDelete = () => {
    editor.chain().focus().deleteNode(MAILY_NODE_TYPES.HTML_CODE_BLOCK).run();
  };

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.HTML_CODE_BLOCK_BUBBLE_MENU}
      onOpenChange={setOpen}
      open={open}
      ref={container}
    >
      <ToggleTabGroup onValueChange={handleTabChange} value={[activeTab]}>
        <ToggleTabItem
          container={container}
          icon={CodeXmlIcon}
          label="HTML Code"
          tooltip="HTML Code"
          value={HTML_CODE_BLOCK_TABS.CODE}
        />
        <ToggleTabItem
          container={container}
          icon={EyeIcon}
          label="Preview"
          tooltip="Preview"
          value={HTML_CODE_BLOCK_TABS.PREVIEW}
        />
      </ToggleTabGroup>

      <Divider />

      <BubbleButton
        container={container}
        data-variant="danger"
        icon={Trash2Icon}
        label="Delete HTML Block"
        onClick={handleDelete}
        tooltip="Delete HTML Block"
      />
    </BubbleMenu>
  );
}
