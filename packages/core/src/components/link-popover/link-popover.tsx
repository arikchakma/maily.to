import type { Editor } from '@tiptap/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRightIcon, LinkIcon, TrashIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import type { FloatingUIContainer } from '~/types/floating-ui';

import { TextFieldPopover } from '../interface/text-field-popover';

type LinkPopoverProps = {
  container: FloatingUIContainer;
  icon?: LucideIcon;
  tooltip?: string;
  enterTooltip?: string;

  url: string;
  onUrlChange: (url: string | null) => void;
  onClose?: () => void;

  placeholder?: string;
  showOpenInNewTabButton?: boolean;
  showRemoveButton?: boolean;
};

export function LinkPopover(props: LinkPopoverProps) {
  const {
    container,
    icon = LinkIcon,
    tooltip = 'Link',
    enterTooltip = 'Add Link',
    url,
    onUrlChange,
    onClose,
    placeholder = 'https://maily.to',
    showOpenInNewTabButton = true,
    showRemoveButton,
  } = props;

  const [open, setOpen] = useState(false);

  const handleUrlChange = useCallback(
    (url: string) => {
      onUrlChange(url ?? null);
      setOpen(false);
    },
    [onUrlChange]
  );

  const handleRemoveLink = useCallback(() => {
    onUrlChange(null);
    onClose?.();
    setOpen(false);
  }, [onUrlChange, onClose]);

  const handleOpenInNewTab = useCallback((editor: Editor) => {
    const text = editor.getText();
    window.open(text, '_blank');
  }, []);

  const actions = useMemo(() => {
    return [
      ...(showOpenInNewTabButton
        ? [
            {
              icon: ArrowUpRightIcon,
              tooltip: 'Open in new tab',
              onClick: handleOpenInNewTab,
            },
          ]
        : []),
      ...(showRemoveButton
        ? [
            {
              icon: TrashIcon,
              tooltip: 'Remove link',
              onClick: handleRemoveLink,
            },
          ]
        : []),
    ];
  }, [
    showRemoveButton,
    handleRemoveLink,
    handleOpenInNewTab,
    showOpenInNewTabButton,
  ]);

  return (
    <TextFieldPopover
      open={open}
      onOpenChange={setOpen}
      container={container}
      value={url ?? ''}
      onValueChange={handleUrlChange}
      onClose={onClose}
      triggerIcon={icon}
      triggerTooltip={tooltip}
      enterTooltip={enterTooltip}
      actions={actions}
      placeholder={placeholder}
    />
  );
}
