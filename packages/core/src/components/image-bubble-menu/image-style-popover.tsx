import {
  MAILY_NODE_TYPES,
  MAX_IMAGE_WIDTH_PERCENTAGE,
  MIN_IMAGE_WIDTH_PERCENTAGE,
  parseWidthToPercentage,
} from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
import { RulerDimensionLineIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';

import { UnitField } from '../interface/unit-field';
import { NodeStylePopover } from '../node-style/node-style-popover';

export type ImageStylePopoverProps = {
  container: FloatingUIContainer;
};

export function ImageStylePopover(props: ImageStylePopoverProps) {
  const { container } = props;

  const editor = useEditorInstance();
  const committedWidth = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const attrs = instance.getAttributes(MAILY_NODE_TYPES.IMAGE);

      return parseWidthToPercentage(attrs.width as string);
    },
  });

  const widthInputId = useId();

  const [width, setWidth] = useState(committedWidth);

  const handleWidthChange = (nextWidth: number) => {
    setWidth(nextWidth);
    editor
      .chain()
      .updateAttributes(MAILY_NODE_TYPES.IMAGE, { width: `${nextWidth}%` })
      .run();
  };

  return (
    <NodeStylePopover
      container={container}
      label="Image Style"
      nodeType={MAILY_NODE_TYPES.IMAGE}
      onOpenChange={() => setWidth(committedWidth)}
    >
      <div data-mly-image-width-field="">
        <label data-mly-field-label="" htmlFor={widthInputId}>
          Width
        </label>

        <UnitField
          container={container}
          dragAreaIcon={<RulerDimensionLineIcon size={14} />}
          id={widthInputId}
          label="Width"
          max={MAX_IMAGE_WIDTH_PERCENTAGE}
          min={MIN_IMAGE_WIDTH_PERCENTAGE}
          onValueChange={setWidth}
          onValueCommitted={handleWidthChange}
          suffix="%"
          value={width}
        />
      </div>
    </NodeStylePopover>
  );
}
