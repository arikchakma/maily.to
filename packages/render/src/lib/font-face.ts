import type { AnyMailyNode, FallbackFont, FontProps } from '@maily-to/shared';
import {
  DEFAULT_FONT_FALLBACK,
  getFontFamilyNames,
  parseInlineStyles,
} from '@maily-to/shared';

import type { RenderContext } from '../context';

export type RegisterFontFaceOptions = {
  ctx: RenderContext;
  font: FontProps;
};

/**
 * Registers a font face in the context's shared font collector.
 * Deduplicates by family+style+weight+fallback so each variant
 * only appears once in the final `<style>` block.
 */
function registerFontFace(options: RegisterFontFaceOptions): void {
  const { ctx, font } = options;
  const {
    fallbackFontFamily,
    fontFamily,
    fontStyle = 'normal',
    fontWeight = 400,
  } = font;

  if (!fontFamily) {
    return;
  }

  const key = `${fontFamily}:${fontStyle}:${fontWeight}:${fallbackFontFamily}`;
  if (ctx.fonts.has(key)) {
    return;
  }

  ctx.font(key, font);
}

function getFallbackFont(names: string[]): FallbackFont {
  const last = names.length > 1 ? names.at(-1) : undefined;

  return (last as FallbackFont | undefined) ?? DEFAULT_FONT_FALLBACK;
}

type StyledFontOptions = {
  ctx: RenderContext;
  style: string;
};

function registerStyledFont(options: StyledFontOptions): void {
  const { ctx, style } = options;
  const declarations = parseInlineStyles(style);
  const value = declarations.fontFamily;
  if (!value) {
    return;
  }

  const names = getFontFamilyNames(value);
  const fontFamily = names[0];
  if (!fontFamily) {
    return;
  }

  const item = ctx.config.fontFamilies.find((entry) => {
    return entry.fontFamily === fontFamily;
  });
  if (!item) {
    return;
  }

  const weight = Number.parseInt(declarations.fontWeight ?? '', 10);
  const { webFont } = item;

  registerFontFace({
    ctx,
    font: {
      fallbackFontFamily: getFallbackFont(names),
      fontFamily,
      fontStyle: declarations.fontStyle === 'italic' ? 'italic' : 'normal',
      fontWeight: Number.isNaN(weight) ? 400 : weight,
      ...(webFont ? { webFont } : {}),
    },
  });
}

export type DocumentFontsOptions = {
  ctx: RenderContext;
  node: AnyMailyNode;
};

export function registerDocumentFonts(options: DocumentFontsOptions): void {
  const { ctx, node } = options;
  const style = (node.attrs as Record<string, unknown> | undefined)?.style;

  if (typeof style === 'string' && style) {
    registerStyledFont({ ctx, style });
  }

  for (const mark of node.marks ?? []) {
    const markStyle = (mark.attrs as Record<string, unknown> | undefined)
      ?.style;

    if (typeof markStyle === 'string' && markStyle) {
      registerStyledFont({ ctx, style: markStyle });
    }
  }

  for (const child of node.content ?? []) {
    registerDocumentFonts({ ctx, node: child });
  }
}
