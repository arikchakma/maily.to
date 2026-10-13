import {
  cleanup,
  render as renderReact,
  waitFor,
} from '@testing-library/react';
import type { JSONContent } from '@tiptap/core';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { getContentFromHtml, PlainVariableInput } from '~/index';
import type { PlainVariableInputProps } from '~/index';
import { VARIABLE_SUGGESTION_POPOVER_ID } from '~/utils/variable';

import editorCss from '~/styles/index.css?raw';

afterEach(() => {
  cleanup();
  document.head.querySelectorAll('style').forEach((style) => style.remove());
});

const MODIFIER = navigator.platform.includes('Mac') ? 'Meta' : 'Control';

const HISTORY_GROUP_DELAY = 600;

function waitForNewHistoryGroup() {
  return new Promise((resolve) => setTimeout(resolve, HISTORY_GROUP_DELAY));
}

const CONTENT = 'Hi {{firstName fallback="there"}}, meet {{company}}';

async function renderInput(props: Partial<PlainVariableInputProps> = {}) {
  const onContentChange = vi.fn();
  const onEnter = vi.fn();

  const style = document.createElement('style');
  style.textContent = editorCss;
  document.head.append(style);

  renderReact(
    <PlainVariableInput
      aria-label="Subject"
      content={CONTENT}
      onContentChange={onContentChange}
      onEnter={onEnter}
      variables={[{ id: 'firstName' }, { id: 'company' }]}
      {...props}
    />
  );

  const textbox = await waitFor(() => {
    const element = document.querySelector<HTMLElement>(
      '[aria-label="Subject"]'
    );
    expect(element).not.toBeNull();

    return element!;
  });

  return { onContentChange, onEnter, textbox };
}

