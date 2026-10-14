import { describe, expect, it } from 'vite-plus/test';

import {
  getBoxDeclarations,
  getPixelValue,
  getStyleAttribute,
} from '../src/utils/style';

const STYLE_ATTRIBUTE_CASES = [
  {
    name: 'serializes declarations as kebab-cased inline css',
    declarations: { textAlign: 'center', paddingTop: '12px' },
    expected: 'text-align:center;padding-top:12px',
  },
  {
    name: 'drops null, undefined and empty values',
    declarations: {
      backgroundColor: '',
      borderStyle: undefined,
      color: null,
      textAlign: 'right',
    },
    expected: 'text-align:right',
  },
  {
    name: 'returns null when nothing remains',
    declarations: { color: null, textAlign: '' },
    expected: null,
  },
  {
    name: 'returns null for an empty record',
    declarations: {},
    expected: null,
  },
  {
    name: 'keeps a zero-length value such as "0"',
    declarations: { padding: '0' },
    expected: 'padding:0',
  },
];

const PIXEL_VALUE_CASES = [
  { name: 'appends the px unit', value: 12, expected: '12px' },
  { name: 'keeps zero', value: 0, expected: '0px' },
];

const BOX_DECLARATION_CASES: {
  box: {
    bottom?: number | null;
    left?: number | null;
    property: 'margin' | 'padding';
    right?: number | null;
    top?: number | null;
  };
  expected: Record<string, string>;
  name: string;
}[] = [
  {
    name: 'builds one declaration per numeric side',
    box: {
      property: 'padding',
      top: 0,
      right: 8,
      bottom: 16,
      left: 24,
    },
    expected: {
      paddingTop: '0px',
      paddingRight: '8px',
      paddingBottom: '16px',
      paddingLeft: '24px',
    },
  },
  {
    name: 'skips sides that are not numbers',
    box: { property: 'margin', top: 4, bottom: null },
    expected: { marginTop: '4px' },
  },
  {
    name: 'returns an empty record when no side is a number',
    box: { property: 'padding' },
    expected: {},
  },
];

describe('getStyleAttribute', () => {
  it.each(STYLE_ATTRIBUTE_CASES)('$name', ({ declarations, expected }) => {
    expect(getStyleAttribute(declarations)).toBe(expected);
  });
});

describe('getPixelValue', () => {
  it.each(PIXEL_VALUE_CASES)('$name', ({ expected, value }) => {
    expect(getPixelValue(value)).toBe(expected);
  });
});

describe('getBoxDeclarations', () => {
  it.each(BOX_DECLARATION_CASES)('$name', ({ box, expected }) => {
    expect(getBoxDeclarations(box)).toEqual(expected);
  });
});
