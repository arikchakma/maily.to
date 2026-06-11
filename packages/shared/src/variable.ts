import { MAILY_NODE_TYPES } from './node';
import type { VariableAttributes } from './node';

/** Default opening delimiter for variable placeholders in text. */
export const DEFAULT_VARIABLE_START_TRIGGER = '{{';

/** Default closing delimiter for variable placeholders in text. */
export const DEFAULT_VARIABLE_END_TRIGGER = '}}';

/**
 * Regex that matches variable placeholders like {{name}} in a string.
 * Uses a non-greedy match to handle multiple variables in one string.
 */
export const VARIABLE_PLACEHOLDER_REGEX = /({{.*?}})/g;

/**
 * Delimiter used between fields inside a serialized variable string.
 * Format: {{id|label|required|hideDefaultValue}}.
 */
export const VARIABLE_TEXT_DELIMITER = '|';

/**
 * Serializes a variable node's attributes into a delimited string.
 * Output format: `{{id|label|required|hideDefaultValue}}`.
 * Used to represent structured variable data as a template string
 * in plain text contexts.
 */
export function serializeVariableToText(variable: VariableAttributes): string {
  const { id, label, required = true, hideDefaultValue = false } = variable;

  return [
    DEFAULT_VARIABLE_START_TRIGGER,
    defaultStringifyValue(id),
    VARIABLE_TEXT_DELIMITER,
    defaultStringifyValue(label),
    VARIABLE_TEXT_DELIMITER,
    required,
    VARIABLE_TEXT_DELIMITER,
    hideDefaultValue,
    DEFAULT_VARIABLE_END_TRIGGER,
  ].join('');
}

function defaultStringifyValue(value: string | null | undefined) {
  return value ?? '';
}

/**
 * Deserializes a variable string back into VariableAttributes.
 * Expected input format: `{{id|label|required|hideDefaultValue}}`.
 * Missing fields default to undefined; boolean fields are parsed
 * from "true"/"false" strings.
 */
export function deserializeVariableFromText(text: string): VariableAttributes {
  const inner = text
    .slice(
      DEFAULT_VARIABLE_START_TRIGGER.length,
      text.length - DEFAULT_VARIABLE_END_TRIGGER.length
    )
    .trim();

  const [id, label, required, hideDefaultValue] = inner.split(
    VARIABLE_TEXT_DELIMITER
  );

  return {
    id,
    label: label || null,
    required: parseBoolean(required, true),
    hideDefaultValue: parseBoolean(hideDefaultValue, false),
  };
}

/**
 * Parses a string containing variable placeholders (e.g. "Hello {{name}}")
 * into a Tiptap-compatible document JSON with text and variable nodes.
 * Splits on {{...}} boundaries and creates the appropriate node type
 * for each segment.
 */
export function buildDocFromVariableText(content: string) {
  const parts = content.split(VARIABLE_PLACEHOLDER_REGEX);

  return {
    type: MAILY_NODE_TYPES.DOCUMENT,
    content: [
      {
        type: MAILY_NODE_TYPES.PARAGRAPH,
        content: parts
          .flatMap((part) => {
            if (
              part.startsWith(DEFAULT_VARIABLE_START_TRIGGER) &&
              part.endsWith(DEFAULT_VARIABLE_END_TRIGGER)
            ) {
              return {
                type: MAILY_NODE_TYPES.VARIABLE,
                attrs: deserializeVariableFromText(part),
              };
            }

            if (part) {
              return { type: MAILY_NODE_TYPES.TEXT, text: part };
            }

            return [];
          })
          .filter(Boolean),
      },
    ],
  };
}

/**
 * Checks if a string contains at least one variable placeholder.
 * Returns true for strings like "Hello {{name}}", false for plain text.
 * Uses index-based scanning instead of regex for performance.
 */
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

function parseBoolean(
  value?: string,
  defaultValue?: boolean
): boolean | undefined {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }

  return defaultValue;
}
