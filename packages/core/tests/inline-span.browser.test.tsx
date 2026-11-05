import { DEFAULT_TEXT_DIRECTION } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { createRenderer, getContainerContent } from '#test-utils';

const BULLET_STYLE =
  'display:inline-block;border-color:rgb(228,228,231);border-style:solid;border-width:1px;border-radius:9999px;width:1.5rem;height:1.5rem;vertical-align:middle';

describe('inline span', () => {
  const { render } = createRenderer();

  it('imports an empty styled span as an inline span node', async () => {
    const { ref } = await render({
      content: `<p><span style="${BULLET_STYLE}"></span></p>`,
    });

    const [paragraph] = getContainerContent(ref.current!);

    expect(paragraph?.content).toEqual([
      {
        type: 'inlineSpan',
        attrs: { dir: DEFAULT_TEXT_DIRECTION, style: BULLET_STYLE },
      },
    ]);
  });

  it('imports a span that wraps text as a span mark', async () => {
    const { ref } = await render({
      content: '<p><span style="letter-spacing:-0.048px">Bullet</span></p>',
    });

    const [paragraph] = getContainerContent(ref.current!);

    expect(paragraph?.content).toEqual([
      {
        type: 'text',
        text: 'Bullet',
        marks: [{ type: 'span', attrs: { style: 'letter-spacing:-0.048px' } }],
      },
    ]);
  });
});
