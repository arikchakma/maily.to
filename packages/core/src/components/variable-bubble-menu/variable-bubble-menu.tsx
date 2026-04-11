import type { VariableOptions } from '@maily-to/extension-variable';
import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { useMailyId } from '@maily-to/ui';
import { CornerDownLeftIcon } from 'lucide-react';
import { useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useExtensionOptions } from '~/hooks/use-extension-options';
import { useVariableBubbleState } from '~/hooks/use-variable-bubble-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { BubbleMenu } from '../interface/bubble-menu';
import {
  FieldIcon,
  FieldInput,
  FieldLabel,
  FieldRoot,
} from '../interface/field';

export function VariableBubbleMenu() {
  const editor = useEditorInstance();
  const state = useVariableBubbleState(editor);
  const options = useExtensionOptions<VariableOptions>(
    MAILY_NODE_TYPES.VARIABLE,
    editor
  );

  const container = useRef<HTMLDivElement | null>(null);
  const variableFieldRef = useRef<HTMLInputElement | null>(null);
  const fallbackFieldRef = useRef<HTMLInputElement | null>(null);

  const variableFieldId = useMailyId();
  const fallbackFieldId = useMailyId();

  const handleVariableChange = (id: string) => {
    const { selection } = editor.state;
    const { from } = selection;

    editor
      .chain()
      .updateAttributes(MAILY_NODE_TYPES.VARIABLE, {
        id,
        label: null,
      })
      .setNodeSelection(from)
      .run();
  };

  const handleFallbackChange = (fallback: string) => {
    const { selection } = editor.state;
    const { from } = selection;

    editor
      .chain()
      .updateAttributes(MAILY_NODE_TYPES.VARIABLE, { fallback })
      .setNodeSelection(from)
      .run();
  };

  if (!state.open) {
    return null;
  }

  return (
    <BubbleMenu
      ref={container}
      open={state.open}
      onOpenChange={state.setOpen}
      floatingId={FLOATING_ELEMENT_IDS.VARIABLE_BUBBLE_MENU}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const variableField = variableFieldRef.current;
          if (!variableField) {
            return;
          }

          handleVariableChange(variableField.value);
          variableField.blur();
        }}
      >
        <FieldRoot className="mly:flex mly:items-center mly:gap-2 mly:pl-1">
          <FieldLabel htmlFor={variableFieldId}>Variable</FieldLabel>
          <div className="mly:relative">
            <FieldInput
              ref={variableFieldRef}
              id={variableFieldId}
              aria-label="Variable"
              className="mly:pr-6.5"
              placeholder="ie. Full Name"
              defaultValue={state.id ?? ''}
              onBlur={(event) => {
                const value = event.target.value;
                if (value === state.id) {
                  return;
                }

                handleVariableChange(value);
              }}
              disabled={options.disableInput}
            />
            <FieldIcon>
              <CornerDownLeftIcon />
            </FieldIcon>
          </div>
        </FieldRoot>
      </form>

      {!state.hideDefaultValue && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const fallbackField = fallbackFieldRef.current;
            if (!fallbackField) {
              return;
            }

            handleFallbackChange(fallbackField.value);
            fallbackField.blur();
          }}
        >
          <FieldRoot className="mly:flex mly:items-center mly:gap-2 mly:pl-1">
            <FieldLabel htmlFor={fallbackFieldId}>Default</FieldLabel>
            <div className="mly:relative">
              <FieldInput
                ref={fallbackFieldRef}
                className="mly:pr-6.5"
                aria-label="Default Value"
                id={fallbackFieldId}
                placeholder="ie. John Doe..."
                defaultValue={state.fallback ?? ''}
                onBlur={(event) => {
                  const value = event.target.value;
                  if (value === state.fallback) {
                    return;
                  }

                  handleFallbackChange(value);
                }}
              />

              <FieldIcon>
                <CornerDownLeftIcon />
              </FieldIcon>
            </div>
          </FieldRoot>
        </form>
      )}
    </BubbleMenu>
  );
}
