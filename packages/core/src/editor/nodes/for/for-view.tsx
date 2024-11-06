import { NodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Repeat2 } from 'lucide-react';

export function ForView(_: NodeViewProps) {
  return (
    <NodeViewWrapper
      draggable="true"
      data-drag-handle=""
      data-type="for"
      className="mly-relative"
    >
      <NodeViewContent className="is-editable" />

      <div
        data-repeat-indicator=""
        className="mly-absolute mly-inset-y-0 mly-right-0 mly-flex mly-translate-x-full mly-flex-col mly-items-center mly-gap-1 mly-opacity-60"
        contentEditable={false}
      >
        <Repeat2 className="mly-size-3 mly-stroke-[2.5] mly-text-midnight-gray" />
        <div className="mly-w-[1.5px] mly-grow mly-rounded-full mly-bg-rose-300" />
      </div>
    </NodeViewWrapper>
  );
}
