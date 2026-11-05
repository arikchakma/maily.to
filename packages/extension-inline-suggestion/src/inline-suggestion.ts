import { MAILY_ERROR_PREFIX } from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
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
   * Key that accepts/inserts the current suggestion.
   * @default "Tab"
   */
  acceptKey?: string;

  /**
   * Debounce time for fetching suggestions in milliseconds.
   * @default 250
   */
  debounceTime?: number;

  /**
   * Fetch inline suggestions.
   *
   * @param text - existing text in the current node
   * @param ctx - context with editor instance and abort signal
   * @returns the suggestion string to show
   */
  suggest: (text: string, ctx: SuggestContext) => Promise<string>;

  /**
   * Key that triggers fetching a suggestion.
   * Set to null to disable key-based triggering (use fetchSuggestion command manually).
   * @default " " (space)
   */
  triggerKey?: string | null;
};

export type InlineSuggestionStorage = {
  /** The suggestion text currently shown as a ghost decoration. */
  currentSuggestion?: string;
  /** Node range (`from`/`to`) where the decoration is rendered. */
  nodeDetails?: { from: number; to: number };
};

declare module '@tiptap/core' {
  interface Storage {
    inlineSuggestion: InlineSuggestionStorage;
  }
}

type InflightRequest = {
  abortController: AbortController | null;
  debounceTimer: ReturnType<typeof setTimeout> | null;
  /** Monotonic counter used to discard stale async responses. */
  requestVersion: number;
};

/**
 * Held per editor rather than per extension: an extension's config object is
 * built once and shared by every editor that registers it, so a closure here
 * would let one editor's teardown cancel another's in-flight request.
 */
const inflightRequests = new WeakMap<Editor, InflightRequest>();

function getInflightRequest(editor: Editor): InflightRequest {
  const existing = inflightRequests.get(editor);
  if (existing) {
    return existing;
  }

  const request: InflightRequest = {
    abortController: null,
    debounceTimer: null,
    requestVersion: 0,
  };
  inflightRequests.set(editor, request);

  return request;
}

function abortInflight(editor: Editor) {
  const request = getInflightRequest(editor);

  if (request.abortController) {
    request.abortController.abort();
    request.abortController = null;
  }

  if (request.debounceTimer) {
    clearTimeout(request.debounceTimer);
    request.debounceTimer = null;
  }
}

export const InlineSuggestion: Extension<
  InlineSuggestionOptions,
  InlineSuggestionStorage
> = Extension.create<InlineSuggestionOptions, InlineSuggestionStorage>({
  name: INLINE_SUGGESTION_PLUGIN_KEY,

  addOptions() {
    return {
      acceptKey: TAB_KEY,
      debounceTime: 250,
      suggest: async () => {
        console.warn(
          `${MAILY_ERROR_PREFIX}: You must provide a "suggest" function to the InlineSuggestion extension.`
        );

        return '';
      },
      triggerKey: SPACE_KEY,
    };
  },

  addStorage() {
    return {
      currentSuggestion: undefined,
      nodeDetails: undefined,
    };
  },

  onDestroy() {
    abortInflight(this.editor);
  },

  onSelectionUpdate({ editor }) {
    if (!this.storage.currentSuggestion) {
      return;
    }

    editor.commands.dismissSuggestion();
  },

  addCommands() {
    return {
      fetchSuggestion:
        () =>
        ({ editor }) => {
          abortInflight(editor);

          const request = getInflightRequest(editor);
          request.requestVersion += 1;
          const version = request.requestVersion;
          const debounceTime = this.options.debounceTime ?? 250;

          request.debounceTimer = setTimeout(() => {
            const { $from } = editor.state.selection;
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

            request.abortController = new AbortController();
            const { signal } = request.abortController;

            this.options
              .suggest(existingText, { editor, signal })
              .then((response) => {
                if (version !== request.requestVersion || signal.aborted) {
                  return;
                }

                const trimmed = response.replace(/^\s+/, '');
                if (!trimmed) {
                  return;
                }

                // Re-resolve positions from the current editor state
                // to avoid stale from/to captured before the async call.
                const { $from: currentFrom } = editor.state.selection;

                this.storage.currentSuggestion = trimmed;
                this.storage.nodeDetails = {
                  from: currentFrom.start() - 1,
                  to: currentFrom.end() + 1,
                };

                editor.view.dispatch(
                  editor.view.state.tr.setMeta('addToHistory', false)
                );
              })
              .catch((error: unknown) => {
                if (
                  error instanceof DOMException &&
                  error.name === 'AbortError'
                ) {
                  return;
                }

                console.error(
                  `${MAILY_ERROR_PREFIX}: Failed to fetch inline suggestion for "${existingText}".`,
                  error
                );
              });
          }, debounceTime);

          return true;
        },

      insertSuggestion:
        () =>
        ({ chain, editor }) => {
          const suggestion = this.storage.currentSuggestion;
          if (!suggestion) {
            return false;
          }

          abortInflight(editor);
          this.storage.currentSuggestion = undefined;
          this.storage.nodeDetails = undefined;

          return chain().insertContent(suggestion).run();
        },

      dismissSuggestion:
        () =>
        ({ dispatch, editor, tr }) => {
          if (!this.storage.currentSuggestion) {
            return false;
          }

          abortInflight(editor);
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
    const { editor, storage } = this;
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
            const hasSuggestion = Boolean(storage.currentSuggestion);

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
});
