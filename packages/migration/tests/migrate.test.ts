import { describe, expect, it } from 'vite-plus/test';

import { migrate, requireContentMigration } from '../src/index';

const REQUIRE_MIGRATION_CASES = [
  {
    name: 'returns true for doc without version',
    doc: { type: 'doc' },
    expected: true,
  },
  {
    name: 'returns true for doc with version 1',
    doc: { type: 'doc', attrs: { version: 1 } },
    expected: true,
  },
  {
    name: 'returns false for doc with version 2',
    doc: { type: 'doc', attrs: { version: 2 } },
    expected: false,
  },
  {
    name: 'returns false for doc with version > 2',
    doc: { type: 'doc', attrs: { version: 3 } },
    expected: false,
  },
];

describe('requireContentMigration', () => {
  it.each(REQUIRE_MIGRATION_CASES)('$name', ({ doc, expected }) => {
    expect(requireContentMigration(doc)).toBe(expected);
  });
});

describe('migrate', () => {
  it('passes through v2 doc unchanged', () => {
    const v2Doc = {
      type: 'doc',
      attrs: { version: 2 },
      content: [{ type: 'paragraph', attrs: { id: 'p1' } }],
    };
    const result = migrate(v2Doc);

    expect(result.json).toBe(v2Doc);
    expect(result.warnings).toEqual([]);
  });

  it('sets version to 2', () => {
    const result = migrate({
      type: 'doc',
      content: [],
    });

    expect(result.json.attrs.version).toBe(2);
  });

  it('applies global transforms to deeply nested nodes', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'section',
          attrs: {},
          content: [
            {
              type: 'columns',
              attrs: {},
              content: [
                {
                  type: 'column',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      attrs: { showIfKey: 'show', textDirection: 'rtl' },
                      content: [{ type: 'text', text: 'Nested text' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = migrate(v1Doc);
    const section = result.json.content[0];
    const columns = section.content[0];
    const column = columns.content[0];
    const paragraph = column.content[0];

    expect(paragraph.attrs.visibilityRule).toEqual({
      action: 'show',
      variable: 'show',
      operator: 'is_true',
      value: '',
    });
    expect(paragraph.attrs.dir).toBe('rtl');
    expect(paragraph.attrs.id).toBeDefined();
    expect(paragraph.content[0]).not.toHaveProperty('attrs');
  });

  it('collects warnings from every visited node', () => {
    const result = migrate({
      type: 'doc',
      content: [
        { type: 'paragraph', attrs: { showIfKey: 'first' } },
        { type: 'paragraph', attrs: { showIfKey: 'second' } },
      ],
    });

    expect(
      result.warnings.filter((warning) => {
        return warning.field === 'showIfKey';
      })
    ).toHaveLength(2);
  });
});
