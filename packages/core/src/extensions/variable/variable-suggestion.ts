import { computePosition, flip, offset, shift } from '@floating-ui/react';
import { DEFAULT_VARIABLE_START_TRIGGER } from '@maily-to/shared';
import type { Editor, Range } from '@tiptap/react';
import { posToDOMRect, ReactRenderer } from '@tiptap/react';
import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
} from '@tiptap/suggestion';

import { FLOATING_ELEMENT_PADDING } from '~/components/interface/floating-element';
import type { Variable } from '~/utils/variable';
import {
  VARIABLE_SUGGESTION_POPOVER_ID,
  filterVariableSuggestions,
} from '~/utils/variable';

import { VariableSuggestionList } from './variable-suggestion-list';

type VariableSuggestionListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

async function updatePosition(
  editor: Editor,
  element: HTMLElement,
  range: Range
) {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(editor.view, range.from, range.to),
  };

  const position = await computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip(), offset(FLOATING_ELEMENT_PADDING)],
  });

  element.style.width = 'max-content';
  element.style.position = position.strategy;
  element.style.left = `${position.x}px`;
  element.style.top = `${position.y}px`;
  element.style.zIndex = '9999';
}

export function getVariableSuggestions(
  char: string = DEFAULT_VARIABLE_START_TRIGGER
): Omit<SuggestionOptions<Variable>, 'editor'> {
  return {
    char,
    items: ({ query, editor }) => {
      const variables = editor.storage.variable?.variables;
      return filterVariableSuggestions(variables, { query, editor });
    },

    render: () => {
      let component: ReactRenderer<VariableSuggestionListRef> | null = null;

      return {
        onStart: async (props) => {
          const { editor, range } = props;
          const parentElement = editor.view.dom.parentElement;
          if (!parentElement) {
            return;
          }

          component = new ReactRenderer(VariableSuggestionList, {
            props,
            editor,
          });

          if (!props.clientRect) {
            return;
          }

          component.element.style.position = 'absolute';
          component.element.id = VARIABLE_SUGGESTION_POPOVER_ID;
          parentElement.appendChild(component.element);
          await updatePosition(editor, component.element, range);
        },

        onUpdate: async (props) => {
          const { editor, range } = props;
          if (!component) {
            return;
          }

          component.updateProps(props);
          if (!props.clientRect) {
            return;
          }

          await updatePosition(editor, component.element, range);
        },

        onKeyDown(props) {
          if (!component) {
            return false;
          }

          if (props.event.key === 'Escape') {
            component.destroy();
            return true;
          }

          return component.ref?.onKeyDown(props) ?? false;
        },

        onExit() {
          if (!component) {
            return;
          }

          component.element.remove();
          component.destroy();
        },
      };
    },
  };
}
