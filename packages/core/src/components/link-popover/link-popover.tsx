import type { LucideIcon } from 'lucide-react';
import { ArrowUpRightIcon, LinkIcon, TrashIcon } from 'lucide-react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import type { TextFieldPopoverAction } from '../interface/text-field-popover';
import { TextFieldPopover } from '../interface/text-field-popover';

export type LinkPopoverProps = {
  container: FloatingUIContainer;
  enterTooltip?: string;
  icon?: LucideIcon;
  onClose?: () => void;
  onUrlChange: (url: string | null) => void;
  placeholder?: string;
  showOpenInNewTabButton?: boolean;
  showRemoveButton?: boolean;
  tooltip?: string;
  url: string;
};

export function LinkPopover(props: LinkPopoverProps) {
  const {
    container,
    enterTooltip = 'Add Link',
    icon = LinkIcon,
    onClose,
    onUrlChange,
    placeholder = 'https://maily.to',
    showOpenInNewTabButton = true,
    showRemoveButton,
    tooltip = 'Link',
    url,
  } = props;

  const actions: TextFieldPopoverAction[] = [];

  if (showOpenInNewTabButton) {
    actions.push({
      icon: ArrowUpRightIcon,
      onClick: (value) => {
        if (value) {
          window.open(value, '_blank', 'noopener,noreferrer');
        }
      },
      tooltip: 'Open in new tab',
    });
  }

  if (showRemoveButton) {
    actions.push({
      icon: TrashIcon,
      onClick: () => onUrlChange(null),
      tooltip: 'Remove link',
    });
  }

  return (
    <TextFieldPopover
      actions={actions}
      container={container}
      enterTooltip={enterTooltip}
      onClose={onClose}
      onValueChange={onUrlChange}
      placeholder={placeholder}
      triggerIcon={icon}
      triggerTooltip={tooltip}
      value={url}
    />
  );
}
