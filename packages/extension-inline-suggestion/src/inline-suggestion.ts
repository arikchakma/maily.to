import { MAILY_ERROR_PREFIX } from '@maily-to/shared';
import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

const ESCAPE_KEY = 'Escape';
const SPACE_KEY = ' ';
const TAB_KEY = 'Tab';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    inlineSuggestion: {
      /** Debounce-fetch a suggestion for the current node's text. */
      fetchSuggestion: () => ReturnType;
      /** Accept and insert the current suggestion into the document. */
      insertSuggestion: () => ReturnType;
      /** Dismiss the current suggestion without inserting it. */
      dismissSuggestion: () => ReturnType;
    };
  }
}

const INLINE_SUGGESTION_PLUGIN_KEY = 'inlineSuggestion';
export const inlineSuggestionPluginKey: PluginKey = new PluginKey(
  INLINE_SUGGESTION_PLUGIN_KEY
);

export type SuggestContext = {
  /** The Tiptap editor instance. */
  editor: Editor;
  /** Abort signal — cancelled when a newer request supersedes this one. */
  signal: AbortSignal;
};

export type InlineSuggestionOptions = {
  /**
   * Fetch inline suggestions.
   *
   * @param text - existing text in the current node
   * @param ctx - context with editor instance and abort signal
   * @returns the suggestion string to show
   */
  suggest: (text: string, ctx: SuggestContext) => Promise<string>;

  /**
   * Debounce time for fetching suggestions in milliseconds.
   * @default 250
   */
  debounceTime?: number;

  /**
   * Key that triggers fetching a suggestion.
   * Set to null to disable key-based triggering (use fetchSuggestion command manually).
   * @default " " (space)
   */
  triggerKey?: string | null;

  /**
   * Key that accepts/inserts the current suggestion.
   * @default "Tab"
   */
  acceptKey?: string;
};

export type InlineSuggestionStorage = {
  /** The suggestion text currently shown as a ghost decoration. */
  currentSuggestion?: string;
  /** Node range (`from`/`to`) where the decoration is rendered. */
  nodeDetails?: { from: number; to: number };
};

declare module '@tiptap/core' {
  interface ExtensionStorage {
    inlineSuggestion: InlineSuggestionStorage;
  }
}

export const InlineSuggestion: Extension<
  InlineSuggestionOptions,
  InlineSuggestionStorage
