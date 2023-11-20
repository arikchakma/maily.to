import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react';
import { ChromePicker } from 'react-color';

import { BaseButton } from '../components/base-button';
import { Input } from '../components/input';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';
import { cn } from '../utils/classname';

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
                'mly-inline-flex mly-items-center mly-justify-center mly-rounded-md mly-text-sm mly-font-medium mly-ring-offset-white mly-transition-colors focus-visible:mly-outline-none focus-visible:mly-ring-2 focus-visible:mly-ring-gray-400 focus-visible:mly-ring-offset-2 disabled:mly-pointer-events-none disabled:mly-opacity-50',
                'mly-h-10 mly-px-4 mly-py-2',
                'mly-border-2 mly-px-[32px] mly-py-[20px] mly-font-semibold mly-no-underline',
                {
                  '!mly-rounded-full': _radius === 'round',
                  '!mly-rounded-md': _radius === 'smooth',
                  '!mly-rounded-none': _radius === 'sharp',
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

          <div className="mly-w-full mly-space-y-2">
            <p className="mly-text-xs mly-font-normal mly-text-slate-400">
              Style
            </p>
            <div className="mly-flex mly-gap-1">
              {items.style(props).map((item, index) => (
                <BaseButton
                  key={index}
                  data-state={item.isActive ? 'true' : 'false'}
                  variant="ghost"
                  className="mly-grow mly-font-normal"
                  size="sm"
                  onClick={item.onClick}
                >
                  {item.name}
                </BaseButton>
              ))}
            </div>
          </div>

          <div className="mly-w-full mly-space-y-2">
            <p className="mly-text-xs mly-font-normal mly-text-slate-400">
              Corner Radius
            </p>
            <div className="mly-flex mly-gap-1">
              {items.cornerRadius(props).map((item, index) => (
                <BaseButton
                  key={index}
                  data-state={item.isActive ? 'true' : 'false'}
                  variant="ghost"
                  className="mly-grow mly-font-normal"
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
              <p className="mly-text-xs mly-font-normal mly-text-slate-400">
                Alignment
              </p>
              <div className="mly-mt-2 mly-flex mly-gap-1">
                {items.alignment(props).map((item, index) => (
                  <BaseButton
                    key={index}
                    data-state={item.isActive ? 'true' : 'false'}
                    variant="ghost"
                    className="mly-grow"
                    size="sm"
                    onClick={item.onClick}
                  >
                    <item.icon size={16} />
                  </BaseButton>
                ))}
              </div>
            </div>
            <div>
              <p className="mly-text-xs mly-font-normal mly-text-slate-400">
                Color
              </p>
              <div className="mly-mt-2 mly-flex mly-gap-1">
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
            className="mly-h-4 mly-w-4 mly-rounded"
            style={{
              backgroundColor:
                props.variant === 'filled' ? color : 'transparent',
              border: props.variant === 'outline' ? '2px solid' : 'none',
              borderColor: color,
            }}
          />
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent className="mly-w-full !mly-p-0">
        <ChromePicker
          className="!mly-shadow-md"
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
        <BaseButton variant="ghost" size="sm">
          <div className="mly-flex mly-flex-col mly-items-center mly-justify-center mly-gap-[1px]">
            <span className="mly-font-bolder mly-font-mono mly-text-xs mly-text-slate-700">
              A
            </span>
            <div
              className="mly-h-[2px] mly-w-3"
              style={{ backgroundColor: color }}
            />
          </div>
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent className="mly-w-full !mly-p-0">
        <ChromePicker
          className="!mly-shadow-md"
          color={color}
          onChange={(color) => {
            onChange(color.hex);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
