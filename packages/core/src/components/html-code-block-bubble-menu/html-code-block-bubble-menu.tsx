import { HTML_CODE_BLOCK_TABS, MAILY_NODE_TYPES } from '@maily-to/shared';
import { CodeXmlIcon, EyeIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useHtmlCodeBlockState } from '~/hooks/use-html-code-block-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { BubbleButton } from '../interface/bubble-button';
import { BubbleMenu } from '../interface/bubble-menu';
import { Divider } from '../interface/divider';
import { ToggleTabGroup, ToggleTabItem } from '../interface/toggle-tab';

export function HtmlCodeBlockBubbleMenu() {
  const editor = useEditorInstance();
  const state = useHtmlCodeBlockState(editor);
  const container = useRef<HTMLDivElement | null>(null);

  const { open, setOpen, activeTab } = state;

  const handleDelete = useCallback(() => {
    editor.chain().focus().deleteNode(MAILY_NODE_TYPES.HTML_CODE_BLOCK).run();
  }, [editor]);

  if (!open) {
    return null;
  }

  return (
    <BubbleMenu
      ref={container}
      open={open}
      onOpenChange={setOpen}
      floatingId={FLOATING_ELEMENT_IDS.HTML_CODE_BLOCK_BUBBLE_MENU}
    >
      <ToggleTabGroup
        value={[activeTab]}
        onValueChange={(value) => {
          const tab = value[0];
          if (!tab) {
            return;
          }

          editor.commands.updateHtmlCodeBlock({ activeTab: tab });
        }}
      >
        <ToggleTabItem
          value={HTML_CODE_BLOCK_TABS.CODE}
          label="HTML Code"
          icon={CodeXmlIcon}
          tooltip="HTML Code"
          container={container}
          className="mly:rounded-r-none"
        />
        <ToggleTabItem
          value={HTML_CODE_BLOCK_TABS.PREVIEW}
          label="Preview"
          icon={EyeIcon}
          tooltip="Preview"
          container={container}
          className="mly:rounded-l-none"
        />
      </ToggleTabGroup>

      <Divider />

      <BubbleButton
        label="Delete HTML Block"
        icon={Trash2Icon}
        tooltip="Delete HTML Block"
        container={container}
        onClick={handleDelete}
        className="mly:text-red-500 mly:hover:bg-red-50 mly:hover:text-red-600"
      />
    </BubbleMenu>
  );
}
