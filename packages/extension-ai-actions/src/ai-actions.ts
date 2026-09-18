import { MAILY_ERROR_PREFIX } from '@maily-to/shared';
import type { Editor, EditorEvents } from '@tiptap/core';
import { Decoration, Extension } from '@tiptap/core';

type AIActionsTransactionEvent = (event: EditorEvents['transaction']) => void;

/**
 * Transaction meta key used to tag stream-originated dispatches so the
 * `remapOnTransaction` listener can ignore them (they already account
 * for position changes).
 */
const AI_STREAM_TX = 'aiActionsStream';
export const AI_ACTIONS_PLUGIN_KEY = 'aiActions';

export type AIActionsRange = {
  /** Start of the text the running action is rewriting. */
  from: number;
  /** End of the text the running action is rewriting. */
  to: number;
};

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
      /** Clear the last failed AI action so its error stops showing. */
      dismissAIAction: () => ReturnType;
    };
  }
}

export type AIActionsTransformParams = {
  /** The action identifier passed to `runAIAction`. */
  action: string;
  /** The plain-text content of the current selection. */
  text: string;
};

export type AIActionsTransformContext = {
  /** The Tiptap editor instance. */
  editor: Editor;
  /** Abort signal — cancelled when `cancelAIAction` is called. */
  signal: AbortSignal;
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
  /** The name of the currently running action, or `null`. */
  activeAction: string | null;
  /** The name of the action that most recently failed, or `null`. */
  failedAction: string | null;
  /** The range the running action is rewriting, or `null`. */
  activeRange: AIActionsRange | null;
  /** `true` while an AI action is in flight. */
  isLoading: boolean;
};

declare module '@tiptap/core' {
  interface Storage {
    aiActions: AIActionsStorage;
  }
}

/**
 * Held per editor rather than per extension: an extension's config object is
 * built once and shared by every editor that registers it, so a closure here
 * would let one editor's teardown abort another's action.
 */
const abortControllers = new WeakMap<Editor, AbortController>();

function getLoadingWidget(action: string) {
  return () => {
    const wrapper = window.document.createElement('span');
    wrapper.setAttribute('data-mly-ai-loading-widget', '');
    wrapper.setAttribute('role', 'status');
    wrapper.contentEditable = 'false';

    const spinner = window.document.createElement('span');
    spinner.setAttribute('data-mly-ai-spinner', '');
    spinner.setAttribute('aria-hidden', 'true');

    const status = window.document.createElement('span');
    status.setAttribute('data-mly-visually-hidden', '');
    status.textContent = `Running ${action}`;
    Object.assign(status.style, {
      border: '0',
      clipPath: 'inset(50%)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: '0',
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: '1px',
    });

    wrapper.append(spinner, status);

    return wrapper;
  };
}

function abortInflight(editor: Editor) {
  const abortController = abortControllers.get(editor);
  if (abortController) {
    abortController.abort();
    abortControllers.delete(editor);
  }
}

export const AIActions: Extension<AIActionsOptions, AIActionsStorage> =
  Extension.create<AIActionsOptions, AIActionsStorage>({
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
        activeAction: null,
        activeRange: null,
        failedAction: null,
        isLoading: false,
      };
    },

    onDestroy() {
      abortInflight(this.editor);
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

            abortInflight(editor);
            const abortController = new AbortController();
            abortControllers.set(editor, abortController);
            const { signal } = abortController;

            this.storage.isLoading = true;
            this.storage.activeAction = action;
            this.storage.failedAction = null;
            this.storage.activeRange = { from, to };

            // Trigger a re-render so consumers see isLoading immediately.
            editor.view.dispatch(
              editor.view.state.tr.setMeta('addToHistory', false)
            );
            editor.commands.updateDecorations(this.name);

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

              const nextTo = currentFrom + text.length;
              this.storage.activeRange = { from: currentFrom, to: nextTo };

              const { tr } = editor.view.state;
              tr.insertText(text, currentFrom, currentTo);
              tr.setMeta('addToHistory', false);
              tr.setMeta(AI_STREAM_TX, true);
              editor.view.dispatch(tr);

              currentTo = nextTo;
            };

            this.options
              .transform(
                { action, text: selectedText },
                { editor, signal, write }
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
                  .insertContentAt({ from: currentFrom, to: currentTo }, result)
                  .run();
              })
              .catch((error: unknown) => {
                if (
                  error instanceof DOMException &&
                  error.name === 'AbortError'
                ) {
                  return;
                }

                this.storage.failedAction = action;

                console.error(
                  `${MAILY_ERROR_PREFIX}: AI action "${action}" failed.`,
                  error
                );
              })
              .finally(() => {
                editor.off('transaction', remapOnTransaction);

                this.storage.isLoading = false;
                this.storage.activeAction = null;
                this.storage.activeRange = null;

                // Dispatch no-op transaction to trigger React re-render.
                editor.view.dispatch(
                  editor.view.state.tr.setMeta('addToHistory', false)
                );
                editor.commands.updateDecorations(this.name);
              });

            return true;
          },

        cancelAIAction:
          () =>
          ({ dispatch, editor, tr }) => {
            abortInflight(editor);

            this.storage.isLoading = false;
            this.storage.activeAction = null;
            this.storage.failedAction = null;
            this.storage.activeRange = null;

            if (dispatch) {
              dispatch(tr.setMeta('addToHistory', false));
              editor.commands.updateDecorations(this.name);
            }

            return true;
          },

        dismissAIAction:
          () =>
          ({ dispatch, tr }) => {
            this.storage.failedAction = null;

            if (dispatch) {
              dispatch(tr.setMeta('addToHistory', false));
            }

            return true;
          },
      };
    },

    addDecorations() {
      return {
        create: () => {
          const { activeAction, activeRange } = this.storage;
          if (!(activeAction && activeRange)) {
            return [];
          }

          const { from, to } = activeRange;
          if (from >= to) {
            return [];
          }

          return [
            Decoration.Inline(from, to, { 'data-mly-ai-loading': '' }),
            Decoration.Widget(to, getLoadingWidget(activeAction), {
              key: `ai-loading-${activeAction}`,
              side: 1,
            }),
          ];
        },
      };
    },
  });
