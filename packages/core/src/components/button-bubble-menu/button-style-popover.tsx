import { getBoxSides, MAILY_NODE_TYPES, toBoxSides } from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
import { MaximizeIcon } from 'lucide-react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';
import { SPACING_PRESETS } from '~/utils/spacing';
import { getNodeStyleState } from '~/utils/theme';

import { SideIcon } from '../icons/side-icon';
import { MultiUnitField, SIDE_AXES } from '../interface/multi-unit-field';
import { NodeStylePopover } from '../node-style/node-style-popover';

export type ButtonStylePopoverProps = {
  container: FloatingUIContainer;
};

export function ButtonStylePopover(props: ButtonStylePopoverProps) {
  const { container } = props;

  const editor = useEditorInstance();
  const paddingValues = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const { resolved } = getNodeStyleState({
        editor: instance,
        type: MAILY_NODE_TYPES.BUTTON,
      });

      return getBoxSides(resolved, 'padding');
    },
  });

  const updateStyle = (next: Record<string, string | null>) => {
    return editor.chain().updateNodeStyle(MAILY_NODE_TYPES.BUTTON, next).run();
  };

  return (
    <NodeStylePopover
      container={container}
      label="Button Style"
      nodeType={MAILY_NODE_TYPES.BUTTON}
    >
      <MultiUnitField
        axes={SIDE_AXES}
        axisIcons={{
          bottom: <SideIcon side="bottom" />,
          left: <SideIcon side="left" />,
          right: <SideIcon side="right" />,
          top: <SideIcon side="top" />,
        }}
        container={container}
        dragAreaIcon={<MaximizeIcon size={14} />}
        label="Padding"
        max={100}
        min={0}
        onValuesChange={(values) => updateStyle(toBoxSides('padding', values))}
        presets={SPACING_PRESETS}
        suffix="px"
        values={paddingValues}
      />
    </NodeStylePopover>
  );
}
