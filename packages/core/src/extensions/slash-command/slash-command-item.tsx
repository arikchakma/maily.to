import type { Editor } from '@tiptap/core';
import { ChevronRightIcon } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';

import { FLOATING_ELEMENT_PADDING } from '~/components/interface/floating-element';
import {
  Tooltip,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from '~/components/interface/tooltip';
import { useDelayedState } from '~/hooks/use-delayed-state';
import type { SlashCommandItem as SlashCommandItemType } from '~/utils/slash-command';

export type SlashCommandItemProps = ComponentPropsWithRef<'button'> & {
  editor: Editor;
  hoveredKey: string | null;
  isSelected: boolean;
  item: SlashCommandItemType;
  itemKey: string;
  onHover: (isHovered: boolean) => void;
};

export function SlashCommandItem(props: SlashCommandItemProps) {
  const { editor, hoveredKey, isSelected, item, itemKey, onHover, ...rest } =
    props;

  const isHovered = hoveredKey === itemKey;
  const isNested = 'commands' in item;

  // show tooltip only if this item is hovered
  // OR (active/keyboard selected AND no other item is hovered)
  const open = useDelayedState(
    Boolean(item.preview) && (isHovered || (isSelected && !hoveredKey))
  );

  const rendered = item.render ? item.render(editor) : null;
  const isCustomRow =
    rendered !== null && rendered !== true && rendered !== undefined;

  return (
    <Tooltip open={open}>
      <TooltipTrigger
        render={
          <button
            {...rest}
            data-mly-slash-command-item=""
            data-selected={isSelected ? '' : undefined}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            type="button"
          >
            {isCustomRow ? (
              rendered
            ) : (
              <>
                {item.icon ? (
                  <span data-mly-slash-command-icon="">{item.icon}</span>
                ) : null}
                <span data-mly-slash-command-text="">
                  <span data-mly-slash-command-title="">{item.title}</span>
                  {item.description ? (
                    <span data-mly-slash-command-description="">
                      {item.description}
                    </span>
                  ) : null}
                </span>
                {isNested ? (
                  <span data-mly-slash-command-chevron="">
                    <ChevronRightIcon size={14} strokeWidth={2.5} />
                  </span>
                ) : null}
              </>
            )}
          </button>
        }
      />

      <TooltipPositioner side="right" sideOffset={FLOATING_ELEMENT_PADDING}>
        <TooltipPopup data-variant="preview">
          {typeof item.preview === 'function' ? (
            item.preview(editor)
          ) : (
            <>
              <figure data-mly-slash-command-preview="">
                <img alt={item.title} src={item.preview} />
              </figure>
              <p data-mly-slash-command-preview-description="">
                {item.description}
              </p>
            </>
          )}
        </TooltipPopup>
      </TooltipPositioner>
    </Tooltip>
  );
}
