import { collapse, expand, objectify, stringify } from 'stylecast';

export type InlineStyle = Record<string, string>;

export function parseInlineStyles(style: string): InlineStyle {
  return objectify(style, { reactify: true });
}

export function stringifyInlineStyles(style: InlineStyle): string {
  return stringify(style, { kebabCase: true });
}

export function expandInlineStyles(style: InlineStyle): InlineStyle {
  return expand(style, { camelCase: true });
}

function collapseInlineStyles(style: InlineStyle): InlineStyle {
  return collapse(style, { camelCase: true });
}

export function mergeInlineStyles(
  under: InlineStyle,
  over: InlineStyle
): InlineStyle {
  return collapseInlineStyles({
    ...expandInlineStyles(under),
    ...expandInlineStyles(over),
  });
}
