import { describe, expect, it } from 'vite-plus/test';

import { createRenderer, getContainerContent } from '#test-utils';

const NODE_STYLE_CASES: {
  content: string;
  declarations: Record<string, string | null>;
  expected: string | null;
  name: string;
}[] = [
  {
    content: '<p style="color:#111827;margin:0">Styled</p>',
    declarations: { backgroundColor: '#f7f7f7' },
    expected: 'color:#111827;margin:0;background-color:#f7f7f7',
    name: 'merges a declaration into an existing style',
  },
  {
    content: '<p style="color:#111827">Styled</p>',
    declarations: { color: '#ef4444' },
    expected: 'color:#ef4444',
    name: 'replaces a declaration that is already present',
  },
  {
    content: '<p style="color:#111827;margin:0">Styled</p>',
    declarations: { color: '' },
    expected: 'margin:0',
    name: 'removes a declaration when given an empty value',
  },
  {
    content: '<p style="color:#111827">Styled</p>',
    declarations: { color: null },
    expected: null,
    name: 'clears the style attribute when the last declaration goes',
  },
];

describe('node styles', () => {
  const { render } = createRenderer();

  for (const { content, declarations, expected, name } of NODE_STYLE_CASES) {
    it(name, async () => {
      const { ref } = await render({ content });

      ref.current
        ?.getEditor()
        .chain()
        .focus()
        .updateNodeStyle('paragraph', declarations)
        .run();

      expect(getContainerContent(ref.current!).at(-1)?.attrs?.style).toBe(
        expected
      );
    });
  }
});
