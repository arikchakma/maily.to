import { computePosition, flip, offset, shift } from '@floating-ui/react';
import type { Editor, Range } from '@tiptap/react';
import { posToDOMRect, ReactRenderer } from '@tiptap/react';
import type { SuggestionOptions } from '@tiptap/suggestion';

import { FLOATING_ELEMENT_PADDING } from '~/components/interface/floating-element';
import type { SlashCommandGroupItem } from '~/utils/slash-command';
import {
  filterSlashCommands,
  SLASH_COMMAND_SUGGESTION_POPOVER_ID,
} from '~/utils/slash-command';

import type { SlashCommandSuggestionListRef } from './slash-command-suggestion-list';
import { SlashCommandSuggestionList } from './slash-command-suggestion-list';

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

export function getSlashCommandSuggestions(): Omit<
  SuggestionOptions<SlashCommandGroupItem>,
  'editor'
> {
  return {
    char: '/',

    items: ({ editor, query }) =>
      filterSlashCommands({
        editor,
        groups: editor.storage.slashCommand?.commands ?? [],
        query,
      }),

    command: ({ editor, props, range }) => {
      (props as unknown as { command: (opts: unknown) => void }).command({
        editor,
        range,
      });
    },

    render: () => {
      let component: ReactRenderer<SlashCommandSuggestionListRef> | null = null;

      return {
        onStart: async (props) => {
          const { editor, range } = props;
          const parentElement = editor.view.dom.parentElement;
          if (!parentElement) {
            return;
          }

          component = new ReactRenderer(SlashCommandSuggestionList, {
            editor,
            props,
          });

          if (!props.clientRect) {
            return;
          }

          component.element.style.position = 'absolute';
          component.element.id = SLASH_COMMAND_SUGGESTION_POPOVER_ID;
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
