import { NodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useRef } from 'react';

export function ForView(props: NodeViewProps) {
  const { updateAttributes, node } = props;
  const { each, isUpdatingKey } = node.attrs;

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <NodeViewWrapper
      draggable="true"
      data-drag-handle=""
      className="mly-rounded-md mly-border mly-border-gray-100"
      data-type="for"
    >
      <div
        contentEditable={false}
        className="mly-border-b mly-border-gray-100 mly-px-2 mly-py-1 mly-text-sm"
      >
        <code contentEditable={false} className="mly-text-gray-400">
          {'<For'}&nbsp;{`each="payload.`}
          {isUpdatingKey ? (
            <input
              className="mly-max-w-20 mly-border-none mly-text-blue-500 mly-outline-none"
              ref={inputRef}
              value={each}
              onChange={(e) => {
                updateAttributes({ each: e.target.value });
              }}
              onBlur={() => {
                updateAttributes({ isUpdatingKey: false });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateAttributes({ isUpdatingKey: false });
                }
              }}
              placeholder="items"
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
              {each}
            </span>
          )}
          {`">`}
        </code>
      </div>
      <NodeViewContent className="is-editable mly-p-0.5 mly-px-1" />
      <div
        className="mly-border-t mly-border-gray-100 mly-px-2 mly-py-1 mly-text-sm"
        contentEditable={false}
      >
        <code className="mly-text-gray-400" contentEditable={false}>
          {'</For>'}
        </code>
      </div>
    </NodeViewWrapper>
  );
}