> = Extension.create<InlineSuggestionOptions, InlineSuggestionStorage>(() => {
  // Monotonic counter used to discard stale async responses.
  let requestVersion = 0;
  let abortController: AbortController | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function abortInflight() {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  }

  return {
    name: INLINE_SUGGESTION_PLUGIN_KEY,

    addOptions() {
      return {
        suggest: async () => {
          console.warn(
            `${MAILY_ERROR_PREFIX}: You must provide a "suggest" function to the InlineSuggestion extension.`
          );
          return '';
        },
        debounceTime: 250,
        triggerKey: SPACE_KEY,
        acceptKey: TAB_KEY,
      };
    },

    addStorage() {
      return {
        currentSuggestion: undefined,
        nodeDetails: undefined,
      };
    },

    onDestroy() {
      abortInflight();
    },

    onSelectionUpdate({ editor }) {
      const { currentSuggestion } = this.storage;
      if (!currentSuggestion) {
        return;
      }

      editor.commands.dismissSuggestion();
      return;
    },

    addCommands() {
      return {
        fetchSuggestion:
          () =>
          ({ editor }) => {
            abortInflight();

            const version = ++requestVersion;
            const debounceMs = this.options.debounceTime ?? 250;

            debounceTimer = setTimeout(() => {
              const { state } = editor;
              const { $from } = state.selection;
              const node = $from.parent;
              const existingText = node.textContent;

              if (!existingText) {
                return;
              }

              // Only suggest when the cursor is at the end of the node
              // (no text or inline content after the cursor).
              if ($from.parentOffset < node.content.size) {
                return;
              }

              abortController = new AbortController();
              const { signal } = abortController;

              this.options
                .suggest(existingText, { editor, signal })
                .then((response) => {
                  if (version !== requestVersion || signal.aborted) {
                    return;
                  }

                  const trimmed = response.replace(/^\s+/, '');
                  if (!trimmed) {
                    return;
                  }

                  // Re-resolve positions from the current editor state
                  // to avoid stale from/to captured before the async call.
                  const { $from: current$from } = editor.state.selection;
                  const freshFrom = current$from.start() - 1;
                  const freshTo = current$from.end() + 1;

                  this.storage.currentSuggestion = trimmed;
                  this.storage.nodeDetails = {
                    from: freshFrom,
                    to: freshTo,
                  };

                  editor.view.dispatch(
                    editor.view.state.tr.setMeta('addToHistory', false)
                  );
                })
                .catch((err: unknown) => {
                  if (
                    err instanceof DOMException &&
                    err.name === 'AbortError'
                  ) {
                    return;
                  }
                  console.error(
                    `${MAILY_ERROR_PREFIX}: Failed to fetch inline suggestion for "${existingText}".`,
                    err
                  );
                });
            }, debounceMs);

            return true;
          },

        insertSuggestion:
          () =>
          ({ chain }) => {
            const suggestion = this.storage.currentSuggestion;
            if (!suggestion) {
              return false;
            }

            abortInflight();
            this.storage.currentSuggestion = undefined;
            this.storage.nodeDetails = undefined;

            return chain().insertContent(suggestion).run();
          },

        dismissSuggestion:
          () =>
          ({ tr, dispatch }) => {
            if (!this.storage.currentSuggestion) {
              return false;
            }

            abortInflight();
            this.storage.currentSuggestion = undefined;
            this.storage.nodeDetails = undefined;

            if (dispatch) {
              dispatch(tr.setMeta('addToHistory', false));
            }

            return true;
          },
      };
    },

    addProseMirrorPlugins() {
      const { storage, editor } = this;
      const acceptKey = this.options.acceptKey ?? TAB_KEY;
      const triggerKey = this.options.triggerKey;

      // Identity-check cache to short-circuit `apply` when storage is unchanged.
      let lastData: InlineSuggestionStorage = {
        currentSuggestion: undefined,
        nodeDetails: undefined,
      };

      return [
        new Plugin({
          key: inlineSuggestionPluginKey,

          state: {
            init() {
              return DecorationSet.empty;
            },

            apply(tr, oldDecorations) {
              const { currentSuggestion, nodeDetails } = storage;

              if (
                currentSuggestion === lastData.currentSuggestion &&
                nodeDetails === lastData.nodeDetails
              ) {
                return oldDecorations.map(tr.mapping, tr.doc);
              }

              lastData = { currentSuggestion, nodeDetails };

              if (currentSuggestion && nodeDetails) {
                const { from, to } = nodeDetails;
                if (from < 0 || to > tr.doc.content.size || from >= to) {
                  return DecorationSet.empty;
                }

                const decoration = Decoration.node(from, to, {
                  'data-inline-suggestion': currentSuggestion,
                });

                return DecorationSet.create(tr.doc, [decoration]);
              }

              return DecorationSet.empty;
            },
          },

          props: {
            decorations(state) {
              return this.getState(state);
            },

            handleKeyDown(_view, event) {
              const hasSuggestion = !!storage.currentSuggestion;

              if (event.key === acceptKey && hasSuggestion) {
                event.preventDefault();
                event.stopPropagation();
                editor.commands.insertSuggestion();
                return true;
              }

              if (event.key === ESCAPE_KEY && hasSuggestion) {
                editor.commands.dismissSuggestion();
                return true;
              }

              if (hasSuggestion) {
                editor.commands.dismissSuggestion();
              }

              if (triggerKey !== null && event.key === triggerKey) {
                requestAnimationFrame(() => {
                  editor.commands.fetchSuggestion();
                });
              }

              return false;
            },
          },
        }),
      ];
    },
  };
});
