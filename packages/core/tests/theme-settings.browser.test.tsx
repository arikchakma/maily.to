import type { DocumentNode, NodeThemeOptions } from '@maily-to/shared';
import { BASIC_NODE_THEME, extendNodeTheme } from '@maily-to/shared';
import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getDocument } from '#test-utils';
import { ThemeSettings } from '~/index';
import type { Editor } from '~/index';

const DOCUMENT = getDocument([
  { type: 'paragraph', content: [{ type: 'text', text: 'Themed copy' }] },
]);

const SHELLED_DOCUMENT: DocumentNode = {
  type: 'doc',
  attrs: { version: 2 },
  content: [
    {
      type: 'body',
      attrs: { style: 'background-color:#fbfcfb' },
      content: [
        {
          type: 'container',
          attrs: { style: 'padding:4rem 1rem 1.5rem' },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Imported copy' }],
            },
          ],
        },
      ],
    },
  ],
};

const SETTINGS_BAR = (
  <ThemeSettings.Root>
    <ThemeSettings.Font />
    <ThemeSettings.Layout />
    <ThemeSettings.Button />
    <ThemeSettings.Text />
  </ThemeSettings.Root>
);

function getTrigger(label: string) {
  return document.querySelector<HTMLButtonElement>(
    `[data-mly-theme-settings-trigger][aria-label="${label}"]`
  );
}

function getPanel() {
  return document.querySelector<HTMLElement>(
    '[data-mly-popover][data-variant="theme-settings"]'
  );
}

async function openPanel(label: string) {
  await userEvent.click(getTrigger(label)!);

  return waitFor(() => {
    const found = getPanel();
    expect(found).not.toBeNull();
    return found!;
  });
}

type SelectSwatchOptions = {
  field: string;
  swatch: string;
};

async function selectSwatch(options: SelectSwatchOptions) {
  const { field, swatch } = options;

  await userEvent.click(
    document.querySelector<HTMLElement>(
      `[data-mly-theme-settings-color][aria-label="${field}"]`
    )!
  );

  const item = await waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      `[data-mly-color-swatch] [aria-label="${swatch}"]`
    );
    expect(found).not.toBeNull();
    return found!;
  });

  await userEvent.click(item);
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

type FillUnitFieldOptions = {
  label: string;
  value: string;
};

async function fillUnitField(options: FillUnitFieldOptions) {
  const { label, value } = options;

  const field = document.querySelector<HTMLInputElement>(
    `[data-mly-unit-field] input[aria-label="${label}"]`
  )!;

  await userEvent.tripleClick(field);
  await userEvent.keyboard(value);
  await userEvent.keyboard('{Enter}');
}

function getSelectValue(label: string) {
  return document.querySelector<HTMLElement>(
    `[data-mly-select-trigger][aria-label="${label}"] > :not([data-mly-select-icon])`
  )?.textContent;
}

function getColorValue(label: string) {
  return document.querySelector<HTMLElement>(
    `[data-mly-theme-settings-color][aria-label="${label}"] [data-mly-theme-settings-color-value]`
  )?.textContent;
}

function getUnitValue(label: string) {
  return document.querySelector<HTMLInputElement>(
    `[data-mly-unit-field] input[aria-label="${label}"]`
  )?.value;
}

function getTheme(handle: Editor.Root.Handle) {
  return (handle.getJSON().attrs.theme ?? {}) as NodeThemeOptions;
}

