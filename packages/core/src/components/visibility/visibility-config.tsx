import type {
  AllowedVisibilityAction,
  AllowedVisibilityOperator,
  VisibilityRule,
} from '@maily-to/shared';
import {
  OPERATORS_WITHOUT_VALUE,
  VISIBILITY_ACTION_OPTIONS,
  VISIBILITY_ACTIONS,
  VISIBILITY_OPERATOR_OPTIONS,
  VISIBILITY_OPERATORS,
} from '@maily-to/shared';
import { ConditionBuilder } from '@maily-to/ui';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { useCallback, useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';

import { Divider } from '../interface/divider';
import { FieldInput, FieldRoot } from '../interface/field';
import { PopoverBack } from '../interface/popover';
import {
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '../interface/select';
import { VariableOnlyEditor } from '../variable-only-editor/variable-only-editor';

type VisibilityConfigProps = {
  container: FloatingUIContainer;
  editor: Editor;
  nodeType: string;
  onBack?: () => void;
};

export function VisibilityConfig(props: VisibilityConfigProps) {
  const { container, editor: editorProp, nodeType, onBack } = props;

  const editor = useEditorInstance(editorProp);
  const variableEditorRef = useRef<Editor | null>(null);

  const state = useEditorState({
    editor,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes(nodeType);

      return {
        visibilityRule: (attrs.visibilityRule as VisibilityRule) ?? null,
      };
    },
  });

  const updateCondition = useCallback(
    (updates: Partial<VisibilityRule>) => {
      const current = state.visibilityRule ?? {
        action: VISIBILITY_ACTIONS.SHOW,
        variable: '',
        operator: VISIBILITY_OPERATORS.EQUALS,
        value: '',
      };

      const next: VisibilityRule = { ...current, ...updates };

      if (
        updates.operator &&
        OPERATORS_WITHOUT_VALUE.includes(updates.operator)
      ) {
        next.value = '';
      }

      editor.chain().setVisibility({ visibilityRule: next }).run();
    },
    [editor, state.visibilityRule]
  );

  const handleClearCondition = useCallback(() => {
    editor.chain().setVisibility({ visibilityRule: null }).run();
  }, [editor]);

  const handleActionChange = useCallback(
    (action: string) => {
      if (action === VISIBILITY_ACTIONS.NONE) {
        handleClearCondition();
        return;
      }

      updateCondition({ action: action as AllowedVisibilityAction });
    },
    [updateCondition, handleClearCondition]
  );

  const condition = state.visibilityRule;
  const currentAction = condition?.action ?? VISIBILITY_ACTIONS.NONE;
  const currentOperator = condition?.operator ?? VISIBILITY_OPERATORS.EQUALS;
  const hasCondition = currentAction !== VISIBILITY_ACTIONS.NONE;
  const needsValue = !OPERATORS_WITHOUT_VALUE.includes(currentOperator);

  return (
    <div className="mly:flex mly:flex-col">
      {onBack && (
        <>
          <PopoverBack onClick={onBack}>Visibility</PopoverBack>
          <Divider type="horizontal" className="mly:-mx-1 mly:my-1" />
        </>
      )}

      <div className="mly:grid mly:p-0">
        <ConditionBuilder.Root
          action={currentAction}
          field={condition?.variable ?? ''}
          operator={currentOperator}
          value={condition?.value ?? ''}
          onActionChange={handleActionChange}
          onFieldChange={(v) => {
            updateCondition({ variable: v });
          }}
          onOperatorChange={(o) => {
            updateCondition({ operator: o as AllowedVisibilityOperator });
          }}
          onValueChange={(v) => {
            updateCondition({ value: v });
          }}
          onClear={handleClearCondition}
          operatorNeedsValue={needsValue}
          className="mly:grid mly:gap-2"
        >
          <FieldRoot>
            <ConditionBuilder.ActionSelect items={VISIBILITY_ACTION_OPTIONS}>
              <SelectTrigger className="mly:w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectPositioner container={container}>
                <SelectContent>
                  {VISIBILITY_ACTION_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectPositioner>
            </ConditionBuilder.ActionSelect>
          </FieldRoot>

          {hasCondition && (
            <>
              <FieldRoot>
                <VariableOnlyEditor
                  editorRef={variableEditorRef}
                  content={condition?.variable ?? '{{'}
                  onContentChange={(v) => {
                    updateCondition({ variable: v });
                  }}
                  placeholder="{{variable}}"
                  autofocus={false}
                  className="mly:w-full mly:rounded-lg mly:bg-soft-gray"
                />
              </FieldRoot>

              <div className="mly:grid mly:grid-cols-2 mly:gap-2">
                <FieldRoot>
                  <ConditionBuilder.OperatorSelect
                    items={VISIBILITY_OPERATOR_OPTIONS}
                  >
                    <SelectTrigger className="mly:w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPositioner container={container} align="start">
                      <SelectContent>
                        {VISIBILITY_OPERATOR_OPTIONS.map((item) => (
                          <SelectItem
                            key={item.value}
                            value={item.value}
                            className="mly:whitespace-nowrap"
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectPositioner>
                  </ConditionBuilder.OperatorSelect>
                </FieldRoot>

                {needsValue && (
                  <FieldRoot>
                    <FieldInput
                      placeholder="Value"
                      value={condition?.value ?? ''}
                      onChange={(e) => {
                        updateCondition({ value: e.target.value });
                      }}
                      className="mly:w-full"
                    />
                  </FieldRoot>
                )}
              </div>
            </>
          )}
        </ConditionBuilder.Root>
      </div>
    </div>
  );
}
