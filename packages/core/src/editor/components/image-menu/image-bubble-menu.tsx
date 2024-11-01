import { AllowedLogoSize, allowedLogoSize } from '@/editor/nodes/logo';
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

export function ImageBubbleMenu(props: EditorBubbleMenuProps) {
  const { editor, appendTo } = props;
  if (!editor) {
    return null;
  }

  const state = useImageState(editor);

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    shouldShow: ({ editor }) => {
      return editor.isActive('logo') || editor.isActive('image');
    },
    tippyOptions: {
      maxWidth: '100%',
      moveTransition: 'mly-transform 0.15s mly-ease-out',
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly-flex mly-rounded-lg mly-border mly-border-slate-200 mly-bg-white mly-p-0.5 mly-shadow-md"
    >
      <TooltipProvider>
        {state.isLogoActive && (
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
            onValueChange={(value) => {
              if (state.isLogoActive) {
                editor?.chain().setLogoAttributes({ src: value }).run();
              } else {
                editor?.chain().updateAttributes('image', { src: value }).run();
              }
            }}
            tooltip="Source URL"
            icon={ImageDown}
          />

          {state.isImageActive && (
            <LinkInputPopover
              defaultValue={state?.imageExternalLink ?? ''}
              onValueChange={(value) => {
                editor
                  ?.chain()
                  .updateAttributes('image', { externalLink: value })
                  .run();
              }}
              tooltip="External URL"
            />
          )}
        </div>

        {state.isImageActive && (
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
        />
      </TooltipProvider>
    </BubbleMenu>
  );
}
