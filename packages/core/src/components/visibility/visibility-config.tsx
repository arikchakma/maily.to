import type {
  AllowedVisibilityAction,
  AllowedVisibilityOperator,
  VisibilityRule,
} from '@maily-to/shared';
import {
  DEFAULT_VISIBILITY_RULE,
  getVisibilityValueSupport,
  VISIBILITY_ACTION_OPTIONS,
  VISIBILITY_OPERATOR_OPTIONS,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { useRef } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';

import { Divider } from '../interface/divider';
import { FieldInput, FieldRoot } from '../interface/field';
import { PopoverBack } from '../interface/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '../interface/select';
import { VariableOnlyEditor } from '../variable-only-editor/variable-only-editor';

const NO_CONDITION_ACTION = 'none';

const ACTION_OPTIONS = [
  { label: 'No condition', value: NO_CONDITION_ACTION },
  ...VISIBILITY_ACTION_OPTIONS,
];

export type VisibilityConfigProps = {
  container: FloatingUIContainer;
  nodeType: string;
  onBack: () => void;
};

export function VisibilityConfig(props: VisibilityConfigProps) {
  const { container, nodeType, onBack } = props;

  const editor = useEditorInstance();
  const variableEditorRef = useRef<Editor | null>(null);

  const rule = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const { visibilityRule } = instance.getAttributes(nodeType);

      return (visibilityRule as VisibilityRule | null) ?? null;
    },
  });

  const updateRule = (updates: Partial<VisibilityRule>) => {
    const next = { ...(rule ?? DEFAULT_VISIBILITY_RULE), ...updates };

    return editor
      .chain()
      .setVisibilityRule(nodeType, {
        ...next,
        value: getVisibilityValueSupport(next.operator) ? next.value : '',
      })
      .run();
  };

  const handleActionChange = (value: unknown) => {
    if (value === NO_CONDITION_ACTION) {
      return editor.chain().unsetVisibilityRule(nodeType).run();
    }

    return updateRule({ action: value as AllowedVisibilityAction });
  };

  return (
    <div data-mly-visibility-config="">
      <PopoverBack onClick={onBack}>Visibility</PopoverBack>

      <Divider type="horizontal" />

      <div data-mly-visibility-fields="">
        <FieldRoot>
          <Select
            items={ACTION_OPTIONS}
            onValueChange={handleActionChange}
            value={rule?.action ?? NO_CONDITION_ACTION}
          >
            <SelectTrigger aria-label="Visibility Action">
              <SelectValue />
            </SelectTrigger>

            <SelectPositioner container={container}>
              <SelectContent data-variant="visibility-action">
                {ACTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPositioner>
          </Select>
        </FieldRoot>

        {rule ? (
          <>
            <FieldRoot>
              <VariableOnlyEditor
                autofocus={false}
                content={rule.variable || '{{'}
                editorRef={variableEditorRef}
                onContentChange={(value) => {
                  updateRule({ variable: value });
                }}
                placeholder="{{variable}}"
              />
            </FieldRoot>

            <div data-mly-visibility-condition="">
              <FieldRoot>
                <Select
                  items={VISIBILITY_OPERATOR_OPTIONS}
                  onValueChange={(value) => {
                    return updateRule({
                      operator: value as AllowedVisibilityOperator,
                    });
                  }}
                  value={rule.operator}
                >
                  <SelectTrigger aria-label="Visibility Operator">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectPositioner container={container}>
                    <SelectContent data-variant="visibility-operator">
                      {VISIBILITY_OPERATOR_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPositioner>
                </Select>
              </FieldRoot>

              {getVisibilityValueSupport(rule.operator) ? (
                <FieldRoot>
                  <FieldInput
                    aria-label="Visibility Value"
                    defaultValue={rule.value}
                    onChange={(event) => {
                      updateRule({ value: event.target.value });
                    }}
                    placeholder="Value"
                  />
                </FieldRoot>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
