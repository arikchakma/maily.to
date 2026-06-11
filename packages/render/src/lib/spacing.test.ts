import type { AnyMailyNode } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { buildConfig } from '../config';
import { defineRenderContext } from '../context';
import type { RenderContext } from '../context';
import { shouldSuppressMarginBottom, shouldSuppressMarginTop } from './spacing';

function makeCtx(
  parent: AnyMailyNode | undefined,
  siblingIndex: number
): RenderContext {
  return defineRenderContext({
    config: buildConfig(),
    parent,
    siblingIndex,
  });
}

function makeDoc(content: AnyMailyNode[]): AnyMailyNode {
  return { type: 'doc', content } as AnyMailyNode;
}

describe('shouldSuppressMarginTop', () => {
  it('suppresses when no parent', () => {
    expect(shouldSuppressMarginTop(makeCtx(undefined, 0))).toBe(true);
  });

  it('suppresses for first child in doc', () => {
    const parent = makeDoc([{ type: 'paragraph' } as AnyMailyNode]);
    expect(shouldSuppressMarginTop(makeCtx(parent, 0))).toBe(true);
  });

  it('does not suppress for second child in doc', () => {
    const parent = makeDoc([
      { type: 'paragraph' } as AnyMailyNode,
      { type: 'paragraph' } as AnyMailyNode,
    ]);
    expect(shouldSuppressMarginTop(makeCtx(parent, 1))).toBe(false);
  });

  it('suppresses when previous sibling is a spacer', () => {
    const parent = makeDoc([
      { type: 'spacer' } as AnyMailyNode,
      { type: 'paragraph' } as AnyMailyNode,
    ]);
    expect(shouldSuppressMarginTop(makeCtx(parent, 1))).toBe(true);
  });

  it('suppresses when parent is not a block container', () => {
    const parent = {
      type: 'bulletList',
      content: [{ type: 'listItem' }],
    } as AnyMailyNode;
    expect(shouldSuppressMarginTop(makeCtx(parent, 0))).toBe(true);
  });

  it('does not suppress in a section container', () => {
    const parent = {
      type: 'section',
      content: [
        { type: 'paragraph' } as AnyMailyNode,
        { type: 'heading' } as AnyMailyNode,
      ],
    } as AnyMailyNode;
    expect(shouldSuppressMarginTop(makeCtx(parent, 1))).toBe(false);
  });
});

describe('shouldSuppressMarginBottom', () => {
  it('suppresses when no parent', () => {
    expect(shouldSuppressMarginBottom(makeCtx(undefined, 0))).toBe(true);
  });

  it('suppresses for last child in doc', () => {
    const parent = makeDoc([{ type: 'paragraph' } as AnyMailyNode]);
    expect(shouldSuppressMarginBottom(makeCtx(parent, 0))).toBe(true);
  });

  it('does not suppress for first child when there is a next sibling', () => {
    const parent = makeDoc([
      { type: 'paragraph' } as AnyMailyNode,
      { type: 'paragraph' } as AnyMailyNode,
    ]);
    expect(shouldSuppressMarginBottom(makeCtx(parent, 0))).toBe(false);
  });

  it('suppresses when next sibling is a spacer', () => {
    const parent = makeDoc([
      { type: 'paragraph' } as AnyMailyNode,
      { type: 'spacer' } as AnyMailyNode,
    ]);
    expect(shouldSuppressMarginBottom(makeCtx(parent, 0))).toBe(true);
  });

  it('suppresses when next sibling is a horizontal rule', () => {
    const parent = makeDoc([
      { type: 'paragraph' } as AnyMailyNode,
      { type: 'horizontalRule' } as AnyMailyNode,
    ]);
    expect(shouldSuppressMarginBottom(makeCtx(parent, 0))).toBe(true);
  });

  it('suppresses when parent is a listItem', () => {
    const parent = {
      type: 'listItem',
      content: [{ type: 'paragraph' } as AnyMailyNode],
    } as AnyMailyNode;
    expect(shouldSuppressMarginBottom(makeCtx(parent, 0))).toBe(true);
  });
});
