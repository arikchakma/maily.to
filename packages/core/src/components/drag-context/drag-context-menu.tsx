import type { Node } from '@tiptap/pm/model';
import type { Editor } from '@tiptap/react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ClipboardCopyIcon,
  CopyIcon,
  EyeIcon,
  GripVerticalIcon,
  PilcrowIcon,
  RotateCcwIcon,
  TrashIcon,
  TypeIcon,
} from 'lucide-react';
import type { KeyboardEvent, RefObject } from 'react';
import { Fragment, useState } from 'react';

import {
  getBlockMenuShortcutKeys,
  getBlockMenuShortcutLabel,
} from '~/extensions/block-menu/block-menu';
import { VISIBILITY_SUPPORTED_TYPES } from '~/extensions/visibility/visibility';
import type { FloatingUIContainer } from '~/types/floating-ui';

import {
  FONT_STYLE_SUPPORTED_TYPES,
  FontStyleConfig,
} from '../font-style/font-style-config';
import { Button } from '../interface/button';
import { Divider } from '../interface/divider';
import type { PopoverPopupProps } from '../interface/popover';
import {
  Popover,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';
import {
  Tooltip,
  TooltipArrow,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from '../interface/tooltip';
import {
  TEXT_DIRECTION_SUPPORTED_TYPES,
  TextDirectionConfig,
} from '../text-direction/text-direction-config';
import { VisibilityConfig } from '../visibility/visibility-config';

const ENABLED_ITEM_SELECTOR =
  '[data-mly-drag-context-item]:not([data-disabled])';

const NAVIGATION_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

function getEnabledItems(container: HTMLElement) {
  return [
    ...container.querySelectorAll<HTMLButtonElement>(ENABLED_ITEM_SELECTOR),
  ];
}

type NextItemOptions = {
  active: Element | null;
  items: HTMLButtonElement[];
  key: string;
};

function getNextItem(options: NextItemOptions) {
  const { active, items, key } = options;

  if (items.length === 0) {
    return null;
  }

  if (key === 'Home') {
    return items[0];
  }

  if (key === 'End') {
    return items[items.length - 1];
  }

  const index = items.findIndex((item) => {
    return item === active;
  });

  if (index === -1) {
    return key === 'ArrowUp' ? items[items.length - 1] : items[0];
  }

  const step = key === 'ArrowUp' ? -1 : 1;

  return items[(index + step + items.length) % items.length];
}

type DragContextMenuItem = {
  can: () => boolean;
  command: () => void;
  icon: LucideIcon;
  id: string;
  label: string;
  rightIcon?: LucideIcon;
};

type DragContextMenuGroup = {
  id: string;
  items: DragContextMenuItem[];
};

export type DragContextOpenSource = 'pointer' | 'shortcut';

export type DragContextMenuProps = {
  container: FloatingUIContainer;
  editor: Editor;
  nodeRef: RefObject<Node | null>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  openSourceRef: RefObject<DragContextOpenSource>;
  posRef: RefObject<number | null>;
};

export function DragContextMenu(props: DragContextMenuProps) {
  const {
    container,
    editor,
    nodeRef,
    onOpenChange,
    open,
    openSourceRef,
    posRef,
  } = props;

  const [isFontStyleOpen, setIsFontStyleOpen] = useState(false);
  const [isTextDirectionOpen, setIsTextDirectionOpen] = useState(false);
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setIsFontStyleOpen(false);
    setIsTextDirectionOpen(false);
    setIsVisibilityOpen(false);
    onOpenChange(nextOpen);
  };

  const getInitialFocus: PopoverPopupProps['initialFocus'] = (openType) => {
    return openSourceRef.current === 'shortcut' || openType === 'keyboard';
  };

  const handleItemsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!NAVIGATION_KEYS.includes(event.key)) {
      return;
    }

    const next = getNextItem({
      active: document.activeElement,
      items: getEnabledItems(event.currentTarget),
      key: event.key,
    });

    if (!next) {
      return;
    }

    event.preventDefault();
    next.focus();
  };

  const getNodeAndPos = () => {
    const node = nodeRef.current;
    const pos = posRef.current;

    if (node === null || pos === null || pos === -1) {
      return null;
    }

    return { node, pos };
  };

  const resetFormatting: DragContextMenuItem = {
    can: () => {
      return getNodeAndPos() !== null;
    },
    command: () => {
      const data = getNodeAndPos();
      const node = data ? editor.state.doc.nodeAt(data.pos) : null;
      if (!(data && node)) {
        return;
      }

      editor
        .chain()
        .focus()
        .setTextSelection({
          from: data.pos + 1,
          to: data.pos + node.nodeSize - 1,
        })
        .clearNodes()
        .unsetAllMarks()
        .run();
    },
    icon: RotateCcwIcon,
    id: 'reset-formatting',
    label: 'Reset formatting',
  };

  const fontStyle: DragContextMenuItem = {
    can: () => {
      const node = nodeRef.current;

      return (
        node !== null && FONT_STYLE_SUPPORTED_TYPES.includes(node.type.name)
      );
    },
    command: () => {
      setIsFontStyleOpen(true);
    },
    icon: TypeIcon,
    id: 'font-style',
    label: 'Font Style',
    rightIcon: ArrowRightIcon,
  };

  const textDirection: DragContextMenuItem = {
    can: () => {
      const node = nodeRef.current;

      return (
        node !== null && TEXT_DIRECTION_SUPPORTED_TYPES.includes(node.type.name)
      );
    },
    command: () => {
      setIsTextDirectionOpen(true);
    },
    icon: PilcrowIcon,
    id: 'text-direction',
    label: 'Text Direction',
    rightIcon: ArrowRightIcon,
  };

  const visibility: DragContextMenuItem = {
    can: () => {
      const node = nodeRef.current;

      return (
        node !== null && VISIBILITY_SUPPORTED_TYPES.includes(node.type.name)
      );
    },
    command: () => {
      setIsVisibilityOpen(true);
    },
    icon: EyeIcon,
    id: 'visibility',
    label: 'Visibility',
    rightIcon: ArrowRightIcon,
  };

  const duplicate: DragContextMenuItem = {
    can: () => {
      return getNodeAndPos() !== null;
    },
    command: () => {
      const data = getNodeAndPos();
      if (!data) {
        return;
      }

      editor
        .chain()
        .focus()
        .insertContentAt(data.pos + data.node.nodeSize, data.node.toJSON())
        .run();
    },
    icon: CopyIcon,
    id: 'duplicate',
    label: 'Duplicate',
  };

  const copyToClipboard: DragContextMenuItem = {
    can: () => {
      return (nodeRef.current?.textContent.length ?? 0) > 0;
    },
    command: () => {
      const text = nodeRef.current?.textContent;
      if (!text) {
        return;
      }

      void navigator.clipboard.writeText(text);
      onOpenChange(false);
    },
    icon: ClipboardCopyIcon,
    id: 'copy-to-clipboard',
    label: 'Copy to clipboard',
  };

  const moveUp: DragContextMenuItem = {
    can: () => {
      const data = getNodeAndPos();

      return data !== null && editor.state.doc.resolve(data.pos).index() > 0;
    },
    command: () => {
      const data = getNodeAndPos();
      const nodeBefore = data
        ? editor.state.doc.resolve(data.pos).nodeBefore
        : null;
      if (!(data && nodeBefore)) {
        return;
      }

      editor
        .chain()
        .focus()
        .command(({ dispatch, tr }) => {
          if (!dispatch) {
            return true;
          }

          tr.delete(data.pos, data.pos + data.node.nodeSize);
          tr.insert(data.pos - nodeBefore.nodeSize, data.node);

          return dispatch(tr);
        })
        .run();

      onOpenChange(false);
    },
    icon: ArrowUpIcon,
    id: 'move-up',
    label: 'Move up',
  };

  const moveDown: DragContextMenuItem = {
    can: () => {
      const data = getNodeAndPos();
      if (!data) {
        return false;
      }

      const $pos = editor.state.doc.resolve(data.pos);

      return $pos.index() < $pos.parent.childCount - 1;
    },
    command: () => {
      const data = getNodeAndPos();
      if (!data) {
        return;
      }

      const endPos = data.pos + data.node.nodeSize;
      const nodeAfter = editor.state.doc.resolve(endPos).nodeAfter;
      if (!nodeAfter) {
        return;
      }

      editor
        .chain()
        .focus()
        .command(({ dispatch, tr }) => {
          if (!dispatch) {
            return true;
          }

          tr.delete(data.pos, endPos);
          tr.insert(
            endPos + nodeAfter.nodeSize - data.node.nodeSize,
            data.node
          );

          return dispatch(tr);
        })
        .run();

      onOpenChange(false);
    },
    icon: ArrowDownIcon,
    id: 'move-down',
    label: 'Move down',
  };

  const remove: DragContextMenuItem = {
    can: () => {
      return getNodeAndPos() !== null;
    },
    command: () => {
      const data = getNodeAndPos();
      if (!data) {
        return;
      }

      editor
        .chain()
        .focus()
        .setMeta('hideDragHandle', true)
        .command(({ dispatch, tr }) => {
          if (!dispatch) {
            return true;
          }

          tr.delete(data.pos, data.pos + data.node.nodeSize);

          return dispatch(tr);
        })
        .run();
    },
    icon: TrashIcon,
    id: 'delete',
    label: 'Delete',
  };

  const groups: DragContextMenuGroup[] = [
    { id: 'formatting', items: [resetFormatting] },
    { id: 'options', items: [fontStyle, textDirection, visibility] },
    { id: 'clipboard', items: [duplicate, copyToClipboard] },
    { id: 'order', items: [moveUp, moveDown] },
    { id: 'remove', items: [remove] },
  ];

  const nodeType = nodeRef.current?.type.name;

  return (
    <Popover onOpenChange={handleOpenChange} open={open}>
      <Tooltip disableHoverablePopup>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  aria-keyshortcuts={getBlockMenuShortcutKeys()}
                  aria-label="Drag to move"
                  data-active={open ? '' : undefined}
                  data-mly-drag-context-trigger=""
                >
                  <GripVerticalIcon size={14} />
                </Button>
              }
            />
          }
        />
        <TooltipPositioner container={container}>
          <TooltipPopup>
            {`Drag to move (${getBlockMenuShortcutLabel()})`}
            <TooltipArrow />
          </TooltipPopup>
        </TooltipPositioner>
      </Tooltip>

      <PopoverPositioner align="start" container={container} side="bottom">
        <PopoverPopup
          data-variant="drag-context"
          initialFocus={getInitialFocus}
        >
          {isFontStyleOpen && nodeType ? (
            <FontStyleConfig
              container={container}
              nodeType={nodeType}
              onBack={() => setIsFontStyleOpen(false)}
            />
          ) : null}

          {isTextDirectionOpen && nodeType ? (
            <TextDirectionConfig
              nodeType={nodeType}
              onBack={() => setIsTextDirectionOpen(false)}
            />
          ) : null}

          {isVisibilityOpen && nodeType ? (
            <VisibilityConfig
              container={container}
              nodeType={nodeType}
              onBack={() => setIsVisibilityOpen(false)}
            />
          ) : null}

          {isFontStyleOpen || isTextDirectionOpen || isVisibilityOpen ? null : (
            <div
              data-axis="y"
              data-mly-drag-context-items=""
              data-mly-scroll-fade=""
              onKeyDown={handleItemsKeyDown}
            >
              {groups.map((group, index) => {
                return (
                  <Fragment key={group.id}>
                    {index > 0 && <Divider type="horizontal" />}

                    {group.items.map((item) => {
                      return (
                        <Button
                          data-mly-drag-context-item=""
                          data-variant={
                            item.id === remove.id ? 'danger' : undefined
                          }
                          disabled={!item.can()}
                          key={item.id}
                          onClick={item.command}
                        >
                          <item.icon size={16} />
                          {item.label}
                          {item.rightIcon ? (
                            <item.rightIcon
                              data-mly-drag-context-item-chevron=""
                              size={14}
                            />
                          ) : null}
                        </Button>
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          )}
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
}
