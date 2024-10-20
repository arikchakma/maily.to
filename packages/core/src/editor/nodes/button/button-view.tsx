import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/editor/components/popover';
import { Select } from '@/editor/components/ui/select';
import { cn } from '@/editor/utils/classname';
import { NodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import {
  AllowedButtonBorderRadius,
  allowedButtonBorderRadius,
  allowedButtonVariant,
} from './button';
import { Input } from '@/editor/components/input';
import { AlignLeft, Pencil } from 'lucide-react';
import { Divider } from '@/editor/components/ui/divider';
import { BubbleMenuButton } from '@/editor/components/bubble-menu-button';

export function ButtonView(props: NodeViewProps) {
  const { node, editor, getPos, updateAttributes } = props;
  const {
    text,
    alignment,
    variant,
    borderRadius: _radius,
    buttonColor,
    textColor,
  } = node.attrs;

  return (
    <NodeViewWrapper
      draggable="true"
      data-drag-handle=""
      data-type="button"
      style={{
        textAlign: alignment,
      }}
    >
      <Popover open={props.selected}>
        <PopoverTrigger asChild>
          <div>
            <button
              className={cn(
                'mly-inline-flex mly-items-center mly-justify-center mly-rounded-md mly-text-sm mly-font-medium mly-ring-offset-white mly-transition-colors disabled:mly-pointer-events-none disabled:mly-opacity-50',
                'mly-h-10 mly-px-4 mly-py-2',
                'mly-px-[32px] mly-py-[20px] mly-font-semibold mly-no-underline',
                {
                  '!mly-rounded-full': _radius === 'round',
                  '!mly-rounded-md': _radius === 'smooth',
                  '!mly-rounded-none': _radius === 'sharp',
                }
              )}
              tabIndex={-1}
              style={{
                backgroundColor:
                  variant === 'filled' ? buttonColor : 'transparent',
                color: textColor,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: buttonColor,
              }}
              onClick={(e) => {
                e.preventDefault();
                const pos = getPos();
                editor.commands.setNodeSelection(pos);
              }}
            >
              {text}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="mly-w-max mly-rounded-lg !mly-p-0.5"
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="mly-flex mly-items-stretch mly-text-red-400">
            <div className="relative">
              <input
                value={text}
                onChange={(e) => {
                  updateAttributes({
                    text: e.target.value,
                  });
                }}
                className="mly-h-7 mly-max-w-24 mly-rounded-md mly-px-2 mly-pr-6 mly-text-sm mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-bg-soft-gray focus:mly-outline-none"
              />
              <div className="mly-absolute mly-inset-y-0 mly-right-1 mly-flex mly-items-center">
                <Pencil className="mly-h-3 mly-w-3 mly-text-midnight-gray" />
              </div>
            </div>

            <Divider />

            <div className="mly-flex mly-space-x-0.5">
              <Select
                label="Border Radius"
                value={_radius}
                options={allowedButtonBorderRadius.map((value) => ({
                  value,
                  label: value,
                }))}
                onValueChange={(value) => {
                  updateAttributes({
                    borderRadius: value,
                  });
                }}
              />

              <Select
                label="Style"
                value={variant}
                options={allowedButtonVariant.map((value) => ({
                  value,
                  label: value,
                }))}
                onValueChange={(value) => {
                  updateAttributes({
                    variant: value,
                  });
                }}
              />
            </div>

            <Divider />

            <div className="mly-flex mly-space-x-0.5">
            <BubbleMenuButton
              icon={AlignLeft}
             tooltip='Align Left'
             
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
