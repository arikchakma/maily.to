import type { InlineStyle } from '@maily-to/shared';

import type { MigrationWarning } from '../types';
import { getBoxDeclarations, getPixelValue } from './style';

const DEFAULT_BORDER_COLOR = '#e2e2e2';

const BORDER_FIELDS = ['borderWidth', 'borderColor'] as const;

const PADDING_FIELDS = [
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
] as const;

type BorderDeclarationsOptions = {
  color?: string | null;
  width?: number | null;
};

function getBorderDeclarations(
  options: BorderDeclarationsOptions
): InlineStyle {
  const { color, width } = options;

  if (typeof width !== 'number' || width <= 0) {
    return {};
  }

  return {
    borderColor: color ?? DEFAULT_BORDER_COLOR,
    borderStyle: 'solid',
    borderWidth: getPixelValue(width),
  };
}

function getBorderRadiusDeclarations(
  radius: number | null | undefined
): InlineStyle {
  if (typeof radius !== 'number' || radius <= 0) {
    return {};
  }

  return { borderRadius: getPixelValue(radius) };
}

type BoxStyleDeclarationsOptions = {
  attrs: Record<string, any>;
  nodeType: string;
  warnings: MigrationWarning[];
};

export function getBoxStyleDeclarations(
  options: BoxStyleDeclarationsOptions
): InlineStyle {
  const { attrs, nodeType, warnings } = options;
  const declarations: InlineStyle = {};

  if (attrs.backgroundColor) {
    warnings.push({
      nodeType,
      field: 'backgroundColor',
      message: 'Migrated "backgroundColor" → "style"',
    });
    declarations.backgroundColor = attrs.backgroundColor;
  }
  delete attrs.backgroundColor;

  const border = getBorderDeclarations({
    color: attrs.borderColor,
    width: attrs.borderWidth,
  });
  if (Object.keys(border).length > 0) {
    for (const field of BORDER_FIELDS) {
      if (attrs[field] != null) {
        warnings.push({
          nodeType,
          field,
          message: `Migrated "${field}" → "style"`,
        });
      }
    }
    Object.assign(declarations, border);
  }
  for (const field of BORDER_FIELDS) {
    delete attrs[field];
  }

  const radius = getBorderRadiusDeclarations(attrs.borderRadius);
  if (Object.keys(radius).length > 0) {
    warnings.push({
      nodeType,
      field: 'borderRadius',
      message: 'Migrated "borderRadius" → "style"',
    });
    Object.assign(declarations, radius);
  }
  delete attrs.borderRadius;

  const padding = getBoxDeclarations({
    bottom: attrs.paddingBottom,
    left: attrs.paddingLeft,
    property: 'padding',
    right: attrs.paddingRight,
    top: attrs.paddingTop,
  });
  if (Object.keys(padding).length > 0) {
    warnings.push({
      nodeType,
      field: 'padding',
      message: 'Migrated "padding*" → "style"',
    });
    Object.assign(declarations, padding);
  }
  for (const field of PADDING_FIELDS) {
    delete attrs[field];
  }

  return declarations;
}
