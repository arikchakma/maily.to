import {
  BracesIcon,
  ChevronDownIcon,
  CornerDownLeft,
  Link,
  LucideIcon,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { BaseButton } from '../base-button';
import { useRef, useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import {
  DEFAULT_PLACEHOLDER_URL,
  DEFAULT_RENDER_VARIABLE_FUNCTION,
  DEFAULT_VARIABLE_TRIGGER_CHAR,
  useMailyContext,
} from '@/editor/provider';
import { InputAutocomplete } from './input-autocomplete';
import { processVariables } from '@/editor/utils/variable';
import { useMemo } from 'react';
import { Editor } from '@tiptap/core';

const LINK_PROTOCOL_REGEX = /https?:\/\//;

type LinkInputPopoverProps = {
  defaultValue?: string;
  isVariable?: boolean;
  onValueChange?: (value: string, isVariable?: boolean) => void;

  icon?: LucideIcon;
  tooltip?: string;

  editor: Editor;
};

export function LinkInputPopover(props: LinkInputPopoverProps) {
  const {
    defaultValue = '',
    onValueChange,
    tooltip,
    icon: Icon = Link,
    editor,

    isVariable,
  } = props;

  const defaultProtocol = defaultValue.match(LINK_PROTOCOL_REGEX)?.[0];
  const defaultUrlWithoutProtocol = defaultValue.replace(
    LINK_PROTOCOL_REGEX,
    ''
  );

  const [isOpen, setIsOpen] = useState(false);
  const [protocol, setProtocol] = useState(defaultProtocol || 'https://');
  const [isEditing, setIsEditing] = useState(!isVariable);

  const linkInputRef = useRef<HTMLInputElement>(null);

  const {
    variables = [],
    variableTriggerCharacter = DEFAULT_VARIABLE_TRIGGER_CHAR,
    renderVariable = DEFAULT_RENDER_VARIABLE_FUNCTION,
    placeholderUrl = DEFAULT_PLACEHOLDER_URL,
  } = useMailyContext();

  const autoCompleteOptions = useMemo(() => {
    const withoutTrigger = defaultUrlWithoutProtocol.replace(
      new RegExp(variableTriggerCharacter, 'g'),
      ''
    );

    return processVariables(variables, {
      query: withoutTrigger || '',
      from: 'bubble-variable',
      editor,
    }).map((variable) => variable.name);
  }, [variables, defaultUrlWithoutProtocol, editor]);

  const popoverButton = (
    <PopoverTrigger asChild>
      <BaseButton
        variant="ghost"
        size="sm"
        type="button"
        className="mly-size-7"
        data-state={!!defaultUrlWithoutProtocol}
      >
        <Icon className="mly-h-3 mly-w-3 mly-shrink-0 mly-stroke-[2.5] mly-text-midnight-gray" />
      </BaseButton>
    </PopoverTrigger>
  );

  const normalizeProtocol = (value: string, p: string = protocol) => {
    // remove protocol if it's already there
    // and add the new one
    value = value?.replace(LINK_PROTOCOL_REGEX, '');
    return p + value;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>{popoverButton}</TooltipTrigger>
          <TooltipContent sideOffset={8}>{tooltip}</TooltipContent>
        </Tooltip>
      ) : (
        popoverButton
      )}

      <PopoverContent
        align="end"
        side="top"
        className="mly-w-max mly-rounded-none mly-border-none mly-bg-transparent !mly-p-0 mly-shadow-none"
        sideOffset={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = linkInputRef.current;
            if (!input) {
              return;
            }

            let value = normalizeProtocol(input.value);
            onValueChange?.(value);
            setIsOpen(false);
          }}
        >
          <div className="mly-isolate mly-flex mly-rounded-lg">
            {!isEditing && (
              <div className="mly-flex mly-h-8 mly-items-center mly-rounded-lg mly-border mly-border-gray-300 mly-bg-white mly-px-0.5">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setTimeout(() => {
                      linkInputRef.current?.focus();
                    }, 0);
                  }}
                >
                  {renderVariable({
                    variable: {
                      name: defaultUrlWithoutProtocol,
                      valid: true,
                    },
                    fallback: '',
                    from: 'bubble-variable',
                    editor,
                  })}
                </button>
              </div>
            )}

            {isEditing && (
              <>
                <div className="mly-relative">
                  <select
                    className="hover:text-accent-foreground mly-peer mly-inline-flex mly-h-full mly-appearance-none mly-items-center mly-rounded-none mly-rounded-s-lg mly-border mly-border-gray-300 mly-bg-gray-50 mly-pe-8 mly-ps-3 mly-text-sm mly-text-gray-700 mly-transition-shadow hover:mly-bg-gray-100 focus:mly-z-10 focus-visible:mly-outline-none disabled:mly-pointer-events-none disabled:mly-cursor-not-allowed disabled:mly-opacity-50"
                    aria-label="Protocol"
                    value={protocol}
                    onChange={(e) => {
                      const protocol = e.target.value;

                      setProtocol(protocol);
                      const newValue = normalizeProtocol(
                        linkInputRef.current?.value || '',
                        protocol
                      );
                      onValueChange?.(newValue);
                    }}
                  >
                    <option value="https://">https://</option>
                    <option value="http://">http://</option>
                  </select>
                  <span className="mly-pointer-events-none mly-absolute mly-inset-y-0 mly-right-0 mly-z-10 mly-flex mly-h-full mly-w-9 mly-items-center mly-justify-center mly-text-gray-600 peer-disabled:mly-opacity-50">
                    <ChevronDownIcon
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                      role="img"
                    />
                  </span>
                </div>

                <InputAutocomplete
                  value={defaultUrlWithoutProtocol}
                  onValueChange={(value) => {
                    let newValue = normalizeProtocol(value);
                    onValueChange?.(newValue);
                  }}
                  autoCompleteOptions={autoCompleteOptions}
                  ref={linkInputRef}
                  placeholder={placeholderUrl}
                  className="-mly-ms-px mly-block mly-h-8 mly-w-52 mly-rounded-lg mly-rounded-s-none mly-border mly-border-gray-300 mly-px-2 mly-py-1.5 mly-pr-6 mly-text-sm mly-shadow-sm mly-outline-none placeholder:mly-text-gray-400"
                  triggerChar={variableTriggerCharacter}
                  onSelectOption={(value) => {
                    const isVariable =
                      autoCompleteOptions.includes(value) ?? false;
                    if (isVariable) {
                      setIsEditing(false);
                    } else {
                      value = normalizeProtocol(value);
                    }

                    onValueChange?.(value, isVariable);
                    setIsOpen(false);
                  }}
                />
              </>
            )}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
