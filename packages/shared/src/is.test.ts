import { describe, expect, it } from 'vite-plus/test';

import { is, isBoolean, isDef, isNumber, isString } from './is';

describe('is.node', () => {
  it('returns true for valid node types', () => {
    expect(is.node({ type: 'paragraph' })).toBe(true);
    expect(is.node({ type: 'heading', attrs: { level: 1 } })).toBe(true);
    expect(is.node({ type: 'doc', content: [] })).toBe(true);
  });

  it('returns false for invalid node types', () => {
    expect(is.node({ type: 'unknown' })).toBe(false);
    expect(is.node(null)).toBe(false);
    expect(is.node(undefined)).toBe(false);
    expect(is.node('paragraph')).toBe(false);
    expect(is.node({})).toBe(false);
  });
});

describe('is.mark', () => {
  it('returns true for valid mark types', () => {
    expect(is.mark({ type: 'bold' })).toBe(true);
    expect(is.mark({ type: 'italic' })).toBe(true);
    expect(
      is.mark({ type: 'link', attrs: { href: 'https://example.com' } })
    ).toBe(true);
  });

  it('returns false for invalid mark types', () => {
    expect(is.mark({ type: 'unknown' })).toBe(false);
    expect(is.mark(null)).toBe(false);
    expect(is.mark(undefined)).toBe(false);
  });
});

describe('is.parent', () => {
  it('returns true for nodes with content array', () => {
    expect(is.parent({ type: 'doc', content: [] } as any)).toBe(true);
    expect(
      is.parent({
        type: 'paragraph',
        content: [{ type: 'text', text: 'hi' }],
      } as any)
    ).toBe(true);
  });

  it('returns false for nodes without content', () => {
    expect(is.parent({ type: 'text', text: 'hi' } as any)).toBe(false);
  });
});

describe('is.marked', () => {
  it('returns true for nodes with marks array', () => {
    expect(
      is.marked({ type: 'text', text: 'hi', marks: [{ type: 'bold' }] } as any)
    ).toBe(true);
  });

  it('returns false for nodes without marks', () => {
    expect(is.marked({ type: 'text', text: 'hi' } as any)).toBe(false);
  });
});

describe('guard factory', () => {
  it('matches correct node type and rejects others', () => {
    expect(is.paragraph({ type: 'paragraph' } as any)).toBe(true);
    expect(is.paragraph({ type: 'heading' } as any)).toBe(false);
  });

  it('matches correct mark type and rejects others', () => {
    expect(is.bold({ type: 'bold' } as any)).toBe(true);
    expect(is.bold({ type: 'italic' } as any)).toBe(false);
  });
});

describe('isDef', () => {
  it('returns true for defined values including falsy ones', () => {
    expect(isDef(0)).toBe(true);
    expect(isDef('')).toBe(true);
    expect(isDef(false)).toBe(true);
  });

  it('returns false for undefined and null', () => {
    expect(isDef(undefined)).toBe(false);
    expect(isDef(null)).toBe(false);
  });
});

describe('isBoolean', () => {
  it('returns true for booleans', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });
});

describe('isNumber', () => {
  it('returns true for numbers including NaN', () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(NaN)).toBe(true);
  });
});

describe('isString', () => {
  it('returns true for strings including empty', () => {
    expect(isString('hello')).toBe(true);
    expect(isString('')).toBe(true);
  });
});
