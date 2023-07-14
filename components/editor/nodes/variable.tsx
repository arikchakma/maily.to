import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Mention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import { SuggestionOptions } from '@tiptap/suggestion';
import tippy, { GetReferenceClientRect, Instance } from 'tippy.js';

import { BaseButton } from '@/components/editor/components/base-button';

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
    <div className="z-50 h-auto rounded-md border border-gray-200 bg-white px-1 py-2 shadow-md transition-all">
      {props?.items?.length ? (
        props?.items?.map((item: string, index: number) => (
          <BaseButton
            variant="secondary"
            key={index}
            onClick={() => selectItem(index)}
            className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-gray-900 hover:bg-gray-100"
          >
            {item}
          </BaseButton>
        ))
      ) : (
        <BaseButton
          variant="secondary"
          className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-gray-900 hover:bg-gray-100"
        >
          No result
        </BaseButton>
      )}
    </div>
  );
});

VariableList.displayName = 'VariableList';

export const suggestion: Omit<SuggestionOptions, 'editor'> = {
  items: ({ query }) => {
    return [query.toLowerCase()];
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
        popup?.[0].destroy();
        component.destroy();
      },
    };
  },
};

export const Variable = Mention.extend({
  name: 'variable',
  parseHTML() {
    return [
      {
        tag: 'span[data-type="variable"]',
      },
    ];
  },
}).configure({
  suggestion,
  renderLabel({ node }) {
    return `${node.attrs.label ?? node.attrs.id}`;
  },
  HTMLAttributes: {
    class: 'py-1 px-2 bg-slate-100 border border-blue-300 rounded-md',
  },
});
