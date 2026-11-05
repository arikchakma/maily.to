import { parseInlineStyles } from '@maily-to/shared';
import { describe, expect, it } from 'vite-plus/test';

import { migrate } from '../src/index';
import type { MigrationWarning } from '../src/types';

const V1_SECTION_DEFAULTS = {
  align: 'left',
  backgroundColor: '#f7f7f7',
  borderColor: '#e2e2e2',
  borderRadius: 0,
  borderWidth: 2,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
};

const getMigratedSection = (attrs: Record<string, any>) => {
  const result = migrate({
    type: 'doc',
    content: [{ type: 'section', attrs, content: [] }],
  });

  return { section: result.json.content[0], warnings: result.warnings };
};

const getSectionStyle = (attrs: Record<string, any>) => {
  return parseInlineStyles(getMigratedSection(attrs).section.attrs.style ?? '');
};

type SectionCase = {
  attrs: Record<string, any>;
  name: string;
  style: Record<string, string> | null;
  warnings?: MigrationWarning[];
};

const BORDER_CASES: SectionCase[] = [
  {
    name: 'writes no border when the width is zero',
    attrs: { borderColor: '#e2e2e2', borderWidth: 0 },
    style: null,
    warnings: [],
  },
  {
    name: 'falls back to the v1 border color when only a width is set',
    attrs: { borderWidth: 4 },
    style: {
      borderColor: '#e2e2e2',
      borderStyle: 'solid',
      borderWidth: '4px',
    },
  },
  {
    name: 'writes a positive border radius',
    attrs: { borderRadius: 12 },
    style: { borderRadius: '12px' },
  },
  {
    name: 'skips a zero border radius',
    attrs: { borderRadius: 0 },
    style: {},
  },
];

const ALIGN_CASES: SectionCase[] = [
  {
    name: 'converts align to a text-align declaration',
    attrs: { align: 'center' },
    style: { textAlign: 'center' },
    warnings: [
      {
        nodeType: 'section',
        field: 'align',
        message: 'Migrated "align" → "style"',
      },
    ],
  },
  {
    name: 'drops align left without writing a style',
    attrs: { align: 'left' },
    style: null,
    warnings: [],
  },
];

describe('section', () => {
  it('writes the v1 defaults as one explicit style', () => {
    expect(getSectionStyle(V1_SECTION_DEFAULTS)).toEqual({
      backgroundColor: '#f7f7f7',
      borderColor: '#e2e2e2',
      borderStyle: 'solid',
      borderWidth: '2px',
      marginBottom: '0px',
      marginLeft: '0px',
      marginRight: '0px',
      marginTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
    });
  });

  it('reports one warning per migrated attribute group', () => {
    const { warnings } = getMigratedSection(V1_SECTION_DEFAULTS);

    expect(warnings).toEqual([
      {
        nodeType: 'section',
        field: 'backgroundColor',
        message: 'Migrated "backgroundColor" → "style"',
      },
      {
        nodeType: 'section',
        field: 'borderWidth',
        message: 'Migrated "borderWidth" → "style"',
      },
      {
        nodeType: 'section',
        field: 'borderColor',
        message: 'Migrated "borderColor" → "style"',
      },
      {
        nodeType: 'section',
        field: 'padding',
        message: 'Migrated "padding*" → "style"',
      },
      {
        nodeType: 'section',
        field: 'margin',
        message: 'Migrated "margin*" → "style"',
      },
    ]);
  });

  it.each(BORDER_CASES)('$name', ({ attrs, style, warnings: expected }) => {
    const { section, warnings } = getMigratedSection(attrs);

    if (style === null) {
      expect(section.attrs).not.toHaveProperty('style');
    } else {
      expect(parseInlineStyles(section.attrs.style ?? '')).toEqual(style);
    }

    expect(section.attrs).not.toHaveProperty('borderWidth');
    expect(section.attrs).not.toHaveProperty('borderColor');

    if (expected) {
      expect(warnings).toEqual(expected);
    }
  });

  it.each(ALIGN_CASES)('$name', ({ attrs, style, warnings: expected }) => {
    const { section, warnings } = getMigratedSection(attrs);

    if (style === null) {
      expect(section.attrs).not.toHaveProperty('style');
    } else {
      expect(parseInlineStyles(section.attrs.style)).toEqual(style);
    }

    expect(section.attrs).not.toHaveProperty('align');
    expect(warnings).toEqual(expected);
  });

  it('writes only the sides that carry a number', () => {
    expect(getSectionStyle({ marginTop: 24, paddingLeft: 16 })).toEqual({
      marginTop: '24px',
      paddingLeft: '16px',
    });
  });

  it('merges the migrated declarations over an existing style', () => {
    expect(
      getSectionStyle({
        backgroundColor: '#ffffff',
        style: 'background-color:#000000;color:#ff0000',
      })
    ).toEqual({
      backgroundColor: '#ffffff',
      color: '#ff0000',
    });
  });

  it('leaves a section without styling attributes untouched', () => {
    const { section, warnings } = getMigratedSection({});

    expect(section.attrs).not.toHaveProperty('style');
    expect(warnings).toEqual([]);
  });

  it('deletes every v1 source attribute', () => {
    const { section } = getMigratedSection(V1_SECTION_DEFAULTS);

    for (const field of Object.keys(V1_SECTION_DEFAULTS)) {
      expect(section.attrs).not.toHaveProperty(field);
    }
  });

  it('writes none of the beta mode or per-side attributes', () => {
    const { section } = getMigratedSection({
      ...V1_SECTION_DEFAULTS,
      borderRadius: 8,
    });

    for (const field of [
      'borderRadiusMode',
      'borderStyle',
      'borderTopLeftRadius',
      'borderTopWidth',
      'borderWidthMode',
      'marginMode',
      'paddingMode',
    ]) {
      expect(section.attrs).not.toHaveProperty(field);
    }
  });

  it('keeps the visibility rule the global transform created', () => {
    const { section } = getMigratedSection({ showIfKey: 'isActive' });

    expect(section.attrs.visibilityRule).toEqual({
      action: 'show',
      variable: 'isActive',
      operator: 'is_true',
      value: '',
    });
  });
});
