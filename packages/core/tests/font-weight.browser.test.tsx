import type { AnyMailyNode } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { createRenderer, getContainerContent } from '#test-utils';

function getIdlessNode(node: AnyMailyNode): AnyMailyNode {
  const { id: _id, ...attrs } = node.attrs ?? {};

  return {
    ...node,
    attrs: node.attrs ? attrs : undefined,
    content: node.content?.map(getIdlessNode),
  } as AnyMailyNode;
}

function getMarkTypes(node: AnyMailyNode | undefined) {
  return (node?.marks ?? []).map((mark) => {
    return mark.type;
  });
}

type MarkStyleOptions = {
  node: AnyMailyNode | undefined;
  type: string;
};

function getMarkStyle(options: MarkStyleOptions) {
  const { node, type } = options;

  return node?.marks?.find((mark) => {
    return mark.type === type;
  })?.attrs?.style;
}

describe('font weight', () => {
  const { render } = createRenderer();

  describe('html import', () => {
    it('keeps a font weight bold does not represent as a span declaration', async () => {
      const { ref } = await render({
        content:
          '<p><span style="font-weight:600">a</span>' +
          '<span style="font-weight:900">b</span></p>',
      });
      const content = getContainerContent(ref.current!)[0]?.content ?? [];

      expect(
        content.map((node) => {
          return {
            text: node.text,
            marks: getMarkTypes(node),
            span: getMarkStyle({ node, type: 'span' }),
          };
        })
      ).toEqual([
        { text: 'a', marks: ['span'], span: 'font-weight:600' },
        { text: 'b', marks: ['span'], span: 'font-weight:900' },
      ]);
    });

    it('imports the weights bold renders as the bold mark alone', async () => {
      const { ref } = await render({
        content:
          '<p><b>b</b></p><p><strong>s</strong></p>' +
          '<p><span style="font-weight:bold">w</span></p>' +
          '<p><span style="font-weight:700">n</span></p>',
      });
      const content = getContainerContent(ref.current!);

      expect(
        content.map((paragraph) => {
          const node = paragraph.content?.[0];

          return {
            text: node?.text,
            marks: getMarkTypes(node),
            bold: getMarkStyle({ node, type: 'bold' }),
          };
        })
      ).toEqual([
        { text: 'b', marks: ['bold'], bold: null },
        { text: 's', marks: ['bold'], bold: null },
        { text: 'w', marks: ['bold'], bold: null },
        { text: 'n', marks: ['bold'], bold: null },
      ]);
      expect(ref.current!.getEditorHTML()).not.toContain('font-weight');
    });

    it('keeps a heavier weight on the mark that carries it', async () => {
      const { ref } = await render({
        content: '<p><strong style="font-weight:900">heavy</strong></p>',
      });
      const node = getContainerContent(ref.current!)[0]?.content?.[0];

      expect({
        marks: getMarkTypes(node),
        bold: getMarkStyle({ node, type: 'bold' }),
      }).toEqual({ marks: ['bold'], bold: 'font-weight:900' });
    });
  });

  it('round-trips its own HTML with the weights intact', async () => {
    const { ref: source } = await render({
      content:
        '<p><span style="font-weight:600">a</span>' +
        '<span style="font-weight:900">b</span>' +
        '<strong>c</strong></p>',
    });
    const html = source.current!.getEditorHTML();

    expect(html).toMatch(/font-weight:\s*600/);
    expect(html).toMatch(/font-weight:\s*900/);

    const { ref: reimported } = await render({ content: html });

    expect(getIdlessNode(reimported.current!.getJSON())).toEqual(
      getIdlessNode(source.current!.getJSON())
    );
  });

  it('adds bold over a span without losing its weight', async () => {
    const { ref } = await render({
      content: '<p><span style="font-weight:600">a</span></p>',
    });

    ref.current!.getEditor().chain().focus().selectAll().toggleBold().run();

    const node = getContainerContent(ref.current!)[0]?.content?.[0];

    expect({
      marks: getMarkTypes(node).sort(),
      span: getMarkStyle({ node, type: 'span' }),
    }).toEqual({ marks: ['bold', 'span'], span: 'font-weight:600' });
  });
});
