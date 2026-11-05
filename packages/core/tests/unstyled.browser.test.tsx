import { render as renderReact, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';

import { createRenderer, getDocument } from '#test-utils';
import { TextBubbleMenu, Toolbar, VisuallyHidden } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Usable without a stylesheet' }],
  },
]);

function addConsumerStyles(css: string) {
  const style = document.createElement('style');
  style.dataset.styled = '';
  style.textContent = css;
  document.head.append(style);
}

function getHiddenControls(root: ParentNode) {
  return [...root.querySelectorAll<HTMLElement>('button')]
    .filter((button) => {
      const box = button.getBoundingClientRect();
      const styles = getComputedStyle(button);

      return (
        box.width === 0 ||
        box.height === 0 ||
        styles.visibility === 'hidden' ||
        styles.display === 'none'
      );
    })
    .map((button) => {
      return button.getAttribute('aria-label');
    });
}

describe('unstyled interface', () => {
  const { render } = createRenderer();

  const mountEditor = async () => {
    return render({
      children: <TextBubbleMenu />,
      toolbar: (
        <Toolbar.Root>
          <Toolbar.CommonActions />
        </Toolbar.Root>
      ),
      content: DOCUMENT,
    });
  };

  it('leaves every toolbar control operable without the stylesheet', async () => {
    const { ref, view } = await mountEditor();

    const toolbar = view.container.querySelector('[data-mly-toolbar]')!;

    expect(getHiddenControls(toolbar)).toEqual([]);

    ref.current!.getEditor().chain().focus().selectAll().run();

    const bold = toolbar.querySelector<HTMLButtonElement>(
      '[aria-label="Bold"]'
    )!;
    const box = bold.getBoundingClientRect();
    const topmost = document.elementFromPoint(
      box.x + box.width / 2,
      box.y + box.height / 2
    );

    expect(bold.contains(topmost)).toBe(true);

    bold.click();

    expect(ref.current!.getEditor().isActive('bold')).toBe(true);
  });

  it('opens the text bubble menu without the stylesheet', async () => {
    const { ref } = await mountEditor();

    ref.current!.getEditor().chain().focus().selectAll().run();

    const menu = await waitFor(() => {
      const found = document.querySelector<HTMLElement>(
        '[data-mly-bubble-menu]'
      );
      expect(found).not.toBeNull();
      return found!;
    });

    const box = menu.getBoundingClientRect();

    expect({
      hidden: getHiddenControls(menu),
      hasSize: box.width > 0 && box.height > 0,
    }).toEqual({ hidden: [], hasSize: true });
  });

  it('keeps an announcement out of sight without the stylesheet', async () => {
    const view = renderReact(
      <VisuallyHidden role="status">Uploading image</VisuallyHidden>
    );

    const announcement = view.container.querySelector<HTMLElement>(
      '[data-mly-visually-hidden]'
    )!;
    const box = announcement.getBoundingClientRect();

    expect({
      height: box.height,
      text: announcement.textContent,
      width: box.width,
    }).toEqual({ height: 1, text: 'Uploading image', width: 1 });
  });

  it('takes a consumer override of its tokens and parts', async () => {
    addConsumerStyles(
      `:root { --mly-color-gray-500: rgb(0, 128, 0); }
       [data-mly-toolbar] { padding: 12px; }
       [data-mly-bubble-button] { color: var(--mly-color-gray-500); }`
    );

    const { view } = await mountEditor();

    const toolbar =
      view.container.querySelector<HTMLElement>('[data-mly-toolbar]')!;
    const button = toolbar.querySelector<HTMLElement>('[aria-label="Bold"]')!;

    expect({
      color: getComputedStyle(button).color,
      padding: getComputedStyle(toolbar).padding,
    }).toEqual({ color: 'rgb(0, 128, 0)', padding: '12px' });
  });
});
