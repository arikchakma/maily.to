import { describe, expect, it } from 'vite-plus/test';

import {
  buildDocFromVariableText,
  deserializeVariableFromText,
  getVariableSegments,
  serializeVariableToText,
} from '../src/index';

describe('variables', () => {
  describe('serializeVariableToText', () => {
    it('writes a bare reference when every attribute holds its default', () => {
      expect(serializeVariableToText({ id: 'people' })).toBe('{{people}}');
    });

    it('leaves out a label that repeats the id', () => {
      expect(serializeVariableToText({ id: 'people', label: 'people' })).toBe(
        '{{people}}'
      );
    });

    it('writes only the attributes that differ from their default', () => {
      expect(
        serializeVariableToText({
          hideDefaultValue: false,
          id: 'name',
          label: 'First name',
          required: false,
        })
      ).toBe('{{name label="First name" required=false}}');
    });
  });

  describe('round trips through the text format', () => {
    it('carries the fallback and the style the old format dropped', () => {
      const attributes = {
        fallback: 'Guest',
        id: 'name',
        style: 'color:#f00',
      };

      expect(
        deserializeVariableFromText(serializeVariableToText(attributes))
      ).toEqual({
        fallback: 'Guest',
        hideDefaultValue: false,
        id: 'name',
        label: null,
        required: true,
        style: 'color:#f00',
      });
    });

    it('keeps a delimiter typed into a label out of its neighbours', () => {
      const attributes = { id: 'total', label: 'Order | Total' };
      const text = serializeVariableToText(attributes);

      expect({
        parsed: deserializeVariableFromText(text),
        text,
      }).toEqual({
        parsed: {
          fallback: null,
          hideDefaultValue: false,
          id: 'total',
          label: 'Order | Total',
          required: true,
          style: null,
        },
        text: '{{total label="Order | Total"}}',
      });
    });

    it('keeps a closing brace inside a label from ending the reference', () => {
      const text = serializeVariableToText({ id: 'x', label: 'a}}b' });

      expect({
        parsed: deserializeVariableFromText(text).label,
        segments: getVariableSegments(text).length,
      }).toEqual({ parsed: 'a}}b', segments: 1 });
    });

    it('escapes a quote inside a value', () => {
      const text = serializeVariableToText({ id: 'x', label: 'say "hi"' });

      expect({
        parsed: deserializeVariableFromText(text).label,
        text,
      }).toEqual({ parsed: 'say "hi"', text: '{{x label="say \\"hi\\""}}' });
    });
  });

  describe('getVariableSegments', () => {
    it('splits prose around several references', () => {
      expect(
        getVariableSegments('Hi {{a}} and {{b label="Bee"}}!').map(
          (segment) => {
            return segment.text;
          }
        )
      ).toEqual(['Hi ', '{{a}}', ' and ', '{{b label="Bee"}}', '!']);
    });

    it('leaves an unclosed trigger as plain text', () => {
      expect(
        getVariableSegments('a {{ b').map((segment) => {
          return segment.text;
        })
      ).toEqual(['a {{ b']);
    });
  });

  it('reads a bare reference, trimming the padding people type', () => {
    expect(deserializeVariableFromText('{{ name }}')).toEqual({
      fallback: null,
      hideDefaultValue: false,
      id: 'name',
      label: null,
      required: true,
      style: null,
    });
  });

  it('builds a document of text and variable nodes', () => {
    expect(buildDocFromVariableText('Hi {{name}}').content[0]?.content).toEqual(
      [
        { text: 'Hi ', type: 'text' },
        {
          attrs: {
            fallback: null,
            hideDefaultValue: false,
            id: 'name',
            label: null,
            required: true,
            style: null,
          },
          type: 'variable',
        },
      ]
    );
  });
});
