import {
  AlignVerticalJustifyCenterIcon,
  AlignVerticalJustifyEndIcon,
  AlignVerticalJustifyStartIcon,
} from 'lucide-react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { BubbleButton } from '../interface/bubble-button';

const COLUMN_VERTICAL_ALIGNMENTS = [
  {
    icon: AlignVerticalJustifyStartIcon,
    label: 'Align Top',
    value: 'top',
  },
  {
    icon: AlignVerticalJustifyCenterIcon,
    label: 'Align Middle',
    value: 'middle',
  },
  {
    icon: AlignVerticalJustifyEndIcon,
    label: 'Align Bottom',
    value: 'bottom',
  },
] as const;

export type AllowedColumnVerticalAlign =
  (typeof COLUMN_VERTICAL_ALIGNMENTS)[number]['value'];

export type VerticalAlignmentSwitchProps = {
  align: string;
  container: FloatingUIContainer;
  onAlignChange: (align: AllowedColumnVerticalAlign) => void;
};

export function VerticalAlignmentSwitch(props: VerticalAlignmentSwitchProps) {
  const { align, container, onAlignChange } = props;

  return (
    <div data-mly-vertical-alignment-switch="" role="group">
      {COLUMN_VERTICAL_ALIGNMENTS.map((item) => (
        <BubbleButton
          container={container}
          icon={item.icon}
          isActive={item.value === align}
          key={item.value}
          label={item.label}
          onClick={() => onAlignChange(item.value)}
          tooltip={item.label}
        />
      ))}
    </div>
  );
}
