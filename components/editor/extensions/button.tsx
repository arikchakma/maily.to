import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

import { BaseButton, buttonVariants } from '../components/base-button';
import { Input } from '../components/input';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';
import { cn } from '../utils/tailwind';

export default function ButtonComponent(props: NodeViewProps) {
  const {
    url,
    text,
    alignment,
    variant,
    borderRadius: _radius,
    buttonColor,
    textColor,
  } = props.node.attrs;

  return (
    <NodeViewWrapper
      className={`react-component ${
        props.selected && 'ProseMirror-selectednode'
      }`}
      draggable="true"
      data-drag-handle=""
      style={{
        textAlign: alignment,
      }}
    >
      <Popover open={props.selected}>
        <PopoverTrigger asChild>
          <a
            className={cn(
              buttonVariants(),
              'px-[32px] py-[20px] no-underline',
              {
                'rounded-full': _radius === 'round',
                'rounded-md': _radius === 'smooth',
                'rounded-none': _radius === 'sharp',
              }
            )}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            style={{
              backgroundColor:
                variant === 'filled' ? buttonColor : 'transparent',
              color: textColor,
            }}
          >
            {text}
          </a>
        </PopoverTrigger>
        <PopoverContent
          className="space-y-2"
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Input
            placeholder="Add text here"
            value={text}
            onChange={(e) => {
              props.updateAttributes({
                text: e.target.value,
              });
            }}
          />
          <Input
            placeholder="Add link here"
            value={url}
            onChange={(e) => {
              props.updateAttributes({
                url: e.target.value,
              });
            }}
          />

          <div className="w-full space-y-2">
            <p className="text-xs font-normal text-slate-400">Style</p>
            <div className="flex gap-1">
              <BaseButton
                data-state={variant === 'filled' ? 'true' : 'false'}
                variant="ghost"
                className="grow"
                size="sm"
                onClick={() => {
                  props.updateAttributes({
                    variant: 'filled',
                  });
                }}
              >
                Filled
              </BaseButton>
              <BaseButton
                data-state={variant === 'outline' ? 'true' : 'false'}
                variant="ghost"
                className="grow"
                size="sm"
                onClick={() => {
                  props.updateAttributes({
                    variant: 'outline',
                  });
                }}
              >
                Outline
              </BaseButton>
            </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-xs font-normal text-slate-400">Corner Radius</p>
            <div className="flex gap-1">
              <BaseButton
                data-state={_radius === 'sharp' ? 'true' : 'false'}
                variant="ghost"
                className="grow"
                size="sm"
                onClick={() => {
                  props.updateAttributes({
                    borderRadius: 'sharp',
                  });
                }}
              >
                Sharp
              </BaseButton>
              <BaseButton
                data-state={_radius === 'smooth' ? 'true' : 'false'}
                variant="ghost"
                className="grow"
                size="sm"
                onClick={() => {
                  props.updateAttributes({
                    borderRadius: 'smooth',
                  });
                }}
              >
                Smooth
              </BaseButton>
              <BaseButton
                data-state={_radius === 'round' ? 'true' : 'false'}
                variant="ghost"
                className="grow"
                size="sm"
                onClick={() => {
                  props.updateAttributes({
                    borderRadius: 'round',
                  });
                }}
              >
                Round
              </BaseButton>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
