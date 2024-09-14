import { BubbleMenu } from '@tiptap/react';
import { EditorBubbleMenuProps } from './../editor-bubble-menu';
import { useCallback } from 'react';
import { getRenderContainer } from '../../utils/get-render-container';
import { sticky } from 'tippy.js';
import { BorderRadius } from './border-radius';
import { useSectionState } from './use-section-state';
import { Padding } from './padding';

export function SectionBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'section');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      return editor.isActive('section');
    },
    tippyOptions: {
      offset: [0, 8],
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      getReferenceClientRect,
      appendTo: () => appendTo?.current,
      plugins: [sticky],
      sticky: 'popper',
    },
    pluginKey: 'sectionBubbleMenu',
  };

  const state = useSectionState(editor);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-items-stretch mly-rounded-md mly-border mly-border-slate-200 mly-bg-white mly-p-1 mly-shadow-md"
    >
      <BorderRadius
        value={state.currentBorderRadius}
        onChange={(value) => {
          editor?.commands?.updateAttributes('section', {
            borderRadius: value,
          });
        }}
      />
      <div className="mly-mx-0.5 mly-w-px mly-bg-gray-200" />
      <Padding
        value={state.currentPadding}
        onChange={(value) => {
          editor?.commands?.updateAttributes('section', {
            padding: value,
          });
        }}
      />
    </BubbleMenu>
  );
}
