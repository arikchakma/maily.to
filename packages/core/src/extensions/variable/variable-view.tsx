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
    <NodeViewWrapper as="span">
      <span className="mly:whitespace-nowrap">
        <span className="mly:font-bold mly:opacity-70">
          {DEFAULT_VARIABLE_START_TRIGGER}&nbsp;
        </span>
        <span>{label ?? id}</span>
        <span className="mly:font-bold mly:opacity-70">
          &nbsp;{DEFAULT_VARIABLE_END_TRIGGER}
        </span>
      </span>
    </NodeViewWrapper>
  );
}
