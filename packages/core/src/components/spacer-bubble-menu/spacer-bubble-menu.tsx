import type { AllowedFieldMode } from '@maily-to/shared';
import { FIELD_MODE } from '@maily-to/shared';
import { RectangleHorizontalIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useSpacerState } from '~/hooks/use-spacer-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';
import { SPACER_SPACING } from '~/utils/spacing';

import { BubbleMenu } from '../interface/bubble-menu';
import { UnitField } from '../interface/unit-field';

type SpacerBubbleMenuProps = {};

export function SpacerBubbleMenu(_props: SpacerBubbleMenuProps) {
  const editor = useEditorInstance();
  const state = useSpacerState(editor);
  const container = useRef<HTMLDivElement | null>(null);

  const { height: defaultHeight, heightMode, open, setOpen } = state;
  const [height, setHeight] = useState(defaultHeight);
  const [prevDefaultHeight, setPrevDefaultHeight] = useState(defaultHeight);

  if (prevDefaultHeight !== defaultHeight) {
    setPrevDefaultHeight(defaultHeight);
    setHeight(defaultHeight);
  }

  const handleHeightChange = (
    value: number,
    mode: AllowedFieldMode = FIELD_MODE.UNIFORM
  ) => {
    editor
      .chain()
      .updateSpacerAttributes({
        height: value,
        heightMode: mode,
      })
      .run();
  };

  const displayValue = useMemo(() => {
    if (heightMode !== FIELD_MODE.PRESET) {
      return null;
    }

    const preset = SPACER_SPACING.find(
      (preset) => preset.value === Number(height)
    );
    return preset?.displayValue ?? null;
  }, [heightMode, height]);

  if (!open) {
    return null;
  }

  return (
    <BubbleMenu
      ref={container}
      open={open}
      onOpenChange={setOpen}
      floatingId={FLOATING_ELEMENT_IDS.SPACER_BUBBLE_MENU}
    >
      <UnitField
        value={height}
        onValueChange={setHeight}
        onValueCommitted={handleHeightChange}
        suffix="px"
        min={1}
        max={1000}
        className="mly:w-20"
        presets={SPACER_SPACING}
        displayValue={displayValue}
        onSelectPreset={(value) => handleHeightChange(value, FIELD_MODE.PRESET)}
        container={container}
        dragAreaIcon={
          <RectangleHorizontalIcon className="mly:size-3.5 mly:text-midnight-gray" />
        }
      />
    </BubbleMenu>
  );
}
