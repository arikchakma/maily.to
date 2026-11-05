import { waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { createRenderer, getContainerContent, getDocument } from '#test-utils';
import { TextBubbleMenu } from '~/index';
import type { Editor } from '~/index';

const DOCUMENT = getDocument([
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Select this text' }],
  },
]);

async function findButton(label: string) {
  return waitFor(() => {
    const found = document.querySelector<HTMLElement>(
      `[data-mly-bubble-button][aria-label="${label}"]`
    );
    expect(found).not.toBeNull();
    return found!;
  });
}

function selectAllText(handle: Editor.Root.Handle) {
  handle.getEditor().commands.selectAll();
}

describe('<TextBubbleMenu />', () => {
  const { render } = createRenderer();

  const mountEditor = async () => {
    return render({
      caret: 'end',
      children: <TextBubbleMenu />,
      content: DOCUMENT,
    });
  };

  describe('visibility', () => {
    it('stays hidden while the selection is empty', async () => {
      await mountEditor();

      expect(document.querySelector('[data-mly-bubble-menu]')).toBeNull();
    });

    it('appears once text is selected', async () => {
      const { ref } = await mountEditor();

      selectAllText(ref.current!);

      await waitFor(() => {
        expect(document.querySelector('[data-mly-bubble-menu]')).not.toBeNull();
      });

      expect(
        [...document.querySelectorAll('[data-mly-bubble-button]')].map(
          (button) => {
            return button.getAttribute('aria-label');
          }
        )
      ).toEqual([
        'Turn into',
        'Bold',
        'Italic',
        'Underline',
        'Strikethrough',
        'Code',
        'Alignment',
        'Link',
        'Background Color',
        'Text Color',
      ]);
    });
  });

  describe('marks', () => {
    it('applies a mark and reflects it as active', async () => {
      const { ref } = await mountEditor();

      selectAllText(ref.current!);

      await userEvent.click(await findButton('Bold'));

      await waitFor(() => {
        expect(
          document
            .querySelector('[data-mly-bubble-button][aria-label="Bold"]')
            ?.hasAttribute('data-active')
        ).toBe(true);
      });

      expect(
        getContainerContent(ref.current!).at(-1)?.content?.[0]?.marks?.[0]?.type
      ).toBe('bold');
    });

    it('highlights the selection with a background colour', async () => {
      const { ref } = await mountEditor();

      selectAllText(ref.current!);

      await userEvent.click(await findButton('Background Color'));
      await userEvent.click(await findButton('Blue Background'));

      await waitFor(() => {
        expect(
          getContainerContent(ref.current!)
            .at(-1)
            ?.content?.[0]?.marks?.find((mark) => {
              return mark.type === 'highlight';
            })?.attrs?.color
        ).toBe('#E9F3F7');
      });
    });
  });

  describe('links', () => {
    it('turns the selection into a link', async () => {
      const { ref } = await mountEditor();

      selectAllText(ref.current!);

      await userEvent.click(await findButton('Link'));

      const field = await waitFor(() => {
        const found = document.querySelector<HTMLElement>(
          '[data-mly-skeleton-editor] [contenteditable="true"]'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      await userEvent.click(field);
      await userEvent.keyboard('https://maily.to{Enter}');

      await waitFor(() => {
        expect(
          getContainerContent(ref.current!).at(-1)?.content?.[0]?.marks?.[0]
        ).toMatchObject({ attrs: { href: 'https://maily.to' }, type: 'link' });
      });
    });

    it('takes a variable as the link url', async () => {
      const { ref } = await mountEditor();

      selectAllText(ref.current!);

      await userEvent.click(await findButton('Link'));

      const field = await waitFor(() => {
        const found = document.querySelector<HTMLElement>(
          '[data-mly-skeleton-editor] [contenteditable="true"]'
        );
        expect(found).not.toBeNull();
        return found!;
      });

      await userEvent.click(field);
      await userEvent.keyboard('{{{{profileUrl');

      await waitFor(() => {
        expect(document.querySelector('[data-mly-suggestion]')).not.toBeNull();
      });

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(
          field.querySelector('[data-node-type="variable"]')
        ).not.toBeNull();
      });
    });
  });

  it('writes the chosen alignment into the paragraph style', async () => {
    const { ref } = await mountEditor();

    selectAllText(ref.current!);

    await userEvent.click(await findButton('Alignment'));
    await userEvent.click(await findButton('Align Center'));

    await waitFor(() => {
      expect(getContainerContent(ref.current!).at(-1)?.attrs?.style).toContain(
        'text-align:center'
      );
    });
  });
});
