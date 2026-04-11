import type { AnyMailyNode, VisibilityRule } from '@maily-to/shared';
import { VISIBILITY_ACTIONS, VISIBILITY_OPERATORS } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { buildConfig } from '../config';
import { defineRenderContext } from '../context';
import type { RenderContext } from '../context';
import { shouldShow } from './visibility';

function makeNode(rule?: VisibilityRule | null): AnyMailyNode {
  return { type: 'paragraph', attrs: { visibilityRule: rule } } as AnyMailyNode;
}

function makeCtx(
  payload?: Record<string, any>,
  configVariables?: Record<string, any>
): RenderContext {
  const ctx = defineRenderContext({
    config: buildConfig({ variables: configVariables }),
  });
  if (payload) {
    ctx.set('item', payload);
  }
  return ctx;
}

describe('shouldShow', () => {
  it('returns true when no visibility rule', () => {
    const node = { type: 'paragraph' } as AnyMailyNode;
    expect(shouldShow(node, makeCtx())).toBe(true);
  });

  it('returns true when action is NONE', () => {
    expect(
      shouldShow(
        makeNode({
          action: VISIBILITY_ACTIONS.NONE,
          variable: 'x',
          operator: VISIBILITY_OPERATORS.IS_TRUE,
          value: '',
        }),
        makeCtx()
      )
    ).toBe(true);
  });

  describe('SHOW action', () => {
    it('shows when IS_TRUE matches truthy value', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'active',
            operator: VISIBILITY_OPERATORS.IS_TRUE,
            value: '',
          }),
          makeCtx({ active: true })
        )
      ).toBe(true);
    });

    it('hides when IS_TRUE does not match falsy value', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'active',
            operator: VISIBILITY_OPERATORS.IS_TRUE,
            value: '',
          }),
          makeCtx({ active: false })
        )
      ).toBe(false);
    });

    it('shows when EQUALS matches', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'plan',
            operator: VISIBILITY_OPERATORS.EQUALS,
            value: 'pro',
          }),
          makeCtx({ plan: 'pro' })
        )
      ).toBe(true);
    });

    it('hides when EQUALS does not match', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'plan',
            operator: VISIBILITY_OPERATORS.EQUALS,
            value: 'pro',
          }),
          makeCtx({ plan: 'free' })
        )
      ).toBe(false);
    });
  });

  describe('HIDE action', () => {
    it('hides when IS_TRUE matches truthy value', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.HIDE,
            variable: 'banned',
            operator: VISIBILITY_OPERATORS.IS_TRUE,
            value: '',
          }),
          makeCtx({ banned: true })
        )
      ).toBe(false);
    });

    it('shows when IS_TRUE does not match falsy value', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.HIDE,
            variable: 'banned',
            operator: VISIBILITY_OPERATORS.IS_TRUE,
            value: '',
          }),
          makeCtx({ banned: false })
        )
      ).toBe(true);
    });
  });

  describe('operators', () => {
    it('IS_FALSE returns true for falsy value', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'v',
            operator: VISIBILITY_OPERATORS.IS_FALSE,
            value: '',
          }),
          makeCtx({ v: '' })
        )
      ).toBe(true);
    });

    it('NOT_EQUALS returns true when values differ', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'v',
            operator: VISIBILITY_OPERATORS.NOT_EQUALS,
            value: 'a',
          }),
          makeCtx({ v: 'b' })
        )
      ).toBe(true);
    });

    it('CONTAINS returns true when value contains substring', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'v',
            operator: VISIBILITY_OPERATORS.CONTAINS,
            value: 'ello',
          }),
          makeCtx({ v: 'hello world' })
        )
      ).toBe(true);
    });

    it('NOT_CONTAINS returns true when value does not contain substring', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'v',
            operator: VISIBILITY_OPERATORS.NOT_CONTAINS,
            value: 'xyz',
          }),
          makeCtx({ v: 'hello world' })
        )
      ).toBe(true);
    });

    it('STARTS_WITH returns true when value starts with prefix', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'v',
            operator: VISIBILITY_OPERATORS.STARTS_WITH,
            value: 'hel',
          }),
          makeCtx({ v: 'hello' })
        )
      ).toBe(true);
    });

    it('ENDS_WITH returns true when value ends with suffix', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'v',
            operator: VISIBILITY_OPERATORS.ENDS_WITH,
            value: 'llo',
          }),
          makeCtx({ v: 'hello' })
        )
      ).toBe(true);
    });

    it('GREATER_THAN returns true when numeric value is greater', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'v',
            operator: VISIBILITY_OPERATORS.GREATER_THAN,
            value: '5',
          }),
          makeCtx({ v: 10 })
        )
      ).toBe(true);
    });

    it('LESS_THAN returns true when numeric value is less', () => {
      expect(
        shouldShow(
          makeNode({
            action: VISIBILITY_ACTIONS.SHOW,
            variable: 'v',
            operator: VISIBILITY_OPERATORS.LESS_THAN,
            value: '10',
          }),
          makeCtx({ v: 5 })
        )
      ).toBe(true);
    });
  });

  it('resolves from config.variableValues when not in item', () => {
    expect(
      shouldShow(
        makeNode({
          action: VISIBILITY_ACTIONS.SHOW,
          variable: 'status',
          operator: VISIBILITY_OPERATORS.EQUALS,
          value: 'active',
        }),
        makeCtx(undefined, { status: 'active' })
      )
    ).toBe(true);
  });

  it('prefers item over config.variableValues', () => {
    expect(
      shouldShow(
        makeNode({
          action: VISIBILITY_ACTIONS.SHOW,
          variable: 'status',
          operator: VISIBILITY_OPERATORS.EQUALS,
          value: 'active',
        }),
        makeCtx({ status: 'active' }, { status: 'inactive' })
      )
    ).toBe(true);
  });
});
