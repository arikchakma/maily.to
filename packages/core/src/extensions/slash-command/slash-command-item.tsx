import type { Editor } from '@tiptap/core';
import { ChevronRightIcon } from 'lucide-react';
import type { ReactNode, RefObject } from 'react';

import { FLOATING_ELEMENT_PADDING } from '~/components/interface/floating-element';
import {
  Tooltip,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from '~/components/interface/tooltip';
import { useDelayedState } from '~/hooks/use-delayed-state';
import { cn } from '~/utils/classname';
import type { SlashCommandItem } from '~/utils/slash-command';

type SlashCommandItemProps = {
  item: SlashCommandItem;
  groupIndex: number;
  commandIndex: number;
  selectedGroupIndex: number;
  selectedCommandIndex: number;
  editor: Editor;
  activeCommandRef: RefObject<HTMLButtonElement | null>;
  selectItem: (groupIndex: number, commandIndex: number) => void;
  hoveredItemKey: string | null;
  onHover: (isHovered: boolean) => void;
};

export function SlashCommandItem(props: SlashCommandItemProps) {
  const {
    item,
    groupIndex,
    commandIndex,
    selectedGroupIndex,
    selectedCommandIndex,
    editor,
    activeCommandRef,
    selectItem,
    hoveredItemKey,
    onHover,
  } = props;

  const isActive =
    groupIndex === selectedGroupIndex && commandIndex === selectedCommandIndex;

  const itemKey = `${groupIndex}-${commandIndex}`;
  const isHovered = hoveredItemKey === itemKey;

  const isSubCommand = item && 'commands' in item;

  // show tooltip only if this item is hovered
  // OR (active/keyboard selected AND no other item is hovered)
  const shouldOpenTooltip =
    !!item?.preview && (isHovered || (isActive && !hoveredItemKey));

  const open = useDelayedState(shouldOpenTooltip);

  const hasRenderFunction = typeof item.render === 'function';
  const renderFunctionValue = hasRenderFunction ? item.render?.(editor) : null;

  let value: ReactNode = (
    <>
      <div className="mly:flex mly:h-6 mly:w-6 mly:shrink-0 mly:items-center mly:justify-center">
        {item.icon}
      </div>
      <div className="mly:min-w-0 mly:grow">
        <p className="mly:min-w-0 mly:truncate mly:font-medium">{item.title}</p>
        <p className="mly:min-w-0 mly:truncate mly:text-xs mly:text-midnight-gray/60">
          {item.description}
        </p>
      </div>

      {isSubCommand && (
        <span className="mly:block mly:px-1 mly:text-gray-400">
          <ChevronRightIcon className="mly:size-3.5 mly:stroke-[2.5]" />
        </span>
      )}
    </>
  );

  if (renderFunctionValue !== null && renderFunctionValue !== true) {
    value = renderFunctionValue!;
  }

  return (
    <Tooltip open={open}>
      <TooltipTrigger
        render={
          <button
            className={cn(
              'mly:flex mly:w-full mly:items-center mly:gap-2 mly:rounded-lg mly:px-2 mly:py-1 mly:text-left mly:text-sm mly:text-gray-900 mly:hover:bg-gray-100 mly:hover:text-gray-900',
              isActive
                ? 'mly:bg-gray-100 mly:text-gray-900'
                : 'mly:bg-transparent'
            )}
            onClick={() => selectItem(groupIndex, commandIndex)}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            type="button"
            ref={isActive ? activeCommandRef : null}
          >
            {value}
          </button>
        }
      />
      <TooltipPositioner side="right" sideOffset={FLOATING_ELEMENT_PADDING}>
        <TooltipPopup className="mly:w-52 mly:rounded-lg mly:border-none mly:p-1 mly:shadow">
          {typeof item.preview === 'function' ? (
            item?.preview(editor)
          ) : (
            <>
              <figure className="mly:relative mly:aspect-[2.5] mly:w-full mly:overflow-hidden mly:rounded-md mly:border mly:border-gray-200">
                <img
                  src={item?.preview}
                  alt={item?.title}
                  className="mly:absolute mly:inset-0 mly:h-full mly:w-full mly:object-cover"
                />
              </figure>
              <p className="mly:mt-2 mly:px-0.5 mly:text-gray-500">
                {item.description}
              </p>
            </>
          )}
        </TooltipPopup>
      </TooltipPositioner>
    </Tooltip>
  );
}
