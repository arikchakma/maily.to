import type { VisibilityRule } from '@maily-to/shared';
import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { Editor } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Hide me sometimes' }],
  },
  {
    type: 'footer',
    content: [{ type: 'text', text: 'Unsubscribe' }],
  },
]);

const IS_PRO_RULE: VisibilityRule = {
  action: 'show',
  operator: 'is_true',
  value: '',
  variable: '{{isPro}}',
};

function getBlockSelector(tag: string) {
  return `[contenteditable="true"] [data-node-type="container"] > ${tag}`;
}

function getRule(handle: Editor.Root.Handle) {
  const paragraph = getContainerContent(handle)[0] as {
    attrs?: { visibilityRule?: VisibilityRule | null };
  };

  return paragraph.attrs?.visibilityRule ?? null;
}

async function openDragMenu(selector: string) {
  await userEvent.hover(document.querySelector<HTMLElement>(selector)!);

  const trigger = await waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-drag-context-trigger]'
    );
    expect(found).not.toBeNull();
    return found!;
  });

  await userEvent.click(trigger);

  return waitFor(() => {
    const found = [
      ...document.querySelectorAll<HTMLButtonElement>(
        '[data-mly-drag-context-item]'
      ),
    ].find((item) => {
      return item.textContent?.startsWith('Visibility');
    });
    expect(found).not.toBeUndefined();
    return found!;
  });
}

async function openVisibilityPanel() {
  await userEvent.click(await openDragMenu(getBlockSelector('p')));

  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-visibility-config]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

type SelectOptionOptions = {
  label: string;
  option: string;
};

async function selectOption(options: SelectOptionOptions) {
  const { label, option } = options;

  await userEvent.click(
    document.querySelector<HTMLElement>(
      `[data-mly-select-trigger][aria-label="${label}"]`
    )!
  );

  const item = await waitFor(() => {
    const list = document.querySelector<HTMLElement>(
      '[data-mly-select-content][data-open]'
    );
    const found = [
      ...(list?.querySelectorAll<HTMLElement>('[data-mly-select-item]') ?? []),
    ].find((candidate) => {
      return candidate.textContent === option;
    });
    expect(found).not.toBeUndefined();
    return found!;
  });

  await userEvent.click(item);
}

