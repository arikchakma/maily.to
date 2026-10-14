import { render as renderMaily } from '@maily-to/render';
import type { BulletListNode, OrderedListNode } from '@maily-to/shared';
import { BASIC_NODE_THEME, extendNodeTheme } from '@maily-to/shared';
import { waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';

import { createRenderer, getDocument } from '#test-utils';

const SPACED_THEME = extendNodeTheme({
  extension: {
    paragraph: { marginBottom: '20px', marginTop: '20px' },
  },
  preset: BASIC_NODE_THEME,
});

function getListNode(
  type: 'bulletList' | 'orderedList'
): BulletListNode | OrderedListNode {
  return {
    type,
    content: ['Alpha', 'Beta'].map((text) => {
      return {
        type: 'listItem',
        content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
      };
    }),
  } as BulletListNode | OrderedListNode;
}

describe('<ThemeExtension />', () => {
  const { render } = createRenderer();

  describe('node styles', () => {
    it('fills in the theme where a paragraph authored nothing', async () => {
      const { view } = await render({
        content: getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'Plain' }] },
        ]),
        theme: true,
      });

      const style = getComputedStyle(within(view.container).getByText('Plain'));

      expect({
        color: style.color,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
      }).toEqual({
        color: 'rgb(24, 24, 27)',
        fontSize: '14px',
        lineHeight: '24px',
      });
    });

    it('themes a button without replacing its authored weight', async () => {
      const { ref, view } = await render({ theme: true });

      ref.current?.getEditor().chain().focus().setButton().run();

      const button = await waitFor(() => {
        const found = view.container.querySelector<HTMLElement>(
          '[data-node-type="button"]'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      const style = getComputedStyle(button);

      expect({
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
      }).toEqual({ fontSize: '14px', fontWeight: '500' });
    });

    it('themes each heading level from its own entry', async () => {
      const { view } = await render({
        content: getDocument([
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'One' }],
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Two' }],
          },
          {
            type: 'heading',
            attrs: { level: 3 },
            content: [{ type: 'text', text: 'Three' }],
          },
        ]),
        theme: true,
      });

      const getTextStyle = (text: string) => {
        const style = getComputedStyle(within(view.container).getByText(text));

        return { color: style.color, fontSize: style.fontSize };
      };

      expect({
        one: getTextStyle('One'),
        three: getTextStyle('Three'),
        two: getTextStyle('Two'),
      }).toEqual({
        one: { color: 'rgb(16, 24, 40)', fontSize: '36px' },
        three: { color: 'rgb(16, 24, 40)', fontSize: '24px' },
        two: { color: 'rgb(16, 24, 40)', fontSize: '30px' },
      });
    });

    it('styles a loaded document from the theme it carries', async () => {
      const { view } = await render({
        content: {
          ...getDocument([
            { type: 'paragraph', content: [{ type: 'text', text: 'Carried' }] },
          ]),
          attrs: {
            version: 2,
            theme: { paragraph: { color: '#ff0000', fontSize: '18px' } },
          },
        },
        theme: true,
      });

      const style = getComputedStyle(
        within(view.container).getByText('Carried')
      );

      expect({ color: style.color, fontSize: style.fontSize }).toEqual({
        color: 'rgb(255, 0, 0)',
        fontSize: '18px',
      });
    });
  });

  describe('overrides', () => {
    it('keeps an authored paragraph style over the theme', async () => {
      const { view } = await render({
        content: getDocument([
          {
            type: 'paragraph',
            attrs: { style: 'color:#ff0000;font-size:30px' },
            content: [{ type: 'text', text: 'Authored' }],
          },
        ]),
        theme: true,
      });

      const style = getComputedStyle(
        within(view.container).getByText('Authored')
      );

      expect({
        color: style.color,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
      }).toEqual({
        color: 'rgb(255, 0, 0)',
        fontSize: '30px',
        lineHeight: '24px',
      });
    });

    it('keeps an authored style on a paragraph inserted after mount', async () => {
      const { ref, view } = await render({
        content: getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'First' }] },
        ]),
        theme: true,
      });

      ref.current
        ?.getEditor()
        .chain()
        .focus('end')
        .insertContent('<p style="color:#0000ff">Pasted</p>')
        .run();

      await waitFor(() => {
        expect(within(view.container).queryByText('Pasted')).not.toBeNull();
      });

      expect(
        getComputedStyle(within(view.container).getByText('Pasted')).color
      ).toBe('rgb(0, 0, 255)');
    });

    it('keeps an authored style over the theme when rendering', async () => {
      const html = await renderMaily(
        getDocument([
          {
            type: 'paragraph',
            attrs: { style: 'color:#ff0000' },
            content: [{ type: 'text', text: 'Authored' }],
          },
        ]),
        { theme: BASIC_NODE_THEME }
      );

      const paragraph = new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector('p');

      expect({
        color: paragraph?.style.color,
        fontSize: paragraph?.style.fontSize,
      }).toEqual({ color: 'rgb(255, 0, 0)', fontSize: '14px' });
    });

    it('keeps an edited property while the rest tracks the theme', async () => {
      const { ref } = await render({ theme: true });

      const editor = ref.current!.getEditor();
      editor.chain().focus().setButton().run();
      editor
        .chain()
        .updateNodeStyle('button', { backgroundColor: '#ff0000' })
        .run();

      const anchor = new DOMParser()
        .parseFromString(
          await renderMaily(ref.current!.getJSON(), {
            theme: BASIC_NODE_THEME,
          }),
          'text/html'
        )
        .querySelector('a');

      expect({
        background: anchor?.style.backgroundColor,
        radius: anchor?.style.borderRadius,
      }).toEqual({ background: 'rgb(255, 0, 0)', radius: '9999px' });
    });

    it('merges a render override over the theme the document carries', async () => {
      const { ref } = await render({ theme: true });

      ref.current?.getEditor().chain().focus().setButton().run();

      const anchor = new DOMParser()
        .parseFromString(
          await renderMaily(ref.current!.getJSON(), {
            theme: { button: { backgroundColor: '#00ff00' } },
          }),
          'text/html'
        )
        .querySelector('a');

      expect({
        background: anchor?.style.backgroundColor,
        color: anchor?.style.color,
        radius: anchor?.style.borderRadius,
      }).toEqual({
        background: 'rgb(0, 255, 0)',
        color: 'rgb(255, 255, 255)',
        radius: '9999px',
      });
    });

    it('keeps an authored style over a theme changed after mount', async () => {
      const { ref, view } = await render({
        content: getDocument([
          {
            type: 'paragraph',
            attrs: { style: 'color:#0000ff' },
            content: [{ type: 'text', text: 'Authored' }],
          },
        ]),
        theme: true,
      });

      ref.current?.getEditor().commands.updateNodeTheme({
        paragraph: { color: '#00ff00' },
      });

      await waitFor(() => {
        expect(ref.current!.getJSON().attrs.theme?.paragraph?.color).toBe(
          '#00ff00'
        );
      });

      expect(
        getComputedStyle(within(view.container).getByText('Authored')).color
      ).toBe('rgb(0, 0, 255)');
    });
  });

  describe('lists', () => {
    it('gives a list its marker gutter from the theme', async () => {
      const { view } = await render({
        content: getDocument([getListNode('bulletList')]),
        theme: true,
      });

      const list = view.container.querySelector('ul');
      const item = view.container.querySelector('li');

      expect({
        listPadding: list && getComputedStyle(list).paddingLeft,
        marker: list && getComputedStyle(list).listStyleType,
        itemPadding: item && getComputedStyle(item).paddingLeft,
        itemMarginTop: item && getComputedStyle(item).marginTop,
        itemMarginBottom: item && getComputedStyle(item).marginBottom,
      }).toEqual({
        listPadding: '26px',
        marker: 'disc',
        itemPadding: '6px',
        itemMarginTop: '0px',
        itemMarginBottom: '8px',
      });
    });

    it('gives a list its marker gutter when rendering', async () => {
      const html = await renderMaily(
        getDocument([getListNode('orderedList')]),
        { theme: BASIC_NODE_THEME }
      );

      const exported = new DOMParser().parseFromString(html, 'text/html');
      const list = exported.querySelector('ol');
      const item = exported.querySelector('li');

      expect({
        listPadding: list?.style.paddingLeft,
        marker: list?.style.listStyleType,
        itemPadding: item?.style.paddingLeft,
      }).toEqual({
        listPadding: '26px',
        marker: 'decimal',
        itemPadding: '6px',
      });
    });

    it('zeroes the trailing margin on the last list item when rendering', async () => {
      const html = await renderMaily(
        getDocument([getListNode('orderedList')]),
        { theme: BASIC_NODE_THEME }
      );

      const items = new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelectorAll('li');

      expect({
        between: (items[0] as HTMLElement).style.marginBottom,
        trailing: (items[1] as HTMLElement).style.marginBottom,
      }).toEqual({ between: '8px', trailing: '0px' });
    });
  });

  describe('margins', () => {
    it('drops a theme margin at the edges of its container', async () => {
      const { view } = await render({
        content: getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'First' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Middle' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Last' }] },
        ]),
        theme: SPACED_THEME,
      });

      const getMargins = (text: string) => {
        const style = getComputedStyle(within(view.container).getByText(text));

        return `${style.marginTop}/${style.marginBottom}`;
      };

      expect({
        first: getMargins('First'),
        last: getMargins('Last'),
        middle: getMargins('Middle'),
      }).toEqual({ first: '0px/20px', last: '20px/0px', middle: '20px/20px' });
    });

    it('drops a theme margin against a spacer', async () => {
      const { view } = await render({
        content: getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'Above' }] },
          { type: 'spacer', attrs: { height: 32 } },
          { type: 'paragraph', content: [{ type: 'text', text: 'Below' }] },
        ]),
        theme: SPACED_THEME,
      });

      const getMargins = (text: string) => {
        const style = getComputedStyle(within(view.container).getByText(text));

        return `${style.marginTop}/${style.marginBottom}`;
      };

      expect({
        above: getMargins('Above'),
        below: getMargins('Below'),
      }).toEqual({ above: '0px/0px', below: '0px/0px' });
    });

    it('drops a theme margin where the parent does not stack blocks', async () => {
      const { view } = await render({
        content: getDocument([getListNode('bulletList')]),
        theme: SPACED_THEME,
      });

      const style = getComputedStyle(within(view.container).getByText('Alpha'));

      expect(`${style.marginTop}/${style.marginBottom}`).toBe('0px/0px');
    });

    it('keeps an authored margin where the theme margin is dropped', async () => {
      const { view } = await render({
        content: getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'Only' }] },
          {
            type: 'paragraph',
            attrs: { style: 'margin-bottom:40px' },
            content: [{ type: 'text', text: 'Authored' }],
          },
        ]),
        theme: SPACED_THEME,
      });

      const style = getComputedStyle(
        within(view.container).getByText('Authored')
      );

      expect(style.marginBottom).toBe('40px');
    });

    it('zeroes a theme margin at a container edge when rendering', async () => {
      const html = await renderMaily(
        getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'First' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Middle' }] },
          {
            type: 'paragraph',
            attrs: { style: 'margin-bottom:40px' },
            content: [{ type: 'text', text: 'Last' }],
          },
        ]),
        { theme: SPACED_THEME }
      );

      const paragraphs = new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelectorAll('p');

      const getMargins = (index: number) => {
        const style = (paragraphs[index] as HTMLElement).style;

        return `${style.marginTop || 'none'}/${style.marginBottom || 'none'}`;
      };

      expect({
        first: getMargins(0),
        last: getMargins(2),
        middle: getMargins(1),
      }).toEqual({
        first: '0px/20px',
        last: '20px/40px',
        middle: '20px/20px',
      });
    });
  });

  describe('rendering', () => {
    it('renders the configured theme into the export', async () => {
      const html = await renderMaily(
        getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'Typed' }] },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Titled' }],
          },
        ]),
        { theme: BASIC_NODE_THEME }
      );

      const exported = new DOMParser().parseFromString(html, 'text/html');

      expect({
        heading: exported.querySelector('h2')?.style.fontSize,
        paragraph: exported.querySelector('p')?.style.color,
      }).toEqual({ heading: '30px', paragraph: 'rgb(24, 24, 27)' });
    });

    it('renders an inserted button with the configured theme', async () => {
      const theme = extendNodeTheme({
        extension: {
          button: { backgroundColor: '#0000ff', borderRadius: '4px' },
        },
        preset: BASIC_NODE_THEME,
      });

      const { ref } = await render({ theme });

      ref.current?.getEditor().chain().focus().setButton().run();

      const json = ref.current!.getJSON();
      const anchor = new DOMParser()
        .parseFromString(await renderMaily(json, { theme }), 'text/html')
        .querySelector('a');

      expect({
        background: anchor?.style.backgroundColor,
        radius: anchor?.style.borderRadius,
      }).toEqual({ background: 'rgb(0, 0, 255)', radius: '4px' });
    });

    it('carries the configured theme in the document json', async () => {
      const { ref } = await render({ theme: true });

      ref.current?.getEditor().chain().focus().setButton().run();

      const json = ref.current!.getJSON();
      const anchor = new DOMParser()
        .parseFromString(await renderMaily(json), 'text/html')
        .querySelector('a');

      expect({
        background: anchor?.style.backgroundColor,
        theme: json.attrs.theme?.button?.backgroundColor,
      }).toEqual({ background: 'rgb(0, 0, 0)', theme: '#000000' });
    });

    it('restyles an existing button when the theme changes', async () => {
      const { ref } = await render({ theme: true });

      ref.current?.getEditor().chain().focus().setButton().run();

      const json = ref.current!.getJSON();
      const getButtonBackground = async (theme: typeof BASIC_NODE_THEME) => {
        return new DOMParser()
          .parseFromString(await renderMaily(json, { theme }), 'text/html')
          .querySelector('a')?.style.backgroundColor;
      };

      expect({
        after: await getButtonBackground(
          extendNodeTheme({
            extension: {
              button: { backgroundColor: '#00ff00' },
            },
            preset: BASIC_NODE_THEME,
          })
        ),
        before: await getButtonBackground(BASIC_NODE_THEME),
      }).toEqual({ after: 'rgb(0, 255, 0)', before: 'rgb(0, 0, 0)' });
    });
  });

  describe('updating the theme', () => {
    it('restyles a button already in the document', async () => {
      const { ref, view } = await render({ theme: true });

      ref.current?.getEditor().chain().focus().setButton().run();

      const getButton = () => {
        return view.container.querySelector<HTMLElement>(
          '[data-node-type="button"]'
        );
      };

      await waitFor(() => {
        expect(getButton()).not.toBeNull();
      });

      ref.current?.getEditor().commands.updateNodeTheme({
        button: { backgroundColor: '#00ff00' },
      });

      await waitFor(() => {
        expect(getComputedStyle(getButton()!).backgroundColor).toBe(
          'rgb(0, 255, 0)'
        );
      });
    });

    it('merges an update over the theme the document carries and renders it', async () => {
      const { ref } = await render({ theme: true });

      ref.current?.getEditor().chain().focus().setButton().run();
      ref.current?.getEditor().commands.updateNodeTheme({
        button: { backgroundColor: '#00ff00' },
      });

      const json = ref.current!.getJSON();
      const anchor = new DOMParser()
        .parseFromString(await renderMaily(json), 'text/html')
        .querySelector('a');

      expect({
        background: anchor?.style.backgroundColor,
        radius: anchor?.style.borderRadius,
        themeBackground: json.attrs.theme?.button?.backgroundColor,
        themeRadius: json.attrs.theme?.button?.borderRadius,
      }).toEqual({
        background: 'rgb(0, 255, 0)',
        radius: '9999px',
        themeBackground: '#00ff00',
        themeRadius: '9999px',
      });
    });

    it('clears every themed declaration when the theme is replaced', async () => {
      const { ref, view } = await render({
        content: getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'Plain' }] },
        ]),
        theme: true,
      });

      const getParagraphColor = () => {
        return getComputedStyle(within(view.container).getByText('Plain'))
          .color;
      };

      expect(getParagraphColor()).toBe('rgb(24, 24, 27)');

      ref.current?.getEditor().commands.setNodeTheme({});

      await waitFor(() => {
        expect(getParagraphColor()).not.toBe('rgb(24, 24, 27)');
      });

      expect(ref.current!.getJSON().attrs.theme).toEqual({});
    });

    it('reverts a theme change on undo', async () => {
      const { ref, view } = await render({
        content: getDocument([
          { type: 'paragraph', content: [{ type: 'text', text: 'Plain' }] },
        ]),
        theme: true,
      });

      const getParagraphColor = () => {
        return getComputedStyle(within(view.container).getByText('Plain'))
          .color;
      };

      const editor = ref.current!.getEditor();

      editor.commands.updateNodeTheme({ paragraph: { color: '#00ff00' } });

      await waitFor(() => {
        expect(getParagraphColor()).toBe('rgb(0, 255, 0)');
      });

      editor.commands.undo();

      await waitFor(() => {
        expect(getParagraphColor()).toBe('rgb(24, 24, 27)');
      });

      expect(ref.current!.getJSON().attrs.theme?.paragraph?.color).toBe(
        '#18181b'
      );
    });
  });

  describe('shell', () => {
    it('paints the body and the container from their own theme entries', async () => {
      const { ref, view } = await render({ frame: true, theme: true });

      const getNode = (type: string) => {
        return view.container.querySelector<HTMLElement>(
          `[data-node-type="${type}"]`
        )!;
      };

      ref.current
        ?.getEditor()
        .chain()
        .updateNodeTheme({
          body: { backgroundColor: '#eceef8', padding: '20px' },
          container: { backgroundColor: '#ff0000' },
        })
        .run();

      await waitFor(() => {
        expect(getComputedStyle(getNode('body')).backgroundColor).toBe(
          'rgb(236, 238, 248)'
        );
      });

      expect({
        padding: getComputedStyle(getNode('body')).padding,
        shell: getComputedStyle(getNode('container')).backgroundColor,
      }).toEqual({ padding: '20px', shell: 'rgb(255, 0, 0)' });
    });

    it('keeps the body style the document authored over the theme', async () => {
      const { ref, view } = await render({
        content: {
          type: 'doc',
          attrs: { version: 2 },
          content: [
            {
              type: 'body',
              attrs: { style: 'background-color:#eceef8' },
              content: [
                {
                  type: 'container',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Shelled' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        theme: true,
      });

      await waitFor(() => {
        expect(
          getComputedStyle(
            view.container.querySelector<HTMLElement>(
              '[data-node-type="body"]'
            )!
          ).backgroundColor
        ).toBe('rgb(236, 238, 248)');
      });

      expect(ref.current!.getJSON().content[0]?.attrs?.style).toBe(
        'background-color:#eceef8'
      );
    });
  });
});
