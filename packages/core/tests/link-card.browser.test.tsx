import { render as renderMaily } from '@maily-to/render';
import { waitFor } from '@testing-library/react';
import type { AnyExtension } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import {
  cleanup,
  createRenderer,
  EMPTY_DOCUMENT,
  getContainerContent,
  getDocument,
} from '#test-utils';
import { LinkCardExtension } from '~/extensions';
import { LinkCardBubbleMenu } from '~/index';
import type { Editor } from '~/index';

const CARD = {
  badgeText: 'New',
  description: 'What the page is about',
  image: 'https://maily.to/brand/logo.png',
  link: 'https://maily.to',
  linkTitle: 'Read more',
  subTitle: '5 min read',
  title: 'Card title',
};

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Above the card' }],
  },
  { type: 'linkCard', attrs: CARD },
]);

function getCard(handle: Editor.Root.Handle) {
  return getContainerContent(handle).find((node) => {
    return node.type === 'linkCard';
  });
}

function selectCard(handle: Editor.Root.Handle) {
  const editor = handle.getEditor();
  let position: number | null = null;

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === 'linkCard') {
      position = pos;
    }
  });

  editor.chain().focus().setNodeSelection(position!).run();
}

async function openFields(handle: Editor.Root.Handle) {
  selectCard(handle);

  const trigger = await waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      '[data-mly-bubble-button][aria-label="Card Fields"]'
    );
    expect(found).not.toBeNull();
    return found!;
  });

  await userEvent.click(trigger);

  return waitFor(() => {
    const found = document.querySelector<HTMLElement>('[data-mly-popover]');
    expect(found).not.toBeNull();
    return found!;
  });
}

describe('<LinkCardExtension />', () => {
  const { render } = createRenderer();

  const mountEditor = async (content = DOCUMENT) => {
    return render({
      children: <LinkCardBubbleMenu />,
      content,
      extensions: [LinkCardExtension],
      styled: true,
    });
  };

  describe('registration', () => {
    it('is opt-in, so an editor without the extension keeps no card', async () => {
      const { ref } = await render({ content: DOCUMENT });

      expect(getCard(ref.current!)).toBeUndefined();
    });

    it('shows its block in the slash menu only when registered', async () => {
      const openMenu = async (extensions: AnyExtension[]) => {
        const { ref } = await render({
          caret: 'end',
          content: EMPTY_DOCUMENT,
          extensions,
        });

        await userEvent.keyboard('/card');

        await waitFor(() => {
          expect(ref.current!.getEditor().getText()).toContain('/card');
        });

        const titles = [
          ...document.querySelectorAll('[data-mly-slash-command-title]'),
        ].map((title) => {
          return title.textContent;
        });

        cleanup();

        return titles;
      };

      expect({
        with: await openMenu([LinkCardExtension]),
        without: await openMenu([]),
      }).toEqual({ with: ['Link Card'], without: [] });
    });
  });

  describe('rendering', () => {
    it('renders every field it carries in the editor', async () => {
      await mountEditor();

      const card = document.querySelector('[data-mly-link-card]');

      expect({
        badge: card?.querySelector('[data-mly-link-card-badge]')?.textContent,
        cta: card?.querySelector('[data-mly-link-card-cta]')?.textContent,
        description: card
          ?.querySelector('[data-mly-link-card-description]')
          ?.textContent?.trim(),
        image: card
          ?.querySelector<HTMLImageElement>('[data-mly-link-card-image]')
          ?.getAttribute('src'),
        title: card?.querySelector('[data-mly-link-card-title]')?.textContent,
      }).toEqual({
        badge: CARD.badgeText,
        cta: CARD.linkTitle,
        description: `${CARD.description} ${CARD.linkTitle}`,
        image: CARD.image,
        title: CARD.title,
      });
    });

    it('shows the empty state until a card carries something', async () => {
      const { ref } = await mountEditor(EMPTY_DOCUMENT);

      ref.current?.getEditor().chain().focus().setLinkCard().run();

      await waitFor(() => {
        expect(document.querySelector('[data-mly-image-state]')).not.toBeNull();
      });

      ref.current?.getEditor().commands.updateLinkCardAttributes({
        title: 'Now filled',
      });

      await waitFor(() => {
        expect(document.querySelector('[data-mly-image-state]')).toBeNull();
        expect(
          document.querySelector('[data-mly-link-card-title]')?.textContent
        ).toBe('Now filled');
      });
    });
  });

  describe('the fields popover', () => {
    it('lays the fields out as labelled rows split by dividers', async () => {
      const { ref } = await mountEditor();

      const popover = await openFields(ref.current!);
      const rows = [...popover.querySelectorAll('[data-mly-metadata-field]')];

      expect({
        dividers: popover.querySelectorAll(
          '[data-mly-divider][data-type="horizontal"]'
        ).length,
        labels: rows.map((row) => {
          return row.querySelector('[data-mly-field-label]')?.textContent;
        }),
        variant: popover.dataset.variant,
      }).toEqual({
        dividers: rows.length - 1,
        labels: ['Image', 'Title', 'Desc.', 'URL', 'CTA', 'Badge', 'Sub.'],
        variant: 'link-card',
      });
    });

    it('sizes a field row the way the current Maily repository sizes it', async () => {
      const { ref } = await mountEditor();

      const popover = await openFields(ref.current!);
      const row = popover.querySelector('[data-mly-metadata-field]')!;
      const label = row.querySelector('[data-mly-field-label]')!;
      const input = row.querySelector('[data-mly-field-input]')!;
      const inputStyle = getComputedStyle(input);

      expect({
        input: input.getBoundingClientRect().width,
        inputHeight: input.getBoundingClientRect().height,
        label: label.getBoundingClientRect().width,
        popover: popover.getBoundingClientRect().width,
        row: row.getBoundingClientRect().width,
        text:
          input.getBoundingClientRect().width -
          Number.parseFloat(inputStyle.paddingLeft) -
          Number.parseFloat(inputStyle.paddingRight),
      }).toEqual({
        input: 200,
        inputHeight: 28,
        label: 64,
        popover: 278,
        row: 268,
        text: 184,
      });
    });

    it('writes a field from the bubble menu back onto the node', async () => {
      const { ref } = await mountEditor();

      const popover = await openFields(ref.current!);
      const input = popover.querySelector<HTMLInputElement>(
        '[data-mly-field-input]'
      );

      await userEvent.fill(input!, 'https://maily.to/cover.png');

      await waitFor(() => {
        expect(getCard(ref.current!)?.attrs?.image).toBe(
          'https://maily.to/cover.png'
        );
      });
    });
  });

  it('round-trips through the exported html', async () => {
    const { ref } = await mountEditor();

    const exported = await renderMaily(ref.current!.getJSON());
    const anchors = new DOMParser()
      .parseFromString(exported, 'text/html')
      .querySelectorAll('a');

    expect({
      card: anchors[0]?.getAttribute('href'),
      cta: anchors[1]?.textContent,
      hasImage: exported.includes(CARD.image),
      text: anchors[0]?.textContent?.includes(CARD.title),
    }).toEqual({
      card: CARD.link,
      cta: CARD.linkTitle,
      hasImage: true,
      text: true,
    });
  });
});
