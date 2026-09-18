import type { ComputePositionConfig, VirtualElement } from '@floating-ui/react';
import { offset } from '@floating-ui/react';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import type { NestedOptions } from '@tiptap/extension-drag-handle';
import type { DragHandleProps } from '@tiptap/extension-drag-handle-react';
import { DragHandle } from '@tiptap/extension-drag-handle-react';
import type { Node } from '@tiptap/pm/model';
import { PlusIcon } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useMemo, useRef, useState } from 'react';

import { useBlockMenuShortcut } from '~/hooks/use-block-menu-shortcut';
import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useFloatingStore } from '~/hooks/use-floating-store';

import { Button } from '../interface/button';
import {
  Tooltip,
  TooltipArrow,
  TooltipPopup,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
} from '../interface/tooltip';
import type { DragContextOpenSource } from './drag-context-menu';
import { DragContextMenu } from './drag-context-menu';

const DRAG_HANDLE_PLUGIN_KEY = 'drag-context';
const TALL_BLOCK_THRESHOLD = 40;

type OnNodeChange = NonNullable<DragHandleProps['onNodeChange']>;

/**
 * How far below the block's top the handle sits. A tall block gets a handle at
 * its first line; a short one gets it centred.
 */
type HandleShiftOptions = {
  blockHeight: number;
  handleHeight: number;
};

function getHandleShift(options: HandleShiftOptions) {
  const { blockHeight, handleHeight } = options;

  return blockHeight > TALL_BLOCK_THRESHOLD
    ? 0
    : (blockHeight - handleHeight) / 2;
}

