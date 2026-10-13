import { DEFAULT_VARIABLE_ATTRIBUTES, MAILY_NODE_TYPES } from './node';
import type { VariableAttributes } from './node';

export const DEFAULT_VARIABLE_START_TRIGGER = '{{';

export const DEFAULT_VARIABLE_END_TRIGGER = '}}';

type VariableAttributeName = keyof typeof DEFAULT_VARIABLE_ATTRIBUTES;

const LEGACY_HIDE_DEFAULT_VALUE = 'hideDefaultValue';

function getQuotedValue(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

type SerializedAttributeOptions = {
  name: VariableAttributeName;
  value: VariableAttributes[VariableAttributeName];
};

function getSerializedAttribute(
  options: SerializedAttributeOptions
): string | null {
  const { name, value } = options;

  if (value === undefined || value === DEFAULT_VARIABLE_ATTRIBUTES[name]) {
    return null;
  }

  if (typeof value === 'boolean') {
    return `${name}=${value}`;
  }

  return typeof value === 'string' ? `${name}=${getQuotedValue(value)}` : null;
}

export function serializeVariableToText(variable: VariableAttributes): string {
  const { fallback, id, isDefaultEditable, label, required, style } = variable;

  const attributes = [
    getSerializedAttribute({ name: 'fallback', value: fallback }),
    getSerializedAttribute({
      name: 'isDefaultEditable',
      value: isDefaultEditable,
    }),
    getSerializedAttribute({
      name: 'label',
      value: label === id ? null : label,
    }),
    getSerializedAttribute({ name: 'required', value: required }),
    getSerializedAttribute({ name: 'style', value: style }),
  ].filter((attribute) => {
    return attribute !== null;
  });

  return [
    DEFAULT_VARIABLE_START_TRIGGER,
    [id, ...attributes].join(' '),
    DEFAULT_VARIABLE_END_TRIGGER,
  ].join('');
}

function getReferenceTokens(inner: string): string[] {
  const tokens: string[] = [];
  let token = '';
  let quoted = false;

  for (let index = 0; index < inner.length; index += 1) {
    const character = inner[index]!;

    if (quoted && character === '\\' && index + 1 < inner.length) {
      token += character + inner[index + 1];
      index += 1;
      continue;
    }

    if (character === '"') {
      quoted = !quoted;
      token += character;
      continue;
    }

    if (!quoted && /\s/.test(character)) {
      if (token) {
        tokens.push(token);
        token = '';
      }
      continue;
    }

    token += character;
  }

  if (token) {
    tokens.push(token);
  }

  return tokens;
}

function getUnquotedValue(value: string): unknown {
  if (value.startsWith('"') && value.endsWith('"') && value.length > 1) {
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }

  return value;
}

export function deserializeVariableFromText(text: string): VariableAttributes {
  const inner = text
    .slice(
      DEFAULT_VARIABLE_START_TRIGGER.length,
      text.length - DEFAULT_VARIABLE_END_TRIGGER.length
    )
    .trim();

  const [id = '', ...pairs] = getReferenceTokens(inner);
  const attributes: Record<string, unknown> = { id };

  for (const pair of pairs) {
    const separator = pair.indexOf('=');
    if (separator <= 0) {
      continue;
    }

    const key = pair.slice(0, separator);
    const value = getUnquotedValue(pair.slice(separator + 1));

    if (key === LEGACY_HIDE_DEFAULT_VALUE) {
      attributes.isDefaultEditable ??= value !== true;
      continue;
    }

    attributes[key] = value;
  }

  return {
    ...DEFAULT_VARIABLE_ATTRIBUTES,
    ...attributes,
  } as VariableAttributes;
}

type VariableSegment = {
  isReference: boolean;
  text: string;
};

export function getVariableSegments(content: string): VariableSegment[] {
  const segments: VariableSegment[] = [];
  let plain = '';
  let index = 0;

  while (index < content.length) {
    if (!content.startsWith(DEFAULT_VARIABLE_START_TRIGGER, index)) {
      plain += content[index];
      index += 1;
      continue;
    }

    const end = getReferenceEnd({ content, start: index });
    if (end === -1) {
      plain += content[index];
      index += 1;
      continue;
    }

    if (plain) {
      segments.push({ isReference: false, text: plain });
      plain = '';
    }

    segments.push({ isReference: true, text: content.slice(index, end) });
    index = end;
  }

  if (plain) {
    segments.push({ isReference: false, text: plain });
  }

  return segments;
}

type ReferenceEndOptions = {
  content: string;
  start: number;
};

function getReferenceEnd(options: ReferenceEndOptions): number {
  const { content, start } = options;
  let quoted = false;

  for (
    let index = start + DEFAULT_VARIABLE_START_TRIGGER.length;
    index < content.length;
    index += 1
  ) {
    const character = content[index]!;

    if (quoted && character === '\\') {
      index += 1;
      continue;
    }

    if (character === '"') {
      quoted = !quoted;
      continue;
    }

    if (!quoted && content.startsWith(DEFAULT_VARIABLE_END_TRIGGER, index)) {
      return index + DEFAULT_VARIABLE_END_TRIGGER.length;
    }
  }

  return -1;
}

export function buildDocFromVariableText(content: string) {
  return {
    type: MAILY_NODE_TYPES.DOCUMENT,
    content: [
      {
        type: MAILY_NODE_TYPES.PARAGRAPH,
        content: getVariableSegments(content).map((segment) => {
          return segment.isReference
            ? {
                type: MAILY_NODE_TYPES.VARIABLE,
                attrs: deserializeVariableFromText(segment.text),
              }
            : { type: MAILY_NODE_TYPES.TEXT, text: segment.text };
        }),
      },
    ],
  };
}

export function hasVariableInText(text: string): boolean {
  const start = text.indexOf(DEFAULT_VARIABLE_START_TRIGGER);
  if (start === -1) {
    return false;
  }

  return (
    text.indexOf(
      DEFAULT_VARIABLE_END_TRIGGER,
      start + DEFAULT_VARIABLE_START_TRIGGER.length
    ) !== -1
  );
}
