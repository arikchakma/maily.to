import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/editor/components/popover';
import { ShowPopover } from '@/editor/components/show-popover';
import { Divider } from '@/editor/components/ui/divider';
import { TooltipProvider } from '@/editor/components/ui/tooltip';
import { useMailyContext, Variable } from '@/editor/provider';
import { cn } from '@/editor/utils/classname';
import { processVariables } from '@/editor/utils/variable';
import { NodeViewProps } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import { AlertTriangle, Braces, Pencil } from 'lucide-react';
import { useMemo } from 'react';

export function VariableView(props: NodeViewProps) {
  const { node, selected, updateAttributes, editor } = props;
  const { id, fallback, showIfKey = '' } = node.attrs;

  const { variables = [] } = useMailyContext();
  const eachKey = editor?.getAttributes('for')?.each || '';

  const isRequired = useMemo(() => {
    const variable = processVariables(variables, {
      query: '',
      target: node,
      editor,
    }).find((variable) => variable.name === id);

    return variable?.required ?? true;
  }, [variables, id, editor, eachKey]);

  return (
    <NodeViewWrapper
      className={cn(
        'react-component',
        selected && 'ProseMirror-selectednode',
        'mly-inline-block mly-leading-none'
      )}
      draggable="false"
    >
      <Popover>
        <PopoverTrigger>
          <span
            tabIndex={-1}
            className="mly-inline-flex mly-items-center mly-gap-[var(--variable-icon-gap)] mly-rounded-full mly-border mly-px-1.5 mly-py-0.5 mly-leading-none"
          >
            <Braces className="mly-size-[var(--variable-icon-size)] mly-shrink-0 mly-stroke-[2.5] mly-text-rose-600" />
            {id}
            {isRequired && !fallback && (
              <AlertTriangle className="mly-size-[var(--variable-icon-size)] mly-shrink-0 mly-stroke-[2.5]" />
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          className="mly-w-max mly-rounded-lg !mly-p-0.5"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <TooltipProvider>
            <div className="mly-flex mly-items-stretch mly-text-midnight-gray">
              <label className="mly-relative">
                <span className="mly-inline-block mly-px-2 mly-text-xs mly-text-midnight-gray">
                  Variable
                </span>
                <input
                  value={id ?? ''}
                  onChange={(e) => {
                    updateAttributes({
                      id: e.target.value,
                    });
                  }}
                  placeholder="ie. name..."
                  className="mly-h-7 mly-w-36 mly-rounded-md mly-bg-soft-gray mly-px-2 mly-text-sm mly-text-midnight-gray focus:mly-bg-soft-gray focus:mly-outline-none"
                />
              </label>

              <Divider className="mly-mx-1.5" />

              <label className="mly-relative">
                <span className="mly-inline-block mly-px-2 mly-pl-1 mly-text-xs mly-text-midnight-gray">
                  Default
                </span>
                <input
                  value={fallback ?? ''}
                  onChange={(e) => {
                    updateAttributes({
                      fallback: e.target.value,
                    });
                  }}
                  placeholder="ie. John Doe..."
                  className="mly-h-7 mly-w-32 mly-rounded-md mly-bg-soft-gray mly-px-2 mly-pr-6 mly-text-sm mly-text-midnight-gray focus:mly-bg-soft-gray focus:mly-outline-none"
                />
                <div className="mly-absolute mly-inset-y-0 mly-right-1 mly-flex mly-items-center">
                  <Pencil className="mly-h-3 mly-w-3 mly-stroke-[2.5] mly-text-midnight-gray" />
                </div>
              </label>

              <Divider />

              <ShowPopover
                showIfKey={showIfKey}
                onShowIfKeyValueChange={(value) => {
                  updateAttributes({
                    showIfKey: value,
                  });
                }}
                editor={editor}
              />
            </div>
          </TooltipProvider>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
