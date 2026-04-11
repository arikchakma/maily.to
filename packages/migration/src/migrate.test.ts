import { describe, expect, it } from 'vite-plus/test';

import { migrate, requireContentMigration } from './migrate';

describe('requireContentMigration', () => {
  it('returns true for doc without version', () => {
    expect(requireContentMigration({ type: 'doc' })).toBe(true);
  });

  it('returns true for doc with version 1', () => {
    expect(
      requireContentMigration({ type: 'doc', attrs: { version: 1 } })
    ).toBe(true);
  });

  it('returns false for doc with version 2', () => {
    expect(
      requireContentMigration({ type: 'doc', attrs: { version: 2 } })
    ).toBe(false);
  });

  it('returns false for doc with version > 2', () => {
    expect(
      requireContentMigration({ type: 'doc', attrs: { version: 3 } })
    ).toBe(false);
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

    expect(result.json).toBe(v2Doc); // same reference, not cloned
    expect(result.warnings).toEqual([]);
  });

  it('does not mutate the original input', () => {
    const original = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { showIfKey: 'test', textDirection: 'rtl' },
        },
      ],
    };
    const originalJson = JSON.stringify(original);
    migrate(original);

    expect(JSON.stringify(original)).toBe(originalJson);
  });

  it('sets version to 2', () => {
    const result = migrate({
      type: 'doc',
      content: [],
    });

    expect(result.json.attrs.version).toBe(2);
  });

  it('is idempotent — migrating twice produces same result', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'button',
          attrs: {
            text: 'Click me',
            buttonColor: '#ff0000',
            textColor: '#ffffff',
            variant: 'filled',
            borderRadius: 'round',
            url: 'https://example.com',
          },
        },
        {
          type: 'image',
          attrs: {
            src: 'https://example.com/img.png',
            alignment: 'center',
            borderRadius: 8,
            width: 'auto',
          },
        },
        {
          type: 'section',
          attrs: {
            borderRadius: 4,
            borderWidth: 1,
            backgroundColor: '#f0f0f0',
          },
          content: [
            {
              type: 'paragraph',
              attrs: { showIfKey: 'showParagraph' },
            },
          ],
        },
      ],
    };

    const first = migrate(v1Doc);
    const second = migrate(first.json);

    // Second migration should be a no-op (v2 doc passes through)
    expect(second.json).toBe(first.json);
    expect(second.warnings).toEqual([]);
  });

  it('migrates a full v1 document', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { textDirection: 'rtl' },
          content: [
            {
              type: 'text',
              text: 'Hello ',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://example.com',
                    isUrlVariable: true,
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'button',
          attrs: {
            text: 'Subscribe',
            buttonColor: '#000000',
            textColor: '#ffffff',
            variant: 'filled',
            borderRadius: 'round',
            url: 'https://example.com',
            alignment: 'center',
            showIfKey: 'showBtn',
          },
        },
        {
          type: 'logo',
          attrs: {
            src: 'https://example.com/logo.png',
            size: 'lg',
            alignment: 'left',
          },
        },
        {
          type: 'spacer',
          attrs: { height: 24 },
        },
        {
          type: 'columns',
          attrs: {},
          content: [
            {
              type: 'column',
              attrs: {
                width: '50%',
                columnId: 'col-1',
                backgroundColor: '#fff',
              },
              content: [{ type: 'paragraph', attrs: {} }],
            },
            {
              type: 'column',
              attrs: { width: 'auto' },
              content: [{ type: 'paragraph', attrs: {} }],
            },
          ],
        },
        {
          type: 'repeat',
          attrs: { each: 'items' },
          content: [{ type: 'paragraph', attrs: {} }],
        },
        {
          type: 'footer',
          attrs: {
            'maily-component': 'footer',
            textAlign: 'center',
            textDirection: 'rtl',
          },
        },
        {
          type: 'inlineImage',
          attrs: {
            src: null,
            width: 100,
            height: 100,
            isSrcVariable: false,
          },
        },
      ],
    };

    const result = migrate(v1Doc);
    const { json, warnings } = result;

    // Doc version
    expect(json.attrs.version).toBe(2);

    // Paragraph
    const paragraph = json.content[0];
    expect(paragraph.attrs.dir).toBe('rtl');
    expect(paragraph.attrs).not.toHaveProperty('textDirection');
    expect(paragraph.attrs.id).toBeDefined();

    // Link mark
    const linkMark = paragraph.content[0].marks[0];
    expect(linkMark.attrs).not.toHaveProperty('isUrlVariable');

    // Button
    const button = json.content[1];
    expect(button.content).toEqual([{ type: 'text', text: 'Subscribe' }]);
    expect(button.attrs.backgroundColor).toBe('#000000');
    expect(button.attrs.color).toBe('#ffffff');
    expect(button.attrs.borderTopLeftRadius).toBe(9999);
    expect(button.attrs.kind).toBe('tight');
    expect(button.attrs.visibilityRule).toEqual({
      action: 'show',
      variable: 'showBtn',
      operator: 'is_true',
      value: '',
    });
    expect(button.attrs).not.toHaveProperty('text');
    expect(button.attrs).not.toHaveProperty('buttonColor');
    expect(button.attrs).not.toHaveProperty('textColor');
    expect(button.attrs).not.toHaveProperty('variant');
    expect(button.attrs).not.toHaveProperty('borderRadius');
    expect(button.attrs).not.toHaveProperty('showIfKey');

    // Logo → Image
    const image = json.content[2];
    expect(image.type).toBe('image');
    expect(image.attrs.width).toBe('11%');
    expect(image.attrs.align).toBe('left');
    expect(image.attrs).not.toHaveProperty('size');
    expect(image.attrs).not.toHaveProperty('alignment');

    // Spacer
    const spacer = json.content[3];
    expect(spacer.attrs.heightMode).toBe('uniform');

    // Columns
    const columns = json.content[4];
    expect(columns.attrs.columnCount).toBe(2);
    expect(columns.attrs.gap).toBe(8);

    // Column 1
    const col1 = columns.content[0];
    expect(col1.attrs.width).toBe(50);
    expect(col1.attrs).not.toHaveProperty('columnId');
    expect(col1.attrs).not.toHaveProperty('backgroundColor');

    // Column 2
    const col2 = columns.content[1];
    expect(col2.attrs.width).toBeNull();

    // Repeat
    const repeat = json.content[5];
    expect(repeat.attrs.each).toBe('{{items}}');

    // Footer
    const footer = json.content[6];
    expect(footer.attrs).not.toHaveProperty('maily-component');
    expect(footer.attrs.dir).toBe('rtl');

    // InlineImage
    const inlineImage = json.content[7];
    expect(inlineImage.attrs.src).toBe('');
    expect(inlineImage.attrs).not.toHaveProperty('isSrcVariable');

    // Warnings from column drops
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.some((w) => w.nodeType === 'column')).toBe(true);
  });

  it('handles button with variable text', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'button',
          attrs: {
            text: 'userName',
            isTextVariable: true,
            url: 'https://example.com',
          },
        },
      ],
    };

    const result = migrate(v1Doc);
    const button = result.json.content[0];

    expect(button.content).toEqual([
      { type: 'variable', attrs: { id: 'userName' } },
    ]);
  });

  it('handles outline button variant', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'button',
          attrs: {
            text: 'Click',
            buttonColor: '#0066ff',
            variant: 'outline',
          },
        },
      ],
    };

    const result = migrate(v1Doc);
    const button = result.json.content[0];

    expect(button.attrs.backgroundColor).toBe('transparent');
    expect(button.attrs.borderColor).toBe('#0066ff');
    expect(button.attrs.borderTopWidth).toBe(2);
  });

  it('converts image pixel width to percentage at root level', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'image',
          attrs: { src: 'img.png', width: '200' },
        },
      ],
    };

    const result = migrate(v1Doc);
    const img = result.json.content[0];

    // 200 / 600 = 33%
    expect(img.attrs.width).toBe('33%');
    expect(img.attrs).not.toHaveProperty('_containerWidth');
  });

  it('uses context-aware width for image inside section + column', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'section',
          attrs: { paddingLeft: 50, paddingRight: 50, borderWidth: 0 },
          content: [
            {
              type: 'columns',
              attrs: { gap: 0 },
              content: [
                {
                  type: 'column',
                  attrs: { width: '50%' },
                  content: [
                    {
                      type: 'image',
                      attrs: { src: 'img.png', width: '200' },
                    },
                  ],
                },
                {
                  type: 'column',
                  attrs: { width: '50%' },
                  content: [{ type: 'paragraph', attrs: {} }],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = migrate(v1Doc);
    const section = result.json.content[0];
    const img = section.content[0].content[0].content[0];

    // Section: 600 - 50 - 50 = 500
    // Column 50% with gap 0: 500 * 0.5 = 250
    // 200 / 250 = 80%
    expect(img.attrs.width).toBe('80%');
    expect(img.attrs).not.toHaveProperty('_containerWidth');
  });

  it('uses context-aware width for logo inside column', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'columns',
          attrs: { gap: 0 },
          content: [
            {
              type: 'column',
              attrs: { width: '50%' },
              content: [
                {
                  type: 'logo',
                  attrs: {
                    src: 'logo.png',
                    size: 'lg',
                    alignment: 'center',
                  },
                },
              ],
            },
            {
              type: 'column',
              attrs: { width: '50%' },
              content: [{ type: 'paragraph', attrs: {} }],
            },
          ],
        },
      ],
    };

    const result = migrate(v1Doc);
    const img = result.json.content[0].content[0].content[0];

    // Column: 600 * 0.5 = 300 (gap=0)
    // Logo lg = 64px. 64 / 300 = 21%
    expect(img.type).toBe('image');
    expect(img.attrs.width).toBe('21%');
    expect(img.attrs).not.toHaveProperty('_containerWidth');
    expect(img.attrs).not.toHaveProperty('size');
  });

  it('does not leak _containerWidth into non-image/logo nodes', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'section',
          attrs: { paddingLeft: 20, paddingRight: 20 },
          content: [
            { type: 'paragraph', attrs: {} },
            {
              type: 'image',
              attrs: { src: 'img.png', width: 'auto' },
            },
          ],
        },
      ],
    };

    const result = migrate(v1Doc);
    const section = result.json.content[0];
    const paragraph = section.content[0];
    const img = section.content[1];

    expect(paragraph.attrs).not.toHaveProperty('_containerWidth');
    expect(section.attrs).not.toHaveProperty('_containerWidth');
    expect(img.attrs).not.toHaveProperty('_containerWidth');
    expect(img.attrs.width).toBe('100%');
  });

  it('handles deeply nested content', () => {
    const v1Doc = {
      type: 'doc',
      content: [
        {
          type: 'section',
          attrs: { borderRadius: 8, borderWidth: 1, backgroundColor: '#fff' },
          content: [
            {
              type: 'columns',
              attrs: {},
              content: [
                {
                  type: 'column',
                  attrs: { width: '100%' },
                  content: [
                    {
                      type: 'paragraph',
                      attrs: { showIfKey: 'show' },
                      content: [
                        {
                          type: 'text',
                          text: 'Nested text',
                          marks: [
                            {
                              type: 'link',
                              attrs: {
                                href: 'https://test.com',
                                isUrlVariable: true,
                              },
                            },
                          ],
                        },
                      ],
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

    // Section transforms applied
    expect(section.attrs.borderTopLeftRadius).toBe(8);
    expect(section.attrs.borderTopWidth).toBe(1);
    expect(section.attrs).not.toHaveProperty('borderRadius');
    expect(section.attrs).not.toHaveProperty('borderWidth');

    // Columns transform
    expect(columns.attrs.columnCount).toBe(1);

    // Column transform
    expect(column.attrs.width).toBe(100);

    // Paragraph global transform
    expect(paragraph.attrs.visibilityRule).toEqual({
      action: 'show',
      variable: 'show',
      operator: 'is_true',
      value: '',
    });

    // Link mark transform
    const linkMark = paragraph.content[0].marks[0];
    expect(linkMark.attrs).not.toHaveProperty('isUrlVariable');
  });
});
