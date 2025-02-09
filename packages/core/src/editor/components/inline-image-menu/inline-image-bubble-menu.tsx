import { BubbleMenu } from '@tiptap/react';
import { sticky } from 'tippy.js';
import { ImageSize } from '../image-menu/image-size';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { TooltipProvider } from '../ui/tooltip';
import { useInlineImageState } from './use-inline-image-state';
import { LinkInputPopover } from '../ui/link-input-popover';
import { ImageDownIcon } from 'lucide-react';
import { isTextSelected } from '@/editor/utils/is-text-selected';

export function InlineImageBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;
  if (!editor) {
    return null;
  }

  const state = useInlineImageState(editor);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      if (!editor.isEditable) {
        return false;
      }

      return editor.isActive('inlineImage');
    },
    tippyOptions: {
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      plugins: [sticky],
      sticky: 'popper',
      maxWidth: '100%',
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-rounded-lg mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        <div className="mly-flex mly-space-x-0.5">
          <LinkInputPopover
            defaultValue={state?.src ?? ''}
            onValueChange={(value, isVariable) => {
              editor
                ?.chain()
                .updateAttributes('inlineImage', {
                  src: value,
                  isSrcVariable: isVariable ?? false,
                })
                .run();
            }}
            tooltip="Source URL"
            icon={ImageDownIcon}
            editor={editor}
            isVariable={state.isSrcVariable}
          />

          <LinkInputPopover
            defaultValue={state?.imageExternalLink ?? ''}
            onValueChange={(value, isVariable) => {
              editor
                ?.chain()
                .updateAttributes('inlineImage', {
                  externalLink: value,
                  isExternalLinkVariable: isVariable ?? false,
                })
                .run();
            }}
            tooltip="External URL"
            editor={editor}
            isVariable={state.isExternalLinkVariable}
          />

          <ImageSize
            dimension="height"
            value={state?.height}
            onValueChange={(value) => {
              editor
                ?.chain()
                .updateAttributes('inlineImage', {
                  width: value,
                  height: value,
                })
                .run();
            }}
          />
        </div>
      </TooltipProvider>
    </BubbleMenu>
  );
}
