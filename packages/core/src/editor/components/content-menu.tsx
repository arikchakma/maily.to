import type { Editor } from '@tiptap/core';
import { useEffect, useRef, useState } from 'react';

import type { NodeSelection } from '@tiptap/pm/state';
import {
  DragHandlePlugin,
  dragHandlePluginDefaultKey,
} from 'echo-drag-handle-plugin';

import type { Node } from '@tiptap/pm/model';
import { Copy, GripVertical, Plus, Trash2 } from 'lucide-react';
import { cn } from '../utils/classname';
import { BaseButton } from './base-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export type ContentMenuProps = {
  editor: Editor;
  className?: string;
  pluginKey?: string;
};

export function ContentMenu(props: ContentMenuProps) {
  const { editor, pluginKey = dragHandlePluginDefaultKey, className } = props;

  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [currentNodePos, setCurrentNodePos] = useState(-1);
  const dragElement = useRef(null);
  const pluginRef = useRef<any | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (dragElement.current && !editor.isDestroyed) {
      pluginRef.current = DragHandlePlugin({
        editor,
        element: dragElement.current,
        pluginKey,
        tippyOptions: {
          offset: [-2, 0],
          zIndex: 99,
          // moveTransition: 'transform 0.15s ease-out',
        },
        onNodeChange: (props) => {
          const { node, pos } = props;
          if (node) {
            setCurrentNode(node);
          }

          setCurrentNodePos(pos);
        },
      });

      editor.registerPlugin(pluginRef.current);
    }

    return () => {
      if (pluginRef.current) {
        editor.unregisterPlugin(pluginKey);
        pluginRef.current = null;
      }
    };
  }, [editor, dragElement]);

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
  }

  function deleteCurrentNode() {
    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .setNodeSelection(currentNodePos)
      .deleteSelection()
      .run();
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
  }, [menuOpen]);

  useEffect(() => {
    if (editor?.isDestroyed && pluginRef.current) {
      editor.unregisterPlugin(pluginKey);
      pluginRef.current = null;
    }
  }, [editor?.isDestroyed]);

  return (
    <div className={cn('drag-handle', className)} ref={dragElement}>
      <div className="mly-flex mly-items-center mly-gap-0.5">
        <BaseButton
          variant="ghost"
          size="icon"
          className="!mly-size-7 mly-cursor-grab mly-text-gray-500 hover:mly-text-black"
          onClick={handleAddNewNode}
          type="button"
        >
          <Plus className="mly-size-4 mly-shrink-0" />
        </BaseButton>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <div className="mly-relative mly-flex mly-flex-col">
            <BaseButton
              variant="ghost"
              size="icon"
              className="mly-relative mly-z-[1] !mly-size-7 mly-cursor-grab mly-text-gray-500 hover:mly-text-black"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(true);
              }}
              type="button"
            >
              <GripVertical className="mly-size-4 mly-shrink-0" />
            </BaseButton>
            <DropdownMenuTrigger className="mly-absolute mly-left-0 mly-top-0 mly-z-0 mly-h-[28px] mly-w-[28px]" />
          </div>

          <DropdownMenuContent align="start" side="bottom" sideOffset={0}>
            <DropdownMenuItem onClick={duplicateNode} className="!mly-rounded">
              <Copy className="mly-size-[15px] mly-shrink-0" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={deleteCurrentNode}
              className="!mly-rounded mly-bg-red-100 mly-text-red-600 focus:mly-bg-red-200"
            >
              <Trash2 className="mly-size-[15px] mly-shrink-0" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
