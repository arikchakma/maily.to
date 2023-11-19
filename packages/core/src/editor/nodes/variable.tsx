import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Mention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import { SuggestionOptions } from '@tiptap/suggestion';
import tippy, { GetReferenceClientRect } from 'tippy.js';

import { BaseButton } from '@/editor/components/base-button';

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
    <div className="mly-z-50 mly-h-auto mly-rounded-md mly-border mly-border-gray-200 mly-bg-white mly-px-1 mly-py-2 mly-shadow-md mly-transition-all">
      {props?.items?.length ? (
        props?.items?.map((item: string, index: number) => (
          <BaseButton
            variant="secondary"
            key={index}
            onClick={() => selectItem(index)}
            className="mly-flex mly-w-full mly-items-center mly-space-x-2 mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-text-sm mly-text-gray-900 hover:mly-bg-gray-100"
          >
            {item}
          </BaseButton>
        ))
      ) : (
        <BaseButton
          variant="secondary"
          className="mly-flex mly-w-full mly-items-center mly-space-x-2 mly-rounded-md mly-px-2 mly-py-1 mly-text-left mly-text-sm mly-text-gray-900 hover:mly-bg-gray-100"
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
    class:
      'mly-py-1 mly-px-2 mly-bg-slate-100 mly-border mly-border-blue-300 mly-rounded-md',
  },
});
