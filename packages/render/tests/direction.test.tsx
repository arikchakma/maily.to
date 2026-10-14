import type { DocumentNode } from '@maily-to/shared';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vite-plus/test';

import { render } from '../src/index';

function directed(dir?: string) {
  return {
    type: 'doc',
    attrs: { version: 2, ...(dir ? { dir } : {}) },
    content: [
      { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
    ],
  } as DocumentNode;
}

async function getHtmlDir(document: DocumentNode) {
  return parse(await render(document))
    .querySelector('html')
    ?.getAttribute('dir');
}

const CASES = [
  {
    dir: 'rtl',
    expected: 'rtl',
    name: 'carries the document text direction onto the email',
  },
  {
    dir: undefined,
    expected: 'ltr',
    name: 'leaves the direction alone when the document sets none',
  },
];

describe('direction', () => {
  // React Email's `Html` defaults `dir` to ltr, so an editor set to rtl renders a
  // left-to-right email unless the document's own direction is passed through.
  for (const { dir, expected, name } of CASES) {
    it(name, async () => {
      expect(await getHtmlDir(directed(dir))).toBe(expected);
    });
  }
});
