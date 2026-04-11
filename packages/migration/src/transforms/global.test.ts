import { describe, expect, it } from 'vite-plus/test';

import type { MigrationWarning } from '../types';
import { global } from './global';

describe('applyGlobalTransforms', () => {
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

  it('generates id when missing', () => {
    const node = {
      type: 'paragraph',
      attrs: {} as Record<string, any>,
    };
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    expect(node.attrs.id).toBeDefined();
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

  it('does not generate id for doc node', () => {
    const node = {
      type: 'doc',
      attrs: {},
    };
    const warnings: MigrationWarning[] = [];
    global(node, warnings);

    expect(node.attrs).not.toHaveProperty('id');
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
