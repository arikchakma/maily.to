import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { Trash2Icon } from 'lucide-react';
import { useRef, useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useRepeatState } from '~/hooks/use-repeat-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { BubbleButton } from '../interface/bubble-button';
import { BubbleMenu } from '../interface/bubble-menu';
import { Divider } from '../interface/divider';
import { FieldLabel, FieldRoot } from '../interface/field';
import { VariableOnlyEditor } from '../variable-only-editor/variable-only-editor';

export function RepeatBubbleMenu() {
  const editor = useEditorInstance();
  const { each: committedEach, open, setOpen } = useRepeatState(editor);
  const container = useRef<HTMLDivElement>(null);
  const eachEditorRef = useRef<Editor | null>(null);

  const [each, setEach] = useState(committedEach);
  const [previousEach, setPreviousEach] = useState(committedEach);

  if (previousEach !== committedEach) {
    setPreviousEach(committedEach);
    setEach(committedEach);
  }

  if (!open) {
    return null;
  }

  const handleDelete = () => {
    editor.chain().focus().deleteNode(MAILY_NODE_TYPES.REPEAT).run();
  };

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.REPEAT_BUBBLE_MENU}
      onOpenChange={setOpen}
      open={open}
      ref={container}
    >
      <FieldRoot>
        <FieldLabel htmlFor="mly-repeat-each">each</FieldLabel>
        <VariableOnlyEditor
          autofocus={false}
          content={each}
          editorRef={eachEditorRef}
          onContentChange={(value) => {
            setEach(value);
            editor.chain().updateRepeat({ each: value }).run();
          }}
          placeholder="{{items}}"
        />
      </FieldRoot>

      <Divider />

      <BubbleButton
        container={container}
        data-variant="danger"
        icon={Trash2Icon}
        label="Delete Repeat"
        onClick={handleDelete}
        tooltip="Delete Repeat"
      />
    </BubbleMenu>
  );
}
