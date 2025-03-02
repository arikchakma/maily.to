import { InputAutocomplete } from '@/editor/components/ui/input-autocomplete';
import { DEFAULT_VARIABLE_TRIGGER_CHAR } from '@/editor/nodes/variable/variable';
import { DEFAULT_PLACEHOLDER_URL, useMailyContext } from '@/editor/provider';
import { useVariableOptions } from '@/editor/utils/node-options';
import { processVariables } from '@/editor/utils/variable';
import { Editor } from '@tiptap/core';
import { useMemo, useRef, useState } from 'react';

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

  const { placeholderUrl = DEFAULT_PLACEHOLDER_URL } = useMailyContext();
  const otps = useVariableOptions(editor);
  const variables = otps?.variables;
  const variableTriggerCharacter =
    otps?.suggestion?.char ?? DEFAULT_VARIABLE_TRIGGER_CHAR;
  const renderVariable = otps?.renderVariable;

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
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              linkInputRef.current?.focus();
            }, 0);
          }}
        >
          {renderVariable({
            variable: {
              name: value,
              valid: true,
            },
            fallback: '',
            from: 'bubble-variable',
            editor,
          })}
        </button>
      )}

      {isEditing && (
        <InputAutocomplete
          editor={editor}
          value={value}
          onValueChange={(value) => {
            onValueChange?.(value);
          }}
          autoCompleteOptions={autoCompleteOptions}
          ref={linkInputRef}
          placeholder={placeholderUrl}
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
