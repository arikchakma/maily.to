import type { ComputePositionConfig, Middleware } from '@floating-ui/react';
import { offset } from '@floating-ui/react';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { NestedOptions } from '@tiptap/extension-drag-handle';
import type { DragHandleProps } from '@tiptap/extension-drag-handle-react';
import { DragHandle } from '@tiptap/extension-drag-handle-react';
import type { Node } from '@tiptap/pm/model';
import { PlusIcon } from 'lucide-react';
import type { MouseEvent } from 'react';
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

type OnNodeChange = NonNullable<DragHandleProps['onNodeChange']>;

export function DragContextHandle() {
  const editor = useEditorInstance();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentNodeRef = useRef<Node | null>(null);
  const currentNodePosRef = useRef<number | null>(null);
  const currentNodeDomRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNodeChange: OnNodeChange = (data) => {
    currentNodeRef.current = data.node;
    currentNodePosRef.current = data.pos;

    const dom = data.pos >= 0 ? editor.view.nodeDOM(data.pos) : null;
    currentNodeDomRef.current = dom instanceof HTMLElement ? dom : null;
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

    const { doc, schema } = editor.state;
    const paragraphType = schema.nodes.paragraph;
    const insertPos = pos + node.nodeSize;
    const currentNodeIsEmptyParagraph =
      node.type.name === MAILY_NODE_TYPES.PARAGRAPH && node.content.size === 0;

    if (currentNodeIsEmptyParagraph) {
      editor
        .chain()
        .command((props) => {
          if (!props.dispatch) {
            return true;
          }

          return props.dispatch(props.tr.insertText('/', pos, pos + 1));
        })
        .focus(pos + 2)
        .run();
      return;
    }

    const paragraph = paragraphType.create(null, [schema.text('/')]);
    const $insert = doc.resolve(insertPos);
    const index = $insert.index();

    // A list only takes list items, so match the container when a bare
    // paragraph does not fit.
    let block = paragraph;
    let focusOffset = 2;
    if (!$insert.parent.canReplaceWith(index, index, paragraphType)) {
      const sibling = node.type.createAndFill(node.attrs, paragraph);
      if (!sibling || !$insert.parent.canReplaceWith(index, index, node.type)) {
        return;
      }

      block = sibling;
      focusOffset = 3;
    }

    editor
      .chain()
      .command((props) => {
        if (!props.dispatch) {
          return true;
        }

        return props.dispatch(props.tr.insert(insertPos, block));
      })
      .focus(insertPos + focusOffset)
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

  /**
   * A list paints its marker in its own padding, which the item box excludes,
   * so floating-ui anchoring to the item puts the handle on top of the marker.
   * Anchoring to the list clears it and leaves every depth its own column.
   *
   *      anchored to the item        anchored to the list
   *
   *      [+][::]Alpha                [+][::] o Alpha
   *         [+][::]Howdy                 [+][::] o Howdy
   *
   *        the marker is under         it keeps its space, and
   *        the handle                  a deeper list indents
   *                                    its handle with it
   */
  const clearListMarker = useMemo<Middleware>(
    () => ({
      name: 'clearListMarker',
      fn: (state) => {
        const list = currentNodeDomRef.current?.parentElement;
        const isListItem =
          currentNodeRef.current?.type.name === MAILY_NODE_TYPES.LIST_ITEM;

        const reference = state.elements.reference.getBoundingClientRect();
        const marker =
          isListItem && list
            ? reference.left - list.getBoundingClientRect().left
            : 0;

        const style = state.elements.floating.style;
        style.setProperty(
          '--mly-drag-bridge-top',
          `${state.rects.reference.y - state.y}px`
        );
        style.setProperty(
          '--mly-drag-bridge-height',
          `${state.rects.reference.height}px`
        );

        return { x: state.x - marker };
      },
    }),
    []
  );

  // The bridge covers editor content once a list indents it, so hand clicks
  // that land there back to the editor.
  const handleBridgeMouseDown = (event: MouseEvent<HTMLSpanElement>) => {
    const coords = editor.view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    if (!coords) {
      return;
    }

    editor.commands.focus(coords.pos);
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
        clearListMarker,
      ],
    }),
    [clearListMarker]
  );

  /**
   * Edge detection hands the handle to the parent whenever the pointer comes
   * near a block's left edge, and that edge is the only way in to a handle
   * that sits on the left. So it is off.
   *
   *      handle is on Beta            reaching for it
   *
   *              o Alpha              [+][::] o Alpha
   *      [+][::] o Beta                 x     o Beta
   *              o Gamma                      o Gamma
   *
   *        aimed at Beta                the edge zone gave the
   *                                     handle to the list, so
   *                                     it is gone on arrival
   */
  const nestedOptions = useMemo<NestedOptions>(
    () => ({
      edgeDetection: 'none',
      rules: [
        {
          id: 'excludeColumn',
          evaluate: (context) =>
            context.node.type.name === MAILY_NODE_TYPES.COLUMN ? 1000 : 0,
        },
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
        nested={nestedOptions}
      >
        <span
          aria-hidden="true"
          draggable={false}
          className="mly:absolute mly:left-0 mly:w-full"
          /**
           * The handle is one row tall next to a block that may be many rows
           * tall, and the plugin hides it the moment the pointer leaves the
           * editor for anything that is not the handle. Reaching for it
           * sideways would drop it, so this stretches its hit area down the
           * whole block.
           *
           *      | editor edge      : bridge edge      x pointer
           *
           *      without it                    with it
           *
           *      [+][::]|first line of a       [+][::]:first line of a
           *             |block that wraps        x    :block that wraps
           *        x    |onto a third line            :onto a third line
           *
           *        the pointer exits            the exit lands on the
           *        beside nothing and           handle at any height,
           *        the handle is gone           so it survives the trip
           */
          style={{
            top: 'var(--mly-drag-bridge-top, 0px)',
            height: 'var(--mly-drag-bridge-height, 100%)',
          }}
          onMouseDown={handleBridgeMouseDown}
        />
        <TooltipProvider>
          <div
            ref={containerRef}
            className="mly:relative mly:flex mly:items-center mly:gap-0.5 mly:px-1.5"
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
