import { getBorderParts, noop } from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
import {
  ArrowRightIcon,
  SlidersHorizontalIcon,
  SquareRoundCornerIcon,
} from 'lucide-react';
import { useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';
import { getNodeStyleState } from '~/utils/theme';

import { BorderStyleConfig } from '../border-style/border-style-config';
import { BubbleButton } from '../interface/bubble-button';
import { Button } from '../interface/button';
import { Divider } from '../interface/divider';
import {
  Popover,
  PopoverArrow,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';

export type NodeStylePopoverProps = {
  children: React.ReactNode;
  container: FloatingUIContainer;
  label: string;
  nodeType: string;
  onOpenChange?: (open: boolean) => void;
};

export function NodeStylePopover(props: NodeStylePopoverProps) {
  const { children, container, label, nodeType, onOpenChange = noop } = props;

  const editor = useEditorInstance();
  const hasBorderStyle = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const { authored } = getNodeStyleState({
        editor: instance,
        type: nodeType,
      });
      const border = getBorderParts(authored);

      return (
        Boolean(border.width) ||
        Object.keys(authored).some((property) =>
          property.startsWith('borderRadius')
        )
      );
    },
  });

  const [open, setOpen] = useState(false);
  const [isBorderConfigOpen, setIsBorderConfigOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    setIsBorderConfigOpen(false);
    onOpenChange(nextOpen);
  };

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <BubbleButton
        container={container}
        icon={SlidersHorizontalIcon}
        isActive={open}
        label={label}
        render={<PopoverTrigger />}
        tooltip={label}
      />

      <PopoverPositioner align="center" container={container} side="bottom">
        <PopoverPopup data-variant="style" initialFocus={false}>
          {isBorderConfigOpen ? (
            <BorderStyleConfig
              container={container}
              nodeType={nodeType}
              onBack={() => setIsBorderConfigOpen(false)}
            />
          ) : (
            <>
              {children}

              <Divider type="horizontal" />

              <Button
                data-active={hasBorderStyle ? '' : undefined}
                data-mly-style-config-link=""
                onClick={() => setIsBorderConfigOpen(true)}
              >
                <span>
                  <SquareRoundCornerIcon size={14} />
                  Border Style
                </span>
                <ArrowRightIcon size={14} />
              </Button>
            </>
          )}

          <PopoverArrow />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