describe('<VisibilityExtension />', () => {
  const { render } = createRenderer();

  const renderVisibility = async (content: typeof DOCUMENT | string) => {
    const { ref } = await render({
      children: <Editor.DragContextHandle />,
      content,
      styled: true,
      theme: true,
      wrapper: { padding: 64 },
    });

    return ref;
  };

  describe('authoring a rule', () => {
    it('writes no rule until an action is chosen', async () => {
      const ref = await renderVisibility(DOCUMENT);

      await openVisibilityPanel();

      expect(getRule(ref.current!)).toBeNull();
      expect(
        document.querySelector('[data-mly-visibility-condition]')
      ).toBeNull();
    });

    it('authors a rule from the action the panel offers', async () => {
      const ref = await renderVisibility(DOCUMENT);

      await openVisibilityPanel();
      await selectOption({ label: 'Visibility Action', option: 'Show if' });

      await waitFor(() => {
        expect(getRule(ref.current!)).toEqual({
          action: 'show',
          operator: 'equals',
          value: '',
          variable: '',
        });
      });
    });

    it('names the variable the rule reads', async () => {
      const ref = await renderVisibility(DOCUMENT);

      await openVisibilityPanel();
      await selectOption({ label: 'Visibility Action', option: 'Hide if' });

      const field = await waitFor(() => {
        const found = document.querySelector<HTMLElement>(
          '[data-mly-visibility-config] [data-mly-variable-only-editor] [contenteditable="true"]'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      await userEvent.click(field);
      await userEvent.keyboard('isSubscribed');

      await waitFor(() => {
        expect(document.querySelector('[data-mly-suggestion]')).not.toBeNull();
      });

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(getRule(ref.current!)?.variable).toBe('{{isSubscribed}}');
      });
    });

    it('drops the value an operator cannot use', async () => {
      const ref = await renderVisibility(DOCUMENT);

      await openVisibilityPanel();
      await selectOption({ label: 'Visibility Action', option: 'Show if' });

      const value = await waitFor(() => {
        const found = document.querySelector<HTMLInputElement>(
          '[data-mly-field-input][aria-label="Visibility Value"]'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      await userEvent.type(value, 'pro');

      await waitFor(() => {
        expect(getRule(ref.current!)?.value).toBe('pro');
      });

      await selectOption({ label: 'Visibility Operator', option: 'Is true' });

      await waitFor(() => {
        expect(getRule(ref.current!)).toEqual({
          action: 'show',
          operator: 'is_true',
          value: '',
          variable: '',
        });
      });

      expect(
        document.querySelector(
          '[data-mly-field-input][aria-label="Visibility Value"]'
        )
      ).toBeNull();
    });

    it('clears the rule when the condition is removed', async () => {
      const ref = await renderVisibility(DOCUMENT);

      await openVisibilityPanel();
      await selectOption({ label: 'Visibility Action', option: 'Show if' });

      await waitFor(() => {
        expect(getRule(ref.current!)).not.toBeNull();
      });

      await selectOption({
        label: 'Visibility Action',
        option: 'No condition',
      });

      await waitFor(() => {
        expect(getRule(ref.current!)).toBeNull();
      });
    });
  });

  describe('the config panel', () => {
    it('offers the panel only for a block that carries the attribute', async () => {
      await renderVisibility(DOCUMENT);

      expect((await openDragMenu(getBlockSelector('p'))).disabled).toBe(false);

      await userEvent.keyboard('{Escape}');

      expect((await openDragMenu(getBlockSelector('small'))).disabled).toBe(
        true
      );
    });

    it('keeps every operator on a single line', async () => {
      await renderVisibility(DOCUMENT);

      await openVisibilityPanel();
      await selectOption({ label: 'Visibility Action', option: 'Show if' });

      await userEvent.click(
        document.querySelector<HTMLElement>(
          '[data-mly-select-trigger][aria-label="Visibility Operator"]'
        )!
      );

      const items = await waitFor(() => {
        const list = document.querySelector<HTMLElement>(
          '[data-mly-select-content][data-variant="visibility-operator"]'
        );
        expect(list).not.toBeNull();
        return [
          ...list!.querySelectorAll<HTMLElement>('[data-mly-select-item]'),
        ];
      });

      expect(items).toHaveLength(10);
      expect(
        items
          .filter((item) => {
            return (
              getComputedStyle(item).whiteSpace !== 'nowrap' ||
              item.scrollWidth > item.clientWidth
            );
          })
          .map((item) => {
            return item.textContent;
          })
      ).toEqual([]);
    });

    it('sizes the panel the way the current editor does', async () => {
      await renderVisibility(DOCUMENT);

      const panel = await openVisibilityPanel();
      const popup = panel.closest<HTMLElement>('[data-mly-popover]')!;
      const styles = getComputedStyle(popup);

      expect({
        padding: styles.padding,
        width: styles.width,
      }).toEqual({ padding: '4px', width: '232px' });
    });
  });

  describe('persisting the rule', () => {
    it('leaves the rule behind when the block is split', async () => {
      const ref = await renderVisibility(
        getDocument([
          {
            type: 'paragraph',
            attrs: { visibilityRule: IS_PRO_RULE },
            content: [{ type: 'text', text: 'Only for subscribers' }],
          },
        ])
      );

      const instance = ref.current!.getEditor();
      instance.commands.focus('end');
      instance.commands.splitBlock();

      expect(
        getContainerContent(ref.current!).map((node) => {
          return (node.attrs as { visibilityRule?: VisibilityRule | null })
            .visibilityRule;
        })
      ).toEqual([IS_PRO_RULE, null]);
    });

    it('survives a round trip through the editor HTML', async () => {
      const rule: VisibilityRule = {
        action: 'hide',
        operator: 'contains',
        value: 'trial',
        variable: '{{plan}}',
      };

      const ref = await renderVisibility(
        getDocument([
          {
            type: 'paragraph',
            attrs: { visibilityRule: rule },
            content: [{ type: 'text', text: 'Hide me sometimes' }],
          },
        ])
      );

      const html = ref.current!.getEditor().getHTML();
      const reopened = await renderVisibility(html);

      expect(getRule(reopened.current!)).toEqual(rule);
    });
  });

  it('marks a conditional block in the editor', async () => {
    await renderVisibility(
      getDocument([
        {
          type: 'paragraph',
          attrs: { visibilityRule: IS_PRO_RULE },
          content: [{ type: 'text', text: 'Only for subscribers' }],
        },
        { type: 'paragraph', content: [{ type: 'text', text: 'Always' }] },
      ])
    );

    const paragraphs = [
      ...document.querySelectorAll<HTMLElement>(
        `[data-mly-editor-content] ${getBlockSelector('p')}`
      ),
    ];

    expect(
      paragraphs.map((paragraph) => {
        const marker = getComputedStyle(paragraph, '::before');

        return {
          hasEye: marker.maskImage.includes('svg'),
          text: paragraph.textContent,
          width: marker.width,
        };
      })
    ).toEqual([
      { hasEye: true, text: 'Only for subscribers', width: '16px' },
      { hasEye: false, text: 'Always', width: 'auto' },
    ]);
  });
});
