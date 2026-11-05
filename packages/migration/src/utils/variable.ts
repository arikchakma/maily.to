import {
  DEFAULT_VARIABLE_END_TRIGGER,
  DEFAULT_VARIABLE_START_TRIGGER,
} from '@maily-to/shared';

const LINK_PROTOCOL_REGEX = /https?:\/\//;

export function getVariableReference(value: string): string {
  const name = value.replace(LINK_PROTOCOL_REGEX, '');

  if (name.startsWith(DEFAULT_VARIABLE_START_TRIGGER)) {
    return name;
  }

  return `${DEFAULT_VARIABLE_START_TRIGGER}${name}${DEFAULT_VARIABLE_END_TRIGGER}`;
}
