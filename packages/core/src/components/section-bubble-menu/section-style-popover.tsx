import { getBoxSides, MAILY_NODE_TYPES, toBoxSides } from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
import { MaximizeIcon, MoveIcon } from 'lucide-react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';
import { SPACING_PRESETS } from '~/utils/spacing';
import { getNodeStyleState } from '~/utils/theme';

import { SideIcon } from '../icons/side-icon';
import { Divider } from '../interface/divider';
import { MultiUnitField, SIDE_AXES } from '../interface/multi-unit-field';
import { NodeStylePopover } from '../node-style/node-style-popover';

const SIDE_ICONS = {
  bottom: <SideIcon side="bottom" />,
  left: <SideIcon side="left" />,
  right: <SideIcon side="right" />,
  top: <SideIcon side="top" />,
};

export type SectionStylePopoverProps = {
  container: FloatingUIContainer;
};

export function SectionStylePopover(props: SectionStylePopoverProps) {
  const { container } = props;

  const editor = useEditorInstance();
  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const { resolved } = getNodeStyleState({
        editor: instance,
        type: MAILY_NODE_TYPES.SECTION,
      });

      return {
        marginValues: getBoxSides(resolved, 'margin'),
        paddingValues: getBoxSides(resolved, 'padding'),
      };
    },
  });

  const updateStyle = (next: Record<string, string | null>) => {
    return editor.chain().updateNodeStyle(MAILY_NODE_TYPES.SECTION, next).run();
  };

  return (
    <NodeStylePopover
      container={container}
      label="Section Style"
      nodeType={MAILY_NODE_TYPES.SECTION}
    >
      <MultiUnitField
        axes={SIDE_AXES}
        axisIcons={SIDE_ICONS}
        container={container}
        dragAreaIcon={<MaximizeIcon size={14} />}
        label="Padding"
        max={100}
        min={0}
        onValuesChange={(values) => updateStyle(toBoxSides('padding', values))}
        presets={SPACING_PRESETS}
        suffix="px"
        values={state.paddingValues}
      />

      <Divider type="horizontal" />

      <MultiUnitField
        axes={SIDE_AXES}
        axisIcons={SIDE_ICONS}
        container={container}
        dragAreaIcon={<MoveIcon size={14} />}
        label="Margin"
        max={100}
        min={0}
        onValuesChange={(values) => updateStyle(toBoxSides('margin', values))}
        presets={SPACING_PRESETS}
        suffix="px"
        values={state.marginValues}
      />
    </NodeStylePopover>
  );
}
