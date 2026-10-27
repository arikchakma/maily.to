import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';

type MigratedRepeatOptions = {
  attrs: Record<string, any>;
  type?: string;
};

function getMigratedRepeat(options: MigratedRepeatOptions) {
  const { attrs, type = 'repeat' } = options;
  const { json, warnings } = migrate({
    type: 'doc',
    content: [{ type, attrs, content: [{ type: 'paragraph', attrs: {} }] }],
  });

  return { node: json.content[0], warnings };
}

describe('repeat', () => {
  it('wraps a bare each name in variable syntax', () => {
    const { node, warnings } = getMigratedRepeat({ attrs: { each: 'items' } });

    expect(node.attrs.each).toBe('{{items}}');
    expect(warnings).toContainEqual({
      nodeType: 'repeat',
      field: 'each',
      message: 'Migrated "each: items" → "each: {{items}}"',
    });
  });

  it('leaves an already wrapped each alone', () => {
    const { node, warnings } = getMigratedRepeat({
      attrs: { each: '{{items}}' },
    });

    expect(node.attrs.each).toBe('{{items}}');
    expect(warnings).toEqual([]);
  });

  it('leaves an empty each alone', () => {
    const { node, warnings } = getMigratedRepeat({ attrs: { each: '' } });

    expect(node.attrs.each).toBe('');
    expect(warnings).toEqual([]);
  });

  it('drops isUpdatingKey with a warning', () => {
    const { node, warnings } = getMigratedRepeat({
      attrs: { each: '{{items}}', isUpdatingKey: true },
    });

    expect(node.attrs).not.toHaveProperty('isUpdatingKey');
    expect(warnings).toContainEqual({
      nodeType: 'repeat',
      field: 'isUpdatingKey',
      message:
        'Editor-only attribute "isUpdatingKey" is not supported in v2 and was dropped',
    });
  });

  it('drops isUpdatingKey false with a warning too', () => {
    const { node, warnings } = getMigratedRepeat({
      attrs: { each: '{{items}}', isUpdatingKey: false },
    });

    expect(node.attrs).not.toHaveProperty('isUpdatingKey');
    expect(warnings).toHaveLength(1);
  });

  it('renames a deprecated for node and wraps its each', () => {
    const { node, warnings } = getMigratedRepeat({
      attrs: { each: 'items' },
      type: 'for',
    });

    expect(node.type).toBe('repeat');
    expect(node.attrs.each).toBe('{{items}}');
    expect(warnings).toContainEqual({
      nodeType: 'for',
      field: 'type',
      message: 'Migrated deprecated "for" node → "repeat"',
    });
    expect(warnings).toContainEqual({
      nodeType: 'repeat',
      field: 'each',
      message: 'Migrated "each: items" → "each: {{items}}"',
    });
  });

  it('renames a for node whose each is already wrapped', () => {
    const { node, warnings } = getMigratedRepeat({
      attrs: { each: '{{items}}' },
      type: 'for',
    });

    expect(node.type).toBe('repeat');
    expect(node.attrs.each).toBe('{{items}}');
    expect(warnings).toEqual([
      {
        nodeType: 'for',
        field: 'type',
        message: 'Migrated deprecated "for" node → "repeat"',
      },
    ]);
  });
});
