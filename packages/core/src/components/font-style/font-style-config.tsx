import type { FallbackFont, FontStyleValue } from '@maily-to/shared';
import {
  allowedFallbackFonts,
  DEFAULT_FONT_FALLBACK,
  DEFAULT_FONT_FAMILY,
  FONT_SIZE_PRESETS,
  FONT_STYLES,
  FONT_WEIGHTS,
  getFontFamilyNames,
  getFontFamilyValue,
  LINE_HEIGHT_PRESETS,
  MAILY_NODE_TYPES,
  roundTo,
} from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
import { ALargeSmallIcon, BaselineIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useFontFamilies } from '~/hooks/use-font-families';
import { useLoadFont } from '~/hooks/use-load-font';
import type { FloatingUIContainer } from '~/types/floating-ui';
import { getNodeStyleState } from '~/utils/theme';

import { Divider } from '../interface/divider';
import { FieldLabel, FieldRoot } from '../interface/field';
import { PopoverBack } from '../interface/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '../interface/select';
import { UnitField } from '../interface/unit-field';

export const FONT_STYLE_SUPPORTED_TYPES: string[] = [
  MAILY_NODE_TYPES.PARAGRAPH,
  MAILY_NODE_TYPES.HEADING,
  MAILY_NODE_TYPES.BUTTON,
  MAILY_NODE_TYPES.BLOCKQUOTE,
  MAILY_NODE_TYPES.FOOTER,
];

const FALLBACK_FONT_SIZE = 16;
const FALLBACK_LINE_HEIGHT = 1.5;

const STYLE_PRESETS = [
  { label: 'Normal', value: FONT_STYLES.NORMAL },
  { label: 'Italic', value: FONT_STYLES.ITALIC },
];

const WEIGHT_PRESETS = Object.entries(FONT_WEIGHTS).map(([name, value]) => {
  return {
    label: name
      .split('_')
      .map((word) => {
        return word.charAt(0) + word.slice(1).toLowerCase();
      })
      .join(' '),
    value,
  };
});

type LineHeightFieldOptions = {
  fontSize: number;
  isRatio: boolean;
};

function getLineHeightField(options: LineHeightFieldOptions) {
  const { fontSize, isRatio } = options;

  if (isRatio) {
    return {
      decimal: true,
      max: 3,
      min: 0.5,
      presets: LINE_HEIGHT_PRESETS.map((preset) => {
        return { label: preset.label, value: preset.value };
      }),
      step: 0.1,
      suffix: '',
    };
  }

  return {
    decimal: false,
    max: 200,
    min: 8,
    presets: LINE_HEIGHT_PRESETS.map((preset) => {
      return {
        label: preset.label,
        value: Math.round(fontSize * preset.value),
      };
    }),
    step: 1,
    suffix: 'px',
  };
}

export type FontStyleConfigProps = {
  container: FloatingUIContainer;
  nodeType: string;
  onBack: () => void;
};

