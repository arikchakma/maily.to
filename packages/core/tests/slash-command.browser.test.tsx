import { waitFor } from '@testing-library/react';
import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import {
  createRenderer,
  EMPTY_DOCUMENT,
  getContainerContent,
  getDocument,
} from '#test-utils';
import { SlashCommandExtension } from '~/extensions';
import type { SlashCommandGroupItem } from '~/utils/slash-command';

const TWO_PARAGRAPHS = getDocument([
  { type: 'paragraph' },
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Second paragraph' }],
  },
]);

const TWO_SECTIONS = getDocument([
  { type: 'section', content: [{ type: 'paragraph' }] },
  {
    type: 'section',
    content: [
      { type: 'paragraph', content: [{ type: 'text', text: 'Next section' }] },
    ],
  },
]);

const TABLE_THEN_PARAGRAPH = getDocument([
  {
    type: 'table',
    attrs: { responsive: true },
    content: [
      {
        type: 'tableRow',
        content: [
          {
            type: 'tableCell',
            attrs: { colspan: 1, colwidth: null, rowspan: 1 },
            content: [{ type: 'paragraph' }],
          },
        ],
      },
    ],
  },
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'After the table' }],
  },
]);

function getSuggestion() {
  return document.querySelector('[data-mly-suggestion]');
}

function getItems() {
  return [...document.querySelectorAll('[data-mly-slash-command-item]')];
}

function getTitles() {
  return [...document.querySelectorAll('[data-mly-slash-command-title]')].map(
    (title) => {
      return title.textContent;
    }
  );
}

function getSelectedIndex() {
  return getItems().findIndex((item) => {
    return item.hasAttribute('data-selected');
  });
}

type NavigationStep = {
  index: number | 'last';
  key: string;
  pressPerItem?: boolean;
};

const NAVIGATION_CASES: {
  name: string;
  steps: NavigationStep[];
}[] = [
  {
    name: 'wraps from the last item to the first with ArrowDown',
    steps: [{ index: 0, key: '{ArrowDown}', pressPerItem: true }],
  },
  {
    name: 'wraps from the first item to the last with ArrowUp',
    steps: [{ index: 'last', key: '{ArrowUp}' }],
  },
  {
    name: 'jumps to the last item with End',
    steps: [{ index: 'last', key: '{End}' }],
  },
  {
    name: 'jumps back to the first item with Home',
    steps: [
      { index: 'last', key: '{End}' },
      { index: 0, key: '{Home}' },
    ],
  },
];

const ARROW_DOWN_CONTENT_CASES = [
  {
    content: TWO_SECTIONS,
    name: 'keeps ArrowDown when a gap cursor could follow the paragraph',
  },
  {
    content: TABLE_THEN_PARAGRAPH,
    name: 'keeps ArrowDown inside a table cell',
  },
];

