import {
  DEFAULT_VARIABLE_TRIGGER_CHAR,
  DEFAULT_VARIABLES,
  Variable as VariableType,
  Variables,
} from '@/editor/provider';
import { processVariables } from '@/editor/utils/variable';
import { ReactRenderer } from '@tiptap/react';
import { SuggestionOptions } from '@tiptap/suggestion';
import { useRef, forwardRef, useImperativeHandle, ComponentType } from 'react';
import tippy, { GetReferenceClientRect } from 'tippy.js';
import { VariablePopover, VariablePopoverRef } from './variable-popover';

export type VariableListProps = {
  command: (params: { id: string; required: boolean }) => void;
  items: VariableType[];
};

export const VariableList = forwardRef((props: VariableListProps, ref) => {
  const { items = [] } = props;

  const popoverRef = useRef<VariablePopoverRef>(null);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (!popoverRef.current) {
        return false;
      }

      const { moveUp, moveDown, select } = popoverRef.current || {};
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
        return true;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
        return true;
      }

      if (event.key === 'Enter') {
        select();
        return true;
      }

      return false;
    },
  }));

  return (
    <VariablePopover
      items={items}
      onSelectItem={(value) => {
        props.command({
          id: value.name,
          required: value.required ?? true,
        });
      }}
      ref={popoverRef}
    />
  );
});

VariableList.displayName = 'VariableList';

export function getVariableSuggestions(
  variables: Variables = DEFAULT_VARIABLES,
  char: string = DEFAULT_VARIABLE_TRIGGER_CHAR,
  variableListComponent: ComponentType<VariableListProps> = VariableList,
): Omit<SuggestionOptions, 'editor'> {
  return {
    char,
    items: ({ query, editor }) => {
      return processVariables(variables, {
        query,
        editor,
        from: 'content-variable',
      });
    },

    render: () => {
      let component: ReactRenderer<any>;
      let popup: InstanceType<any> | null = null;

      return {
        onStart: (props) => {
          component = new ReactRenderer(variableListComponent, {
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
