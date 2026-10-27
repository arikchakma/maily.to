import type { AllowedTextAlignment, TextDirection } from '@maily-to/shared';
import {
  DEFAULT_TEXT_ALIGN,
  DEFAULT_TEXT_DIRECTION,
  isAllowedTextAlignment,
  MAILY_NODE_TYPES,
  parseInlineStyles,
  TEXT_ALIGNMENTS,
  TEXT_DIRECTIONS,
} from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
import type { LucideIcon } from 'lucide-react';
import {
  CheckIcon,
  PilcrowIcon,
  PilcrowLeftIcon,
  PilcrowRightIcon,
} from 'lucide-react';

import { useEditorInstance } from '~/hooks/use-editor-instance';

import { Button } from '../interface/button';
import { Divider } from '../interface/divider';
import { PopoverBack } from '../interface/popover';

const DIRECTION_OPTIONS: {
  icon: LucideIcon;
  label: string;
  value: TextDirection;
}[] = [
  {
    icon: PilcrowLeftIcon,
    label: 'Left to Right',
    value: TEXT_DIRECTIONS.LTR,
  },
  { icon: PilcrowIcon, label: 'Auto', value: TEXT_DIRECTIONS.AUTO },
  {
    icon: PilcrowRightIcon,
    label: 'Right to Left',
    value: TEXT_DIRECTIONS.RTL,
  },
];

export const TEXT_DIRECTION_SUPPORTED_TYPES: string[] = [
  MAILY_NODE_TYPES.PARAGRAPH,
  MAILY_NODE_TYPES.HEADING,
  MAILY_NODE_TYPES.BULLET_LIST,
  MAILY_NODE_TYPES.ORDERED_LIST,
  MAILY_NODE_TYPES.BUTTON,
];

export type TextDirectionConfigProps = {
  nodeType: string;
  onBack: () => void;
};

export function TextDirectionConfig(props: TextDirectionConfigProps) {
  const { nodeType, onBack } = props;

  const editor = useEditorInstance();

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const attrs = instance.getAttributes(nodeType);
      const align =
        nodeType === MAILY_NODE_TYPES.BUTTON
          ? attrs.align
          : parseInlineStyles((attrs.style as string) ?? '').textAlign;

      return {
        align: isAllowedTextAlignment(align) ? align : DEFAULT_TEXT_ALIGN,
        direction: (attrs.dir ?? DEFAULT_TEXT_DIRECTION) as TextDirection,
      };
    },
  });

  const updateDirection = (direction: TextDirection) => {
    const chain = editor.chain().focus();

    if (direction === TEXT_DIRECTIONS.AUTO) {
      chain.unsetTextDirection();
    } else {
      chain.setTextDirection(direction);
    }

    if (state.align !== TEXT_ALIGNMENTS.CENTER) {
      const align: AllowedTextAlignment =
        direction === TEXT_DIRECTIONS.RTL
          ? TEXT_ALIGNMENTS.RIGHT
          : TEXT_ALIGNMENTS.LEFT;

      if (nodeType === MAILY_NODE_TYPES.BUTTON) {
        chain.updateButtonAttributes({ align });
      } else {
        chain.updateNodeStyle(nodeType, { textAlign: align });
      }
    }

    return chain.run();
  };

  return (
    <div data-mly-text-direction-config="">
      <PopoverBack onClick={onBack}>Text Direction</PopoverBack>

      <Divider type="horizontal" />

      <div data-mly-text-direction-options="">
        {DIRECTION_OPTIONS.map((option) => {
          const isActive = state.direction === option.value;

          return (
            <Button
              data-active={isActive ? '' : undefined}
              data-mly-text-direction-option=""
              key={option.value}
              onClick={() => {
                return updateDirection(option.value);
              }}
            >
              <option.icon size={16} />
              {option.label}
              {isActive ? (
                <CheckIcon data-mly-text-direction-check="" size={14} />
              ) : null}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
