import { MAILY_NODE_TYPES } from '@maily-to/shared';
import { isNodeSelection } from '@tiptap/react';
import { CornerDownLeftIcon } from 'lucide-react';
import { useId, useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useVariableBubbleState } from '~/hooks/use-variable-bubble-state';
import { FLOATING_ELEMENT_IDS } from '~/types/floating-ui';

import { BubbleMenu } from '../interface/bubble-menu';
import {
  FieldControl,
  FieldIcon,
  FieldInput,
  FieldLabel,
  FieldRoot,
} from '../interface/field';

export function VariableBubbleMenu() {
  const editor = useEditorInstance();
  const { fallback, hideDefaultValue, id, open, setOpen } =
    useVariableBubbleState(editor);

  const variableFieldRef = useRef<HTMLInputElement>(null);
  const fallbackFieldRef = useRef<HTMLInputElement>(null);

  const variableFieldId = useId();
  const fallbackFieldId = useId();

  if (!open) {
    return null;
  }

  const updateVariable = (attrs: Record<string, string | null>) => {
    const { selection } = editor.state;
    const chain = editor
      .chain()
      .updateAttributes(MAILY_NODE_TYPES.VARIABLE, attrs);

    return isNodeSelection(selection)
      ? chain.setNodeSelection(selection.from).run()
      : chain.run();
  };

  return (
    <BubbleMenu
      floatingId={FLOATING_ELEMENT_IDS.VARIABLE_BUBBLE_MENU}
      onOpenChange={setOpen}
      open={open}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const field = variableFieldRef.current;
          if (!field) {
            return;
          }

          updateVariable({ id: field.value, label: null });
          field.blur();
        }}
      >
        <FieldRoot>
          <FieldLabel htmlFor={variableFieldId}>Variable</FieldLabel>
          <FieldControl>
            <FieldInput
              aria-label="Variable"
              defaultValue={id}
              id={variableFieldId}
              key={id}
              onBlur={(event) => {
                if (event.target.value === id) {
                  return;
                }

                updateVariable({ id: event.target.value, label: null });
              }}
              placeholder="ie. Full Name"
              ref={variableFieldRef}
            />
            <FieldIcon>
              <CornerDownLeftIcon />
            </FieldIcon>
          </FieldControl>
        </FieldRoot>
      </form>

      {hideDefaultValue ? null : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const field = fallbackFieldRef.current;
            if (!field) {
              return;
            }

            updateVariable({ fallback: field.value });
            field.blur();
          }}
        >
          <FieldRoot>
            <FieldLabel htmlFor={fallbackFieldId}>Default</FieldLabel>
            <FieldControl>
              <FieldInput
                aria-label="Default Value"
                defaultValue={fallback}
                id={fallbackFieldId}
                key={fallback}
                onBlur={(event) => {
                  if (event.target.value === fallback) {
                    return;
                  }

                  updateVariable({ fallback: event.target.value });
                }}
                placeholder="ie. John Doe"
                ref={fallbackFieldRef}
              />
              <FieldIcon>
                <CornerDownLeftIcon />
              </FieldIcon>
            </FieldControl>
          </FieldRoot>
        </form>
      )}
    </BubbleMenu>
  );
}