export function DragContextHandle() {
  const editor = useEditorInstance();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentNodeRef = useRef<Node | null>(null);
  const currentNodePosRef = useRef<number | null>(null);
  const currentNodeDomRef = useRef<HTMLElement | null>(null);
  const bridgeRef = useRef<HTMLSpanElement | null>(null);
  const isMenuOpenRef = useRef(false);
  const openSourceRef = useRef<DragContextOpenSource>('pointer');
  const [open, setOpen] = useState(false);

  const setDragContextOpen = useFloatingStore((state) => {
    return state.setDragContextOpen;
  });

  const handleNodeChange: OnNodeChange = (data) => {
    if (isMenuOpenRef.current) {
      return;
    }

    currentNodeRef.current = data.node;
    currentNodePosRef.current = data.pos;

    const dom = data.pos >= 0 ? editor.view.nodeDOM(data.pos) : null;
    const element = dom instanceof HTMLElement ? dom : null;
    currentNodeDomRef.current = element;

    const bridge = bridgeRef.current;
    const handle = bridge?.parentElement;
    if (!(bridge && handle && element)) {
      return;
    }

    const blockHeight = element.getBoundingClientRect().height;
    bridge.style.height = `${blockHeight}px`;
    const shift = getHandleShift({
      blockHeight,
      handleHeight: handle.offsetHeight,
    });

    bridge.style.top = `${-shift}px`;
  };

  // `DragHandle` owns the positioned element and exposes only `className`, so
  // the presence attribute the stylesheet needs is set through a child.
  const setBridgeElement = (element: HTMLSpanElement | null) => {
    bridgeRef.current = element;
    element?.parentElement?.setAttribute('data-mly-drag-handle', '');
  };

  const handleDragStart = () => {
    setOpen(false);
    editor.view.dom.dispatchEvent(
      new DragEvent('dragstart', { bubbles: true })
    );
  };

  const handleAddBlock = () => {
    const node = currentNodeRef.current;
    const pos = currentNodePosRef.current;
    if (node === null || pos === null || pos === -1) {
      return;
    }

    const { doc, schema } = editor.state;
    const paragraphType = schema.nodes.paragraph;
    const insertPos = pos + node.nodeSize;

    if (
      node.type.name === MAILY_NODE_TYPES.PARAGRAPH &&
      node.content.size === 0
    ) {
      editor
        .chain()
        .command(({ dispatch, tr }) => {
          return dispatch ? dispatch(tr.insertText('/', pos, pos + 1)) : true;
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
      .command(({ dispatch, tr }) => {
        return dispatch ? dispatch(tr.insert(insertPos, block)) : true;
      })
      .focus(insertPos + focusOffset)
      .run();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    const pos = currentNodePosRef.current;
    if (nextOpen && pos !== null && openSourceRef.current === 'pointer') {
      editor.commands.setNodeSelection(pos);
    }

    if (!nextOpen) {
      openSourceRef.current = 'pointer';
    }

    isMenuOpenRef.current = nextOpen;
    setOpen(nextOpen);
    setDragContextOpen(nextOpen);
    editor.commands.setMeta('lockDragHandle', nextOpen);
  };

  const handleShortcutOpen = () => {
    const pos = currentNodePosRef.current;
    if (isMenuOpenRef.current || pos === null || pos < 0) {
      return;
    }

    openSourceRef.current = 'shortcut';
    handleOpenChange(true);
  };

  useBlockMenuShortcut({ editor, onOpen: handleShortcutOpen });

  /**
   * A list paints its marker in its own padding, which the item box excludes,
   * so anchoring to the item puts the handle on top of the marker. Anchoring
   * to the list clears it and leaves every depth its own column.
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
  const getPinnedElement = () => {
    const pos = currentNodePosRef.current;
    if (!isMenuOpenRef.current || pos === null || pos < 0) {
      return null;
    }

    const dom = editor.view.nodeDOM(pos);

    return dom instanceof HTMLElement ? dom : null;
  };

  const getHandleAnchor = (): VirtualElement | null => {
    const element = getPinnedElement() ?? currentNodeDomRef.current;
    const list = element?.parentElement;
    const isListItem =
      currentNodeRef.current?.type.name === MAILY_NODE_TYPES.LIST_ITEM;

    if (!element || !(isMenuOpenRef.current || (list && isListItem))) {
      return null;
    }

    return {
      getBoundingClientRect: () => {
        if (!(list && isListItem)) {
          return element.getBoundingClientRect();
        }

        const item = element.getBoundingClientRect();
        const left = list.getBoundingClientRect().left;

        return new DOMRect(left, item.y, item.right - left, item.height);
      },
    };
  };

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

  const computePositionConfig = useMemo<ComputePositionConfig>(() => {
    return {
      placement: 'left-start',
      strategy: 'absolute',
      middleware: [
        offset(({ rects }) => {
          return {
            alignmentAxis: getHandleShift({
              blockHeight: rects.reference.height,
              handleHeight: rects.floating.height,
            }),
            mainAxis: 0,
          };
        }),
      ],
    };
  }, []);

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
  const nestedOptions = useMemo<NestedOptions>(() => {
    return {
      edgeDetection: 'none',
      rules: [
        {
          id: 'excludeColumn',
          evaluate: (context) => {
            return context.node.type.name === MAILY_NODE_TYPES.COLUMN
              ? 1000
              : 0;
          },
        },
      ],
    };
  }, []);

  return (
    // The dependency arrays inside DragHandle break unless it is wrapped.
    // @see https://github.com/ueberdosis/tiptap/issues/4619
    <div ref={containerRef}>
      <DragHandle
        computePositionConfig={computePositionConfig}
        editor={editor}
        getReferencedVirtualElement={getHandleAnchor}
        nested={nestedOptions}
        onElementDragStart={handleDragStart}
        onNodeChange={handleNodeChange}
        pluginKey={DRAG_HANDLE_PLUGIN_KEY}
      >
        {/**
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
         */}
        <span
          aria-hidden="true"
          data-mly-drag-bridge=""
          draggable={false}
          onMouseDown={handleBridgeMouseDown}
          ref={setBridgeElement}
        />

        <TooltipProvider>
          <div data-mly-drag-context="">
            <Tooltip disableHoverablePopup>
              <TooltipTrigger
                render={
                  <Button
                    aria-label="Add block"
                    data-mly-drag-context-add=""
                    onClick={handleAddBlock}
                  >
                    <PlusIcon size={14} />
                  </Button>
                }
              />
              <TooltipPositioner container={containerRef}>
                <TooltipPopup>
                  Add block
                  <TooltipArrow />
                </TooltipPopup>
              </TooltipPositioner>
            </Tooltip>

            <DragContextMenu
              container={containerRef}
              editor={editor}
              nodeRef={currentNodeRef}
              onOpenChange={handleOpenChange}
              open={open}
              openSourceRef={openSourceRef}
              posRef={currentNodePosRef}
            />
          </div>
        </TooltipProvider>
      </DragHandle>
    </div>
  );
}