describe('<PlainVariableInput />', () => {
  it('keeps text and every variable in the content', async () => {
    const { onContentChange, textbox } = await renderInput();

    expect(textbox.querySelectorAll('[data-mly-variable]').length).toBe(2);

    await userEvent.click(textbox);
    await userEvent.keyboard('{ArrowRight}!');

    await waitFor(() => {
      expect(onContentChange).toHaveBeenLastCalledWith(`${CONTENT}!`);
    });
  });

  it('calls onEnter instead of adding a line', async () => {
    const { onContentChange, onEnter, textbox } = await renderInput();

    await userEvent.click(textbox);
    await userEvent.keyboard('{Enter}');

    expect(onEnter).toHaveBeenCalledOnce();
    expect(onContentChange).not.toHaveBeenCalled();
    expect(textbox.querySelectorAll('p').length).toBe(1);
  });

  it('edits a variable fallback from the bubble menu', async () => {
    const { onContentChange, textbox } = await renderInput();
    const chip = textbox.querySelector<HTMLElement>('[data-mly-variable]')!;

    await userEvent.click(chip);

    const selected = chip.closest<HTMLElement>('.ProseMirror-selectednode');
    const line = textbox.querySelector('p')!.getBoundingClientRect();
    const highlight = selected!.getBoundingClientRect();

    expect({
      background: getComputedStyle(selected!, '::after').backgroundColor,
      clipped:
        highlight.top - 2 < line.top || highlight.bottom + 2 > line.bottom,
    }).toEqual({
      background: expect.not.stringMatching(
        /^(transparent|rgba\(0, 0, 0, 0\))$/
      ),
      clipped: false,
    });

    const fallback = await waitFor(() => {
      const element = document.querySelector<HTMLInputElement>(
        'input[aria-label="Default Value"]'
      );
      expect(element).not.toBeNull();

      return element!;
    });

    await userEvent.clear(fallback);
    await userEvent.type(fallback, 'friend{Enter}');

    await waitFor(() => {
      expect(onContentChange).toHaveBeenLastCalledWith(
        'Hi {{firstName fallback="friend"}}, meet {{company}}'
      );
    });
  });

  it('shows only the default field when the id is not editable', async () => {
    const { textbox } = await renderInput({ isIdEditable: false });

    await userEvent.click(textbox.querySelector('[data-mly-variable]')!);

    await waitFor(() => {
      expect(
        document.querySelector('input[aria-label="Default Value"]')
      ).not.toBeNull();
    });
    expect(document.querySelector('input[aria-label="Variable"]')).toBeNull();
  });

  it('keeps a typed trailing space as a regular space', async () => {
    const { onContentChange, textbox } = await renderInput({ content: '' });

    await userEvent.click(textbox);
    await userEvent.keyboard('Hi ');

    await waitFor(() => {
      expect(onContentChange).toHaveBeenLastCalledWith('Hi ');
    });
  });

  it('undoes and redoes text, variables and fallback edits', async () => {
    const { onContentChange, textbox } = await renderInput({ content: '' });
    const getLast = () => onContentChange.mock.lastCall?.[0];

    await userEvent.click(textbox);
    await userEvent.keyboard('Hi,');
    await waitForNewHistoryGroup();
    await userEvent.keyboard('{{{{');
    await waitFor(() => {
      expect(
        document.getElementById(VARIABLE_SUGGESTION_POPOVER_ID)
      ).not.toBeNull();
    });
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(getLast()).toBe('Hi,{{firstName}}');
    });

    await waitForNewHistoryGroup();
    await userEvent.click(textbox.querySelector('[data-mly-variable]')!);
    const fallback = await waitFor(() => {
      const element = document.querySelector<HTMLInputElement>(
        'input[aria-label="Default Value"]'
      );
      expect(element).not.toBeNull();

      return element!;
    });
    await userEvent.type(fallback, 'friend{Enter}');
    await waitFor(() => {
      expect(getLast()).toBe('Hi,{{firstName fallback="friend"}}');
    });

    const emitted: string[] = [];
    for (const shortcut of [
      `{${MODIFIER}>}z{/${MODIFIER}}`,
      `{${MODIFIER}>}z{/${MODIFIER}}`,
      `{${MODIFIER}>}z{/${MODIFIER}}`,
      `{${MODIFIER}>}{Shift>}z{/Shift}{/${MODIFIER}}`,
      `{${MODIFIER}>}y{/${MODIFIER}}`,
      `{${MODIFIER}>}y{/${MODIFIER}}`,
    ]) {
      textbox.focus();
      await userEvent.keyboard(shortcut);
      emitted.push(getLast());
    }

    expect({
      emitted,
      isSuggestionOpen: Boolean(
        document.getElementById(VARIABLE_SUGGESTION_POPOVER_ID)
      ),
    }).toEqual({
      emitted: [
        'Hi,{{firstName}}',
        'Hi,',
        '',
        'Hi,',
        'Hi,{{firstName}}',
        'Hi,{{firstName fallback="friend"}}',
      ],
      isSuggestionOpen: false,
    });
  });
});

describe('getContentFromHtml', () => {
  it('returns the maily document for an html string', () => {
    const content = getContentFromHtml(
      '<body style="background-color:#f4f4f5"><p>Hello <strong>world</strong></p></body>'
    );

    expect(JSON.stringify(content)).toContain('"text":"world"');
    expect({
      body: content.content?.[0]?.type,
      type: content.type,
    }).toEqual({ body: 'body', type: 'doc' });
  });

  it('turns variable syntax in text into variable nodes', () => {
    const content = getContentFromHtml(
      [
        '<h1>Welcome, {{first_name fallback="friend"}}</h1>',
        '<p><a href="https://example.com/{{id}}">Hi {{company}}</a></p>',
        '<p><code>{{literal}}</code></p>',
      ].join('')
    );

    const nodes: JSONContent[] = [];
    const visit = (node: JSONContent) => {
      nodes.push(node);
      node.content?.forEach(visit);
    };
    visit(content as JSONContent);

    const variables = nodes.filter((node) => node.type === 'variable');

    expect(
      variables.map((node) => ({
        fallback: node.attrs?.fallback,
        id: node.attrs?.id,
        marks: node.marks?.map((mark) => mark.type),
      }))
    ).toEqual([
      { fallback: 'friend', id: 'first_name', marks: undefined },
      { fallback: null, id: 'company', marks: ['link'] },
    ]);
    expect(nodes.some((node) => node.text === '{{literal}}')).toBe(true);
  });
});
