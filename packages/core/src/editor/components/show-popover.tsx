import { Editor } from '@tiptap/core';
import { Eye, InfoIcon } from 'lucide-react';
import { memo, useMemo, useRef, useState } from 'react';
import { cn } from '../utils/classname';
import { useVariableOptions } from '../utils/node-options';
import { processVariables } from '../utils/variable';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { InputAutocomplete } from './ui/input-autocomplete';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type ShowPopoverProps = {
  showIfKey?: string;
  onShowIfKeyValueChange?: (when: string) => void;

  editor: Editor;
};

function _ShowPopover(props: ShowPopoverProps) {
  const { showIfKey = '', onShowIfKeyValueChange, editor } = props;

  const opts = useVariableOptions(editor);
  const variables = opts?.variables;
  const renderVariable = opts?.renderVariable;
  const [isUpdatingKey, setIsUpdatingKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const autoCompleteOptions = useMemo(() => {
    return processVariables(variables, {
      query: showIfKey || '',
      from: 'bubble-variable',
      editor,
    }).map((variable) => variable.name);
  }, [variables, showIfKey, editor]);

  const isValidWhenKey = showIfKey || autoCompleteOptions.includes(showIfKey);

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) {
          return;
        }

        setIsUpdatingKey(false);
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger
            className={cn(
              'mly:flex mly:size-7 mly:items-center mly:justify-center mly:gap-1 mly:rounded-md mly:px-1.5 mly:text-sm mly:data-[state=open]:bg-soft-gray mly:hover:bg-soft-gray mly:focus-visible:relative mly:focus-visible:z-10 mly:focus-visible:outline-hidden mly:focus-visible:ring-2 mly:focus-visible:ring-gray-400 mly:focus-visible:ring-offset-2',
              showIfKey &&
                'mly:bg-rose-100 mly:text-rose-800 mly:data-[state=open]:bg-rose-100 mly:hover:bg-rose-100'
            )}
          >
            <Eye className="mly:h-3 mly:w-3 mly:stroke-[2.5]" />
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>Show block conditionally</TooltipContent>
      </Tooltip>
      <PopoverContent
        className="mly:flex mly:w-max mly:rounded-lg mly:p-0.5!"
        side="top"
        sideOffset={8}
        align="end"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <div className="mly:flex mly:items-center mly:gap-1.5 mly:px-1.5 mly:text-sm mly:leading-none">
          Show if
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon
                className={cn('mly:size-3 mly:stroke-[2.5] mly:text-gray-500')}
              />
            </TooltipTrigger>
            <TooltipContent
              sideOffset={14}
              className="mly:max-w-[285px]"
              align="start"
            >
              Show the block if the selected variable is true.
            </TooltipContent>
          </Tooltip>
        </div>

        {!isUpdatingKey && (
          <button
            onClick={() => {
              setIsUpdatingKey(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          >
            {renderVariable({
              variable: {
                name: showIfKey,
                valid: !!isValidWhenKey,
              },
              fallback: '',
              from: 'bubble-variable',
              editor,
            })}
          </button>
        )}
        {isUpdatingKey && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsUpdatingKey(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsUpdatingKey(false);
              }
            }}
          >
            <InputAutocomplete
              editor={editor}
              value={showIfKey || ''}
              onValueChange={(value) => {
                onShowIfKeyValueChange?.(value);
              }}
              onOutsideClick={() => {
                setIsUpdatingKey(false);
              }}
              onSelectOption={(value) => {
                onShowIfKeyValueChange?.(value);
                setIsUpdatingKey(false);
              }}
              autoCompleteOptions={autoCompleteOptions}
              ref={inputRef}
            />
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
}

export const ShowPopover = memo(_ShowPopover);
