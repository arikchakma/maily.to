import { NodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export function ForView(props: NodeViewProps) {
  return (
    <NodeViewWrapper draggable="true" data-drag-handle="" data-type="for">
      <NodeViewContent className="is-editable" />
    </NodeViewWrapper>
  );
}
