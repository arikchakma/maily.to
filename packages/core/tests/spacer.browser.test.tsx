import { render as renderMaily } from '@maily-to/render';
import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent } from '#test-utils';
import type { Editor } from '~/index';

function getSpacer(handle: Editor.Root.Handle) {
  return getContainerContent(handle).find((node) => node.type === 'spacer');
}

describe('<SpacerExtension />', () => {
  const { render } = createRenderer();

  it('inserts a spacer and exports its height', async () => {
    const { ref } = await render();

    ref.current?.getEditor().chain().focus().setSpacer().run();

    const json = ref.current!.getJSON();
    const spacer = getSpacer(ref.current!);

    expect(spacer?.attrs?.height).toBe(8);

    const exported = new DOMParser().parseFromString(
      await renderMaily(json),
      'text/html'
    );

    expect(
      [...exported.querySelectorAll('*')].some((element) => {
        return (element as HTMLElement).style.height === '8px';
      })
    ).toBe(true);
  });

  describe('height', () => {
    it('changes the spacer height through the command', async () => {
      const { ref } = await render();

      ref.current?.getEditor().chain().focus().setSpacer({ height: 32 }).run();
      ref.current?.getEditor().commands.updateSpacerAttributes({ height: 48 });

      expect(getSpacer(ref.current!)?.attrs?.height).toBe(48);
    });

    it('commits a new height when a spacer handle is released', async () => {
      const { ref, view } = await render();

      ref.current?.getEditor().chain().focus().setSpacer({ height: 16 }).run();

      const spacerView = await waitFor(() => {
        const found = view.container.querySelector('[data-mly-spacer-view]');
        expect(found).not.toBeNull();
        return found!;
      });

      await userEvent.hover(spacerView);

      const handle = await waitFor(() => {
        const found = view.container.querySelector<HTMLElement>(
          '[data-mly-spacer-handle][data-side="bottom"]'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      const box = handle.getBoundingClientRect();
      handle.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          clientY: box.top,
          pointerId: 1,
        })
      );
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          clientY: box.top + 40,
          pointerId: 1,
        })
      );
      window.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, pointerId: 1 })
      );

      await waitFor(() => {
        const height = getSpacer(ref.current!)?.attrs?.height;

        expect(height).toBeGreaterThan(16);
      });
    });
  });
});
