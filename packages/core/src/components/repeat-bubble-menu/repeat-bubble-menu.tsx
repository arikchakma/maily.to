import type { Editor } from '@tiptap/react';
import { InfoIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useRepeatState } from '~/hooks/use-repeat-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { BubbleButton } from '../interface/bubble-button';
import { BubbleMenu } from '../interface/bubble-menu';
import { Divider } from '../interface/divider';
import { FieldLabel, FieldRoot } from '../interface/field';
import {
  Tooltip,
  ToolTipArrow,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from '../interface/tooltip';
import { VariableOnlyEditor } from '../variable-only-editor/variable-only-editor';

type RepeatBubbleMenuProps = {};

export function RepeatBubbleMenu(_props: RepeatBubbleMenuProps) {
  const editor = useEditorInstance();
  const state = useRepeatState(editor);
  const container = useRef<HTMLDivElement | null>(null);
  const skeletonEditorRef = useRef<Editor | null>(null);

  const { open, setOpen, each: defaultEach } = state;
  const [each, setEach] = useState(defaultEach);
  const [prevDefaultEach, setPrevDefaultEach] = useState(defaultEach);

  if (prevDefaultEach !== defaultEach) {
    setPrevDefaultEach(defaultEach);
    setEach(defaultEach);
  }

  const handleEachChange = useCallback(
    (value: string) => {
      setEach(value);
      editor.chain().updateRepeat({ each: value }).run();
    },
    [editor]
  );

  const handleDelete = useCallback(() => {
    editor.chain().focus().deleteNode('repeat').run();
  }, [editor]);

  if (!open) {
    return null;
  }

  return (
    <BubbleMenu
      ref={container}
      open={open}
      onOpenChange={setOpen}
      floatingId={FLOATING_ELEMENT_IDS.REPEAT_BUBBLE_MENU}
    >
      <FieldRoot className="mly:flex mly:items-center mly:gap-2 mly:pl-1">
        <div className="mly:flex mly:items-center mly:gap-1">
          <FieldLabel>each</FieldLabel>
          <Tooltip>
            <TooltipTrigger
              className="mly:cursor-help mly:text-gray-400 mly:hover:text-gray-600"
              render={<InfoIcon className="mly:size-3.5" />}
            />
            <TooltipPositioner container={container}>
              <TooltipPopup className="mly:max-w-[200px] mly:text-xs">
                Iterates over an array variable and renders the content for each
                item.
                <ToolTipArrow />
              </TooltipPopup>
            </TooltipPositioner>
          </Tooltip>
        </div>
        <VariableOnlyEditor
          editorRef={skeletonEditorRef}
          content={each}
          onContentChange={handleEachChange}
          placeholder="{{items}}"
          autofocus={false}
          className="mly:w-34 mly:rounded-lg mly:bg-soft-gray"
        />
      </FieldRoot>

      <Divider />

      <BubbleButton
        label="Delete Repeat"
        icon={Trash2Icon}
        tooltip="Delete Repeat Block"
        container={container}
        onClick={handleDelete}
        className="mly:text-red-500 mly:hover:bg-red-50 mly:hover:text-red-600"
      />
    </BubbleMenu>
  );
}