export function FontStyleConfig(props: FontStyleConfigProps) {
  const { container, nodeType, onBack } = props;

  const editor = useEditorInstance();
  const fontFamilies = useFontFamilies(editor);
  const loadFont = useLoadFont();

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const { resolved } = getNodeStyleState({
        editor: instance,
        type: nodeType,
      });
      const names = resolved.fontFamily
        ? getFontFamilyNames(resolved.fontFamily)
        : [];
      const fontSize =
        Number.parseFloat(resolved.fontSize ?? '') || FALLBACK_FONT_SIZE;
      const lineHeight = resolved.lineHeight ?? '';

      return {
        fallbackFontFamily: (names.length > 1
          ? names.at(-1)
          : DEFAULT_FONT_FALLBACK) as FallbackFont,
        fontFamily: names[0] ?? DEFAULT_FONT_FAMILY,
        fontSize,
        fontStyle:
          resolved.fontStyle === FONT_STYLES.ITALIC
            ? FONT_STYLES.ITALIC
            : FONT_STYLES.NORMAL,
        fontWeight: Number.parseInt(resolved.fontWeight ?? '', 10) || null,
        isRatio: !lineHeight.endsWith('px'),
        lineHeight: Number.parseFloat(lineHeight) || FALLBACK_LINE_HEIGHT,
      };
    },
  });

  const [fontSize, setFontSize] = useState(state.fontSize);
  const [lineHeight, setLineHeight] = useState(state.lineHeight);
  const signature = `${state.fontSize}:${state.lineHeight}:${state.isRatio}`;
  const [previousSignature, setPreviousSignature] = useState(signature);

  if (previousSignature !== signature) {
    setPreviousSignature(signature);
    setFontSize(state.fontSize);
    setLineHeight(state.lineHeight);
  }

  const lineHeightField = getLineHeightField({
    fontSize: state.fontSize,
    isRatio: state.isRatio,
  });

  const updateStyle = (next: Record<string, string | null>) => {
    return editor.chain().updateNodeStyle(nodeType, next).run();
  };

  const commitLineHeight = (value: number) => {
    const next = roundTo(value, 2);
    setLineHeight(next);

    return updateStyle({ lineHeight: `${next}${lineHeightField.suffix}` });
  };

  const updateFontFamily = (options: {
    fallbackFontFamily: FallbackFont;
    fontFamily: string;
  }) => {
    const item = fontFamilies.find((candidate) => {
      return candidate.fontFamily === options.fontFamily;
    });

    if (item) {
      loadFont({ fallbackFontFamily: options.fallbackFontFamily, item });
    }

    updateStyle({ fontFamily: getFontFamilyValue(options) });
  };

  const fontFamilyOptions = fontFamilies.some((font) => {
    return font.fontFamily === state.fontFamily;
  })
    ? fontFamilies
    : [{ fontFamily: state.fontFamily }, ...fontFamilies];

  const fontFamilyId = useId();
  const fontFallbackId = useId();
  const fontSizeId = useId();
  const fontWeightId = useId();
  const fontStyleId = useId();
  const lineHeightId = useId();

  return (
    <div data-mly-font-style-config="">
      <PopoverBack onClick={onBack}>Typography</PopoverBack>

      <Divider type="horizontal" />

      <div data-mly-font-style-fields="">
        <FieldRoot>
          <FieldLabel htmlFor={fontFamilyId}>Font Family</FieldLabel>

          <Select
            items={fontFamilyOptions.map((font) => {
              return {
                label: font.label ?? font.fontFamily,
                value: font.fontFamily,
              };
            })}
            onValueChange={(value) => {
              return updateFontFamily({
                fallbackFontFamily: state.fallbackFontFamily,
                fontFamily: String(value),
              });
            }}
            value={state.fontFamily}
          >
            <SelectTrigger aria-label="Font Family" id={fontFamilyId}>
              <SelectValue />
            </SelectTrigger>

            <SelectPositioner container={container}>
              <SelectContent>
                {fontFamilyOptions.map((font) => (
                  <SelectItem key={font.fontFamily} value={font.fontFamily}>
                    {font.label ?? font.fontFamily}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPositioner>
          </Select>
        </FieldRoot>

        <FieldRoot>
          <FieldLabel htmlFor={fontFallbackId}>Fallback</FieldLabel>

          <Select
            onValueChange={(value) => {
              return updateFontFamily({
                fallbackFontFamily: value as FallbackFont,
                fontFamily: state.fontFamily,
              });
            }}
            value={state.fallbackFontFamily}
          >
            <SelectTrigger aria-label="Font Fallback" id={fontFallbackId}>
              <SelectValue />
            </SelectTrigger>

            <SelectPositioner container={container}>
              <SelectContent>
                {allowedFallbackFonts.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPositioner>
          </Select>
        </FieldRoot>
      </div>

      <Divider type="horizontal" />

      <div data-mly-font-style-metrics="">
        <FieldRoot>
          <FieldLabel htmlFor={fontSizeId}>Size</FieldLabel>

          <UnitField
            container={container}
            displayValue={`${fontSize}px`}
            dragAreaIcon={<ALargeSmallIcon size={14} />}
            id={fontSizeId}
            label="Size"
            max={200}
            min={8}
            onSelectPreset={(value) => {
              return updateStyle({ fontSize: `${value}px` });
            }}
            onValueChange={setFontSize}
            onValueCommitted={(value) => {
              return updateStyle({ fontSize: `${value}px` });
            }}
            presets={[...FONT_SIZE_PRESETS]}
            suffix="px"
            value={fontSize}
          />
        </FieldRoot>

        <FieldRoot>
          <FieldLabel htmlFor={fontWeightId}>Weight</FieldLabel>

          <Select
            items={WEIGHT_PRESETS}
            onValueChange={(value) => {
              return updateStyle({ fontWeight: String(value) });
            }}
            value={state.fontWeight ?? FONT_WEIGHTS.NORMAL}
          >
            <SelectTrigger aria-label="Font Weight" id={fontWeightId}>
              <SelectValue />
            </SelectTrigger>

            <SelectPositioner container={container}>
              <SelectContent>
                {WEIGHT_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPositioner>
          </Select>
        </FieldRoot>

        <FieldRoot>
          <FieldLabel htmlFor={fontStyleId}>Style</FieldLabel>

          <Select
            items={STYLE_PRESETS}
            onValueChange={(value) => {
              return updateStyle({ fontStyle: value as FontStyleValue });
            }}
            value={state.fontStyle}
          >
            <SelectTrigger aria-label="Font Style" id={fontStyleId}>
              <SelectValue />
            </SelectTrigger>

            <SelectPositioner container={container}>
              <SelectContent>
                {STYLE_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPositioner>
          </Select>
        </FieldRoot>

        <FieldRoot>
          <FieldLabel htmlFor={lineHeightId}>Line Height</FieldLabel>

          <UnitField
            container={container}
            decimal={lineHeightField.decimal}
            displayValue={`${lineHeight}${lineHeightField.suffix}`}
            dragAreaIcon={<BaselineIcon size={14} />}
            id={lineHeightId}
            label="Line Height"
            max={lineHeightField.max}
            min={lineHeightField.min}
            onSelectPreset={commitLineHeight}
            onValueChange={setLineHeight}
            onValueCommitted={commitLineHeight}
            presets={lineHeightField.presets}
            step={lineHeightField.step}
            suffix={lineHeightField.suffix}
            value={lineHeight}
          />
        </FieldRoot>
      </div>
    </div>
  );
}
