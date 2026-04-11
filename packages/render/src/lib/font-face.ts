import { DEFAULT_FONT } from '@maily-to/shared';
import type {
  FontProps,
  FontStyleAttributes,
  NodeFontStyleDefaults,
} from '@maily-to/shared';

import type { RenderContext } from '../context';

/**
 * Registers a font face in the context's shared font collector.
 * Deduplicates by family+style+weight+fallback so each variant
 * only appears once in the final `<style>` block.
 */
export function registerFontFace(ctx: RenderContext, font: FontProps): void {
  const {
    fontFamily,
    fontWeight = 400,
    fallbackFontFamily,
    fontStyle = 'normal',
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

/**
 * Resolves a complete FontProps from a node's font style attributes
 * (falling back to the theme font and CDN entries) and registers it.
 * Called by node renderers that support per-node font overrides.
 */
export function prepareAndRegisterFontFaceFromAttrs(
  ctx: RenderContext,
  attrs: FontStyleAttributes,
  defaults?: Partial<NodeFontStyleDefaults>
) {
  const primaryFont = ctx.config.theme.font ?? DEFAULT_FONT;
  if (!primaryFont) {
    return;
  }

  const { fontFamily, fontWeight, fontFallback, fontStyle } = attrs;
  const family = fontFamily ?? primaryFont.fontFamily;
  if (!family) {
    return;
  }

  const weight = fontWeight ?? defaults?.fontWeight ?? 400;
  const style = fontStyle ?? defaults?.fontStyle ?? 'normal';
  const fallback = fontFallback ?? primaryFont.fallbackFontFamily;

  const webFont = fontFamily
    ? ctx.config.fontFamilies.find((f) => f.fontFamily === fontFamily)?.webFont
    : primaryFont.webFont;

  registerFontFace(ctx, {
    fontFamily: family,
    fontWeight: weight,
    fallbackFontFamily: fallback,
    fontStyle: style,
    ...(webFont && { webFont }),
  });
}
