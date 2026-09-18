import type { AIActionsOptions } from '@maily-to/extension-ai-actions';
import { AIActions } from '@maily-to/extension-ai-actions';
import { waitFor } from '@testing-library/react';
import type { Editor as TiptapEditor } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getDocument } from '#test-utils';
import { TextBubbleMenu } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Hello world' }],
  },
]);

const HELLO_SELECTION = { from: 3, to: 8 };

type MountOptions = {
  transform: AIActionsOptions['transform'] | undefined;
  withMenu?: boolean;
};

type EndConditionCase = {
  name: string;
  reach: () => Promise<TiptapEditor>;
  then?: (editor: TiptapEditor) => Promise<void>;
};

type FailureLabelCase = {
  action: string;
  label: string;
  name: string;
};

type FailureClearingCase = {
  clear: () => Promise<TiptapEditor>;
  name: string;
};

function getTrimmedText(editor: TiptapEditor) {
  return editor.getText().trim();
}

async function findLoading() {
  return waitFor(() => {
    const found = document.querySelector<HTMLElement>('[data-mly-ai-loading]');
    expect(found).not.toBeNull();
    return found!;
  });
}

async function findAlert() {
  return waitFor(() => {
    const found = document.querySelector<HTMLElement>('[data-mly-ai-error]');
    expect(found).not.toBeNull();
    return found!;
  });
}

function getSpinnerStatus() {
  return {
    spinner: document.querySelector('[data-mly-ai-spinner]') !== null,
    status: document.querySelector('[role="status"]')?.textContent,
  };
}

function getTrigger() {
  return document.querySelector<HTMLElement>(
    '[data-mly-bubble-button][aria-label="AI Actions"]'
  );
}

async function findTrigger() {
  return waitFor(() => {
    const found = getTrigger();
    expect(found).not.toBeNull();
    return found!;
  });
}

async function openDropdown() {
  await userEvent.click(await findTrigger());

  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-dropdown-menu]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

