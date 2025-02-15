import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useState } from 'react';

import type { NodeSelection } from '@tiptap/pm/state';

import type { Node } from '@tiptap/pm/model';
import { Copy, GripVertical, Plus, Trash2 } from 'lucide-react';
import { BaseButton } from './base-button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Divider } from './ui/divider';
import { DragHandle } from '../plugins/drag-handle/drag-handle';
import { cn } from '../utils/classname';

export type ContentMenuProps = {
  editor: Editor;
};

export function ContentMenu(props: ContentMenuProps) {
  const { editor } = props;

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [currentNodePos, setCurrentNodePos] = useState<number>(-1);

  const handleNodeChange = useCallback(
    (data: { node: Node | null; editor: Editor; pos: number }) => {
      if (data.node) {
        setCurrentNode(data.node);
      }

      setCurrentNodePos(data.pos);
    },
    [setCurrentNodePos, setCurrentNode]
  );

  function duplicateNode() {
    editor.commands.setNodeSelection(currentNodePos);
    const { $anchor } = editor.state.selection;
    const selectedNode =
      $anchor.node(1) || (editor.state.selection as NodeSelection).node;
    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .insertContentAt(
        currentNodePos + (currentNode?.nodeSize || 0),
        selectedNode.toJSON()
      )
      .run();

    setMenuOpen(false);
  }

  function deleteCurrentNode() {
    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .setNodeSelection(currentNodePos)
      .deleteSelection()
      .run();

    setMenuOpen(false);
  }

  function handleAddNewNode() {
    if (currentNodePos !== -1) {
      const currentNodeSize = currentNode?.nodeSize || 0;
      const insertPos = currentNodePos + currentNodeSize;
      const currentNodeIsEmptyParagraph =
        currentNode?.type.name === 'paragraph' &&
        currentNode?.content?.size === 0;
      const focusPos = currentNodeIsEmptyParagraph
        ? currentNodePos + 2
        : insertPos + 2;
      editor
        .chain()
        .command(({ dispatch, tr, state }: any) => {
          if (dispatch) {
            if (currentNodeIsEmptyParagraph) {
              tr.insertText('/', currentNodePos, currentNodePos + 1);
            } else {
              tr.insert(
                insertPos,
                state.schema.nodes.paragraph.create(null, [
                  state.schema.text('/'),
                ])
              );
            }

            return dispatch(tr);
          }

          return true;
        })
        .focus(focusPos)
        .run();
    }
  }

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta('lockDragHandle', true);
    } else {
      editor.commands.setMeta('lockDragHandle', false);
    }

    return () => {
      editor.commands.setMeta('lockDragHandle', false);
    };
  }, [editor, menuOpen]);

  return (
    <DragHandle
      pluginKey="ContentMenu"
      editor={editor}
      tippyOptions={{
        offset: [2, 0],
        zIndex: 99,
      }}
      onNodeChange={handleNodeChange}
      className={cn(editor.isEditable ? 'mly-visible' : 'mly-hidden')}
    >
      <TooltipProvider>
        <div className="mly-flex mly-items-center mly-pr-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <BaseButton
                variant="ghost"
                size="icon"
                className="!mly-size-5 mly-cursor-grab mly-text-gray-500 hover:mly-text-black"
                onClick={handleAddNewNode}
                type="button"
              >
                <Plus className="mly-size-3.5 mly-shrink-0" />
              </BaseButton>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>Add new node</TooltipContent>
          </Tooltip>
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <div className="mly-relative mly-flex mly-flex-col">
              <Tooltip>
                <TooltipTrigger asChild>
                  <BaseButton
                    variant="ghost"
                    size="icon"
                    className="mly-relative mly-z-[1] !mly-size-5 mly-cursor-grab mly-text-gray-500 hover:mly-text-black"
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(true);
                      editor.commands.setNodeSelection(currentNodePos);
                    }}
                    type="button"
                  >
                    <GripVertical className="mly-size-3.5 mly-shrink-0" />
                  </BaseButton>
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>Node actions</TooltipContent>
              </Tooltip>
              <PopoverTrigger className="mly-absolute mly-left-0 mly-top-0 mly-z-0 mly-h-5 mly-w-5" />
            </div>

            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={8}
              className="mly-flex mly-w-max mly-flex-col mly-rounded-md mly-p-1"
            >
              <BaseButton
                variant="ghost"
                onClick={duplicateNode}
                className="mly-h-auto mly-justify-start mly-gap-2 !mly-rounded mly-px-2 mly-py-1 mly-text-sm mly-font-normal"
              >
                <Copy className="mly-size-[15px] mly-shrink-0" />
                Duplicate
              </BaseButton>
              <Divider type="horizontal" />
              <BaseButton
                onClick={deleteCurrentNode}
                className="mly-h-auto mly-justify-start mly-gap-2 !mly-rounded mly-bg-red-100 mly-px-2 mly-py-1 mly-text-sm mly-font-normal mly-text-red-600 hover:mly-bg-red-200 focus:mly-bg-red-200"
              >
                <Trash2 className="mly-size-[15px] mly-shrink-0" />
                Delete
              </BaseButton>
            </PopoverContent>
          </Popover>
        </div>
      </TooltipProvider>
    </DragHandle>
  );
}
