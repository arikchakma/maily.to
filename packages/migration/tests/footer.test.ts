import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';

function getMigratedFooter(attrs: Record<string, any>) {
  const { json, warnings } = migrate({
    type: 'doc',
    content: [{ type: 'footer', attrs, content: [] }],
  });

  return { node: json.content[0], warnings };
}

describe('footer', () => {
  it('drops the maily-component marker with a warning', () => {
    const { node, warnings } = getMigratedFooter({
      'maily-component': 'footer',
    });

    expect(node.attrs).not.toHaveProperty('maily-component');
    expect(warnings).toContainEqual({
      nodeType: 'footer',
      field: 'maily-component',
      message:
        'v1 marker attribute "maily-component" is not needed in v2 and was dropped',
    });
  });

  it('drops a falsy maily-component marker too', () => {
    const { node, warnings } = getMigratedFooter({ 'maily-component': '' });

    expect(node.attrs).not.toHaveProperty('maily-component');
    expect(warnings).toHaveLength(1);
  });

  it('leaves a footer without the marker untouched', () => {
    const { node, warnings } = getMigratedFooter({});

    expect(node.attrs).toEqual({});
    expect(warnings).toEqual([]);
  });

  it('leaves textAlign and textDirection to the global transform', () => {
    const { node } = getMigratedFooter({
      textAlign: 'center',
      textDirection: 'rtl',
    });

    expect(node.attrs.style).toBe('text-align:center');
    expect(node.attrs.dir).toBe('rtl');
    expect(node.attrs).not.toHaveProperty('textAlign');
    expect(node.attrs).not.toHaveProperty('textDirection');
  });
});
