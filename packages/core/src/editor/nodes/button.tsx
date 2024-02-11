import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HexAlphaColorPicker, HexColorInput } from 'react-colorful';

import { BaseButton } from '../components/base-button';
import { ColorPicker } from '../components/color-picker';
import { Input } from '../components/input';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';
import {
  allowedButtonBorderRadius,
  AllowedButtonVariant,
  allowedButtonVariant,
} from '../extensions/button-extension';
import { cn } from '../utils/classname';

const alignments = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  right: AlignRightIcon,
};

const items = {
  style(props: NodeViewProps) {
    return allowedButtonVariant.map((variant) => ({
      name: variant,
      isActive: props.node.attrs.variant === variant,
      onClick: () => {
        props.updateAttributes({
          variant: variant,
        });
      },
    }));
  },
  cornerRadius(props: NodeViewProps) {
    return allowedButtonBorderRadius.map((radius) => ({
      name: radius,
      isActive: props.node.attrs.borderRadius === radius,
      onClick: () => {
        props.updateAttributes({
          borderRadius: radius,
        });
      },
    }));
  },
  alignment(props: NodeViewProps) {
    return Object.entries(alignments).map(([alignment, Icon]) => ({
      name: alignment,
      icon: Icon,
      isActive: props.node.attrs.alignment === alignment,
      onClick: () => props.updateAttributes({ alignment }),
    }));
  },
};

export function ButtonComponent(props: NodeViewProps) {
  const {
    url,
    text,
    alignment,
    variant,
    borderRadius: _radius,
    buttonColor,
    textColor,
  } = props.node.attrs;
  const { getPos, editor } = props;

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
                  className="mly-grow mly-font-normal mly-capitalize"
                  size="sm"
                  onClick={item.onClick}
                  type="button"
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
                  className="mly-grow mly-font-normal mly-capitalize"
                  size="sm"
                  onClick={item.onClick}
                  type="button"
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
                    type="button"
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
  variant?: AllowedButtonVariant;
  color: string;
  onChange: (color: string) => void;
};

function BackgroundColorPickerPopup(props: ColorPickerProps) {
  const { color, onChange, variant } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <BaseButton variant="ghost" className="" size="sm" type="button">
          <div
            className="mly-h-4 mly-w-4 mly-rounded"
            style={{
              backgroundColor: variant === 'filled' ? color : 'transparent',
              borderStyle: 'solid',
              borderWidth: variant === 'outline' ? 2 : 0,
              borderColor: color,
            }}
          />
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent className="mly-w-full mly-rounded-none mly-border-0 !mly-bg-transparent !mly-p-0 mly-shadow-none mly-drop-shadow-md">
        <ColorPicker
          color={color}
          onChange={(newColor) => {
            // HACK: This is a workaround for a bug in tiptap
            // https://github.com/ueberdosis/tiptap/issues/3580
            //
            //     ERROR: flushSync was called from inside a lifecycle
            //
            // To fix this, we need to make sure that the onChange
            // callback is run after the current execution context.
            queueMicrotask(() => {
              onChange(newColor);
            });
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
        <BaseButton variant="ghost" size="sm" type="button">
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
      <PopoverContent className="mly-w-full mly-rounded-none mly-border-0 !mly-bg-transparent !mly-p-0 mly-shadow-none mly-drop-shadow-md">
        <ColorPicker
          color={color}
          onChange={(color) => {
            queueMicrotask(() => {
              onChange(color);
            });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
