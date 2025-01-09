import { BubbleMenu } from '@tiptap/react';
import { ArrowUpRight, ImageDown } from 'lucide-react';
import { AlignmentSwitch } from '../alignment-switch';
import { EditorBubbleMenuProps } from '../text-menu/text-bubble-menu';
import { Divider } from '../ui/divider';
import { LinkInputPopover } from '../ui/link-input-popover';
import { Select } from '../ui/select';
import { TooltipProvider } from '../ui/tooltip';
import { ImageSize } from './image-size';
import { useImageState } from './use-image-state';
import { ShowPopover } from '../show-popover';
import { AllowedLogoSize, allowedLogoSize } from '@/editor/nodes/logo/logo';
import { sticky } from 'tippy.js';

export function ImageBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;
  if (!editor) {
    return null;
  }

  const state = useImageState(editor);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ editor }) => {
      return editor.isActive('logo') || editor.isActive('image');
    },
    tippyOptions: {
      popperOptions: {
        modifiers: [{ name: 'flip', enabled: false }],
      },
      appendTo: appendTo?.current || 'parent',
      plugins: [sticky],
      sticky: 'popper',
      maxWidth: '100%',
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-rounded-lg mly-border mly-border-gray-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        {state.isLogoActive && state.imageSrc && (
          <>
            <Select
              label="Size"
              tooltip="Size"
              value={state.logoSize}
              options={allowedLogoSize.map((size) => ({
                value: size,
                label: size,
              }))}
              onValueChange={(value) => {
                editor
                  ?.chain()
                  .focus()
                  .setLogoAttributes({ size: value as AllowedLogoSize })
                  .run();
              }}
            />

            <Divider />
          </>
        )}

        <div className="mly-flex mly-space-x-0.5">
          <AlignmentSwitch
            alignment={state.alignment}
            onAlignmentChange={(alignment) => {
              const isCurrentNodeImage = state.isImageActive;
              if (!isCurrentNodeImage) {
                editor?.chain().focus().setLogoAttributes({ alignment }).run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .updateAttributes('image', { alignment })
                  .run();
              }
            }}
          />

          <LinkInputPopover
            defaultValue={state?.imageSrc ?? ''}
            onValueChange={(value, isVariable) => {
              if (state.isLogoActive) {
                editor
                  ?.chain()
                  .setLogoAttributes({
                    src: value,
                    isSrcVariable: isVariable ?? false,
                  })
                  .run();
              } else {
                editor
                  ?.chain()
                  .updateAttributes('image', {
                    src: value,
                    isSrcVariable: isVariable ?? false,
                  })
                  .run();
              }
            }}
            tooltip="Source URL"
            icon={ImageDown}
            editor={editor}
            isVariable={state.isSrcVariable}
          />

          {state.isImageActive && (
            <LinkInputPopover
              defaultValue={state?.imageExternalLink ?? ''}
              onValueChange={(value, isVariable) => {
                editor
                  ?.chain()
                  .updateAttributes('image', {
                    externalLink: value,
                    isExternalLinkVariable: isVariable ?? false,
                  })
                  .run();
              }}
              tooltip="External URL"
              editor={editor}
              isVariable={state.isExternalLinkVariable}
            />
          )}
        </div>

        {state.isImageActive && state.imageSrc && (
          <>
            <Divider />

            <div className="mly-flex mly-space-x-0.5">
              <ImageSize
                dimension="width"
                value={state?.width ?? 0}
                onValueChange={(value) => {
                  editor
                    ?.chain()
                    .updateAttributes('image', { width: value })
                    .run();
                }}
              />
              <ImageSize
                dimension="height"
                value={state?.height ?? 0}
                onValueChange={(value) => {
                  editor
                    ?.chain()
                    .updateAttributes('image', { height: value })
                    .run();
                }}
              />
            </div>
          </>
        )}

        <Divider />
        <ShowPopover
          showIfKey={state.currentShowIfKey}
          onShowIfKeyValueChange={(value) => {
            editor
              ?.chain()
              .updateAttributes(state.isLogoActive ? 'logo' : 'image', {
                showIfKey: value,
              })
              .run();
          }}
          editor={editor}
        />
      </TooltipProvider>
    </BubbleMenu>
  );
}
