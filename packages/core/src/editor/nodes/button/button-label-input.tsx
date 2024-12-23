import { InputAutocomplete } from '@/editor/components/ui/input-autocomplete';
import {
  DEFAULT_VARIABLE_TRIGGER_CHAR,
  useMailyContext,
} from '@/editor/provider';
import { processVariables } from '@/editor/utils/variable';
import { Editor } from '@tiptap/core';
import { BracesIcon } from 'lucide-react';
import { useMemo } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

type ButtonLabelInputProps = {
  value: string;
  onValueChange?: (value: string, isVariable?: boolean) => void;
  isVariable?: boolean;

  editor: Editor;
};

export function ButtonLabelInput(props: ButtonLabelInputProps) {
  const { value, onValueChange, isVariable, editor } = props;

  const linkInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(!isVariable);

  const {
    variables = [],
    variableTriggerCharacter = DEFAULT_VARIABLE_TRIGGER_CHAR,
  } = useMailyContext();

  const autoCompleteOptions = useMemo(() => {
    const withoutTrigger = value.replace(
      new RegExp(variableTriggerCharacter, 'g'),
      ''
    );

    return processVariables(variables, {
      query: withoutTrigger || '',
      from: 'bubble-variable',
      editor,
    }).map((variable) => variable.name);
  }, [variables, value, editor]);

  return (
    <div className="mly-isolate mly-flex mly-rounded-lg">
      {!isEditing && (
        <button
          className="mly-inline-grid mly-h-7 mly-min-w-28 mly-max-w-xs mly-grid-cols-[12px_1fr] mly-items-center mly-gap-1.5 mly-rounded-md mly-border mly-px-2 mly-font-mono mly-text-sm hover:mly-bg-soft-gray"
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              linkInputRef.current?.focus();
            }, 0);
          }}
        >
          <BracesIcon className="mly-h-3 mly-w-3 mly-shrink-0 mly-stroke-[2.5] mly-text-rose-600" />
          <span className="mly-min-w-0 mly-truncate mly-text-left">
            {value}
          </span>
        </button>
      )}

      {isEditing && (
        <InputAutocomplete
          value={value}
          onValueChange={(value) => {
            onValueChange?.(value);
          }}
          autoCompleteOptions={autoCompleteOptions}
          ref={linkInputRef}
          placeholder="maily.to/"
          className="mly-h-7 mly-w-40 mly-rounded-md mly-px-2 mly-pr-6 mly-text-sm mly-text-midnight-gray hover:mly-bg-soft-gray focus:mly-bg-soft-gray focus:mly-outline-none"
          triggerChar={variableTriggerCharacter}
          onSelectOption={(value) => {
            const isVariable = autoCompleteOptions.includes(value) ?? false;
            if (isVariable) {
              setIsEditing(false);
            }
            onValueChange?.(value, isVariable);
          }}
        />
      )}
    </div>
  );
}
