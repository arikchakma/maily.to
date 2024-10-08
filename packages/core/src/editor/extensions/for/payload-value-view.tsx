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
import { cn } from '@/editor/utils/classname';

export const PlayloadValueList = forwardRef((props: any, ref) => {
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
    <div className="mly-z-50 mly-h-auto mly-min-w-[128px] mly-rounded-md mly-border mly-border-gray-200 mly-bg-white mly-p-1 mly-shadow-md mly-transition-all">
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
        <button className="mly-flex mly-w-full mly-space-x-2 mly-rounded-md mly-bg-white mly-px-2 mly-py-1 mly-text-left mly-text-sm mly-text-gray-900 hover:mly-bg-gray-100">
          No result
        </button>
      )}
    </div>
  );
});

PlayloadValueList.displayName = 'PlayloadValueList';

export type PlayloadValues = { name: string }[];

export function getPlayloadValueSuggestions(
  payloadValues: PlayloadValues = []
): Omit<SuggestionOptions, 'editor'> {
  const defaultPlayloadValues = payloadValues.map(
    (payloadValue) => payloadValue.name
  );

  return {
    items: ({ query }) => {
      return defaultPlayloadValues
        .concat(query.length > 0 ? [query] : [])
        .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5);
    },

    render: () => {
      let component: ReactRenderer<any>;
      let popup: InstanceType<any> | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(PlayloadValueList, {
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

export function PlayloadValueComponent(props: NodeViewProps) {
  const { node, selected, updateAttributes } = props;
  const { id } = node.attrs;

  return (
    <NodeViewWrapper
      className={cn(
        'react-component',
        selected && 'ProseMirror-selectednode',
        'mly-inline-block mly-leading-none'
      )}
      draggable="false"
    >
      <code className="mly-text-inherit mly-opacity-80 [font-size:inherit] [font-weight:inherit]">
        #item.{id}
      </code>
    </NodeViewWrapper>
  );
}
