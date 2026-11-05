import { waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vite-plus/test';

import { createRenderer, getDocument } from '#test-utils';

type MarkedWindow = Window & { mailyPreviewRan?: boolean };

const PAYLOAD =
  '<p>Visible text</p><img src="data:," onerror="(window.top || window).mailyPreviewRan = true; window.mailyPreviewRan = true">';

function getHtmlBlock(text: string) {
  return {
    attrs: { activeTab: 'preview', language: 'html' },
    content: text ? [{ text, type: 'text' }] : undefined,
    type: 'htmlCodeBlock',
  };
}

function getPreviewFrame(root: HTMLElement) {
  return root.querySelector<HTMLIFrameElement>(
    '[data-mly-html-code-block-preview] iframe'
  );
}

describe('html code block preview', () => {
  const { render } = createRenderer();

  afterEach(() => {
    delete (window as MarkedWindow).mailyPreviewRan;
  });

  it('shows the markup without running its scripts', async () => {
    const { editable } = await render({
      content: getDocument([getHtmlBlock(PAYLOAD)]),
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });

    expect((window as MarkedWindow).mailyPreviewRan).toBeUndefined();

    const frame = getPreviewFrame(editable);
    expect(frame?.getAttribute('sandbox')).toBe('allow-same-origin');
    expect(frame?.contentDocument?.body.textContent).toContain('Visible text');
    expect(
      (frame?.contentWindow as MarkedWindow | null)?.mailyPreviewRan
    ).toBeUndefined();
  });

  it('sizes the frame to the markup', async () => {
    const { editable } = await render({
      content: getDocument([
        getHtmlBlock('<div style="height: 240px">Tall</div>'),
      ]),
    });

    await waitFor(() => {
      expect(getPreviewFrame(editable)?.offsetHeight).toBeGreaterThanOrEqual(
        240
      );
    });
  });

  it('keeps margins inside the frame height', async () => {
    const { editable } = await render({
      content: getDocument([
        getHtmlBlock(
          '<style>body { margin: 20px }</style><div style="height: 100px; margin-bottom: 40px">Text</div>'
        ),
      ]),
    });

    await waitFor(() => {
      expect(getPreviewFrame(editable)?.offsetHeight).toBe(160);
    });
  });

  it('follows the markup height when the width changes', async () => {
    const errors: string[] = [];
    const onError = (event: ErrorEvent) => {
      errors.push(event.message);
    };
    window.addEventListener('error', onError);

    const { editable } = await render({
      content: getDocument([getHtmlBlock(`<p>${'word '.repeat(300)}</p>`)]),
    });
    const previewElement = editable.querySelector<HTMLElement>(
      '[data-mly-html-code-block-preview]'
    );
    const getFrameHeight = () => {
      return getPreviewFrame(editable)?.offsetHeight ?? 0;
    };

    previewElement?.style.setProperty('width', '600px');
    await waitFor(() => {
      expect(getFrameHeight()).toBeGreaterThan(0);
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    const wideHeight = getFrameHeight();

    previewElement?.style.setProperty('width', '200px');
    await waitFor(() => {
      expect(getFrameHeight()).toBeGreaterThan(wideHeight);
    });

    previewElement?.style.setProperty('width', '600px');
    await waitFor(() => {
      expect(getFrameHeight()).toBe(wideHeight);
    });

    window.removeEventListener('error', onError);
    expect(errors).toEqual([]);
  });

  it('renders no frame for an empty block', async () => {
    const { editable } = await render({
      content: getDocument([getHtmlBlock('')]),
    });

    expect(
      editable.querySelector('[data-mly-html-code-block-preview][data-empty]')
    ).not.toBeNull();
    expect(getPreviewFrame(editable)).toBeNull();
  });
});