describe('<AIActions />', () => {
  const { render } = createRenderer();

  const mountEditor = async (options: MountOptions) => {
    const { transform, withMenu } = options;

    const { ref } = await render({
      children: withMenu ? <TextBubbleMenu /> : null,
      content: DOCUMENT,
      extensions: transform ? [AIActions.configure({ transform })] : [],
    });

    const editor = ref.current!.getEditor();
    editor.commands.setTextSelection(HELLO_SELECTION);

    return editor;
  };

  describe('running an action', () => {
    it('replaces the selection with what the transform returns', async () => {
      const editor = await mountEditor({
        transform: async (params) => {
          return params.text.toUpperCase();
        },
      });

      expect(editor.commands.runAIAction('shout')).toBe(true);

      await waitFor(() => {
        expect(getTrimmedText(editor)).toBe('HELLO world');
      });
    });

    it('does nothing without a selection', async () => {
      const editor = await mountEditor({
        transform: async () => {
          return 'never';
        },
      });

      editor.commands.setTextSelection(3);

      expect(editor.commands.runAIAction('shout')).toBe(false);
    });

    it('announces the action while it runs', async () => {
      const editor = await mountEditor({
        transform: () => {
          return new Promise(() => undefined);
        },
        withMenu: true,
      });

      await waitFor(() => {
        expect(
          document.querySelector('[data-mly-bubble-button][data-variant="ai"]')
        ).not.toBeNull();
      });

      editor.commands.runAIAction('rewrite');

      await waitFor(() => {
        const status = document.querySelector('[role="status"]');
        expect(status?.textContent).toBe('Running rewrite');
      });

      editor.commands.cancelAIAction();

      await waitFor(() => {
        expect(document.querySelector('[role="status"]')).toBeNull();
      });
    });
  });

  describe('streaming', () => {
    it('streams through write and undoes back to the original text', async () => {
      const editor = await mountEditor({
        transform: async (_params, ctx) => {
          await Promise.resolve();
          ctx.write('One');
          ctx.write('One two');
        },
      });

      editor.commands.runAIAction('rewrite');

      await waitFor(() => {
        expect(getTrimmedText(editor)).toBe('One two world');
      });

      editor.commands.undo();

      expect(getTrimmedText(editor)).toBe('Hello world');
    });

    it('follows the text as the stream extends it', async () => {
      let write: ((text: string) => void) | undefined;
      const editor = await mountEditor({
        transform: (_params, ctx) => {
          write = ctx.write;

          return new Promise(() => undefined);
        },
      });

      editor.commands.runAIAction('rewrite');

      write!('One');

      const loading = await findLoading();

      expect({
        ...getSpinnerStatus(),
        text: loading.textContent,
      }).toEqual({ spinner: true, status: 'Running rewrite', text: 'One' });

      const spinner = document.querySelector('[data-mly-ai-spinner]');

      write!('One two three');

      await waitFor(() => {
        expect(
          document.querySelector('[data-mly-ai-loading]')?.textContent
        ).toBe('One two three');
      });

      expect({
        remounted: document.querySelector('[data-mly-ai-spinner]') !== spinner,
        text: getTrimmedText(editor),
      }).toEqual({ remounted: false, text: 'One two three world' });
    });
  });

  describe('the loading decoration', () => {
    const END_CONDITIONS: EndConditionCase[] = [
      {
        name: 'clears once the action lands',
        reach: async () => {
          const editor = await mountEditor({
            transform: async (_params, ctx) => {
              await Promise.resolve();
              ctx.write('One');
            },
          });

          editor.commands.runAIAction('rewrite');

          await findLoading();

          await waitFor(() => {
            expect(getTrimmedText(editor)).toBe('One world');
          });

          return editor;
        },
      },
      {
        name: 'clears when the action is cancelled',
        reach: async () => {
          let write: ((text: string) => void) | undefined;
          const editor = await mountEditor({
            transform: (_params, ctx) => {
              write = ctx.write;

              return new Promise(() => undefined);
            },
          });

          editor.commands.runAIAction('rewrite');
          write!('One');

          await findLoading();

          editor.commands.cancelAIAction();

          return editor;
        },
      },
      {
        name: 'clears when the action fails',
        reach: async () => {
          let fail: (() => void) | undefined;
          let write: ((text: string) => void) | undefined;
          const editor = await mountEditor({
            transform: (_params, ctx) => {
              write = ctx.write;

              return new Promise((_resolve, reject) => {
                fail = () => {
                  reject(new Error('nope'));
                };
              });
            },
            withMenu: true,
          });

          editor.commands.runAIAction('improve');
          write!('One');

          await findLoading();

          fail!();

          return editor;
        },
        then: async (editor) => {
          editor.commands.setTextSelection({ from: 3, to: 6 });

          await waitFor(() => {
            const alert = document.querySelector('[data-mly-ai-error]');
            expect(alert?.textContent).toContain('Improve Writing failed');
          });
        },
      },
    ];

    for (const testCase of END_CONDITIONS) {
      it(testCase.name, async () => {
        const editor = await testCase.reach();

        await waitFor(() => {
          expect(document.querySelector('[data-mly-ai-loading]')).toBeNull();
        });

        expect(document.querySelector('[data-mly-ai-spinner]')).toBeNull();

        await testCase.then?.(editor);
      });
    }
  });

  describe('cancelling', () => {
    it('reports the running action and cancels it', async () => {
      let signal: AbortSignal | undefined;
      const editor = await mountEditor({
        transform: (_params, ctx) => {
          signal = ctx.signal;

          return new Promise(() => undefined);
        },
      });

      editor.commands.runAIAction('rewrite');

      expect({
        activeAction: editor.storage.aiActions.activeAction,
        isLoading: editor.storage.aiActions.isLoading,
      }).toEqual({ activeAction: 'rewrite', isLoading: true });

      expect(editor.commands.runAIAction('rewrite')).toBe(false);

      editor.commands.cancelAIAction();

      expect({
        aborted: signal?.aborted,
        activeAction: editor.storage.aiActions.activeAction,
        isLoading: editor.storage.aiActions.isLoading,
      }).toEqual({ aborted: true, activeAction: null, isLoading: false });
    });

    it('treats an aborted action as no failure', async () => {
      const editor = await mountEditor({
        transform: (_params, ctx) => {
          return new Promise((_resolve, reject) => {
            ctx.signal.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'));
            });
          });
        },
        withMenu: true,
      });

      await findTrigger();

      editor.commands.runAIAction('improve');
      editor.commands.cancelAIAction();

      await waitFor(() => {
        expect(getTrigger()).not.toBeDisabled();
      });

      expect({
        alert: document.querySelector('[data-mly-ai-error]'),
        failedAction: editor.storage.aiActions.failedAction,
      }).toEqual({ alert: null, failedAction: null });
    });
  });

  describe('errors', () => {
    const FAILURE_LABELS: FailureLabelCase[] = [
      {
        action: 'improve',
        label: 'Improve Writing failed',
        name: 'surfaces a failed action in place of the trigger',
      },
      {
        action: 'shout',
        label: 'shout failed',
        name: 'names an unknown failed action by its raw id',
      },
    ];

    for (const testCase of FAILURE_LABELS) {
      it(testCase.name, async () => {
        const editor = await mountEditor({
          transform: async () => {
            throw new Error('nope');
          },
          withMenu: true,
        });

        await findTrigger();

        editor.commands.runAIAction(testCase.action);

        const alert = await findAlert();

        expect({
          role: alert.getAttribute('role'),
          text: alert.textContent,
          trigger: getTrigger(),
        }).toEqual({
          role: 'alert',
          text: testCase.label,
          trigger: null,
        });
      });
    }

    const FAILURE_CLEARING: FailureClearingCase[] = [
      {
        clear: async () => {
          const editor = await mountEditor({
            transform: async () => {
              throw new Error('nope');
            },
            withMenu: true,
          });

          editor.commands.runAIAction('improve');

          const alert = await findAlert();
          const dismiss = alert.querySelector<HTMLElement>(
            '[data-mly-ai-error-dismiss]'
          );

          expect(dismiss?.getAttribute('aria-label')).toBe('Dismiss');

          await userEvent.click(dismiss!);

          return editor;
        },
        name: 'dismisses the failure and restores the trigger',
      },
      {
        clear: async () => {
          let shouldFail = true;
          const editor = await mountEditor({
            transform: (_params, ctx) => {
              if (shouldFail) {
                return Promise.reject(new Error('nope'));
              }

              return new Promise(() => {
                void ctx;
              });
            },
            withMenu: true,
          });

          editor.commands.runAIAction('improve');

          await findAlert();

          shouldFail = false;
          editor.commands.runAIAction('fix-grammar');

          return editor;
        },
        name: 'clears a previous failure when a new action starts',
      },
    ];

    for (const testCase of FAILURE_CLEARING) {
      it(testCase.name, async () => {
        const editor = await testCase.clear();

        await waitFor(() => {
          expect(document.querySelector('[data-mly-ai-error]')).toBeNull();
        });

        expect({
          failedAction: editor.storage.aiActions.failedAction,
          trigger: getTrigger() !== null,
        }).toEqual({ failedAction: null, trigger: true });
      });
    }
  });

  describe('the dropdown', () => {
    it('runs an action the text bubble menu offers', async () => {
      const editor = await mountEditor({
        transform: async (params) => {
          return `${params.action}:${params.text}`;
        },
        withMenu: true,
      });

      const menu = await openDropdown();

      expect(
        [...menu.querySelectorAll('[data-mly-dropdown-menu-item]')].map(
          (item) => {
            return item.textContent;
          }
        )
      ).toEqual([
        'Improve Writing',
        'Fix Grammar',
        'Make Shorter',
        'Make Longer',
        'Simplify Language',
      ]);

      await userEvent.click(
        menu.querySelector<HTMLElement>('[data-mly-dropdown-menu-item]')!
      );

      await waitFor(() => {
        expect(getTrimmedText(editor)).toBe('improve:Hello world');
      });
    });

    it('disables the trigger while an action runs', async () => {
      const editor = await mountEditor({
        transform: (_params, ctx) => {
          return new Promise(() => {
            void ctx;
          });
        },
        withMenu: true,
      });

      const trigger = await findTrigger();

      expect(trigger).not.toBeDisabled();

      editor.commands.runAIAction('improve');

      await waitFor(() => {
        expect(trigger).toBeDisabled();
      });

      expect(trigger.querySelector('[data-mly-spinner]')).not.toBeNull();
    });

    it('offers no dropdown when the extension is absent', async () => {
      const editor = await mountEditor({
        transform: undefined,
        withMenu: true,
      });
      editor.commands.setTextSelection(HELLO_SELECTION);

      await waitFor(() => {
        expect(document.querySelector('[data-mly-bubble-menu]')).not.toBeNull();
      });

      expect(getTrigger()).toBeNull();
    });
  });

  // The extension's config object is shared by every editor that registers it,
  // so state held in a closure there breaks the moment a page has two.
  it('keeps its abort controller per editor', async () => {
    let signal: AbortSignal | undefined;
    const first = await mountEditor({
      transform: (_params, ctx) => {
        signal = ctx.signal;

        return new Promise(() => undefined);
      },
    });

    first.commands.runAIAction('rewrite');
    expect(signal?.aborted).toBe(false);

    const second = await mountEditor({
      transform: async (params) => {
        return params.text.toUpperCase();
      },
    });
    second.commands.cancelAIAction();
    second.destroy();

    expect({
      aborted: signal?.aborted,
      isLoading: first.storage.aiActions.isLoading,
    }).toEqual({ aborted: false, isLoading: true });
  });
});