describe('<SlashCommandExtension />', () => {
  const { render } = createRenderer();

  type OpenMenuOptions = {
    caret?: number | 'start' | 'end';
    commands?: SlashCommandGroupItem[];
    content?: JSONContent;
    query?: string;
  };

  async function openMenu(options: OpenMenuOptions = {}) {
    const {
      caret = 'start',
      commands,
      content = EMPTY_DOCUMENT,
      query = '',
    } = options;

    const mounted = await render({
      caret,
      content,
      extensions: commands
        ? [SlashCommandExtension.configure({ commands })]
        : undefined,
    });

    await userEvent.keyboard(`/${query}`);

    await waitFor(() => {
      expect(getSuggestion()).not.toBeNull();
    });

    return mounted;
  }

  describe('opening the menu', () => {
    it('opens when a slash is typed in an empty paragraph', async () => {
      await openMenu();

      expect(getItems().length).toBeGreaterThan(5);
    });

    it('does not open when a slash follows text without a space', async () => {
      await render({ caret: 'end', content: TWO_PARAGRAPHS });

      await userEvent.keyboard('/');

      expect(getSuggestion()).toBeNull();
    });

    it('opens when a slash follows a space', async () => {
      await render({ caret: 'end', content: TWO_PARAGRAPHS });

      await userEvent.keyboard(' /');

      await waitFor(() => {
        expect(getSuggestion()).not.toBeNull();
      });
    });
  });

  describe('items', () => {
    it('hides an item whose render returns null', async () => {
      await openMenu({
        commands: [
          {
            title: 'Blocks',
            commands: [
              {
                command: () => undefined,
                searchTerms: ['shown'],
                title: 'Shown',
              },
              {
                command: () => undefined,
                render: () => null,
                searchTerms: ['hidden'],
                title: 'Hidden',
              },
            ],
          },
        ],
      });

      expect(getTitles()).toEqual(['Shown']);
    });

    it('lets an item replace its own row', async () => {
      await openMenu({
        commands: [
          {
            title: 'Blocks',
            commands: [
              {
                command: () => undefined,
                render: () => {
                  return <span data-custom-row="">Custom row</span>;
                },
                searchTerms: ['custom'],
                title: 'Custom',
              },
            ],
          },
        ],
      });

      const item = getItems()[0]!;

      expect({
        custom: item.querySelector('[data-custom-row]')?.textContent,
        title: item.querySelector('[data-mly-slash-command-title]'),
      }).toEqual({ custom: 'Custom row', title: null });
    });

    it('marks a nested item with a chevron', async () => {
      await openMenu({
        commands: [
          {
            title: 'Blocks',
            commands: [
              {
                command: () => undefined,
                searchTerms: ['flat'],
                title: 'Flat',
              },
              {
                commands: [
                  {
                    command: () => undefined,
                    searchTerms: ['child'],
                    title: 'Child',
                  },
                ],
                id: 'nested',
                searchTerms: ['nested'],
                title: 'Nested',
              },
            ],
          },
        ],
      });

      expect(
        getItems().map((item) => {
          return Boolean(
            item.querySelector('[data-mly-slash-command-chevron]')
          );
        })
      ).toEqual([false, true]);
    });
  });

  describe('previews', () => {
    it('previews an item on hover after a delay', async () => {
      await openMenu({
        commands: [
          {
            title: 'Blocks',
            commands: [
              {
                command: () => undefined,
                description: 'What it looks like',
                preview: 'https://maily.to/brand/logo.png',
                searchTerms: ['shot'],
                title: 'Shot',
              },
            ],
          },
        ],
      });

      expect(document.querySelector('[data-mly-tooltip]')).toBeNull();

      await userEvent.hover(getItems()[0] as HTMLElement);

      const preview = await waitFor(() => {
        const found = document.querySelector<HTMLImageElement>(
          '[data-mly-tooltip][data-variant="preview"] img'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      expect(preview.getAttribute('src')).toBe(
        'https://maily.to/brand/logo.png'
      );
    });

    it('draws a preview node in place of the image', async () => {
      await openMenu({
        commands: [
          {
            title: 'Blocks',
            commands: [
              {
                command: () => undefined,
                preview: () => {
                  return <span data-node-preview="">Drawn</span>;
                },
                searchTerms: ['drawn'],
                title: 'Drawn',
              },
            ],
          },
        ],
      });

      await userEvent.hover(getItems()[0] as HTMLElement);

      await waitFor(() => {
        expect(document.querySelector('[data-node-preview]')?.textContent).toBe(
          'Drawn'
        );
      });
    });
  });

  describe('filtering', () => {
    it('filters the menu by the typed query', async () => {
      await openMenu({ query: 'spac' });

      expect(getTitles()).toEqual(['Spacer']);
    });

    it('lists a nested group by its dot notation prefix', async () => {
      await openMenu({ query: 'headers.' });

      await waitFor(() => {
        expect(getTitles()).toEqual([
          'Logo with Text (Vertical)',
          'Logo with Text (Horizontal)',
          'Logo with Cover Image',
        ]);
      });
    });

    it('narrows a nested group by the text after the dot', async () => {
      await openMenu({ query: 'footers.copyright' });

      await waitFor(() => {
        expect(getTitles()).toEqual(['Footer Copyright']);
      });
    });
  });

  describe('keyboard navigation', () => {
    for (const { name, steps } of NAVIGATION_CASES) {
      it(name, async () => {
        const { ref } = await openMenu({ content: TWO_PARAGRAPHS });
        const before = ref.current!.getEditor().state.selection.from;
        const count = getItems().length;

        for (const step of steps) {
          const presses = step.pressPerItem ? count : 1;
          const expected = step.index === 'last' ? count - 1 : step.index;

          for (let press = 0; press < presses; press += 1) {
            await userEvent.keyboard(step.key);
          }

          await waitFor(() => {
            expect(getSelectedIndex()).toBe(expected);
          });
        }

        expect({
          caret: ref.current!.getEditor().state.selection.from,
          open: getSuggestion() !== null,
        }).toEqual({ caret: before, open: true });
      });
    }

    for (const { content, name } of ARROW_DOWN_CONTENT_CASES) {
      it(name, async () => {
        const { ref } = await openMenu({ content });
        const before = ref.current!.getEditor().state.selection.from;

        await userEvent.keyboard('{ArrowDown}');

        await waitFor(() => {
          expect(getSelectedIndex()).toBe(1);
        });
        expect({
          caret: ref.current!.getEditor().state.selection.from,
          open: getSuggestion() !== null,
        }).toEqual({ caret: before, open: true });
      });
    }
  });

  describe('inserting a block', () => {
    it('inserts the chosen block and removes the query text', async () => {
      const { ref } = await openMenu({ query: 'spac' });

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(getSuggestion()).toBeNull();
      });
      expect({
        hasSlashText: ref.current!.getText().includes('/'),
        types: getContainerContent(ref.current!).map((node) => {
          return node.type;
        }),
      }).toEqual({ hasSlashText: false, types: ['spacer'] });
    });

    it('inserts a section that wraps a paragraph', async () => {
      const { ref } = await openMenu({ query: 'sect' });

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(getSuggestion()).toBeNull();
      });

      const section = getContainerContent(ref.current!).find((node) => {
        return node.type === 'section';
      });

      expect({
        inner: section?.content?.map((node) => {
          return node.type;
        }),
        style: section?.attrs?.style,
      }).toEqual({ inner: ['paragraph'], style: null });
    });

    it('opens the headers group and inserts the template it holds', async () => {
      const { ref } = await openMenu({ query: 'header' });

      await waitFor(() => {
        expect(getTitles()).toEqual(['Headers']);
      });

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(getTitles()).toEqual([
          'Logo with Text (Vertical)',
          'Logo with Text (Horizontal)',
          'Logo with Cover Image',
        ]);
      });

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(getSuggestion()).toBeNull();
      });
      expect({
        hasSlashText: ref.current!.getText().includes('/'),
        types: getContainerContent(ref.current!).map((node) => {
          return node.type;
        }),
      }).toEqual({
        hasSlashText: false,
        types: ['image', 'spacer', 'heading'],
      });
    });

    it('closes the menu on Escape without inserting', async () => {
      const { ref } = await openMenu({ query: 'button' });

      await userEvent.keyboard('{Escape}');

      await waitFor(() => {
        expect(getSuggestion()).toBeNull();
      });
      expect(
        getContainerContent(ref.current!).some((node) => {
          return node.type === 'button';
        })
      ).toBe(false);
    });
  });
});
