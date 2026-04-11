import type { AnyMailyNode } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { buildConfig } from './config';
import type { CreateRenderContextOptions, RenderContext } from './context';
import { defineRenderContext } from './context';

function makeCtx(
  opts: Partial<CreateRenderContextOptions> = {}
): RenderContext {
  return defineRenderContext({ config: buildConfig(), ...opts });
}

const PARAGRAPH_NODE = { type: 'paragraph' } as AnyMailyNode;
const HEADING_NODE = { type: 'heading' } as AnyMailyNode;

describe('defineRenderContext', () => {
  it('creates a context with default values', () => {
    const ctx = makeCtx();

    expect(ctx.parent).toBeUndefined();
    expect(ctx.siblingIndex).toBe(0);
    expect(ctx.size).toEqual({
      totalWidth: 600,
      totalBorder: 0,
      totalPadding: 0,
    });
    expect(ctx.box).toBe(600);
  });

  it('accepts custom parent and siblingIndex', () => {
    const ctx = makeCtx({ parent: PARAGRAPH_NODE, siblingIndex: 3 });

    expect(ctx.parent).toBe(PARAGRAPH_NODE);
    expect(ctx.siblingIndex).toBe(3);
  });

  it('accepts partial size overrides', () => {
    const ctx = makeCtx({ size: { totalWidth: 400, totalPadding: 20 } });

    expect(ctx.size).toEqual({
      totalWidth: 400,
      totalBorder: 0,
      totalPadding: 20,
    });
    expect(ctx.box).toBe(380);
  });

  it('computes box from size', () => {
    const ctx = makeCtx({
      size: { totalWidth: 600, totalBorder: 4, totalPadding: 40 },
    });

    expect(ctx.box).toBe(556);
  });
});

describe('set / get', () => {
  it('stores and retrieves a variable', () => {
    const ctx = makeCtx();
    ctx.set('item', { name: 'Alice' });

    expect(ctx.get('item')).toEqual({ name: 'Alice' });
  });

  it('returns undefined for unset keys', () => {
    const ctx = makeCtx();

    expect(ctx.get('item')).toBeUndefined();
  });

  it('overwrites an existing variable', () => {
    const ctx = makeCtx();
    ctx.set('columnTdWidth', '40%');
    ctx.set('columnTdWidth', '50%');

    expect(ctx.get('columnTdWidth')).toBe('50%');
  });
});

describe('var accessor', () => {
  it('returns all variables as an object', () => {
    const ctx = makeCtx();
    ctx.set('columnTdWidth', '48%');
    ctx.set('item', { id: 'test' });

    const snapshot = ctx.var;
    expect(snapshot.columnTdWidth).toBe('48%');
    expect(snapshot.item).toEqual({ id: 'test' });
  });

  it('caches until next set()', () => {
    const ctx = makeCtx();
    const a = ctx.var;
    const b = ctx.var;

    expect(a).toBe(b);

    ctx.set('columnTdWidth', '30%');
    const c = ctx.var;

    expect(c).not.toBe(a);
    expect(c.columnTdWidth).toBe('30%');
  });
});

describe('style / styles', () => {
  it('collects CSS strings', () => {
    const ctx = makeCtx();
    ctx.style('.a{color:red}');
    ctx.style('.b{color:blue}');

    expect(ctx.styles).toEqual(new Set(['.a{color:red}', '.b{color:blue}']));
  });

  it('deduplicates identical styles', () => {
    const ctx = makeCtx();
    ctx.style('.a{color:red}');
    ctx.style('.a{color:red}');

    expect(ctx.styles.size).toBe(1);
  });
});

describe('font / fonts', () => {
  it('collects font entries', () => {
    const ctx = makeCtx();
    ctx.font('Inter:normal:400', {
      fontFamily: 'Inter',
      fallbackFontFamily: 'sans-serif',
    });

    expect(ctx.fonts.get('Inter:normal:400')).toEqual({
      fontFamily: 'Inter',
      fallbackFontFamily: 'sans-serif',
    });
  });

  it('overwrites duplicate font keys', () => {
    const ctx = makeCtx();
    ctx.font('Inter', { fontFamily: 'Inter', fallbackFontFamily: 'serif' });
    ctx.font('Inter', {
      fontFamily: 'Inter',
      fallbackFontFamily: 'sans-serif',
    });

    expect(ctx.fonts.size).toBe(1);
    expect(ctx.fonts.get('Inter')?.fallbackFontFamily).toBe('sans-serif');
  });
});

