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
    borderRadius,
    buttonColor,
    textColor,
  } = props.node.attrs;
  // const increase = () => {
  //   props.updateAttributes({
  //     count: props.node.attrs.count + 1,
  //   });
  // };

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
            className={cn(buttonVariants(), 'px-[32px] py-[20px] no-underline')}
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
        <PopoverContent className="space-y-2">
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
            <p className="text-regular text-xs text-slate-400">Style</p>
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
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
