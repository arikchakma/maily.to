import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vite-plus/test';

import { COLUMNS_RESPONSIVE_CSS } from './nodes/columns';
import { render } from './render';

const BASE_CSS =
  'blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}';

function makeDoc(...content: JSONContent[]): JSONContent {
  return { type: 'doc', attrs: { dir: null }, content };
}

function makeParagraph(text = 'hello'): JSONContent {
  return {
    type: 'paragraph',
    attrs: { textAlign: null, dir: null },
    content: [{ type: 'text', text }],
  };
}

function makeColumns(count = 2): JSONContent {
  const cols = Array.from({ length: count }, () => ({
    type: 'column',
    attrs: { width: null, verticalAlign: 'top' },
    content: [makeParagraph()],
  }));
  return {
    type: 'columns',
    attrs: { gap: 0 },
    content: cols,
  };
}

describe('conditional global styles', () => {
  it('includes only base CSS when no columns are present', async () => {
    const html = await render(makeDoc(makeParagraph()));

    expect(html).toContain(BASE_CSS);
    expect(html).not.toContain('tab-row-full{width:100%');
    expect(html).not.toContain('tab-col-full');
    expect(html).not.toContain('tab-pad');
  });

  it('includes column responsive CSS when columns are present', async () => {
    const html = await render(makeDoc(makeColumns()));

    expect(html).toContain(BASE_CSS);
    expect(html).toContain(COLUMNS_RESPONSIVE_CSS);
  });

  it('includes column CSS only once for multiple columns blocks', async () => {
    const html = await render(
      makeDoc(makeColumns(), makeParagraph(), makeColumns())
    );

    const occurrences = html.split(COLUMNS_RESPONSIVE_CSS).length - 1;
    expect(occurrences).toBe(1);
  });

  it('includes column CSS alongside base CSS in a single style tag', async () => {
    const html = await render(makeDoc(makeColumns()));

    expect(html).toContain(BASE_CSS + COLUMNS_RESPONSIVE_CSS);
  });

  it('includes inline font-family on body when theme has font configured', async () => {
    const html = await render(makeDoc(makeParagraph()));

    const bodySection = html.slice(html.indexOf('<body'));
    expect(bodySection).toContain('font-family:&#x27;Inter&#x27;, sans-serif');
  });

  it('does not include inline font-family on body when font is null', async () => {
    const html = await render(makeDoc(makeParagraph()), {
      theme: { font: null },
    });

    const bodySection = html.slice(html.indexOf('<body'));
    expect(bodySection).not.toContain('font-family');
  });
});
