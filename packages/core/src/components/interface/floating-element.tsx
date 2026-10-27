import type {
  MiddlewareState,
  OpenChangeReason,
  Placement,
} from '@floating-ui/react';
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
import type { Editor } from '@tiptap/react';
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
import { useValueAsRef } from '~/hooks/use-value-as-ref';
import type { FloatingElementId } from '~/types/floating-ui';
import {
  FLOATING_ELEMENT_ATTRIBUTE,
  FLOATING_ELEMENT_ORDER,
} from '~/types/floating-ui';
import {
  getCurrentSelectionRect,
  isValidSelection,
  moveCursorToCoords,
} from '~/utils/selection';

export const FLOATING_ELEMENT_PADDING = 8;
export const FLOATING_ELEMENT_HEIGHT = 28;

const NOT_ALLOWED_NODES: string[] = [
  MAILY_NODE_TYPES.IMAGE,
  MAILY_NODE_TYPES.INLINE_IMAGE,
  MAILY_NODE_TYPES.SPACER,
  MAILY_NODE_TYPES.HORIZONTAL_RULE,
];

export type FloatingElementProps = {
  children: React.ReactNode;
  editor?: Editor;
  floatingId: FloatingElementId;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  placement?: Placement;
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
      children,
      editor: defaultEditor,
      floatingId,
      onOpenChange,
      open: defaultOpen,
      placement = 'top',
    } = props;

    const editor = useEditorInstance(defaultEditor);

    const isDragContextOpen = useFloatingStore((state) => {
      return state.isDragContextOpen;
    });

    const preventShowRef = useRef(false);
    const [isOpen, setIsOpen] = useState(defaultOpen ?? false);
    const openRef = useValueAsRef(isOpen);

    const elementRef = useRef<HTMLDivElement | null>(null);

    const handleOpenChange = useCallback(
      (open: boolean, _event?: Event, reason?: OpenChangeReason) => {
        if (
          !open &&
          reason === 'escape-key' &&
          elementRef.current?.contains(document.activeElement)
        ) {
          editor.commands.focus();
        }

        setIsOpen(open);
        onOpenChange?.(open);
        openRef.current = open;
      },
      [editor, onOpenChange, openRef]
    );

    const handleOutsidePress = useCallback(
      (event: MouseEvent) => {
        const target = event.target;
        const editorWrapper = editor.view.dom.parentElement;

        if (!isHTMLElement(target) || !editorWrapper) {
          return false;
        }

        if (target.closest(`[${FLOATING_ELEMENT_ATTRIBUTE}]`)) {
          return false;
        }

        return !editorWrapper.contains(target);
      },
      [editor]
    );

    const bubbleMenuOffset = (state: MiddlewareState) => {
      const { contexts } = useFloatingStore.getState();

      const otherBubbles = contexts
        .filter(
          (context) =>
            context.id !== floatingId &&
            context.value.open &&
            context.value.placement === state.placement
        )
        .map((context) => context.id);

      const allBubbles = [...otherBubbles, floatingId].sort(
        (a, b) =>
          FLOATING_ELEMENT_ORDER.indexOf(a) - FLOATING_ELEMENT_ORDER.indexOf(b)
      );

      const index = allBubbles.indexOf(floatingId);
      if (index === 0) {
        return FLOATING_ELEMENT_PADDING;
      }

      return (
        index * (FLOATING_ELEMENT_PADDING + FLOATING_ELEMENT_HEIGHT) +
        FLOATING_ELEMENT_PADDING
      );
    };

    const {
      context,
      floatingStyles,
      placement: floatingPlacement,
      refs,
    } = useFloating({
      nodeId: floatingId,
      open: isOpen,
      onOpenChange: handleOpenChange,
      whileElementsMounted: autoUpdate,
      placement,
      middleware: [
        shift({ padding: FLOATING_ELEMENT_PADDING }),
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

      const reference = {
        contextElement: editor.view.dom,
        getBoundingClientRect: () => getCurrentSelectionRect(editor) ?? rect,
      };

      if (rect && defaultOpen !== undefined && !preventShow) {
        setIsOpen(defaultOpen);
        refs.setReference(reference);
        return;
      }

      if (
        !isValidSelection(editor, NOT_ALLOWED_NODES) ||
        preventShow ||
        !editor.isEditable
      ) {
        setIsOpen(false);
        return;
      }

      setIsOpen(true);
      refs.setReference(reference);
    }, [defaultOpen, editor, refs]);

    useOnSelectionUpdate(editor, handleSelectionChange);

    useEffect(() => {
      const editorView = editor.view;

      const handleMouseDown = (event: MouseEvent) => {
        if (event.button !== 0) {
          return;
        }

        preventShowRef.current = true;

        // Only move cursor on single clicks — let ProseMirror handle
        // double-click (word select) and triple-click (node select)
        if (event.detail <= 1) {
          moveCursorToCoords(editor, {
            left: event.clientX,
            top: event.clientY,
          });
        }
      };

      const handleMouseUp = () => {
        if (!preventShowRef.current) {
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
      window.addEventListener('scroll', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }, [handleSelectionChange, openRef]);

    useEffect(() => {
      const editorViewDom = editor.view.dom;

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

    const finalRef = useMergeRefs([refs.setFloating, elementRef, ref]);

    const zIndex = useMemo(
      () =>
        99 -
        FLOATING_ELEMENT_ORDER.toReversed().indexOf(floatingId) *
          (floatingPlacement === 'top' ? 1 : -1),
      [floatingId, floatingPlacement]
    );

    if (!isOpen || isDragContextOpen) {
      return null;
    }

    return (
      <div
        {...getReferenceProps()}
        {...{ [FLOATING_ELEMENT_ATTRIBUTE]: floatingId }}
        ref={finalRef}
        style={{ ...floatingStyles, zIndex }}
      >
        {children}
      </div>
    );
  }
);

FloatingElement.displayName = 'FloatingElement';
