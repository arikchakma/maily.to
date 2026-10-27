import type { DocumentNode } from '@maily-to/shared';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import { render } from '../src/index';

function buttonDocument(kind: 'full-width' | 'tight'): DocumentNode {
  return {
    type: 'doc',
    attrs: { version: 2 },
    content: [
      {
        type: 'button',
        attrs: {
          align: 'left',
          kind,
          style: 'background-color:#000000;color:#ffffff;padding:14px 20px',
          url: 'https://maily.to',
        },
        content: [{ type: 'text', text: 'Confirm email' }],
      },
    ],
  };
}

function getButtonRow(html: string) {
  return parse(html).querySelector('a')?.closest('table') ?? null;
}

function getTableMaxWidths(html: string) {
  const style = getButtonRow(html)?.getAttribute('style') ?? '';

  return [/max-width:([^;]+)/.exec(style)?.[1] ?? null];
}

function getCellAligns(html: string) {
  return (
    getButtonRow(html)
      ?.querySelectorAll('td')
      .map((cell) => cell.getAttribute('align') ?? null) ?? []
  );
}

const KINDS = ['tight', 'full-width'] as const;

describe('button', () => {
  // The wrapper only places the button. React Email's `Container` caps its width
  // at 37.5em, which is narrower than the cell around it whenever the surrounding
  // font size is under 16px.
  it.each(KINDS)(
    'wraps a %s button in a table that does not cap its width',
    async (kind) => {
      const html = await render(buttonDocument(kind));

      expect({
        aligns: getCellAligns(html),
        maxWidths: getTableMaxWidths(html),
      }).toEqual({ aligns: ['left'], maxWidths: [null] });
    }
  );
});
