import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { AllowedLogoAlignment } from '../nodes/logo';
import { BubbleMenuButton } from './bubble-menu-button';

type AlignmentSwitchProps = {
  alignment: AllowedLogoAlignment;
  onAlignmentChange: (alignment: AllowedLogoAlignment) => void;
};

export function AlignmentSwitch(props: AlignmentSwitchProps) {
  const { alignment = 'left', onAlignmentChange } = props;

  const activeAlignment = {
    left: {
      icon: AlignLeft,
      tooltip: 'Align Left',
      onClick: () => {
        onAlignmentChange('center');
      },
    },
    center: {
      icon: AlignCenter,
      tooltip: 'Align Center',
      onClick: () => {
        onAlignmentChange('right');
      },
    },
    right: {
      icon: AlignRight,
      tooltip: 'Align Right',
      onClick: () => {
        onAlignmentChange('left');
      },
    },
  }[alignment];

  return (
    <BubbleMenuButton
      icon={activeAlignment.icon}
      tooltip={activeAlignment.tooltip}
      command={activeAlignment.onClick}
    />
  );
}
