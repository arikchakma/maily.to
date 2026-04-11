import type { ComputePositionConfig } from '@floating-ui/react';
import { offset } from '@floating-ui/react';
import type { OnNodeChange } from '@maily-to/extension-drag-handle';
import { DragHandle } from '@maily-to/extension-drag-handle';
import type { Node } from '@tiptap/pm/model';
import { PlusIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';

import { Button } from '../interface/button';
import {
  Tooltip,
  TooltipPopup,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
} from '../interface/tooltip';
import { DragContextMenu } from './drag-context-menu';

const DRAG_HANDLE_PLUGIN_KEY = 'drag-context';
const TALL_BLOCK_THRESHOLD = 40;

export function DragContextHandle() {
  const editor = useEditorInstance();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentNodeRef = useRef<Node | null>(null);
  const currentNodePosRef = useRef<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNodeChange: OnNodeChange = (data) => {
    currentNodeRef.current = data.node;
    currentNodePosRef.current = data.pos;
  };

  const handleDragStart = () => {
    setMenuOpen(false);

    // Dispatch dragstart so FloatingElement can hide bubble menus
    // TODO: find a better way to do this (e.g., editor meta)
    editor.view.dom.dispatchEvent(
      new DragEvent('dragstart', { bubbles: true })
    );
  };

  const handleAddBlock = () => {
    const node = currentNodeRef.current;
    const pos = currentNodePosRef.current;
    if (pos == null || node == null || pos === -1) {
      return;
    }

    const currentNodeSize = node.nodeSize;
    const insertPos = pos + currentNodeSize;
    const currentNodeIsEmptyParagraph =
      node.type.name === 'paragraph' && node.content.size === 0;

    const focusPos = currentNodeIsEmptyParagraph ? pos + 2 : insertPos + 2;
    editor
      .chain()
      .command(({ dispatch, tr, state }) => {
        if (!dispatch) {
          return true;
        }

        if (currentNodeIsEmptyParagraph) {
          tr.insertText('/', pos, pos + 1);
        } else {
          tr.insert(
            insertPos,
            state.schema.nodes.paragraph.create(null, [state.schema.text('/')])
          );
        }

        return dispatch(tr);
      })
      .focus(focusPos)
      .run();
  };

  const handleMenuOpenChange = (open: boolean) => {
    const pos = currentNodePosRef.current;
    if (open && pos != null) {
      editor.commands.setNodeSelection(pos);
    }

    setMenuOpen(open);
    editor.commands.setMeta('lockDragHandle', open);
  };

  const computePositionConfig = useMemo<ComputePositionConfig>(
    () => ({
      placement: 'left-start',
      strategy: 'absolute',
      middleware: [
        offset(({ rects }) => {
          const blockHeight = rects.reference.height;
          const handleHeight = rects.floating.height;

          if (blockHeight > TALL_BLOCK_THRESHOLD) {
            return { alignmentAxis: 0, mainAxis: 0 };
          }

          return {
            alignmentAxis: (blockHeight - handleHeight) / 2,
            mainAxis: 0,
          };
        }),
      ],
    }),
    []
  );

  return (
    // for some reason the dependencies array breaks when
    // the DragContextHandle is not wrapped in a div
    // @see https://github.com/ueberdosis/tiptap/issues/4619
    <div>
      <DragHandle
        pluginKey={DRAG_HANDLE_PLUGIN_KEY}
        editor={editor}
        onNodeChange={handleNodeChange}
        onElementDragStart={handleDragStart}
        className="mly:z-50"
        computePositionConfig={computePositionConfig}
      >
        <TooltipProvider>
          <div
            ref={containerRef}
            className="mly:flex mly:items-center mly:gap-0.5 mly:px-1.5"
          >
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mly:size-6"
                    onClick={handleAddBlock}
                  >
                    <PlusIcon className="mly:size-3.5 mly:shrink-0" />
                  </Button>
                }
              />
              <TooltipPositioner container={containerRef}>
                <TooltipPopup className="mly:whitespace-nowrap">
                  Add block
                </TooltipPopup>
              </TooltipPositioner>
            </Tooltip>
            <DragContextMenu
              editor={editor}
              open={menuOpen}
              onOpenChange={handleMenuOpenChange}
              container={containerRef}
              nodeRef={currentNodeRef}
              posRef={currentNodePosRef}
            />
          </div>
        </TooltipProvider>
      </DragHandle>
    </div>
  );
}
