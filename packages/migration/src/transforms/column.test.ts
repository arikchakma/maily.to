import { describe, expect, it } from 'vite-plus/test';

import type { MigrationWarning } from '../types';
import { column } from './column';

describe('transformColumn', () => {
  function makeColumn(attrs: Record<string, any> = {}) {
    return { type: 'column', attrs } as Record<string, any>;
  }

  it('converts width auto to null', () => {
    const node = makeColumn({ width: 'auto' });
    column(node, []);

    expect(node.attrs.width).toBeNull();
  });

  it('converts percentage string to number', () => {
    const node = makeColumn({ width: '50%' });
    column(node, []);

    expect(node.attrs.width).toBe(50);
  });

  it('converts unparseable width to null', () => {
    const node = makeColumn({ width: 'invalid' });
    column(node, []);

    expect(node.attrs.width).toBeNull();
  });

  it('drops unsupported attrs with warnings', () => {
    const warnings: MigrationWarning[] = [];
    const node = makeColumn({
      columnId: 'col-1',
      backgroundColor: '#fff',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#000',
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8,
    });
    column(node, warnings);

    expect(node.attrs).not.toHaveProperty('columnId');
    expect(node.attrs).not.toHaveProperty('backgroundColor');
    expect(node.attrs).not.toHaveProperty('borderRadius');
    expect(node.attrs).not.toHaveProperty('borderWidth');
    expect(node.attrs).not.toHaveProperty('borderColor');
    expect(node.attrs).not.toHaveProperty('paddingTop');
    expect(node.attrs).not.toHaveProperty('paddingRight');
    expect(node.attrs).not.toHaveProperty('paddingBottom');
    expect(node.attrs).not.toHaveProperty('paddingLeft');
    expect(warnings).toHaveLength(9);
  });

  it('drops visibilityRule (converted from showIfKey) with warning', () => {
    const warnings: MigrationWarning[] = [];
    const node = makeColumn({
      visibilityRule: {
        action: 'show',
        variable: 'isActive',
        operator: 'is_true',
        value: '',
      },
    });
    column(node, warnings);

    expect(node.attrs).not.toHaveProperty('visibilityRule');
    expect(warnings).toHaveLength(1);
    expect(warnings[0].field).toBe('visibilityRule');
  });

  it('does not warn for null attrs', () => {
    const warnings: MigrationWarning[] = [];
    const node = makeColumn({ backgroundColor: null });
    column(node, warnings);

    expect(warnings).toHaveLength(0);
  });
});
