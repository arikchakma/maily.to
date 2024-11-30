import { DEFAULT_TRIGGER_SUGGESTION_CHAR, Variables } from '@/editor/provider';
import { cn } from '@/editor/utils/classname';
import { ReactRenderer } from '@tiptap/react';
import { SuggestionOptions } from '@tiptap/suggestion';
import { ArrowDown, ArrowUp, Braces, CornerDownLeft } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import tippy, { GetReferenceClientRect } from 'tippy.js';

export const VariableList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (!item) {
      return;
    }

    props.command({ id: item });
  };

  const scrollSelectedIntoView = (index: number) => {
    const container = scrollContainerRef.current;
    const selectedItem = itemRefs.current[index];

    if (!container || !selectedItem) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = selectedItem.getBoundingClientRect();

    if (itemRect.bottom > containerRect.bottom) {
      // Scroll down if item is below viewport
      container.scrollTop += itemRect.bottom - containerRect.bottom;
    } else if (itemRect.top < containerRect.top) {
      // Scroll up if item is above viewport
      container.scrollTop += itemRect.top - containerRect.top;
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
    // Reset scroll position when items change
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    // Reset item refs array
    itemRefs.current = props.items.map(() => null);
  }, [props.items]);

  useEffect(() => {
    scrollSelectedIntoView(selectedIndex);
  }, [selectedIndex]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(
          (selectedIndex + props.items.length - 1) % props.items.length
        );
        return true;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
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
    <div className="mly-z-50 mly-w-64 mly-rounded-lg mly-border mly-border-gray-200 mly-bg-white mly-shadow-md mly-transition-all">
      <div className="mly-flex mly-items-center mly-justify-between mly-gap-2 mly-border-b mly-border-gray-200 mly-bg-soft-gray/40 mly-px-1 mly-py-1.5 mly-text-gray-500">
        <span className="mly-text-xs mly-uppercase">Variables</span>
        <VariableIcon>
          <Braces className="mly-size-3 mly-stroke-[2.5]" />
        </VariableIcon>
      </div>

      <div
        ref={scrollContainerRef}
        className="mly-scrollbar-thin mly-scrollbar-track-transparent mly-scrollbar-thumb-gray-200 mly-max-h-64 mly-overflow-y-auto"
      >
        <div className="mly-flex mly-flex-col mly-gap-0.5 mly-p-1">
          {props?.items?.length ? (
            props?.items?.map((item: string, index: number) => (
              <button
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
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
            <div className="mly-flex mly-w-full mly-items-center mly-gap-2 mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-font-mono mly-text-sm mly-text-gray-900">
              No result
            </div>
          )}
        </div>
      </div>

      <div className="mly-flex mly-items-center mly-justify-between mly-gap-2 mly-border-t mly-border-gray-200 mly-px-1 mly-py-1.5 mly-text-gray-500">
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

VariableList.displayName = 'VariableList';

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
  char: string = DEFAULT_TRIGGER_SUGGESTION_CHAR
): Omit<SuggestionOptions, 'editor'> {
  const defaultVariables = variables
    .filter((v) => !v.iterable)
    .map((variable) => variable.name);

  return {
    char,
    items: ({ query, editor }) => {
      const queryLower = query.toLowerCase();
      const eachKey = editor.getAttributes('for')?.each || '';

      const associatedVariableKeys =
        variables.find((v) => v.name === eachKey)?.keys || [];
      const filteredVariableKeys = defaultVariables.filter((name) =>
        name.toLowerCase().startsWith(queryLower)
      );

      const combinedKeys = [...associatedVariableKeys, ...filteredVariableKeys];
      if (query.length > 0 && !filteredVariableKeys.includes(query)) {
        combinedKeys.push(query);
      }

      return combinedKeys;
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
