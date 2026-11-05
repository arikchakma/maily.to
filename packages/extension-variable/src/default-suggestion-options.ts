import { DEFAULT_VARIABLE_START_TRIGGER } from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import type { SuggestionOptions } from '@tiptap/suggestion';

import { getMarksAt } from './marks';

export type GetSuggestionOptionsConfig = {
  /** Whether to add a space suffix to the suggestion. */
  addSpaceSuffix?: boolean;
  /** The character that triggers the suggestion. */
  char?: string;
  editor: Editor;
  /** The name of the Variable extension. */
  extensionName: string;
  overrideSuggestionOptions: Omit<SuggestionOptions, 'editor'>;
  /** Whether to scroll into view when the suggestion is selected. */
  shouldScrollIntoView?: boolean;
};

/**
 * Returns the suggestion options for a trigger of the Variable extension. These
 * options are used to create a `Suggestion` ProseMirror plugin. Each plugin lets
 * you define a different trigger that opens the variable menu. For example,
 * you can define a `{{` trigger to insert variables and a `#` trigger to insert
 * tags.
 */
export function getSuggestionOptions(
  options: GetSuggestionOptionsConfig
): SuggestionOptions {
  const {
    addSpaceSuffix = true,
    char = DEFAULT_VARIABLE_START_TRIGGER,
    editor: tiptapEditor,
    extensionName,
    overrideSuggestionOptions,
    shouldScrollIntoView = false,
  } = options;

  return {
    editor: tiptapEditor,
    char,
    pluginKey: new PluginKey(`variable-${char}`),
    command: ({ editor, props, range }) => {
      // increase range.to by one when the next node is of type "text"
      // and starts with a space character
      const nodeAfter = editor.view.state.selection.$to.nodeAfter;
      if (nodeAfter?.text?.startsWith(' ')) {
        range.to += 1;
      }

      const marks = getMarksAt({ pos: range.from, state: editor.view.state });

      let chain = editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: extensionName,
            attrs: { ...props, variableSuggestionChar: char },
            marks,
          },
          ...(addSpaceSuffix ? [{ type: 'text', text: ' ', marks }] : []),
        ]);

      if (shouldScrollIntoView) {
        chain = chain.scrollIntoView();
      }

      chain.run();

      // get reference to `window` object from editor element, to support cross-frame JS usage
      editor.view.dom.ownerDocument.defaultView
        ?.getSelection()
        ?.collapseToEnd();
    },
    allow: ({ range, state }) => {
      const $from = state.doc.resolve(range.from);

      return !!$from.parent.type.contentMatch.matchType(
        state.schema.nodes[extensionName]
      );
    },
    ...overrideSuggestionOptions,
  };
}
