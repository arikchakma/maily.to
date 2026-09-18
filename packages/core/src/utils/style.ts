import type { InlineStyle } from '@maily-to/shared';
import {
  FONT_STYLES,
  FONT_WEIGHTS,
  mergeInlineStyles,
  parseInlineStyles,
  stringifyInlineStyles,
  TEXT_ALIGNMENTS,
} from '@maily-to/shared';

import { getSingleCell } from './table';

const BOLD_FONT_WEIGHTS = ['bold', 'bolder', String(FONT_WEIGHTS.BOLD)];

const MARKED_TEXT_DECORATIONS = ['underline', 'line-through'];

type ClaimedStyle = Record<string, true | ((value: string) => boolean)>;

export function isBoldFontWeight(value: string) {
  return BOLD_FONT_WEIGHTS.includes(value.trim().toLowerCase());
}

function isItalicFontStyle(value: string) {
  return value.trim().toLowerCase() === FONT_STYLES.ITALIC;
}

function isMarkedTextDecoration(value: string) {
  const decoration = value.toLowerCase();

  return MARKED_TEXT_DECORATIONS.some((keyword) => {
    return decoration.includes(keyword);
  });
}

// Declarations another mark already represents, so no mark repeats them in its
// own style. Bold parses `font-weight`, italic `font-style`, and underline and
// strike both parse `text-decoration`, on any element.
const CLAIMED_BY_MARKS: ClaimedStyle = {
  fontStyle: isItalicFontStyle,
  fontWeight: isBoldFontWeight,
  textDecoration: isMarkedTextDecoration,
  textDecorationLine: isMarkedTextDecoration,
};

// A span additionally hands colour to the text-style mark. Background is not
// listed: highlight only parses `mark` elements, so nothing claims it here.
const CLAIMED_ON_SPAN: ClaimedStyle = { ...CLAIMED_BY_MARKS, color: true };

const CLAIMED_ON_INLINE_IMAGE: ClaimedStyle = { display: true };

// Columns render their `gap` attribute as a flex gap so the editor spaces the
// columns the way the export does. The attribute owns it, so the parsed style
// must not keep a second copy.
const CLAIMED_ON_COLUMNS: ClaimedStyle = {
  gap: true,
  columnGap: true,
  rowGap: true,
};

// A column renders its `width` and `verticalAlign` attributes the same way, and
// the export recomputes the width to make room for the gap. A second copy left
// in the style would win over that and undo the layout. `verticalAlign` reaches
// the editor as a flex layout, which belongs to the attribute just the same.
const CLAIMED_ON_COLUMN: ClaimedStyle = {
  display: true,
  flexDirection: true,
  justifyContent: true,
  maxWidth: true,
  width: true,
  verticalAlign: true,
};

type UnclaimedStyleOptions = {
  style: string | null;
  claimed: ClaimedStyle;
};

function getUnclaimedStyle(options: UnclaimedStyleOptions) {
  const { style, claimed } = options;

  if (!style) {
    return null;
  }

  const declarations = parseInlineStyles(style);
  for (const [property, claims] of Object.entries(claimed)) {
    const value = declarations[property];
    if (value === undefined) {
      continue;
    }

    if (claims === true || claims(value)) {
      delete declarations[property];
    }
  }

  return stringifyInlineStyles(declarations) || null;
}

export function getMarkStyle(style: string | null) {
  return getUnclaimedStyle({ style, claimed: CLAIMED_BY_MARKS });
}

export function getSpanStyle(style: string | null) {
  return getUnclaimedStyle({ style, claimed: CLAIMED_ON_SPAN });
}

export function getInlineImageStyle(element: HTMLElement) {
  return getUnclaimedStyle({
    style: getElementStyle(element),
    claimed: CLAIMED_ON_INLINE_IMAGE,
  });
}

export function getColumnsStyle(style: string | null) {
  return getUnclaimedStyle({ style, claimed: CLAIMED_ON_COLUMNS });
}

export function getColumnStyle(style: string | null) {
  return getUnclaimedStyle({ style, claimed: CLAIMED_ON_COLUMN });
}

const TABLE_ALIGNMENT: Record<string, InlineStyle> = {
  center: { marginLeft: 'auto', marginRight: 'auto' },
  left: { marginRight: 'auto' },
  right: { marginLeft: 'auto' },
};

function toCssLength(value: string) {
  const trimmed = value.trim();

  return /^\d+(?:\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
}

function getPresentationalStyle(element: HTMLElement): InlineStyle {
  const style: InlineStyle = {};
  const width = element.getAttribute('width');
  const height = element.getAttribute('height');
  const align = element.getAttribute('align');
  const verticalAlign = element.getAttribute('valign');
  const backgroundColor = element.getAttribute('bgcolor');

  if (width) {
    style.width = toCssLength(width);
  }

  if (height) {
    style.height = toCssLength(height);
  }

  if (align) {
    Object.assign(
      style,
      element.tagName === 'TABLE'
        ? TABLE_ALIGNMENT[align.toLowerCase()]
        : { textAlign: align }
    );
  }

  if (verticalAlign) {
    style.verticalAlign = verticalAlign;
  }

  if (backgroundColor) {
    style.backgroundColor = backgroundColor;
  }

  return style;
}

function getWrapperAlignment(element: HTMLElement): InlineStyle {
  const align = element.getAttribute('align')?.toLowerCase();
  if (
    !align ||
    align === TEXT_ALIGNMENTS.LEFT ||
    align === TEXT_ALIGNMENTS.CENTER
  ) {
    return {};
  }

  return TABLE_ALIGNMENT[align] ?? {};
}

export function getWrapperStyle(element: HTMLElement) {
  const cell = getSingleCell(element);
  const style = mergeInlineStyles(
    getWrapperAlignment(element),
    parseInlineStyles(element.getAttribute('style') ?? '')
  );
  const inner = cell?.getAttribute('style');

  return (
    stringifyInlineStyles(
      inner ? mergeInlineStyles(style, parseInlineStyles(inner)) : style
    ) || null
  );
}

export function getElementStyle(element: HTMLElement) {
  const authored = element.getAttribute('style');
  const presentational = getPresentationalStyle(element);

  if (Object.keys(presentational).length === 0) {
    return authored;
  }

  return (
    stringifyInlineStyles(
      mergeInlineStyles(
        presentational,
        authored ? parseInlineStyles(authored) : {}
      )
    ) || null
  );
}

export function setStyleDeclarations(
  style: string | null | undefined,
  declarations: InlineStyle | Record<string, string | null | undefined>
) {
  const merged = style ? parseInlineStyles(style) : {};

  for (const [property, value] of Object.entries(declarations)) {
    if (value === null || value === undefined || value === '') {
      delete merged[property];
    } else {
      merged[property] = value;
    }
  }

  return stringifyInlineStyles(merged) || null;
}
