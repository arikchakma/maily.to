import { MAILY_NODE_TYPES } from '@maily-to/shared';
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
import type { RefObject } from 'react';
import { Fragment, useState } from 'react';

import { FONT_STYLE_SUPPORTED_TYPES } from '~/extensions/font-style/font-style';
import { VISIBILITY_SUPPORTED_TYPES } from '~/extensions/visibility/visibility';
import { cn } from '~/utils/classname';

import { FontStyleConfig } from '../font-style/font-style-config';
import { Button } from '../interface/button';
import { Divider } from '../interface/divider';
import {
  Popover,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from '../interface/popover';
import {
  Tooltip,
  TooltipPopup,
  TooltipPositioner,
  TooltipTrigger,
} from '../interface/tooltip';
import { TextDirectionConfig } from '../text-direction/text-direction-config';
import { VisibilityConfig } from '../visibility/visibility-config';

type MenuItemAction = {
  id: string;
  label: string;
  icon: LucideIcon;
  can: () => boolean;
  command: () => void;
  rightIcon?: LucideIcon;
};

type DragContextMenuProps = {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: RefObject<HTMLDivElement | null>;
  nodeRef: RefObject<Node | null>;
  posRef: RefObject<number | null>;
};

const TEXT_DIRECTION_SUPPORTED_TYPES: string[] = [
  MAILY_NODE_TYPES.PARAGRAPH,
  MAILY_NODE_TYPES.HEADING,
  MAILY_NODE_TYPES.BULLET_LIST,
  MAILY_NODE_TYPES.ORDERED_LIST,
  MAILY_NODE_TYPES.BUTTON,
];

export function DragContextMenu(props: DragContextMenuProps) {
  const { editor, open, onOpenChange, container, nodeRef, posRef } = props;

  const [isFontStyleOpen, setIsFontStyleOpen] = useState(false);
  const [isTextDirectionOpen, setIsTextDirectionOpen] = useState(false);
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIsFontStyleOpen(false);
      setIsTextDirectionOpen(false);
      setIsVisibilityOpen(false);
    }
    onOpenChange(nextOpen);
  };

  const getNodeAndPos = () => {
    const node = nodeRef.current;
    const pos = posRef.current;
    if (pos == null || node == null || pos === -1) {
      return null;
    }

    return { node, pos };
  };

  const menuItems: MenuItemAction[][] = [
    [
      {
        id: 'reset-formatting',
        label: 'Reset formatting',
        icon: RotateCcwIcon,
        can: () => {
          const data = getNodeAndPos();
          return data !== null;
        },
        command: () => {
          const data = getNodeAndPos();
          if (!data) {
            return;
          }

          const node = editor.state.doc.nodeAt(data.pos);
          if (!node) {
            return;
          }

          const from = data.pos + 1;
          const to = data.pos + node.nodeSize - 1;

          editor
            .chain()
            .focus()
            .setTextSelection({ from, to })
            .clearNodes()
            .unsetAllMarks()
            .run();
        },
      },
    ],
    [
      {
        id: 'font-style',
        label: 'Font Style',
        icon: TypeIcon,
        can: () => {
          const node = nodeRef.current;
          return (
            node !== null && FONT_STYLE_SUPPORTED_TYPES.includes(node.type.name)
          );
        },
        command: () => {
          setIsFontStyleOpen(true);
        },
        rightIcon: ArrowRightIcon,
      },
      {
        id: 'text-direction',
        label: 'Text Direction',
        icon: PilcrowIcon,
        can: () => {
          const node = nodeRef.current;
          return (
            node !== null &&
            TEXT_DIRECTION_SUPPORTED_TYPES.includes(node.type.name)
          );
        },
        command: () => {
          setIsTextDirectionOpen(true);
        },
        rightIcon: ArrowRightIcon,
      },
      {
        id: 'visibility',
        label: 'Visibility',
        icon: EyeIcon,
        can: () => {
          const node = nodeRef.current;
          return (
            node !== null && VISIBILITY_SUPPORTED_TYPES.includes(node.type.name)
          );
        },
        command: () => {
          setIsVisibilityOpen(true);
        },
        rightIcon: ArrowRightIcon,
      },
    ],
    [
      {
        id: 'duplicate',
        label: 'Duplicate',
        icon: CopyIcon,
        can: () => {
          const data = getNodeAndPos();
          return data !== null;
        },
        command: () => {
          const data = getNodeAndPos();
          if (!data) {
            return;
          }

          const endPos = data.pos + data.node.nodeSize;
          editor
            .chain()
            .focus()
            .insertContentAt(endPos, data.node.toJSON())
            .run();
        },
      },
      {
        id: 'copy-to-clipboard',
        label: 'Copy to clipboard',
        icon: ClipboardCopyIcon,
        can: () => {
          const node = nodeRef.current;
          return node !== null && node.textContent.length > 0;
        },
        command: () => {
          const node = nodeRef.current;
          if (!node) {
            return;
          }

          const text = node.textContent;
          if (!text) {
            return;
          }

          void navigator.clipboard.writeText(text);
          handleOpenChange(false);
        },
      },
    ],
    [
      {
        id: 'move-up',
        label: 'Move up',
        icon: ArrowUpIcon,
        can: () => {
          const data = getNodeAndPos();
          if (!data) {
            return false;
          }

          const $pos = editor.state.doc.resolve(data.pos);
          const index = $pos.index();

          return index > 0;
        },
        command: () => {
          const data = getNodeAndPos();
          if (!data) {
            return;
          }

          const nodeBefore = editor.state.doc.resolve(data.pos).nodeBefore;
          if (!nodeBefore) {
            return;
          }

          const beforePos = data.pos - nodeBefore.nodeSize;
          editor
            .chain()
            .focus()
            .command(({ dispatch, tr }) => {
              if (!dispatch) {
                return true;
              }
              tr.delete(data.pos, data.pos + data.node.nodeSize);
              tr.insert(beforePos, data.node);
              return dispatch(tr);
            })
            .run();

          handleOpenChange(false);
        },
      },
      {
        id: 'move-down',
        label: 'Move down',
        icon: ArrowDownIcon,
        can: () => {
          const data = getNodeAndPos();
          if (!data) {
            return false;
          }

          const $pos = editor.state.doc.resolve(data.pos);
          const parent = $pos.parent;
          const index = $pos.index();
          return index < parent.childCount - 1;
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

          const afterEndPos = endPos + nodeAfter.nodeSize;
          editor
            .chain()
            .focus()
            .command(({ dispatch, tr }) => {
              if (!dispatch) {
                return true;
              }
              tr.delete(data.pos, data.pos + data.node.nodeSize);
              tr.insert(afterEndPos - data.node.nodeSize, data.node);
              return dispatch(tr);
            })
            .run();

          handleOpenChange(false);
        },
      },
    ],
    [
      {
        id: 'delete',
        label: 'Delete',
        icon: TrashIcon,
        can: () => {
          const data = getNodeAndPos();
          return data !== null;
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
      },
    ],
  ];

  const currentNodeType = nodeRef.current?.type.name;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={(props, state) => {
                const { open } = state;

                return (
                  <Button
                    {...props}
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'mly:size-6 mly:cursor-grab',
                      open && 'mly:bg-soft-gray/70 mly:text-gray-900'
                    )}
                  >
                    <GripVerticalIcon className="mly:size-3.5 mly:shrink-0" />
                  </Button>
                );
              }}
            />
          }
        />
        <TooltipPositioner container={container}>
          <TooltipPopup className="mly:whitespace-nowrap">
            Drag to move
          </TooltipPopup>
        </TooltipPositioner>
      </Tooltip>
      <PopoverPositioner container={container} side="bottom" align="start">
        <PopoverPopup
          className={cn(
            'mly:w-auto mly:min-w-48',
            (isFontStyleOpen || isTextDirectionOpen || isVisibilityOpen) &&
              'mly:p-1',
            isFontStyleOpen && 'mly:w-58',
            isVisibilityOpen && 'mly:w-58'
          )}
        >
          {isFontStyleOpen && !!currentNodeType && (
            <FontStyleConfig
              container={container}
              editor={editor}
              nodeType={currentNodeType}
              onBack={() => setIsFontStyleOpen(false)}
            />
          )}

          {isTextDirectionOpen && !!currentNodeType && (
            <TextDirectionConfig
              editor={editor}
              nodeType={currentNodeType}
              onBack={() => setIsTextDirectionOpen(false)}
            />
          )}

          {isVisibilityOpen && !!currentNodeType && (
            <VisibilityConfig
              container={container}
              editor={editor}
              nodeType={currentNodeType}
              onBack={() => setIsVisibilityOpen(false)}
            />
          )}

          {!isFontStyleOpen && !isTextDirectionOpen && !isVisibilityOpen && (
            <div className="mly:p-0.5">
              {menuItems.map((group, groupIndex) => {
                const showDivider = groupIndex > 0;

                return (
                  <Fragment key={groupIndex}>
                    {showDivider && (
                      <Divider
                        type="horizontal"
                        className="mly:-mx-1 mly:my-1"
                      />
                    )}

                    {group.map((item) => {
                      const Icon = item.icon;
                      const disabled = !item.can();
                      const isDelete = item.id === 'delete';

                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          onClick={item.command}
                          disabled={disabled}
                          className={cn(
                            'mly:w-full mly:cursor-default mly:justify-start mly:gap-2 mly:px-2 mly:py-1 mly:font-normal',
                            isDelete &&
                              'mly:text-red-600 mly:hover:bg-red-100/50 mly:hover:text-red-600 mly:focus-visible:bg-red-100/50 mly:focus-visible:text-red-600',
                            disabled && 'mly:cursor-not-allowed mly:opacity-50'
                          )}
                        >
                          <Icon className="mly:size-4" />
                          {item.label}
                          {item.rightIcon && (
                            <item.rightIcon className="mly:ml-auto mly:size-3.5 mly:shrink-0" />
                          )}
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
