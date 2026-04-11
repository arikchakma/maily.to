import { MAILY_ERROR_PREFIX } from '@maily-to/shared';
import { Extension } from '@tiptap/core';
import type { Editor, EditorEvents } from '@tiptap/core';

type AIActionsTransactionEvent = (event: EditorEvents['transaction']) => void;

/**
 * Transaction meta key used to tag stream-originated dispatches so the
 * `remapOnTransaction` listener can ignore them (they already account
 * for position changes).
 */
const AI_STREAM_TX = 'aiActionsStream';
export const AI_ACTIONS_PLUGIN_KEY = 'aiActions';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiActions: {
      /**
       * Run a named AI action on the current text selection.
       * The action string is forwarded to the user-provided `transform`
       * callback so it can decide which prompt / model to use.
       */
      runAIAction: (action: string) => ReturnType;
      /** Abort any in-flight AI action and reset loading state. */
      cancelAIAction: () => ReturnType;
    };
  }
}

export type AIActionsTransformParams = {
  /** The plain-text content of the current selection. */
  text: string;
  /** The action identifier passed to `runAIAction`. */
  action: string;
};

export type AIActionsTransformContext = {
  /** Abort signal — cancelled when `cancelAIAction` is called. */
  signal: AbortSignal;
  /** The Tiptap editor instance. */
  editor: Editor;
  /**
   * Streaming callback — call with the **full accumulated text so far**
   * to progressively replace the original selection. Each call replaces
   * the entire range, so always pass the complete text, not a delta.
   */
  write: (text: string) => void;
};

export type AIActionsOptions = {
  /**
   * Transform the selected text using an AI action.
   *
   * @param params - the selected text and action name
   * @param ctx - context with editor instance, abort signal, and
   *   streaming `write` callback
   *
   * **Return value:**
   * - Return a `string` to replace the selection in one shot.
   * - Return `void` / `undefined` if you used `write()` for streaming
   *   (the last `write()` value is used as the final text).
   */
  transform: (
    params: AIActionsTransformParams,
    ctx: AIActionsTransformContext
  ) => Promise<string | void>;
};

export type AIActionsStorage = {
  /** `true` while an AI action is in flight. */
  isLoading: boolean;
  /** The name of the currently running action, or `null`. */
  activeAction: string | null;
};

declare module '@tiptap/core' {
  interface ExtensionStorage {
    aiActions: AIActionsStorage;
  }
}

export const AIActions: Extension<AIActionsOptions, AIActionsStorage> =
  Extension.create<AIActionsOptions, AIActionsStorage>(() => {
    let abortController: AbortController | null = null;

    function abortInflight() {
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
    }

    return {
      name: AI_ACTIONS_PLUGIN_KEY,

      addOptions() {
        return {
          transform: async () => {
            console.warn(
              `${MAILY_ERROR_PREFIX}: You must provide a "transform" function to the AIActions extension.`
            );
            return '';
          },
        };
      },

      addStorage() {
        return {
          isLoading: false,
          activeAction: null,
        };
      },

      onDestroy() {
        abortInflight();
      },

      addCommands() {
        return {
          runAIAction:
            (action: string) =>
            ({ editor }) => {
              if (this.storage.isLoading) {
                return false;
              }

              const { from, to } = editor.state.selection;
              const selectedText = editor.state.doc.textBetween(from, to, ' ');

              if (!selectedText) {
                return false;
              }

              abortInflight();
              abortController = new AbortController();
              const { signal } = abortController;

              this.storage.isLoading = true;
              this.storage.activeAction = action;

              // Trigger a re-render so consumers see isLoading immediately.
              editor.view.dispatch(
                editor.view.state.tr.setMeta('addToHistory', false)
              );

              let currentFrom = from;
              let currentTo = to;
              let streamCalled = false;
              let lastWrittenText = '';

              // Keep `currentFrom` / `currentTo` in sync with external
              // transactions (e.g. collaborative edits) that shift positions.
              const remapOnTransaction: AIActionsTransactionEvent = (event) => {
                const { transaction } = event;

                if (
                  transaction.getMeta(AI_STREAM_TX) ||
                  !transaction.docChanged
                ) {
                  return;
                }

                currentFrom = transaction.mapping.map(currentFrom);
                currentTo = transaction.mapping.map(currentTo);
              };

              editor.on('transaction', remapOnTransaction);

              const write = (text: string) => {
                if (signal.aborted || !text) {
                  return;
                }

                streamCalled = true;
                lastWrittenText = text;

                const { tr } = editor.view.state;
                tr.insertText(text, currentFrom, currentTo);
                tr.setMeta('addToHistory', false);
                tr.setMeta(AI_STREAM_TX, true);
                editor.view.dispatch(tr);

                currentTo = currentFrom + text.length;
              };

              this.options
                .transform(
                  { text: selectedText, action },
                  { signal, editor, write }
                )
                .then((result) => {
                  if (signal.aborted) {
                    return;
                  }

                  // -- Streaming path --
                  if (streamCalled) {
                    const finalText =
                      typeof result === 'string' ? result : lastWrittenText;

                    if (!finalText) {
                      editor.commands.focus();
                      return;
                    }

                    // Restore the original text (without history) so the
                    // next transaction records "original → final" for undo.
                    const restoreTr = editor.view.state.tr;
                    restoreTr.insertText(selectedText, currentFrom, currentTo);
                    restoreTr.setMeta('addToHistory', false);
                    restoreTr.setMeta(AI_STREAM_TX, true);
                    editor.view.dispatch(restoreTr);

                    // Replace original with final result — this is the
                    // single history entry, so undo restores the original.
                    const restoredTo = currentFrom + selectedText.length;
                    editor
                      .chain()
                      .focus()
                      .insertContentAt(
                        { from: currentFrom, to: restoredTo },
                        finalText
                      )
                      .run();
                    return;
                  }

                  // -- One-shot path (no streaming) --
                  if (!result) {
                    return;
                  }

                  editor
                    .chain()
                    .focus()
                    .insertContentAt(
                      { from: currentFrom, to: currentTo },
                      result
                    )
                    .run();
                })
                .catch((err: unknown) => {
                  if (
                    err instanceof DOMException &&
                    err.name === 'AbortError'
                  ) {
                    return;
                  }
                  console.error(
                    `${MAILY_ERROR_PREFIX}: AI action "${action}" failed.`,
                    err
                  );
                })
                .finally(() => {
                  editor.off('transaction', remapOnTransaction);

                  this.storage.isLoading = false;
                  this.storage.activeAction = null;

                  // Dispatch no-op transaction to trigger React re-render.
                  editor.view.dispatch(
                    editor.view.state.tr.setMeta('addToHistory', false)
                  );
                });

              return true;
            },

          cancelAIAction:
            () =>
            ({ tr, dispatch }) => {
              abortInflight();

              this.storage.isLoading = false;
              this.storage.activeAction = null;

              if (dispatch) {
                dispatch(tr.setMeta('addToHistory', false));
              }

              return true;
            },
        };
      },
    };
  });
