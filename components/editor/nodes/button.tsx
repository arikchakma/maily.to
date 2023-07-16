import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react';
import { ChromePicker } from 'react-color';

import { BaseButton, buttonVariants } from '../components/base-button';
import { Input } from '../components/input';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';
import { cn } from '../utils/tailwind';

const items = {
  style(props: NodeViewProps) {
    return [
      {
        name: 'Filled',
        isActive: props.node.attrs.variant === 'filled',
        onClick: () => {
          props.updateAttributes({
            variant: 'filled',
          });
        },
      },
      {
        name: 'Outline',
        isActive: props.node.attrs.variant === 'outline',
        onClick: () => {
          props.updateAttributes({
            variant: 'outline',
          });
        },
      },
    ];
  },
  cornerRadius(props: NodeViewProps) {
    return [
      {
        name: 'Sharp',
        isActive: props.node.attrs.borderRadius === 'sharp',
        onClick: () => {
          props.updateAttributes({
            borderRadius: 'sharp',
          });
        },
      },
      {
        name: 'Smooth',
        isActive: props.node.attrs.borderRadius === 'smooth',
        onClick: () => {
          props.updateAttributes({
            borderRadius: 'smooth',
          });
        },
      },
      {
        name: 'Round',
        isActive: props.node.attrs.borderRadius === 'round',
        onClick: () => {
          props.updateAttributes({
            borderRadius: 'round',
          });
        },
      },
    ];
  },
  alignment(props: NodeViewProps) {
    return [
      {
        name: 'Left',
        icon: AlignLeftIcon,
        isActive: props.node.attrs.alignment === 'left',
        onClick: () => {
          props.updateAttributes({
            alignment: 'left',
          });
        },
      },
      {
        name: 'Center',
        icon: AlignCenterIcon,
        isActive: props.node.attrs.alignment === 'center',
        onClick: () => {
          props.updateAttributes({
            alignment: 'center',
          });
        },
      },
      {
        name: 'Right',
        icon: AlignRightIcon,
        isActive: props.node.attrs.alignment === 'right',
        onClick: () => {
          props.updateAttributes({
            alignment: 'right',
          });
        },
      },
    ];
  },
};

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
          <div>
            <a
              className={cn(
                buttonVariants(),
                'border-2 px-[32px] py-[20px] font-semibold no-underline',
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
                borderColor: buttonColor,
              }}
            >
              {text}
            </a>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
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
              {items.style(props).map((item, index) => (
                <BaseButton
                  key={index}
                  data-state={item.isActive ? 'true' : 'false'}
                  variant="ghost"
                  className="grow font-normal"
                  size="sm"
                  onClick={item.onClick}
                >
                  {item.name}
                </BaseButton>
              ))}
            </div>
          </div>

          <div className="w-full space-y-2">
            <p className="text-xs font-normal text-slate-400">Corner Radius</p>
            <div className="flex gap-1">
              {items.cornerRadius(props).map((item, index) => (
                <BaseButton
                  key={index}
                  data-state={item.isActive ? 'true' : 'false'}
                  variant="ghost"
                  className="grow font-normal"
                  size="sm"
                  onClick={item.onClick}
                >
                  {item.name}
                </BaseButton>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <div>
              <p className="text-xs font-normal text-slate-400">Alignment</p>
              <div className="mt-2 flex gap-1">
                {items.alignment(props).map((item, index) => (
                  <BaseButton
                    key={index}
                    data-state={item.isActive ? 'true' : 'false'}
                    variant="ghost"
                    className="grow"
                    size="sm"
                    onClick={item.onClick}
                  >
                    <item.icon size={16} />
                  </BaseButton>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-normal text-slate-400">Color</p>
              <div className="mt-2 flex gap-1">
                <BackgroundColorPickerPopup
                  variant={variant}
                  color={buttonColor}
                  onChange={(color) => {
                    props.updateAttributes({
                      buttonColor: color,
                    });
                  }}
                />
                <TextColorPickerPopup
                  color={textColor}
                  onChange={(color) => {
                    props.updateAttributes({
                      textColor: color,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}

type ColorPickerProps = {
  variant?: 'filled' | 'outline';
  color: string;
  onChange: (color: string) => void;
};

function BackgroundColorPickerPopup(props: ColorPickerProps) {
  const { color, onChange } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <BaseButton variant="ghost" className="" size="sm">
          <div
            className="h-4 w-4 rounded"
            style={{
              backgroundColor:
                props.variant === 'filled' ? color : 'transparent',
              border: props.variant === 'outline' ? '2px solid' : 'none',
              borderColor: color,
            }}
          />
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <ChromePicker
          className="!shadow-md"
          color={color}
          onChange={(color) => {
            onChange(color.hex);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function TextColorPickerPopup(props: ColorPickerProps) {
  const { color, onChange } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <BaseButton variant="ghost" className="" size="sm">
          <div className="flex flex-col items-center justify-center gap-[1px]">
            <span className="font-bolder font-mono text-xs text-slate-700">
              A
            </span>
            <div className="h-[2px] w-3" style={{ backgroundColor: color }} />
          </div>
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <ChromePicker
          className="!shadow-md"
          color={color}
          onChange={(color) => {
            onChange(color.hex);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
