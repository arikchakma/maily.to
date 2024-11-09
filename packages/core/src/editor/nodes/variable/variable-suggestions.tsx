import { DEFAULT_VARIABLE_SUGGESTION_CHAR, Variables } from '@/editor/provider';
import { cn } from '@/editor/utils/classname';
import { ReactRenderer } from '@tiptap/react';
import { SuggestionOptions } from '@tiptap/suggestion';
import { ArrowDown, ArrowUp, Braces, CornerDownLeft } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import tippy, { GetReferenceClientRect } from 'tippy.js';

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
    <div className="mly-z-50 mly-h-auto mly-min-w-[240px] mly-overflow-hidden mly-rounded-lg mly-border mly-border-gray-200 mly-bg-white mly-shadow-md mly-transition-all">
      <div className="mly-flex mly-items-center mly-justify-between mly-gap-2 mly-border-b mly-border-gray-200 mly-bg-soft-gray/40 mly-px-2 mly-py-1.5 mly-text-gray-500">
        <span className="mly-text-xs mly-uppercase">Variables</span>
        <VariableIcon>
          <Braces className="mly-size-3 mly-stroke-[2.5]" />
        </VariableIcon>
      </div>

      <div className="mly-flex mly-flex-col mly-gap-0.5 mly-p-1">
        {props?.items?.length ? (
          props?.items?.map((item: string, index: number) => (
            <button
              key={index}
              onClick={() => selectItem(index)}
              className={cn(
                'mly-flex mly-w-full mly-items-center mly-gap-2 mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-font-mono mly-text-sm mly-text-gray-900 hover:mly-bg-soft-gray',
                index === selectedIndex ? 'mly-bg-soft-gray' : 'mly-bg-white'
              )}
            >
              <Braces className="mly-size-3 mly-stroke-[2.5] mly-text-rose-600" />
              {item}
            </button>
          ))
        ) : (
          <div className="mly-flex mly-w-full mly-items-center mly-gap-2 mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-font-mono mly-text-sm mly-text-gray-900 hover:mly-bg-soft-gray">
            No result
          </div>
        )}
      </div>

      <div className="mly-flex mly-items-center mly-justify-between mly-gap-2 mly-border-t mly-border-gray-200 mly-px-2 mly-py-1.5 mly-text-gray-500">
        <div className="mly-flex mly-items-center mly-gap-1">
          <VariableIcon>
            <ArrowDown className="mly-size-3 mly-stroke-[2.5]" />
          </VariableIcon>
          <VariableIcon>
            <ArrowUp className="mly-size-3 mly-stroke-[2.5]" />
          </VariableIcon>

          <span className="mly-text-xs mly-text-gray-500">Navigate</span>
        </div>
        <VariableIcon>
          <CornerDownLeft className="mly-size-3 mly-stroke-[2.5]" />
        </VariableIcon>
      </div>
    </div>
  );
});

type VariableIconProps = {
  className?: string;
  children: React.ReactNode;
};

function VariableIcon(props: VariableIconProps) {
  const { className, children } = props;

  return (
    <div
      className={cn(
        'mly-flex mly-size-5 mly-items-center mly-justify-center mly-rounded-md mly-border',
        className
      )}
    >
      {children}
    </div>
  );
}

VariableList.displayName = 'VariableList';

export function getVariableSuggestions(
  variables: Variables = [],
  char: string = DEFAULT_VARIABLE_SUGGESTION_CHAR
): Omit<SuggestionOptions, 'editor'> {
  const defaultVariables = variables.map((variable) => variable.name);

  return {
    char,
    items: ({ query }) => {
      return defaultVariables
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
