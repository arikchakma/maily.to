import type { VariableAttributes } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  DEFAULT_VARIABLE_ATTRIBUTES,
  DEFAULT_VARIABLE_START_TRIGGER,
  MAILY_NODE_TYPES,
} from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import { mergeAttributes, Node } from '@tiptap/core';
import type { DOMOutputSpec, Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { SuggestionOptions } from '@tiptap/suggestion';
import { Suggestion } from '@tiptap/suggestion';

import { getSuggestionOptions } from './default-suggestion-options';
import { getMarksAt } from './marks';

/**
 * The attributes for a variable node. This is an alias for
 * `VariableAttributes` from `@maily-to/shared`.
 */
export type VariableNodeAttrs = VariableAttributes;

type RenderProps = {
  node: ProseMirrorNode;
  options: VariableOptions;
  suggestion: SuggestionOptions | null;
};

export type VariableOptions = {
  /** Whether to add a space suffix after an inserted variable. */
  addSpaceSuffix: boolean;
  /** Whether backspace deletes the trigger character with the node. */
  deleteTriggerWithBackspace: boolean;
  HTMLAttributes: Record<string, unknown>;
  renderHTML: (props: RenderProps) => DOMOutputSpec;
  renderText: (props: RenderProps) => string;
  shouldScrollIntoView: boolean;
  /**
   * The suggestion options, when you want to support only one trigger. To
   * support multiple triggers, use `suggestions` instead.
   */
  suggestion: Omit<SuggestionOptions, 'editor'>;
  /**
   * The suggestion options, when you want to support multiple triggers. For
   * example, `{{` to insert variables and `#` to insert tags.
   */
  suggestions: Array<Omit<SuggestionOptions, 'editor'>>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (attrs: VariableAttributes) => ReturnType;
    };
  }
}

type GetSuggestionsOptions = {
  editor?: Editor;
  name: string;
  options: VariableOptions;
};

function getSuggestions(options: GetSuggestionsOptions) {
  return (
    options.options.suggestions.length
      ? options.options.suggestions
      : [options.options.suggestion]
  ).map((suggestion) =>
    getSuggestionOptions({
      addSpaceSuffix: options.options.addSpaceSuffix,
      char: suggestion.char,
      editor: options.editor as Editor,
      extensionName: options.name,
      overrideSuggestionOptions: suggestion,
      shouldScrollIntoView: options.options.shouldScrollIntoView,
    })
  );
}

function getSuggestionFromChar(options: GetSuggestionsOptions, char: string) {
  const suggestions = getSuggestions(options);

  return (
    suggestions.find((item) => item.char === char) ?? suggestions[0] ?? null
  );
}

function getVariableLabel(
  node: ProseMirrorNode,
  suggestion: SuggestionOptions | null
) {
  const char = suggestion?.char ?? DEFAULT_VARIABLE_START_TRIGGER;

  return `${char}${node.attrs.label ?? node.attrs.id}`;
}

export const Variable: Node<VariableOptions> = Node.create<VariableOptions>({
  name: MAILY_NODE_TYPES.VARIABLE,
  priority: 101,
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  addOptions() {
    return {
      addSpaceSuffix: true,
      deleteTriggerWithBackspace: false,
      HTMLAttributes: {},
      renderHTML({ node, options, suggestion }) {
        return [
          'span',
          mergeAttributes(options.HTMLAttributes),
          getVariableLabel(node, suggestion),
        ];
      },
      renderText({ node, suggestion }) {
        return getVariableLabel(node, suggestion);
      },
      shouldScrollIntoView: false,
      suggestion: {},
      suggestions: [],
    };
  },

  addAttributes() {
    return {
      // No default: a variable without an id means nothing, and leaving it
      // fillable lets ProseMirror invent one to satisfy a `(inline)+` node
      // that the user just emptied.
      id: {
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) =>
          attributes.id ? { 'data-id': attributes.id } : {},
      },
      label: {
        default: DEFAULT_VARIABLE_ATTRIBUTES.label,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) =>
          attributes.label ? { 'data-label': attributes.label } : {},
      },
      // When there are multiple types of variables, this attribute helps
      // distinguish them
      variableSuggestionChar: {
        default: DEFAULT_VARIABLE_START_TRIGGER,
        parseHTML: (element) =>
          element.getAttribute('data-variable-suggestion-char') ??
          DEFAULT_VARIABLE_START_TRIGGER,
        renderHTML: (attributes) => ({
          'data-variable-suggestion-char': attributes.variableSuggestionChar,
        }),
      },
      fallback: {
        default: DEFAULT_VARIABLE_ATTRIBUTES.fallback,
        parseHTML: (element) => element.getAttribute('data-fallback'),
        renderHTML: (attributes) =>
          attributes.fallback ? { 'data-fallback': attributes.fallback } : {},
      },
      required: {
        default: DEFAULT_VARIABLE_ATTRIBUTES.required,
        parseHTML: (element) =>
          element.getAttribute('data-required') !== 'false',
        renderHTML: (attributes) => ({
          'data-required': String(attributes.required),
        }),
      },
      hideDefaultValue: {
        default: DEFAULT_VARIABLE_ATTRIBUTES.hideDefaultValue,
        parseHTML: (element) =>
          element.getAttribute('data-hide-default-value') === 'true',
        renderHTML: (attributes) => ({
          'data-hide-default-value': String(attributes.hideDefaultValue),
        }),
      },
    };
  },

  addCommands() {
    return {
      insertVariable:
        (attrs) =>
        ({ commands, state }) =>
          commands.insertContent({
            type: this.name,
            attrs,
            marks: getMarksAt({ pos: state.selection.from, state }),
          }),
    };
  },

  parseHTML() {
    return [{ tag: `span[${DATA_NODE_TYPE_KEY}="${this.name}"]` }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const options = {
      ...this.options,
      HTMLAttributes: mergeAttributes(
        { [DATA_NODE_TYPE_KEY]: this.name },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    };

    return this.options.renderHTML({
      node,
      options,
      suggestion: getSuggestionFromChar(
        this,
        node.attrs.variableSuggestionChar
      ),
    });
  },

  renderText({ node }) {
    return this.options.renderText({
      node,
      options: this.options,
      suggestion: getSuggestionFromChar(
        this,
        node.attrs.variableSuggestionChar
      ),
    });
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ state, tr }) => {
          const { anchor, empty } = state.selection;
          if (!empty) {
            return false;
          }

          let matched: ProseMirrorNode | null = null;
          let matchedPos = 0;

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              matched = node;
              matchedPos = pos;
              return false;
            }

            return true;
          });

          if (!matched) {
            return false;
          }

          const variableNode = matched as ProseMirrorNode;
          tr.insertText(
            this.options.deleteTriggerWithBackspace
              ? ''
              : variableNode.attrs.variableSuggestionChar,
            matchedPos,
            matchedPos + variableNode.nodeSize
          );

          return true;
        }),
    };
  },

  addProseMirrorPlugins() {
    return getSuggestions(this).map(Suggestion);
  },
});
