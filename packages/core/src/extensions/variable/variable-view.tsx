import type { VariableNodeAttrs } from '@maily-to/extension-variable';
import {
  DEFAULT_VARIABLE_END_TRIGGER,
  DEFAULT_VARIABLE_START_TRIGGER,
} from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';

export function VariableView(props: ReactNodeViewProps) {
  const { node } = props;
  const { id, label } = node.attrs as VariableNodeAttrs;

  return (
    <NodeViewWrapper as="span" data-mly-variable="">
      <span data-mly-variable-trigger="">
        {DEFAULT_VARIABLE_START_TRIGGER}&nbsp;
      </span>
      <span data-mly-variable-label="">{label ?? id}</span>
      <span data-mly-variable-trigger="">
        &nbsp;{DEFAULT_VARIABLE_END_TRIGGER}
      </span>
    </NodeViewWrapper>
  );
}
