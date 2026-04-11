import type { MiddlewareState, Placement } from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
} from '@floating-ui/react';
import { isHTMLElement } from '@floating-ui/utils/dom';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { useValueAsRef } from '@maily-to/ui';
import type { Editor, EditorEvents } from '@tiptap/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import {
  useFloatingStore,
  useRegisterFloatingContext,
} from '~/hooks/use-floating-store';
import { useOnSelectionUpdate } from '~/hooks/use-on-selection-update';
import type { FloatingElementId } from '~/types/floating-ui';
import { FLOATING_ELEMENT_ORDER } from '~/types/floating-ui';
import {
  getCurrentSelectionRect,
  isValidSelection,
  moveCursorToCoords,
} from '~/utils/selection';

export const FLOATING_ELEMENT_PADDING = 8;
export const FLOATING_ELEMENT_HEIGHT = 28;

const NOT_ALLOWED_NODES = [
  MAILY_NODE_TYPES.IMAGE,
  MAILY_NODE_TYPES.INLINE_IMAGE,
  MAILY_NODE_TYPES.SPACER,
  MAILY_NODE_TYPES.HORIZONTAL_RULE,
  MAILY_NODE_TYPES.BUTTON,
  MAILY_NODE_TYPES.LINK_CARD,
];

const NOT_ALLOWED_NESTED_NODES = [MAILY_NODE_TYPES.HTML_CODE_BLOCK];

