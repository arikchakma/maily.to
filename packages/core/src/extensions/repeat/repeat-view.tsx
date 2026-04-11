import type { RepeatAttributes } from '@maily-to/shared';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { Repeat2Icon } from 'lucide-react';
import { useCallback } from 'react';

import { cn } from '~/utils/classname';

export function RepeatView(props: ReactNodeViewProps) {
  const { editor, node, selected } = props;
  const attrs = node.attrs as RepeatAttributes;
  const { each } = attrs;

  const handleIndicatorClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // Select the repeat node
      const { view } = editor;
      const pos = view.posAtDOM(event.currentTarget as HTMLElement, 0);
      const resolvedPos = view.state.doc.resolve(pos);

      // Find the repeat node position
      let repeatPos = resolvedPos.before(resolvedPos.depth);
      for (let d = resolvedPos.depth; d >= 0; d--) {
        if (resolvedPos.node(d).type.name === 'repeat') {
          repeatPos = resolvedPos.before(d);
          break;
        }
      }

      editor.commands.setNodeSelection(repeatPos);
    },
    [editor]
  );

  return (
    <NodeViewWrapper
      className="mly:relative"
      draggable={editor.isEditable}
      data-drag-handle={editor.isEditable}
    >
      <div className="mly:relative mly:min-h-[40px]">
        {/* Right-side visual indicator */}
        <div
          className={cn(
            'mly:pointer-events-auto mly:absolute mly:top-0 mly:-right-6 mly:bottom-0 mly:flex mly:w-5 mly:cursor-pointer mly:flex-col mly:items-center mly:gap-1',
            'mly:opacity-50 mly:transition-opacity mly:hover:opacity-100',
            selected && 'mly:opacity-100'
          )}
          onClick={handleIndicatorClick}
          role="button"
          tabIndex={0}
          aria-label={`Repeat block for ${each}`}
        >
          <Repeat2Icon className="mly:size-4 mly:shrink-0 mly:text-rose-500" />
          <div className="mly:w-0.5 mly:flex-1 mly:rounded-full mly:bg-rose-300" />
        </div>

        {/* Content area */}
        <NodeViewContent className="mly:min-h-[24px]" />
      </div>
    </NodeViewWrapper>
  );
}
