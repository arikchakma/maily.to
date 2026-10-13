import {
  cleanup,
  render as renderReact,
  waitFor,
} from '@testing-library/react';
import type { JSONContent } from '@tiptap/core';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { userEvent } from 'vite-plus/test/browser/context';

import { getContentFromHtml, PlainVariableInput } from '~/index';

afterEach(() => {
  cleanup();
});

const CONTENT = 'Hi {{firstName fallback="there"}}, meet {{company}}';

async function renderInput() {
  const onContentChange = vi.fn();
  const onEnter = vi.fn();

  renderReact(
    <PlainVariableInput
      aria-label="Subject"
      content={CONTENT}
      onContentChange={onContentChange}
      onEnter={onEnter}
      variables={[{ id: 'firstName' }, { id: 'company' }]}
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
