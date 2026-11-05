import {
  DEFAULT_BUTTON_KIND,
  MAILY_NODE_TYPES,
  parseInlineStyles,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';

import type { MigrationWarning } from '../types';
import { getBoxDeclarations, getStyleAttribute } from '../utils/style';
import { getVariableReference } from '../utils/variable';

type StyleDeclarations = Record<string, string | null | undefined>;

const BORDER_RADIUS_VALUES: Record<string, string> = {
  sharp: '0px',
  smooth: '6px',
  round: '9999px',
};

const FALLBACK_BORDER_RADIUS = '9999px';
const FALLBACK_OUTLINE_COLOR = '#000000';
const OUTLINE_VARIANT = 'outline';
const V1_DEFAULT_ALIGN = TEXT_ALIGNMENTS.LEFT;

export function button(
  node: Record<string, any>,
  warnings: MigrationWarning[]
): void {
  node.attrs ??= {};

  const attrs = node.attrs;

  if (!node.content) {
    const text = attrs.text ?? '';

    if (attrs.isTextVariable && text) {
      node.content = [
        {
          type: MAILY_NODE_TYPES.VARIABLE,
          attrs: { id: text },
        },
      ];
    } else if (text) {
      node.content = [{ type: MAILY_NODE_TYPES.TEXT, text }];
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

  if (attrs.isUrlVariable === true) {
    warnings.push({
      nodeType: 'button',
      field: 'isUrlVariable',
      message: 'Migrated "isUrlVariable" → variable reference in "url"',
    });
    attrs.url = getVariableReference(attrs.url ?? '');
  }
  delete attrs.isUrlVariable;

  if ('alignment' in attrs) {
    if (attrs.alignment) {
      warnings.push({
        nodeType: 'button',
        field: 'alignment',
        message: 'Migrated "alignment" → "align"',
      });
      attrs.align = attrs.alignment;
    }
    delete attrs.alignment;
  }
  attrs.align ??= V1_DEFAULT_ALIGN;

  const declarations: StyleDeclarations = parseInlineStyles(attrs.style ?? '');

  if (attrs.buttonColor != null && attrs.variant !== OUTLINE_VARIANT) {
    warnings.push({
      nodeType: 'button',
      field: 'buttonColor',
      message: 'Migrated "buttonColor" → "style"',
    });
    declarations.backgroundColor = attrs.buttonColor;
  }

  if (attrs.textColor != null) {
    warnings.push({
      nodeType: 'button',
      field: 'textColor',
      message: 'Migrated "textColor" → "style"',
    });
    declarations.color = attrs.textColor;
  }

  if (attrs.variant === OUTLINE_VARIANT) {
    warnings.push({
      nodeType: 'button',
      field: 'variant',
      message:
        'Migrated "variant: outline" → transparent background + border in "style"',
    });
    declarations.backgroundColor = 'transparent';
    declarations.borderWidth = '2px';
    declarations.borderStyle = 'solid';
    declarations.borderColor = attrs.buttonColor ?? FALLBACK_OUTLINE_COLOR;
  }
  delete attrs.variant;

  if (typeof attrs.borderRadius === 'string') {
    warnings.push({
      nodeType: 'button',
      field: 'borderRadius',
      message: 'Migrated "borderRadius" enum → "style"',
    });
    declarations.borderRadius =
      BORDER_RADIUS_VALUES[attrs.borderRadius] ?? FALLBACK_BORDER_RADIUS;
  }
  delete attrs.borderRadius;

  Object.assign(
    declarations,
    getBoxDeclarations({
      bottom: attrs.paddingBottom,
      left: attrs.paddingLeft,
      property: 'padding',
      right: attrs.paddingRight,
      top: attrs.paddingTop,
    })
  );

  delete attrs.paddingTop;
  delete attrs.paddingRight;
  delete attrs.paddingBottom;
  delete attrs.paddingLeft;

  const style = getStyleAttribute(declarations);
  if (style) {
    attrs.style = style;
  }

  attrs.kind ??= DEFAULT_BUTTON_KIND;

  delete attrs.buttonColor;
  delete attrs.textColor;
}
