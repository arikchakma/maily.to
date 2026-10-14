import { describe, expect, it } from 'vite-plus/test';

import { getVariableReference } from '../src/utils/variable';

const VARIABLE_CASES = [
  {
    name: 'wraps a bare name in the variable triggers',
    value: 'userName',
    expected: '{{userName}}',
  },
  {
    name: 'strips the http protocol the v1 editor prefixed',
    value: 'http://userName',
    expected: '{{userName}}',
  },
  {
    name: 'strips the https protocol the v1 editor prefixed',
    value: 'https://profile.url',
    expected: '{{profile.url}}',
  },
  {
    name: 'leaves a value that is already a reference',
    value: '{{userName}}',
    expected: '{{userName}}',
  },
  {
    name: 'leaves a reference that carries a protocol prefix',
    value: 'https://{{userName}}',
    expected: '{{userName}}',
  },
];

describe('getVariableReference', () => {
  it.each(VARIABLE_CASES)('$name', ({ value, expected }) => {
    expect(getVariableReference(value)).toBe(expected);
  });
});