describe('<ThemeSettings />', () => {
  const { render } = createRenderer();

  type MountEditorOptions = {
    content?: DocumentNode;
    frame?: boolean;
    styled?: boolean;
    theme?: NodeThemeOptions | null;
  };

  const mountEditor = async (options: MountEditorOptions = {}) => {
    const {
      content = DOCUMENT,
      frame = false,
      styled = true,
      theme = BASIC_NODE_THEME,
    } = options;

    return render({
      children: SETTINGS_BAR,
      content,
      frame,
      styled,
      theme: theme ?? undefined,
      wrapper: { padding: 64 },
    });
  };

  describe('rendering', () => {
    it('renders a trigger for every theme panel', async () => {
      await mountEditor();

      const bar = document.querySelector<HTMLElement>(
        '[data-mly-theme-settings]'
      )!;
      const labels = [
        ...bar.querySelectorAll<HTMLElement>(
          '[data-mly-theme-settings-trigger]'
        ),
      ].map((trigger) => {
        return trigger.getAttribute('aria-label');
      });

      expect({ labels, role: bar.getAttribute('role') }).toEqual({
        labels: ['Font', 'Layout', 'Button', 'Text'],
        role: 'toolbar',
      });
    });

    it('renders nothing without the theme extension', async () => {
      await mountEditor({ theme: null });

      expect(document.querySelector('[data-mly-theme-settings]')).toBeNull();
    });

    it('leaves the bar unstyled without the stylesheet', async () => {
      await mountEditor({ styled: false });

      const style = getComputedStyle(
        document.querySelector<HTMLElement>('[data-mly-theme-settings]')!
      );

      expect({
        background: style.backgroundColor,
        borderStyle: style.borderStyle,
        borderWidth: style.borderWidth,
      }).toEqual({
        background: 'rgba(0, 0, 0, 0)',
        borderStyle: 'none',
        borderWidth: '0px',
      });
    });
  });

  describe('button', () => {
    it('writes a button background the whole editor picks up', async () => {
      const { ref, view } = await mountEditor();

      ref.current?.getEditor().chain().focus().setButton().run();

      const getButtonBackground = () => {
        const found = view.container.querySelector<HTMLElement>(
          '[data-node-type="button"]'
        );

        return found && getComputedStyle(found).backgroundColor;
      };

      await waitFor(() => {
        expect(getButtonBackground()).toBe('rgb(0, 0, 0)');
      });

      await openPanel('Button');
      await selectSwatch({ field: 'Background', swatch: 'Blue Background' });

      await waitFor(() => {
        expect(getButtonBackground()).toBe('rgb(233, 243, 247)');
      });

      expect(getTheme(ref.current!).button?.backgroundColor).toBe('#E9F3F7');
    });

    it('writes the padding a button size preset names', async () => {
      const { ref } = await mountEditor();

      await openPanel('Button');
      await selectOption({ label: 'Button Size', option: 'Large' });

      expect({
        label: getSelectValue('Button Size'),
        padding: getTheme(ref.current!).button?.padding,
      }).toEqual({ label: 'Large', padding: '14px 40px' });
    });

    it('names a padding no button size preset matches', async () => {
      await mountEditor({
        theme: extendNodeTheme({
          extension: { button: { padding: '11px 33px' } },
          preset: BASIC_NODE_THEME,
        }),
      });

      await openPanel('Button');

      expect(getSelectValue('Button Size')).toBe('Custom');
    });
  });

  describe('layout', () => {
    it('solidifies the container border when it gains a width', async () => {
      const { ref } = await mountEditor();

      await openPanel('Layout');
      await fillUnitField({ label: 'Container Border Width', value: '2' });

      await waitFor(() => {
        expect(getTheme(ref.current!).container?.borderWidth).toBe('2px');
      });

      expect(getTheme(ref.current!).container?.borderStyle).toBe('solid');
    });

    it('reads the shell the document authored rather than the bare theme', async () => {
      await mountEditor({ content: SHELLED_DOCUMENT, theme: {} });
      await openPanel('Layout');

      expect({
        body: getColorValue('Body'),
        containerPaddingHorizontal: getUnitValue(
          'Container Padding Horizontal'
        ),
        containerPaddingVertical: getUnitValue('Container Padding Vertical'),
      }).toEqual({
        body: '#fbfcfb',
        containerPaddingHorizontal: '16px',
        containerPaddingVertical: '64px',
      });
    });

    it('clears the authored shell style the theme now owns', async () => {
      const { ref } = await mountEditor({
        content: SHELLED_DOCUMENT,
        theme: {},
      });
      await openPanel('Layout');
      await selectSwatch({ field: 'Body', swatch: 'Red Background' });

      await waitFor(() => {
        expect(getTheme(ref.current!).body?.backgroundColor).toBe('#FAECEC');
      });

      expect({
        authored: ref.current!.getJSON().attrs.style ?? null,
        shown: getColorValue('Body'),
      }).toEqual({ authored: null, shown: '#FAECEC' });
    });
  });

  describe('keyboard', () => {
    it('walks the trigger row with the arrow keys', async () => {
      await mountEditor();

      getTrigger('Font')!.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(document.activeElement).toBe(getTrigger('Layout'));
    });

    it('closes a panel on escape and hands focus back', async () => {
      await mountEditor();

      await openPanel('Button');
      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(getPanel()).toBeNull();
      });

      expect(document.activeElement).toBe(getTrigger('Button'));
    });
  });

  it('writes the chosen font family onto the body entry', async () => {
    const { ref } = await mountEditor();

    await openPanel('Font');
    await selectOption({ label: 'Font Family', option: 'Roboto' });

    expect(getTheme(ref.current!).body?.fontFamily).toBe(
      "'Roboto', sans-serif"
    );
  });

  it('writes a paragraph size the editor reflects', async () => {
    const { ref, view } = await mountEditor();

    await openPanel('Text');
    await fillUnitField({ label: 'Paragraph Size', value: '18' });

    const paragraph = view.container.querySelector<HTMLElement>(
      '[data-node-type="paragraph"]'
    )!;

    await waitFor(() => {
      expect(getComputedStyle(paragraph).fontSize).toBe('18px');
    });

    expect(getTheme(ref.current!).paragraph?.fontSize).toBe('18px');
  });

  it('paints the body node and leaves the container transparent', async () => {
    const { ref } = await mountEditor({ frame: true });

    ref.current
      ?.getEditor()
      .chain()
      .updateShellTheme({ body: { backgroundColor: '#faecec' } })
      .run();

    const body = document.querySelector<HTMLElement>(
      '[data-node-type="body"]'
    )!;

    await waitFor(() => {
      expect(getComputedStyle(body).backgroundColor).toBe('rgb(250, 236, 236)');
    });

    const shell = document.querySelector<HTMLElement>(
      '[data-node-type="container"]'
    )!;

    expect(getComputedStyle(shell).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });
});
