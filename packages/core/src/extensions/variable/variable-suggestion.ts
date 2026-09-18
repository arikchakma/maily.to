import { computePosition, flip, offset, shift } from '@floating-ui/react';
import { DEFAULT_VARIABLE_START_TRIGGER } from '@maily-to/shared';
import type { Editor, Range } from '@tiptap/react';
import { posToDOMRect, ReactRenderer } from '@tiptap/react';
import type { SuggestionOptions } from '@tiptap/suggestion';

import { FLOATING_ELEMENT_PADDING } from '~/components/interface/floating-element';
import type { Variable } from '~/utils/variable';
import {
  filterVariableSuggestions,
  VARIABLE_SUGGESTION_POPOVER_ID,
} from '~/utils/variable';

import type { VariableSuggestionListRef } from './variable-suggestion-list';
import { VariableSuggestionList } from './variable-suggestion-list';

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
    items: ({ editor, query }) =>
      filterVariableSuggestions(editor.storage.variable?.variables, {
        editor,
        query,
      }),

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
            editor,
            props,
          });

          if (!props.clientRect) {
            return;
          }

          component.element.style.position = 'absolute';
          component.element.id = VARIABLE_SUGGESTION_POPOVER_ID;
          parentElement.append(component.element);
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
