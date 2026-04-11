import { DEFAULT_RENDERER_THEME } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { buildConfig } from './config';

describe('buildConfig', () => {
  it('returns default config when called with no args', () => {
    const config = buildConfig();

    expect(config.theme).toEqual(DEFAULT_RENDERER_THEME);
    expect(config.variableValues).toBeInstanceOf(Map);
    expect(config.variableValues.size).toBe(0);
  });

  it('converts variables object to Map with mixed value types', () => {
    const config = buildConfig({
      variables: {
        name: 'Alice',
        active: true,
        items: [{ id: 1 }],
        cta: 'https://example.com',
        count: 42,
      },
    });

    expect(config.variableValues.get('name')).toBe('Alice');
    expect(config.variableValues.get('active')).toBe(true);
    expect(config.variableValues.get('items')).toEqual([{ id: 1 }]);
    expect(config.variableValues.get('cta')).toBe('https://example.com');
    expect(config.variableValues.get('count')).toBe(42);
    expect(config.variableValues.size).toBe(5);
  });

  it('merges paragraph theme with defaults', () => {
    const config = buildConfig({
      theme: { paragraph: { color: '#000' } },
    });

    expect(config.theme.paragraph?.color).toBe('#000');
    expect(config.theme.paragraph?.fontSize).toBe(
      DEFAULT_RENDERER_THEME.paragraph?.fontSize
    );
  });

  it('merges heading level overrides with defaults', () => {
    const config = buildConfig({
      theme: { heading: { h1: { fontSize: 40 } } },
    });

    expect(config.theme.heading?.h1?.fontSize).toBe(40);
    expect(config.theme.heading?.h1?.lineHeight).toBe(
      DEFAULT_RENDERER_THEME.heading?.h1?.lineHeight
    );
    expect(config.theme.heading?.h2).toEqual(
      DEFAULT_RENDERER_THEME.heading?.h2
    );
  });

  it('merges heading defaults color', () => {
    const config = buildConfig({
      theme: { heading: { defaults: { color: '#ff0000' } } },
    });

    expect(config.theme.heading?.defaults?.color).toBe('#ff0000');
  });

  it('merges footer theme with defaults', () => {
    const config = buildConfig({
      theme: { footer: { color: '#333' } },
    });

    expect(config.theme.footer?.color).toBe('#333');
    expect(config.theme.footer?.fontSize).toBe(
      DEFAULT_RENDERER_THEME.footer?.fontSize
    );
  });

  it('merges container theme with defaults', () => {
    const config = buildConfig({
      theme: { container: { backgroundColor: '#f0f0f0' } },
    });

    expect(config.theme.container?.backgroundColor).toBe('#f0f0f0');
    expect(config.theme.container?.maxWidth).toBe(
      DEFAULT_RENDERER_THEME.container?.maxWidth
    );
  });

  it('merges blockquote theme with defaults', () => {
    const config = buildConfig({
      theme: { blockquote: { borderColor: '#000' } },
    });

    expect(config.theme.blockquote?.borderColor).toBe('#000');
    expect(config.theme.blockquote?.color).toBe(
      DEFAULT_RENDERER_THEME.blockquote?.color
    );
  });

  it('merges horizontalRule theme with defaults', () => {
    const config = buildConfig({
      theme: { horizontalRule: { color: '#ccc' } },
    });

    expect(config.theme.horizontalRule?.color).toBe('#ccc');
  });

  it('merges code theme with defaults', () => {
    const config = buildConfig({
      theme: { code: { color: '#333' } },
    });

    expect(config.theme.code?.color).toBe('#333');
    expect(config.theme.code?.backgroundColor).toBe(
      DEFAULT_RENDERER_THEME.code?.backgroundColor
    );
  });

  it('merges button theme with font fields', () => {
    const config = buildConfig({
      theme: { button: { fontSize: 18 } },
    });

    expect(config.theme.button?.fontSize).toBe(18);
    expect(config.theme.button?.backgroundColor).toBe(
      DEFAULT_RENDERER_THEME.button?.backgroundColor
    );
  });

  it('allows font: null to override default font', () => {
    const config = buildConfig({ theme: { font: null } });

    expect(config.theme.font).toBeNull();
  });

  it('keeps default font when font is not specified', () => {
    const config = buildConfig({ theme: {} });

    expect(config.theme.font).toEqual(DEFAULT_RENDERER_THEME.font);
  });

  it('uses default variableFormatter when none provided', () => {
    const config = buildConfig();

    expect(config.variableFormatter({ variable: 'name' })).toBe('{{name}}');
    expect(
      config.variableFormatter({ variable: 'name', fallback: 'User' })
    ).toBe('{{name|User}}');
  });

  it('uses custom variableFormatter when provided', () => {
    const custom = ({ variable }: { variable: string }) => `\${${variable}}`;
    const config = buildConfig({ variableFormatter: custom });

    expect(config.variableFormatter({ variable: 'name' })).toBe('${name}');
  });

  it('passes through preview and openTrackingPixel', () => {
    const config = buildConfig({
      preview: 'Hello preview',
      openTrackingPixel: 'https://track.example.com/pixel.gif',
    });

    expect(config.preview).toBe('Hello preview');
    expect(config.openTrackingPixel).toBe(
      'https://track.example.com/pixel.gif'
    );
  });
});
