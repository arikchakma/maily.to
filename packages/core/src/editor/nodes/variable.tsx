import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { NodeViewProps, NodeViewWrapper, ReactRenderer } from '@tiptap/react';
import { SuggestionOptions } from '@tiptap/suggestion';
import tippy, { GetReferenceClientRect } from 'tippy.js';
import { cn } from '../utils/classname';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';
import { Input } from '../components/input';

export const VariableList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex(
          (selectedIndex + props.items.length - 1) % props.items.length
        );
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="mly-z-50 mly-h-auto mly-rounded-md mly-border mly-border-gray-200 mly-bg-white mly-p-1 mly-shadow-md mly-transition-all mly-min-w-[128px]">
      {props?.items?.length ? (
        props?.items?.map((item: string, index: number) => (
          <button
            key={index}
            onClick={() => selectItem(index)}
            className={cn(
              'mly-flex mly-w-full mly-space-x-2 mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-text-sm mly-text-gray-900 hover:mly-bg-gray-100',
              index === selectedIndex ? 'mly-bg-gray-200' : 'mly-bg-white'
            )}
          >
            {item}
          </button>
        ))
      ) : (
        <button className="mly-flex mly-w-full mly-space-x-2 mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-text-sm mly-text-gray-900 hover:mly-bg-gray-100 mly-bg-white">
          No result
        </button>
      )}
    </div>
  );
});

VariableList.displayName = 'VariableList';

export function getVariableSuggestions(
  variables: string[] = []
): Omit<SuggestionOptions, 'editor'> {
  return {
    items: ({ query }) => {
      return variables
        .concat(query.length > 0 ? [query] : [])
        .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5);
    },

    render: () => {
      let component: ReactRenderer<any>;
      let popup: InstanceType<any> | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(VariableList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect as GetReferenceClientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup?.[0]?.setProps({
            getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup?.[0].hide();

            return true;
          }

          return component.ref?.onKeyDown(props);
        },

        onExit() {
          if (!popup || !popup?.[0] || !component) {
            return;
          }

          popup?.[0].destroy();
          component.destroy();
        },
      };
    },
  };
}

export function VariableComponent(props: NodeViewProps) {
  const { node, selected, updateAttributes, editor, getPos } = props;
  const { id, fallback } = node.attrs;

  const [isOpen, setIsOpen] = useState(selected);
  const variableRef = useRef<HTMLDivElement>(null);

  const editorPosition = editor?.view.state.selection.$from.pos;
  const variableStartPosition = getPos();
  const variableEndPosition = variableStartPosition + node.nodeSize;

  // Hack: This is hack to open popover in inline-nodes
  // otherwise it will be closed when we update the attributes
  // because the node-view will be re-rendered
  useEffect(() => {
    if (!variableRef.current || !selected) {
      return;
    }

    setIsOpen(true);
    // Select the text inside the variable
    const range = document.createRange();
    range.selectNode(variableRef.current);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [selected]);

  // Hack: This is hack to close popover in inline-nodes
  // otherwise it stays open when we move the cursor outside the variable
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (
      editorPosition < variableStartPosition ||
      editorPosition > variableEndPosition
    ) {
      setIsOpen(false);
      return;
    }
  }, [isOpen, editorPosition, variableStartPosition, variableEndPosition]);

  return (
    <NodeViewWrapper
      className={cn(
        'react-component',
        selected && 'ProseMirror-selectednode',
        'mly-leading-none mly-inline-block'
      )}
      draggable="false"
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            ref={variableRef}
            tabIndex={-1}
            className="mly-py-1 mly-px-2 mly-bg-slate-100 mly-border mly-border-blue-300 mly-rounded-md mly-leading-none"
          >
            {id}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="mly-space-y-2"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <label className="mly-block mly-w-full mly-leading-none mly-space-y-1.5">
            <span className="mly-leading-none mly-text-xs mly-font-normal mly-text-slate-400">
              Variable Name
            </span>
            <Input
              placeholder="Add Variable Name"
              value={id}
              onChange={(e) => {
                updateAttributes({
                  id: e.target.value,
                });
              }}
            />
          </label>
          <label className="mly-block mly-w-full mly-leading-none mly-space-y-1.5">
            <span className="mly-leading-none mly-text-xs mly-font-normal mly-text-slate-400">
              Fallback Value
            </span>
            <Input
              placeholder="Fallback Value"
              value={fallback || ''}
              onChange={(e) => {
                updateAttributes({
                  fallback: e.target.value,
                });
              }}
            />
          </label>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
