import { render as renderMaily } from '@maily-to/render';
import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { Editor } from '~/index';

const DOCUMENT = getDocument([
  { type: 'paragraph', content: [{ type: 'text', text: 'Set my typography' }] },
  { type: 'horizontalRule' },
]);

function getStyledDocument(style: string) {
  return getDocument([
    {
      type: 'paragraph',
      attrs: { style },
      content: [{ type: 'text', text: 'Set my typography' }],
    },
    { type: 'horizontalRule' },
  ]);
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
    ].find((item) => item.textContent?.startsWith('Font Style'));
    expect(found).not.toBeUndefined();
    return found!;
  });
}

async function openFontStylePanel() {
  await userEvent.click(await openDragMenu('[contenteditable="true"] p'));

  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-font-style-config]'
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

type PickFromOptions = {
  label: string;
  option: string;
};

async function pickFrom(options: PickFromOptions) {
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
    ].find((candidate) => candidate.textContent === option);
    expect(found).not.toBeUndefined();
    return found!;
  });

  await userEvent.click(item);
}

function getParagraphStyle(handle: Editor.Root.Handle) {
  const style = getContainerContent(handle)[0]?.attrs?.style;

  return typeof style === 'string' ? style : '';
}

function getUnitFieldValue(label: string) {
  return document.querySelector<HTMLInputElement>(
    `[data-mly-unit-field] input[aria-label="${label}"]`
  )?.value;
}

describe('<FontStyleConfig />', () => {
  const { render } = createRenderer();

  const mountEditor = async (content = DOCUMENT) => {
    return render({
      children: <Editor.DragContextHandle />,
      content,
      styled: true,
      theme: true,
      wrapper: { padding: 64 },
    });
  };

  it('offers the panel only for a block that carries text', async () => {
    await mountEditor();

    expect((await openDragMenu('[contenteditable="true"] p')).disabled).toBe(
      false
    );

    await userEvent.keyboard('{Escape}');

    expect((await openDragMenu('[contenteditable="true"] hr')).disabled).toBe(
      true
    );
  });

  describe('font family', () => {
    it('authors the chosen family with its fallback', async () => {
      const { ref } = await mountEditor();

      await openFontStylePanel();
      await pickFrom({ label: 'Font Family', option: 'Roboto' });

      await waitFor(() => {
        expect(getParagraphStyle(ref.current!)).toContain(
          "font-family:'Roboto', sans-serif"
        );
      });

      await pickFrom({ label: 'Font Fallback', option: 'Georgia' });

      await waitFor(() => {
        expect(getParagraphStyle(ref.current!)).toContain(
          "font-family:'Roboto', Georgia"
        );
      });
    });

    it('keeps a family the picker does not list', async () => {
      const { ref } = await mountEditor(
        getStyledDocument("font-family:'IBM Plex Sans Condensed', sans-serif")
      );

      await openFontStylePanel();

      const trigger = document.querySelector<HTMLElement>(
        '[data-mly-select-trigger][aria-label="Font Family"]'
      );

      expect(trigger?.textContent).toContain('IBM Plex Sans Condensed');

      await userEvent.click(trigger!);

      const items = await waitFor(() => {
        const list = document.querySelector<HTMLElement>(
          '[data-mly-select-content][data-open]'
        );
        expect(list).not.toBeNull();
        return [
          ...list!.querySelectorAll<HTMLElement>('[data-mly-select-item]'),
        ];
      });

      expect({
        first: items[0]?.textContent,
        selected: items.find((item) => {
          return item.getAttribute('data-selected') !== null;
        })?.textContent,
      }).toEqual({
        first: 'IBM Plex Sans Condensed',
        selected: 'IBM Plex Sans Condensed',
      });

      await userEvent.click(
        items.find((item) => {
          return item.textContent === 'Lato';
        })!
      );

      await waitFor(() => {
        expect(getParagraphStyle(ref.current!)).toContain("font-family:'Lato'");
      });
    });

    it('declares the authored family as a font face in the email', async () => {
      const { ref } = await mountEditor();

      await openFontStylePanel();
      await pickFrom({ label: 'Font Family', option: 'Poppins' });

      await waitFor(() => {
        expect(getParagraphStyle(ref.current!)).toContain('Poppins');
      });

      const html = await renderMaily(ref.current!.getJSON());

      expect(
        new DOMParser()
          .parseFromString(html, 'text/html')
          .querySelector('head style')?.textContent
      ).toContain(
        "@font-face {font-family: 'Poppins';font-style: normal;font-weight: 400;mso-font-alt: 'sans-serif';src: url(https://cdn.usemaily.com/fonts/v0/poppins.woff2) format('woff2');}"
      );
    });
  });

  describe('presets', () => {
    it('authors the weight, style and a size preset', async () => {
      const { ref } = await mountEditor();

      await openFontStylePanel();
      await pickFrom({ label: 'Font Weight', option: 'Semibold' });
      await pickFrom({ label: 'Font Style', option: 'Italic' });
      await pickFrom({ label: 'Size presets', option: 'Large' });

      await waitFor(() => {
        expect(getParagraphStyle(ref.current!)).toContain('font-size:18px');
      });

      const style = getParagraphStyle(ref.current!);

      expect({
        fontStyle: style.includes('font-style:italic'),
        fontWeight: style.includes('font-weight:600'),
      }).toEqual({ fontStyle: true, fontWeight: true });
    });

    it('shows the size the theme resolves when nothing is authored', async () => {
      await mountEditor();
      await openFontStylePanel();

      expect({
        lineHeight: getUnitFieldValue('Line Height'),
        size: getUnitFieldValue('Size'),
      }).toEqual({ lineHeight: '24px', size: '14px' });
    });

    it('keeps a line height the document authored without a unit', async () => {
      const { ref } = await mountEditor(getStyledDocument('line-height:1.2'));

      await openFontStylePanel();

      expect(getUnitFieldValue('Line Height')).toBe('1.2');

      await pickFrom({ label: 'Line Height presets', option: 'Loose' });

      await waitFor(() => {
        expect(getParagraphStyle(ref.current!)).toContain('line-height:2');
      });

      expect(getParagraphStyle(ref.current!)).not.toContain('line-height:2px');
    });
  });

  it('sizes the panel the way the current editor does', async () => {
    await mountEditor();

    const panel = await openFontStylePanel();
    const popup = panel.closest<HTMLElement>('[data-mly-popover]')!;
    const styles = getComputedStyle(popup);

    expect({
      padding: styles.padding,
      width: styles.width,
    }).toEqual({ padding: '4px', width: '232px' });
  });
});
