import { describe, expect, it } from 'vite-plus/test';

import {
  deserializeVariableFromText,
  serializeVariableToText,
} from './variable';

describe('serializeVariableToText', () => {
  it('serializes a basic variable', () => {
    const result = serializeVariableToText({
      id: 'name',
      label: 'Name',
      required: true,
      hideDefaultValue: false,
    });
    expect(result).toBe('{{name|Name|true|false}}');
  });

  it('serializes with null label', () => {
    const result = serializeVariableToText({
      id: 'email',
      label: null,
      required: true,
      hideDefaultValue: false,
    });
    expect(result).toBe('{{email||true|false}}');
  });

  it('defaults required to true and hideDefaultValue to false', () => {
    const result = serializeVariableToText({
      id: 'test',
      label: 'Test',
    });
    expect(result).toBe('{{test|Test|true|false}}');
  });

  it('serializes with hideDefaultValue true', () => {
    const result = serializeVariableToText({
      id: 'price',
      label: 'Price',
      required: false,
      hideDefaultValue: true,
    });
    expect(result).toBe('{{price|Price|false|true}}');
  });
});

describe('deserializeVariableFromText', () => {
  it('deserializes a basic variable string', () => {
    const result = deserializeVariableFromText('{{name|Name|true|false}}');
    expect(result).toEqual({
      id: 'name',
      label: 'Name',
      required: true,
      hideDefaultValue: false,
    });
  });

  it('deserializes with empty label as null', () => {
    const result = deserializeVariableFromText('{{email||true|false}}');
    expect(result).toEqual({
      id: 'email',
      label: null,
      required: true,
      hideDefaultValue: false,
    });
  });

  it('defaults required to true and hideDefaultValue to false when missing', () => {
    const result = deserializeVariableFromText('{{id|label}}');
    expect(result.required).toBe(true);
    expect(result.hideDefaultValue).toBe(false);
  });
});

describe('round-trip', () => {
  it('serialize then deserialize returns original values', () => {
    const original = {
      id: 'user_name',
      label: 'User Name',
      required: false,
      hideDefaultValue: true,
    };
    const serialized = serializeVariableToText(original);
    const deserialized = deserializeVariableFromText(serialized);
    expect(deserialized).toEqual(original);
  });
});