export type FloatingElementProps = {
  editor?: Editor;
  children: React.ReactNode;
  className?: string;
  placement?: Placement;

  floatingId: FloatingElementId;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

// We can’t fully control Tiptap’s default BubbleMenu visibility because it only reacts
// to internal editor state changes. This custom FloatingElement provides controlled
// open/close behavior using a virtual reference element.
// References:
// - https://github.com/sjdemartini/mui-tiptap/blob/main/src/ControlledBubbleMenu.tsx
// - https://github.com/ueberdosis/tiptap/discussions/5467
// - https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1020665146
// - https://mui.com/material-ui/react-popper/#virtual-element
export const FloatingElement = forwardRef<HTMLDivElement, FloatingElementProps>(
  (props, ref) => {
    const {
      floatingId,
      editor: defaultEditor,
      children,
      className,
      placement = 'top',
      open: defaultOpen = undefined,
      onOpenChange,
    } = props;

    const editor = useEditorInstance(defaultEditor);

    const preventShowRef = useRef(false);
    const [isOpen, setIsOpen] = useState(
      defaultOpen !== undefined ? defaultOpen : false
    );
    const openRef = useValueAsRef(isOpen);

    const handleOpenChange = useCallback(
      (open: boolean) => {
        setIsOpen(open);
        onOpenChange?.(open);
        openRef.current = open;
      },
      [onOpenChange, openRef]
    );

    const handleOutsidePress = useCallback(
      (event: MouseEvent) => {
        const target = event.target;
        const editorWrapper = editor.view.dom.parentElement;

        if (!isHTMLElement(target) || !editorWrapper) {
          return false;
        }

        return !editorWrapper.contains(target);
      },
      [editor]
    );

    const bubbleMenuOffset = (state: MiddlewareState) => {
      const contexts = useFloatingStore.getState().contexts;
      const currentPlacement = state.placement;

      const otherBubbles = contexts
        .filter(
          (context) =>
            context.id !== floatingId &&
            context.value.open &&
            context.value.placement === currentPlacement
        )
        .map((context) => context.id);

      const allBubbles = [...otherBubbles, floatingId].sort(
        (a, b) =>
          FLOATING_ELEMENT_ORDER.indexOf(a) - FLOATING_ELEMENT_ORDER.indexOf(b)
      );

      const idx = allBubbles.indexOf(floatingId);
      if (idx === 0) {
        return FLOATING_ELEMENT_PADDING;
      }

      return (
        idx * (FLOATING_ELEMENT_PADDING + FLOATING_ELEMENT_HEIGHT) +
        FLOATING_ELEMENT_PADDING
      );
    };

    const {
      floatingStyles,
      refs,
      context,
      placement: floatingPlacement,
    } = useFloating({
      nodeId: floatingId,
      open: isOpen,
      onOpenChange: handleOpenChange,
      whileElementsMounted: autoUpdate,
      placement,
      middleware: [
        shift({
          padding: FLOATING_ELEMENT_PADDING,
        }),
        offset(bubbleMenuOffset),
        flip(),
      ],
    });

    useRegisterFloatingContext(floatingId, context);

    const dismiss = useDismiss(context, {
      enabled: true,
      escapeKey: true,
      // otherwise the bubble menu will close when clicking outside
      // the bubble menu itself with flicker effect
      // https://floating-ui.com/docs/usedismiss#outsidepress
      // https://github.com/mui/base-ui/blob/master/packages/react/src/floating-ui-react/hooks/useDismiss.ts
      // look into the reference notes above for more details
      outsidePress: handleOutsidePress,
    });

    const { getReferenceProps } = useInteractions([dismiss]);

    const handleSelectionChange = useCallback(() => {
      const preventShow = preventShowRef.current;
      const rect = getCurrentSelectionRect(editor);
      if (rect && defaultOpen !== undefined && !preventShow) {
        setIsOpen(defaultOpen);
        refs.setReference({
          getBoundingClientRect() {
            return rect;
          },
        });
        return;
      }

      const isSelectionValid = isValidSelection(editor, NOT_ALLOWED_NODES);
      const isInsideNotAllowedNestedNode = NOT_ALLOWED_NESTED_NODES.some(
        (nodeType) => {
          return editor.isActive(nodeType);
        }
      );

      if (
        !isSelectionValid ||
        isInsideNotAllowedNestedNode ||
        preventShow ||
        !editor.isEditable
      ) {
        setIsOpen(false);
        return;
      }

      setIsOpen(true);
      refs.setReference({
        getBoundingClientRect() {
          return rect;
        },
      });
    }, [refs, editor, setIsOpen, defaultOpen]);

    useOnSelectionUpdate(editor, handleSelectionChange);

    useEffect(() => {
      const editorView = editor.view;
      if (!editorView) {
        return;
      }

      const handleMouseDown = (e: MouseEvent) => {
        const isLeftButton = e.button === 0;
        if (!isLeftButton) {
          return;
        }

        preventShowRef.current = true;

        // Only move cursor on single clicks — let ProseMirror handle
        // double-click (word select) and triple-click (node select)
        if (e.detail <= 1) {
          moveCursorToCoords(editor, {
            left: e.clientX,
            top: e.clientY,
          });
        }
      };

      const handleMouseUp = () => {
        const preventShow = preventShowRef.current;
        if (!preventShow) {
          return;
        }

        preventShowRef.current = false;
        handleSelectionChange();
      };

      editorView.dom.addEventListener('mousedown', handleMouseDown);
      // even if we mouse up outside, still the floating element will show
      //
      // ┌────────────────────────────────────┐
      // |              ┌─────────────────────|─ mousedown inside editor
      // │ Hello world this is some text that │
      // │ continues and the user             │
      // └────────────────────────────────────┘
      // and drags outside to here ─────────── mouseup outside editor
      //
      editorView.root.addEventListener('mouseup', handleMouseUp);
      return () => {
        editorView.dom.removeEventListener('mousedown', handleMouseDown);
        editorView.root.removeEventListener('mouseup', handleMouseUp);
      };
    }, [editor, handleSelectionChange]);

    useEffect(() => {
      const handleResize = () => {
        if (!openRef.current) {
          return;
        }

        handleSelectionChange();
      };

      // https://github.com/ueberdosis/tiptap/blob/82e03b50b716c18b45f3e0ad02e108b147dc6ceb/packages/extension-bubble-menu/src/bubble-menu-plugin.ts#L362-L363
      window.addEventListener('resize', handleResize);
      // TODO: maybe we can also attach the listener to the editor view root
      // instead of the window, to narrow down the scope of the listener
      window.addEventListener('scroll', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }, [openRef, handleSelectionChange]);

    useEffect(() => {
      const editorViewDom = editor.view.dom;
      if (!editorViewDom) {
        return;
      }

      const handleDrag = () => {
        handleOpenChange(false);
      };

      editorViewDom.addEventListener('dragstart', handleDrag);
      editorViewDom.addEventListener('dragover', handleDrag);
      return () => {
        editorViewDom.removeEventListener('dragstart', handleDrag);
        editorViewDom.removeEventListener('dragover', handleDrag);
      };
    }, [editor, handleOpenChange]);

    useEffect(() => {
      const handleTransaction = (props: EditorEvents['transaction']) => {
        const { transaction } = props;

        const lockDragHandle = transaction.getMeta('lockDragHandle');
        if (lockDragHandle !== true) {
          return;
        }

        handleOpenChange(false);
      };

      editor.on('transaction', handleTransaction);
      return () => {
        editor.off('transaction', handleTransaction);
      };
    }, [editor, handleOpenChange]);

    const finalRef = useMergeRefs([refs.setFloating, ref]);

    const zIndex = useMemo(() => {
      return (
        99 -
        FLOATING_ELEMENT_ORDER.toReversed().indexOf(floatingId) *
          (floatingPlacement === 'top' ? 1 : -1)
      );
    }, [floatingId, floatingPlacement]);

    if (!isOpen) {
      return null;
    }

    return (
      <div
        ref={finalRef}
        {...getReferenceProps()}
        style={{ ...floatingStyles, zIndex }}
        className={className}
      >
        {children}
      </div>
    );
  }
);
