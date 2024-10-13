import { NodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useRef } from 'react';

export function ShowView(props: NodeViewProps) {
  const { updateAttributes, node } = props;
  const { when, isUpdatingKey } = node.attrs;

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <NodeViewWrapper
      draggable="true"
      data-drag-handle=""
      className="mly-rounded-md mly-border mly-border-gray-200"
      data-type="for"
    >
      <div className="mly-border-b mly-border-gray-200 mly-px-2 mly-py-1 mly-text-sm">
        <code contentEditable={false} className="mly-text-gray-400">
          {'<Show'}&nbsp;{`when="payload.`}
          {isUpdatingKey ? (
            <input
              className="mly-max-w-20 mly-border-none mly-text-blue-500 mly-outline-none"
              ref={inputRef}
              value={when}
              onChange={(e) => {
                updateAttributes({ when: e.target.value });
              }}
              onBlur={() => {
                updateAttributes({ isUpdatingKey: false });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateAttributes({ isUpdatingKey: false });
                }
              }}
              placeholder="shouldShow"
            />
          ) : (
            <span
              className="mly-inline-block mly-h-3.5 mly-min-w-5 mly-cursor-pointer mly-text-blue-500"
              onClick={() => {
                updateAttributes({ isUpdatingKey: true });
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }}
            >
              {when}
            </span>
          )}
          {`">`}
        </code>
      </div>
      <NodeViewContent className="is-editable" />
      <div
        className="mly-border-t mly-border-gray-200 mly-px-2 mly-py-1 mly-text-sm"
        contentEditable={false}
      >
        <code className="mly-text-gray-400">{'</Show>'}</code>
      </div>
    </NodeViewWrapper>
  );
}