describe('child', () => {
  it('inherits config from parent', () => {
    const config = buildConfig({ preview: 'hello' });
    const ctx = defineRenderContext({ config });
    const childCtx = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 0 });

    expect(childCtx.config).toBe(ctx.config);
  });

  it('overrides parent and siblingIndex', () => {
    const ctx = makeCtx();
    const childCtx = ctx.child({
      parent: HEADING_NODE,
      siblingIndex: 2,
    });

    expect(childCtx.parent).toBe(HEADING_NODE);
    expect(childCtx.siblingIndex).toBe(2);
  });

  it('inherits parent and siblingIndex when omitted', () => {
    const ctx = makeCtx({ parent: PARAGRAPH_NODE, siblingIndex: 5 });
    const childCtx = ctx.child({});

    expect(childCtx.parent).toBe(PARAGRAPH_NODE);
    expect(childCtx.siblingIndex).toBe(5);
  });

  it('inherits size when not overridden', () => {
    const ctx = makeCtx({ size: { totalWidth: 400 } });
    const childCtx = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 0 });

    expect(childCtx.size).toEqual(ctx.size);
  });

  it('accepts partial size overrides', () => {
    const ctx = makeCtx({
      size: { totalWidth: 600, totalBorder: 4, totalPadding: 40 },
    });
    const childCtx = ctx.child({
      parent: PARAGRAPH_NODE,
      siblingIndex: 0,
      size: { totalWidth: 300 },
    });

    expect(childCtx.size).toEqual({
      totalWidth: 300,
      totalBorder: 4,
      totalPadding: 40,
    });
    expect(childCtx.box).toBe(256);
  });

  describe('styles and fonts are shared', () => {
    it('child styles are visible to parent', () => {
      const ctx = makeCtx();
      const childCtx = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 0 });

      childCtx.style('.child{color:red}');

      expect(ctx.styles.has('.child{color:red}')).toBe(true);
    });

    it('parent styles are visible to child', () => {
      const ctx = makeCtx();
      ctx.style('.parent{color:blue}');

      const childCtx = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 0 });

      expect(childCtx.styles.has('.parent{color:blue}')).toBe(true);
    });

    it('child fonts are visible to parent', () => {
      const ctx = makeCtx();
      const childCtx = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 0 });

      childCtx.font('Roboto', {
        fontFamily: 'Roboto',
        fallbackFontFamily: 'sans-serif',
      });

      expect(ctx.fonts.has('Roboto')).toBe(true);
    });
  });

  describe('vars are cloned (not shared)', () => {
    it('child inherits existing parent vars', () => {
      const ctx = makeCtx();
      ctx.set('item', { x: 1 });

      const childCtx = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 0 });

      expect(childCtx.get('item')).toEqual({ x: 1 });
    });

    it('child mutations do not leak to parent', () => {
      const ctx = makeCtx();
      ctx.set('item', { x: 1 });

      const childCtx = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 0 });
      childCtx.set('item', { x: 99 });

      expect(ctx.get('item')).toEqual({ x: 1 });
      expect(childCtx.get('item')).toEqual({ x: 99 });
    });

    it('parent mutations after child creation do not affect child', () => {
      const ctx = makeCtx();
      const childCtx = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 0 });

      ctx.set('columnTdWidth', '42%');

      expect(childCtx.get('columnTdWidth')).toBeUndefined();
    });

    it('sibling contexts are isolated from each other', () => {
      const ctx = makeCtx();

      const a = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 0 });
      const b = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 1 });

      a.set('item', { id: 'a' });
      b.set('item', { id: 'b' });

      expect(a.get('item')).toEqual({ id: 'a' });
      expect(b.get('item')).toEqual({ id: 'b' });
      expect(ctx.get('item')).toBeUndefined();
    });

    it('nested children each get independent vars', () => {
      const ctx = makeCtx();
      ctx.set('columnTdWidth', '0%');

      const child = ctx.child({ parent: PARAGRAPH_NODE, siblingIndex: 0 });
      child.set('columnTdWidth', '10%');

      const grandchild = child.child({
        parent: HEADING_NODE,
        siblingIndex: 0,
      });
      grandchild.set('columnTdWidth', '20%');

      expect(ctx.get('columnTdWidth')).toBe('0%');
      expect(child.get('columnTdWidth')).toBe('10%');
      expect(grandchild.get('columnTdWidth')).toBe('20%');
    });
  });
});
