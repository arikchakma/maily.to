import type { AllowedTextAlignment, TextDirection } from '@maily-to/shared';
import {
  DEFAULT_TEXT_DIRECTION,
  MAILY_NODE_TYPES,
  TEXT_ALIGNMENTS,
  TEXT_DIRECTIONS,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import type { LucideIcon } from 'lucide-react';
import {
  CheckIcon,
  PilcrowIcon,
  PilcrowLeftIcon,
  PilcrowRightIcon,
} from 'lucide-react';
import { useCallback } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { cn } from '~/utils/classname';

import { Button } from '../interface/button';
import { Divider } from '../interface/divider';
import { PopoverBack } from '../interface/popover';

type TextDirectionConfigProps = {
  editor: Editor;
  nodeType: string;
  onBack?: () => void;
};

type DirectionOption = {
  label: string;
  icon: LucideIcon;
  value: TextDirection;
};

const DIRECTION_OPTIONS: DirectionOption[] = [
  {
    label: 'Left to Right',
    icon: PilcrowLeftIcon,
    value: TEXT_DIRECTIONS.LTR,
  },
  {
    label: 'Auto',
    icon: PilcrowIcon,
    value: TEXT_DIRECTIONS.AUTO,
  },
  {
    label: 'Right to Left',
    icon: PilcrowRightIcon,
    value: TEXT_DIRECTIONS.RTL,
  },
];

export function TextDirectionConfig(props: TextDirectionConfigProps) {
  const { editor: editorProp, nodeType, onBack } = props;

  const editor = useEditorInstance(editorProp);
  const state = useEditorState({
    editor,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes(nodeType);

      const align: AllowedTextAlignment | null =
        nodeType === MAILY_NODE_TYPES.BUTTON
          ? ((attrs.alignment as AllowedTextAlignment) ?? null)
          : ((attrs.textAlign as AllowedTextAlignment) ?? null);

      return {
        direction: (attrs.dir ?? DEFAULT_TEXT_DIRECTION) as TextDirection,
        align,
      };
    },
  });

  const handleDirectionChange = useCallback(
    (dir: TextDirection) => {
      const chain = editor.chain().focus();

      if (dir === TEXT_DIRECTIONS.AUTO) {
        chain.unsetTextDirection();
      } else {
        chain.setTextDirection(dir);
      }

      if (state.align !== TEXT_ALIGNMENTS.CENTER) {
        if (nodeType === MAILY_NODE_TYPES.BUTTON) {
          chain.updateButtonAttributes({
            alignment:
              dir === TEXT_DIRECTIONS.RTL
                ? TEXT_ALIGNMENTS.RIGHT
                : TEXT_ALIGNMENTS.LEFT,
          });
        } else {
          chain.setTextAlign(
            dir === TEXT_DIRECTIONS.RTL
              ? TEXT_ALIGNMENTS.RIGHT
              : TEXT_ALIGNMENTS.LEFT
          );
        }
      }

      chain.run();
    },
    [editor, nodeType, state.align]
  );

  return (
    <div className="mly:flex mly:flex-col">
      {onBack && (
        <>
          <PopoverBack onClick={onBack}>Text Direction</PopoverBack>
          <Divider type="horizontal" className="mly:-mx-1 mly:my-1" />
        </>
      )}

      <div className="mly:space-y-0.5 mly:p-0.5">
        {DIRECTION_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = state.direction === option.value;

          return (
            <Button
              key={option.value}
              variant="ghost"
              onClick={() => handleDirectionChange(option.value)}
              className={cn(
                'mly:w-full mly:cursor-default mly:justify-start mly:gap-2 mly:px-2 mly:py-1 mly:font-normal',
                isActive && 'mly:bg-soft-gray/70 mly:text-gray-900'
              )}
            >
              <Icon className="mly:size-4" />
              {option.label}
              {isActive && (
                <CheckIcon className="mly:ml-auto mly:size-3.5 mly:shrink-0" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
