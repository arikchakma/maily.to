import type { VariableAttributes } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  DEFAULT_VARIABLE_START_TRIGGER,
  MAILY_ERROR_PREFIX,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import { mergeAttributes, Node } from '@tiptap/core';
import type { DOMOutputSpec, Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { SuggestionOptions } from '@tiptap/suggestion';
import { Suggestion } from '@tiptap/suggestion';

import { getSuggestionOptions } from './default-suggestion-options';

/**
 * The attributes for a variable node. This is an alias for
 * `VariableAttributes` from `@maily-to/shared`.
 */
export type VariableNodeAttrs = VariableAttributes;

export type VariableOptions<
  SuggestionItem = any,
  Attrs extends Record<string, any> = VariableNodeAttrs,
> = {
  /**
   * The HTML attributes for a variable node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>;

  /**
   * A function to render the label of a variable.
   * @deprecated use renderText and renderHTML instead
   * @param props The render props
   * @returns The label
   * @example ({ options, node }) => `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
   */
  renderLabel?: (props: {
    options: VariableOptions<SuggestionItem, Attrs>;
    node: ProseMirrorNode;
    suggestion: SuggestionOptions | null;
  }) => string;

  /**
   * A function to render the text of a variable.
   * @param props The render props
   * @returns The text
   * @example ({ options, node }) => `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
   */
  renderText: (props: {
    options: VariableOptions<SuggestionItem, Attrs>;
    node: ProseMirrorNode;
    suggestion: SuggestionOptions | null;
  }) => string;

  /**
   * A function to render the HTML of a variable.
   * @param props The render props
   * @returns The HTML as a ProseMirror DOM Output Spec
   * @example ({ options, node }) => ['span', { [DATA_NODE_TYPE_KEY]: 'variable' }, `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`]
   */
  renderHTML: (props: {
    options: VariableOptions<SuggestionItem, Attrs>;
    node: ProseMirrorNode;
    suggestion: SuggestionOptions | null;
  }) => DOMOutputSpec;

  /**
   * Whether to delete the trigger character with backspace.
   * @default false
   */
  deleteTriggerWithBackspace: boolean;

  /**
   * The suggestion options, when you want to support multiple triggers.
   *
   * With this parameter, you can define multiple types of variable triggers. For example, you can use the `{{`
   * character to insert variables and the `#` character to insert tags.
   *
   * @default [{ char: '{{', pluginKey: VariablePluginKey }]
   * @example [{ char: '{{', pluginKey: VariablePluginKey }, { char: '#', pluginKey: new PluginKey('hashtag') }]
   */
  suggestions: Array<Omit<SuggestionOptions<SuggestionItem, Attrs>, 'editor'>>;

  /**
   * The suggestion options, when you want to support only one trigger. To support multiple triggers, use the
   * `suggestions` parameter instead.
   *
   * @default {}
   * @example { char: '@', pluginKey: VariablePluginKey, command: ({ editor, range, props }) => { ... } }
   */
  suggestion: Omit<SuggestionOptions<SuggestionItem, Attrs>, 'editor'>;

  shouldScrollIntoView: boolean;
  addSpaceSuffix: boolean;

  /**
   * Disable input is the boolean that will be used to disable the input of the variable
   * when the variable is selected.
   * @default false
   */
  disableInput: boolean;
};

type GetSuggestionsOptions = {
  editor?: Editor;
  options: VariableOptions;
  name: string;
};

/**
 * Returns the suggestions for the variable extension.
 *
 * @param options The extension options
 * @returns the suggestions
 */
function getSuggestions(options: GetSuggestionsOptions) {
  return (
    options.options.suggestions.length
      ? options.options.suggestions
      : [options.options.suggestion]
  ).map((suggestion) =>
    getSuggestionOptions({
      // @ts-expect-error `editor` can be `undefined` when converting the document to HTML with the HTML utility
      editor: options.editor,
      overrideSuggestionOptions: suggestion,
      extensionName: options.name,
      char: suggestion.char,
      shouldScrollIntoView: options.options.shouldScrollIntoView,
      addSpaceSuffix: options.options.addSpaceSuffix,
    })
  );
}

/**
 * Returns the suggestion options of the variable that has a given character trigger. If not
 * found, it returns the first suggestion.
 *
 * @param options The extension options
 * @param char The character that triggers the variable
 * @returns The suggestion options
 */
function getSuggestionFromChar(options: GetSuggestionsOptions, char: string) {
  const suggestions = getSuggestions(options);

  const suggestion = suggestions.find((s) => s.char === char);
  if (suggestion) {
    return suggestion;
  }

  if (suggestions.length) {
    return suggestions[0];
  }

  return null;
}

export const Variable: Node<VariableOptions> = Node.create<VariableOptions>({
  name: 'variable',

  priority: 101,

  addOptions() {
    return {
      HTMLAttributes: {},
      renderText({ node, suggestion }) {
        return `${suggestion?.char ?? DEFAULT_VARIABLE_START_TRIGGER}${node.attrs.label ?? node.attrs.id}`;
      },
      deleteTriggerWithBackspace: false,
      renderHTML({ options, node, suggestion }) {
        return [
          'span',
          mergeAttributes(this.HTMLAttributes, options.HTMLAttributes),
          `${suggestion?.char ?? DEFAULT_VARIABLE_START_TRIGGER}${node.attrs.label ?? node.attrs.id}`,
        ];
      },
      suggestions: [],
      suggestion: {},
      shouldScrollIntoView: false,
      addSpaceSuffix: true,
      disableInput: false,
    };
  },

  group: 'inline',

  inline: true,

  selectable: true,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            'data-id': attributes.id,
          };
        },
      },

      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            'data-label': attributes.label,
          };
        },
      },

      // When there are multiple types of variables, this attribute helps distinguish them
      variableSuggestionChar: {
        default: DEFAULT_VARIABLE_START_TRIGGER,
        parseHTML: (element) =>
          element.getAttribute('data-variable-suggestion-char'),
        renderHTML: (attributes) => {
          return {
            'data-variable-suggestion-char': attributes.variableSuggestionChar,
          };
        },
      },

      fallback: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-fallback'),
        renderHTML: (attributes) => {
          if (!attributes.fallback) {
            return {};
          }

          return {
            'data-fallback': attributes.fallback,
          };
        },
      },

      required: {
        default: true,
        parseHTML: (element) => {
          const value = element.getAttribute('data-required');
          if (value === null) {
            return true;
          }

          return value === 'true';
        },
        renderHTML: (attributes) => {
          return {
            'data-required': String(attributes.required),
          };
        },
      },

      hideDefaultValue: {
        default: false,
        parseHTML: (element) => {
          const value = element.getAttribute('data-hide-default-value');
          if (value === null) {
            return false;
          }

          return value === 'true';
        },
        renderHTML: (attributes) => {
          return {
            'data-hide-default-value': String(attributes.hideDefaultValue),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `span[${DATA_NODE_TYPE_KEY}="${this.name}"]`,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const suggestion = getSuggestionFromChar(
      this,
      node.attrs.variableSuggestionChar
    );

    if (this.options.renderLabel !== undefined) {
      console.warn(
        `${MAILY_ERROR_PREFIX}: "renderLabel" is deprecated use "renderText" and "renderHTML" instead`
      );
      return [
        'span',
        mergeAttributes(
          { [DATA_NODE_TYPE_KEY]: this.name },
          this.options.HTMLAttributes,
          HTMLAttributes
        ),
        this.options.renderLabel({
          options: this.options,
          node,
          suggestion,
        }),
      ];
    }
    const mergedOptions = { ...this.options };

    mergedOptions.HTMLAttributes = mergeAttributes(
      { [DATA_NODE_TYPE_KEY]: this.name },
      this.options.HTMLAttributes,
      HTMLAttributes
    );

    const html = this.options.renderHTML({
      options: mergedOptions,
      node,
      suggestion,
    });

    if (typeof html === 'string') {
      return [
        'span',
        mergeAttributes(
          { [DATA_NODE_TYPE_KEY]: this.name },
          this.options.HTMLAttributes,
          HTMLAttributes
        ),
        html,
      ];
    }
    return html;
  },

  renderText({ node }) {
    const args = {
      options: this.options,
      node,
      suggestion: getSuggestionFromChar(
        this,
        node.attrs.variableSuggestionChar
      ),
    };
    if (this.options.renderLabel !== undefined) {
      console.warn(
        `${MAILY_ERROR_PREFIX}: "renderLabel" is deprecated use "renderText" and "renderHTML" instead`
      );
      return this.options.renderLabel(args);
    }

    return this.options.renderText(args);
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          let variableNode: ProseMirrorNode | null = null;
          let variablePos = 0;

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              variableNode = node;
              variablePos = pos;
              return false;
            }
          });

          if (!variableNode) {
            return false;
          }

          const matchedNode = variableNode as ProseMirrorNode;
          tr.insertText(
            this.options.deleteTriggerWithBackspace
              ? ''
              : matchedNode.attrs.variableSuggestionChar,
            variablePos,
            variablePos + matchedNode.nodeSize
          );

          return true;
        }),
    };
  },

  addProseMirrorPlugins() {
    return getSuggestions(this).map(Suggestion);
  },
});
