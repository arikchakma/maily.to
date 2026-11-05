import type { DocumentNode } from '@maily-to/shared';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import { render } from '../src/index';

const BULLET_STYLE =
  'display:inline-block;border-color:rgb(228,228,231);border-style:solid;border-width:1px;border-radius:9999px;width:1.5rem;height:1.5rem;vertical-align:middle';

const BULLET: DocumentNode = {
  type: 'doc',
  attrs: { version: 2 },
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'inlineSpan', attrs: { style: BULLET_STYLE } }],
    },
  ],
};

describe('inline span', () => {
  it('renders an inline span node with its style', async () => {
    const html = await render(BULLET);
    const span = parse(html).querySelector('p span');

    expect(span?.getAttribute('style')).toBe(BULLET_STYLE);
  });
});
