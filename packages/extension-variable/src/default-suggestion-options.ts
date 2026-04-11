import { DEFAULT_VARIABLE_START_TRIGGER } from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import type { SuggestionOptions } from '@tiptap/suggestion';

/**
 * Arguments for the `getSuggestionOptions` function
 * @see getSuggestionOptions
 */
export type GetSuggestionOptionsConfig = {
  /**
   * The Tiptap editor instance.
   */
  editor: Editor;
  /**
   * The suggestion options configuration provided to the
   * Variable extension.
   */
  overrideSuggestionOptions: Omit<SuggestionOptions, 'editor'>;
  /**
   * The name of the Variable extension
   */
  extensionName: string;
  /**
   * The character that triggers the suggestion.
   * @default '{{'
   */
  char?: string;
  /**
   * Whether to scroll into view when the suggestion is selected.
   * @default false
   */
  shouldScrollIntoView?: boolean;
  /**
   * Whether to add a space suffix to the suggestion.
   * @default true
   */
  addSpaceSuffix?: boolean;
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
    editor: tiptapEditor,
    overrideSuggestionOptions,
    extensionName,
    char = DEFAULT_VARIABLE_START_TRIGGER,
    shouldScrollIntoView = false,
    addSpaceSuffix = true,
  } = options;
  const pluginKey = new PluginKey();

  return {
    editor: tiptapEditor,
    char,
    pluginKey,
    command: ({ editor, range, props }) => {
      // increase range.to by one when the next node is of type "text"
      // and starts with a space character
      const nodeAfter = editor.view.state.selection.$to.nodeAfter;
      const overrideSpace = nodeAfter?.text?.startsWith(' ');

      if (overrideSpace) {
        range.to += 1;
      }

      let chain = editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: extensionName,
            attrs: { ...props, variableSuggestionChar: char },
          },
          ...(addSpaceSuffix
            ? [
                {
                  type: 'text',
                  text: ' ',
                },
              ]
            : []),
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
    allow: ({ state, range }: { state: any; range: any }) => {
      const $from = state.doc.resolve(range.from);
      const type = state.schema.nodes[extensionName];
      const allow = !!$from.parent.type.contentMatch.matchType(type);

      return allow;
    },
    ...overrideSuggestionOptions,
  };
}
