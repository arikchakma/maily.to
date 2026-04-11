import { computePosition, flip, offset, shift } from '@floating-ui/react';
import type { Editor, Range } from '@tiptap/react';
import { posToDOMRect, ReactRenderer } from '@tiptap/react';
import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
} from '@tiptap/suggestion';

import type { SlashCommandGroupItem } from '~/utils/slash-command';
import {
  filterSlashCommands,
  SLASH_COMMAND_SUGGESTION_POPOVER_ID,
} from '~/utils/slash-command';

import { DEFAULT_SLASH_COMMANDS } from './default-slash-commands';
import { SlashCommandSuggestionList } from './slash-command-suggestion-list';

type SlashCommandSuggestionListRef = {
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
    middleware: [shift(), flip(), offset(8)],
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
    items: ({ query, editor }) => {
      const commands =
        editor.storage.slashCommand?.commands ?? DEFAULT_SLASH_COMMANDS;
      return filterSlashCommands({ groups: commands, query, editor });
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
            props,
            editor,
          });

          if (!props.clientRect) {
            return;
          }

          component.element.style.position = 'absolute';
          component.element.id = SLASH_COMMAND_SUGGESTION_POPOVER_ID;
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
