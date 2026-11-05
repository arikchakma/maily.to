import { RectangleHorizontalIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useSpacerState } from '~/hooks/use-spacer-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';
import {
  MAX_SPACER_HEIGHT,
  MIN_SPACER_HEIGHT,
  SPACER_SPACING,
} from '~/utils/spacing';

import { BubbleMenu } from '../interface/bubble-menu';
import { UnitField } from '../interface/unit-field';

export function SpacerBubbleMenu() {
  const editor = useEditorInstance();
  const { height: committedHeight, open, setOpen } = useSpacerState(editor);
  const container = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState(committedHeight);
  const [previousHeight, setPreviousHeight] = useState(committedHeight);

  if (previousHeight !== committedHeight) {
    setPreviousHeight(committedHeight);
    setHeight(committedHeight);
  }

  if (!open) {
    return null;
  }

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.SPACER_BUBBLE_MENU}
      onOpenChange={setOpen}
      open={open}
      ref={container}
    >
      <UnitField
        container={container}
        dragAreaIcon={<RectangleHorizontalIcon size={14} />}
        label="Height"
        max={MAX_SPACER_HEIGHT}
        min={MIN_SPACER_HEIGHT}
        onSelectPreset={(value) =>
          editor.chain().updateSpacerAttributes({ height: value }).run()
        }
        onValueChange={setHeight}
        onValueCommitted={(value) =>
          editor.chain().updateSpacerAttributes({ height: value }).run()
        }
        presets={SPACER_SPACING}
        suffix="px"
        value={height}
      />
    </BubbleMenu>
  );
}
