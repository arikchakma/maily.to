import { BubbleMenu as BaseBubbleMenu, useEditorState } from '@tiptap/react';
import { useCallback } from 'react';
import { sticky } from 'tippy.js';
import { v4 as uuid } from 'uuid';
import deepEql from 'fast-deep-equal';
import { Editor as EditorType } from '@tiptap/core';
import { getRenderContainer } from '@/editor/utils/get-render-container';
import { EditorBubbleMenu } from '@/editor/components/editor-bubble-menu';
import { BubbleMenuButton } from '@/editor/components/bubble-menu-button';

type ColumnsMenuProps = {
  editor: EditorType;
  appendTo?: React.RefObject<any>;
};

export function ColumnsMenu(props: ColumnsMenuProps) {
  const { editor, appendTo } = props;

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, 'columns');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isColumns = editor.isActive('columns');
    return isColumns;
  }, [editor]);

  const onColumnLeft = useCallback(() => {
    editor.chain().focus().setLayout('sidebar-left').run();
  }, [editor]);

  const onColumnRight = useCallback(() => {
    editor.chain().focus().setLayout('sidebar-right').run();
  }, [editor]);

  const onColumnTwo = useCallback(() => {
    editor.chain().focus().setLayout('two-column').run();
  }, [editor]);
  const { isColumnLeft, isColumnRight, isColumnTwo } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isColumnLeft: ctx.editor.isActive('columns', {
          layout: 'sidebar-left',
        }),
        isColumnRight: ctx.editor.isActive('columns', {
          layout: 'sidebar-right',
        }),
        isColumnTwo: ctx.editor.isActive('columns', {
          layout: 'two-column',
        }),
      };
    },
    equalityFn: deepEql,
  });
  
  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`columnsMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        getReferenceClientRect,
        appendTo: () => appendTo?.current,
        plugins: [sticky],
        sticky: 'popper',
      }}
    >
      <BubbleMenuButton
        name="PanelLeft"
        isActive={() => isColumnLeft}
        command={onColumnLeft}
      />
      <BubbleMenuButton
        name="Columns2"
        isActive={() => isColumnTwo}
        command={onColumnTwo}
      />
      <BubbleMenuButton
        name="PanelRight"
        isActive={() => isColumnRight}
        command={onColumnRight}
      />
    </BaseBubbleMenu>
  );
}
