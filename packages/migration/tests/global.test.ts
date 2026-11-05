import { describe, expect, it } from 'vite-plus/test';

import { global } from '../src/transforms/global';
import type { MigrationWarning } from '../src/types';

const TEXT_ALIGN_WARNING = {
  nodeType: 'paragraph',
  field: 'textAlign',
  message: 'Migrated "textAlign" → "style"',
};

const TEXT_ALIGN_CASES: {
  attrs: Record<string, any>;
  name: string;
  style: string | null;
}[] = [
  {
    name: 'converts textAlign to a style declaration',
    attrs: { textAlign: 'center' },
    style: 'text-align:center',
  },
  {
    name: 'merges textAlign into an existing style',
    attrs: { style: 'color:#ff0000', textAlign: 'right' },
    style: 'color:#ff0000;text-align:right',
  },
  {
    name: 'overrides a text-align already present in the style',
    attrs: { style: 'text-align:left;color:#ff0000', textAlign: 'center' },
    style: 'text-align:center;color:#ff0000',
  },
  {
    name: 'drops textAlign left without writing a style',
    attrs: { textAlign: 'left' },
    style: null,
  },
  {
    name: 'drops falsy textAlign without writing a style',
    attrs: { textAlign: null },
    style: null,
  },
];

describe('global', () => {
  it('converts showIfKey to visibilityRule', () => {
    const node = {
      type: 'paragraph',
      attrs: { showIfKey: 'isActive' } as Record<string, any>,
    };
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    expect(node.attrs.visibilityRule).toEqual({
      action: 'show',
      variable: 'isActive',
      operator: 'is_true',
      value: '',
    });
    expect(node.attrs).not.toHaveProperty('showIfKey');
    expect(warnings).toContainEqual({
      nodeType: 'paragraph',
      field: 'showIfKey',
      message: 'Migrated "showIfKey" → "visibilityRule"',
    });
  });

  it('does not create visibilityRule for falsy showIfKey', () => {
    const node = {
      type: 'paragraph',
      attrs: { showIfKey: '' },
    };
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    expect(node.attrs).not.toHaveProperty('visibilityRule');
    expect(node.attrs).not.toHaveProperty('showIfKey');
  });

  it('converts textDirection to dir', () => {
    const node = {
      type: 'paragraph',
      attrs: { textDirection: 'rtl' } as Record<string, any>,
    };
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    expect(node.attrs.dir).toBe('rtl');
    expect(node.attrs).not.toHaveProperty('textDirection');
    expect(warnings).toContainEqual({
      nodeType: 'paragraph',
      field: 'textDirection',
      message: 'Migrated "textDirection" → "dir"',
    });
  });

  it('removes textDirection without setting dir when falsy', () => {
    const node = {
      type: 'paragraph',
      attrs: { textDirection: null },
    };
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    expect(node.attrs).not.toHaveProperty('dir');
    expect(node.attrs).not.toHaveProperty('textDirection');
  });

  it.each(TEXT_ALIGN_CASES)('$name', ({ attrs, style }) => {
    const node = {
      type: 'paragraph',
      attrs: { ...attrs } as Record<string, any>,
    };
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    if (style === null) {
      expect(node.attrs).not.toHaveProperty('style');
      expect(warnings).toEqual([]);
    } else {
      expect(node.attrs.style).toBe(style);
      expect(warnings).toContainEqual(TEXT_ALIGN_WARNING);
    }

    expect(node.attrs).not.toHaveProperty('textAlign');
  });

  it('generates id when missing', () => {
    const node = {
      type: 'paragraph',
      attrs: {} as Record<string, any>,
    };
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    expect(typeof node.attrs.id).toBe('string');
  });

  it('preserves existing id', () => {
    const node = {
      type: 'paragraph',
      attrs: { id: 'existing-id' },
    };
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    expect(node.attrs.id).toBe('existing-id');
  });

  it('does not generate id for nodes outside the id list', () => {
    const warnings: MigrationWarning[] = [];

    for (const type of ['button', 'image', 'doc']) {
      const node = { type, attrs: {} };
      global(node, warnings);

      expect(node.attrs).not.toHaveProperty('id');
    }
  });

  it('skips text nodes entirely', () => {
    const node = {
      type: 'text',
      text: 'hello',
    } as Record<string, any>;
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    expect(node).not.toHaveProperty('attrs');
  });

  it('creates attrs object if missing', () => {
    const node = {
      type: 'paragraph',
    } as Record<string, any>;
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    expect(node.attrs).toBeDefined();
    expect(node.attrs.id).toBeDefined();
  });
});
