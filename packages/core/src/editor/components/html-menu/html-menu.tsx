import { cn } from '@/editor/utils/classname';
import { BubbleMenu } from '@tiptap/react';
import { CodeXmlIcon, ViewIcon } from 'lucide-react';
import { useCallback } from 'react';
import { sticky } from 'tippy.js';
import { getRenderContainer } from '../../utils/get-render-container';
import { ShowPopover } from '../show-popover';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { Divider } from '../ui/divider';
import { TooltipProvider } from '../ui/tooltip';
import { useHtmlState } from './use-html-state';

export function HTMLBubbleMenu(props: EditorBubbleMenuProps) {
  const { appendTo, editor } = props;
  if (!editor) {
    return null;
  }

  const state = useHtmlState(editor);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor!, 'htmlCodeBlock');
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      console.log('');
      return editor.isActive('htmlCodeBlock');
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
      maxWidth: 'auto',
    },
    pluginKey: 'htmlCodeBlockBubbleMenu',
  };

  const { activeTab = 'code' } = state;

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-items-stretch mly-rounded-lg mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        <div className="flex items-center mly-h-7 mly-rounded-md mly-bg-soft-gray mly-px-0.5">
          <button
            className={cn(
              'mly-flex mly-size-6 mly-shrink-0 mly-items-center mly-justify-center mly-rounded',
              activeTab === 'code' && 'mly-bg-white'
            )}
            disabled={activeTab === 'code'}
            onClick={() => {
              editor?.commands?.updateHtmlCodeBlock({
                activeTab: 'code',
              });
            }}
          >
            <CodeXmlIcon className="mly-size-3 mly-shrink-0 mly-stroke-[2.5]" />
          </button>
          <button
            className={cn(
              'mly-flex mly-size-6 mly-shrink-0 mly-items-center mly-justify-center mly-rounded',
              activeTab === 'preview' && 'mly-bg-white'
            )}
            disabled={activeTab === 'preview'}
            onClick={() => {
              editor?.commands?.updateHtmlCodeBlock({
                activeTab: 'preview',
              });
            }}
          >
            <ViewIcon className="mly-size-3 mly-shrink-0 mly-stroke-[2.5]" />
          </button>
        </div>
        <Divider />
        <ShowPopover
          showIfKey={state.currentShowIfKey}
          onShowIfKeyValueChange={(value) => {
            editor.commands.updateRepeat({
              showIfKey: value,
            });
          }}
          editor={editor}
        />
      </TooltipProvider>
    </BubbleMenu>
  );
}
