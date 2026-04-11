import type { MigrationWarning } from '../types';
import { splitBorderRadius } from '../utils/border';

const BORDER_RADIUS_MAP: Record<string, number> = {
  sharp: 0,
  smooth: 6,
  round: 9999,
};

/**
 * Migrates a v1 button node to the v2 schema.
 * Performs the following conversions:
 *   - Moves `attrs.text` into `content` as a text node (or a variable
 *     node when `isTextVariable` is true).
 *   - Renames `buttonColor` → `backgroundColor`, `textColor` → `color`.
 *   - Converts `variant: 'outline'` to `backgroundColor: 'transparent'`.
 *   - Converts the `borderRadius` string enum (sharp/smooth/round) into
 *     four numeric corner properties via splitBorderRadius.
 *   - Sets v2 defaults: kind "tight", paddingMode "mixed",
 *     borderRadiusMode/borderWidthMode "uniform", borderStyle "solid".
 *   - Drops deprecated flags: isTextVariable, isUrlVariable, variant.
 */
export function button(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  const attrs = node.attrs ?? {};

  // Move text → content
  if (!node.content) {
    const text = attrs.text ?? '';

    if (attrs.isTextVariable && text) {
      node.content = [
        {
          type: 'variable',
          attrs: { id: text },
        },
      ];
    } else if (text) {
      node.content = [{ type: 'text', text }];
    }
  }
  if ('text' in attrs) {
    warnings.push({
      nodeType: 'button',
      field: 'text',
      message: 'Migrated "text" → inline content node',
    });
    delete attrs.text;
  }
  if ('isTextVariable' in attrs) {
    warnings.push({
      nodeType: 'button',
      field: 'isTextVariable',
      message: 'Migrated "isTextVariable" → variable content node',
    });
    delete attrs.isTextVariable;
  }

  // Rename buttonColor → backgroundColor
  if ('buttonColor' in attrs) {
    warnings.push({
      nodeType: 'button',
      field: 'buttonColor',
      message: 'Migrated "buttonColor" → "backgroundColor"',
    });
    attrs.backgroundColor = attrs.buttonColor;
    delete attrs.buttonColor;
  }

  // Rename textColor → color
  if ('textColor' in attrs) {
    warnings.push({
      nodeType: 'button',
      field: 'textColor',
      message: 'Migrated "textColor" → "color"',
    });
    attrs.color = attrs.textColor;
    delete attrs.textColor;
  }

  // Handle variant: outline → transparent bg, border takes buttonColor
  // In v1, outline buttons had: background=transparent, border=2px solid buttonColor
  if (attrs.variant === 'outline') {
    warnings.push({
      nodeType: 'button',
      field: 'variant',
      message:
        'Migrated "variant: outline" → transparent backgroundColor + border properties',
    });
    attrs.borderColor = attrs.backgroundColor ?? '#000000';
    attrs.borderTopWidth = 2;
    attrs.borderRightWidth = 2;
    attrs.borderBottomWidth = 2;
    attrs.borderLeftWidth = 2;
    attrs.backgroundColor = 'transparent';
  }
  delete attrs.variant;

  // Convert borderRadius enum → number → split to 4 corners
  if (typeof attrs.borderRadius === 'string') {
    warnings.push({
      nodeType: 'button',
      field: 'borderRadius',
      message:
        'Migrated "borderRadius" enum → individual corner radius properties',
    });
    const radius = BORDER_RADIUS_MAP[attrs.borderRadius] ?? 9999;
    Object.assign(attrs, splitBorderRadius(radius));
    delete attrs.borderRadius;
  }

  // Set defaults
  attrs.kind ??= 'tight';
  attrs.paddingMode ??= 'mixed';
  attrs.borderRadiusMode ??= 'uniform';
  attrs.borderWidthMode ??= 'uniform';
  attrs.borderStyle ??= 'solid';
  attrs.borderColor ??= '#000000';
  attrs.borderTopWidth ??= 0;
  attrs.borderRightWidth ??= 0;
  attrs.borderBottomWidth ??= 0;
  attrs.borderLeftWidth ??= 0;

  // Drop with warning
  if ('isUrlVariable' in attrs) {
    warnings.push({
      nodeType: 'button',
      field: 'isUrlVariable',
      message:
        'Attribute "isUrlVariable" is not supported in v2 and was dropped',
    });
    delete attrs.isUrlVariable;
  }
}
