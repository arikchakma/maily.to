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
import { AlertTriangle, Braces } from 'lucide-react';
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
  const { node, selected, updateAttributes } = props;
  const { id, fallback } = node.attrs;

  const [isOpen, setIsOpen] = useState(false);

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
        <PopoverTrigger>
          <span
            tabIndex={-1}
            className="mly-py-1 mly-px-2 mly-bg-rose-50 mly-border mly-border-rose-200 mly-text-rose-800 mly-rounded-md mly-leading-none mly-inline-flex mly-items-center mly-gap-1"
          >
            {id}
            {!fallback && (
              <AlertTriangle className="mly-w-3 mly-shrink-0 mly-h-3 mly-stroke-[2.5]" />
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="mly-space-y-2"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <label className="mly-block mly-w-full mly-leading-none mly-space-y-1.5">
            <span className="mly-leading-none mly-text-xs mly-font-normal">
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
            <span className="mly-leading-none mly-text-xs mly-font-normal">
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

            <p className="mly-text-xs mly-text-gray-500">
              If the variable doesn't exist, this fallback value will be used.
            </p>
          </label>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
