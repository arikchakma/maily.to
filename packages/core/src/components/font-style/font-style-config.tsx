import type {
  FallbackFont,
  FontFamily,
  FontStyleValue,
  FontWeight,
  HeadingLevel,
} from '@maily-to/shared';
import {
  allowedFallbackFonts,
  DEFAULT_FONT_FALLBACK,
  DEFAULT_FONT_FAMILY,
  FONT_SIZE_PRESETS,
  FONT_STYLES,
  FONT_WEIGHTS,
  getNodeFontStyleDefaults,
  LINE_HEIGHT_PRESETS,
  roundTo,
} from '@maily-to/shared';
import { useMailyId } from '@maily-to/ui';
import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { ALargeSmallIcon, BaselineIcon } from 'lucide-react';
import { useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { useFontFamilies } from '~/hooks/use-font-style-options';
import { useLoadFont } from '~/hooks/use-load-font';
import type { FloatingUIContainer } from '~/types/floating-ui';

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

type FontStyleConfigProps = {
  container: FloatingUIContainer;
  editor: Editor;
  nodeType: string;
  onBack?: () => void;
};

export function FontStyleConfig(props: FontStyleConfigProps) {
  const { container, editor: editorProp, nodeType, onBack } = props;

  const editor = useEditorInstance(editorProp);
  const fontFamilies = useFontFamilies(editor);
  const loadFont = useLoadFont();
  const state = useEditorState({
    editor: editor,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes(nodeType);

      return {
        fontFamily: (attrs.fontFamily as FontFamily) ?? null,
        fontFallback: (attrs.fontFallback as FallbackFont) ?? null,
        fontSize: (attrs.fontSize as number) ?? null,
        fontWeight: (attrs.fontWeight as FontWeight) ?? null,
        lineHeight: (attrs.lineHeight as number) ?? null,
        fontStyle: (attrs.fontStyle as FontStyleValue) ?? null,
        level: (attrs.level as HeadingLevel) ?? null,
      };
    },
  });

  const fontDefaults = getNodeFontStyleDefaults(
    nodeType,
    state.level ?? undefined
  );

  const [fontSize, setFontSize] = useState(
    state.fontSize ?? fontDefaults.fontSize
  );
  const [lineHeight, setLineHeight] = useState(
    state.lineHeight ?? fontDefaults.lineHeight
  );

  const handleFontFamilyChange = (value: unknown) => {
    const item = fontFamilies.find((f) => f.fontFamily === value);
    if (!item) {
      return;
    }

    loadFont(item, state.fontFallback ?? DEFAULT_FONT_FALLBACK);
    editor.chain().setFontStyle({ fontFamily: item.fontFamily }).run();
  };

  const handleFontFallbackChange = (value: unknown) => {
    editor
      .chain()
      .setFontStyle({ fontFallback: value as FallbackFont })
      .run();
  };

  const handleFontSizeCommit = (value: number) => {
    setFontSize(value);
    editor.chain().setFontStyle({ fontSize: value }).run();
  };

  const handleFontWeightChange = (value: unknown) => {
    const weight = parseInt(value as string, 10) as FontWeight;
    if (isNaN(weight) || weight <= 0) {
      return;
    }

    editor.chain().setFontStyle({ fontWeight: weight }).run();
  };

  const handleLineHeightChange = (value: number) => {
    setLineHeight(roundTo(value, 2));
  };

  const handleLineHeightCommit = (value: number) => {
    setLineHeight(roundTo(value, 2));
    editor.chain().setFontStyle({ lineHeight: value }).run();
  };

  const handleFontStyleChange = (value: unknown) => {
    editor
      .chain()
      .setFontStyle({ fontStyle: value as FontStyleValue })
      .run();
  };

  const selectedFontFamily = fontFamilies.find(
    (f) => f.fontFamily === state.fontFamily
  );

  const fontFamilyFieldId = useMailyId();
  const fontFallbackFieldId = useMailyId();
  const fontSizeFieldId = useMailyId();
  const fontWeightFieldId = useMailyId();
  const fontStyleFieldId = useMailyId();
  const lineHeightFieldId = useMailyId();

  return (
    <div className="mly:flex mly:flex-col">
      {onBack && (
        <>
          <PopoverBack onClick={onBack}>Typography</PopoverBack>
          <Divider type="horizontal" className="mly:-mx-1 mly:my-2 mly:mt-1" />
        </>
      )}

      <div className="mly:grid mly:gap-2 mly:px-1.5">
        <FieldRoot>
          <FieldLabel
            htmlFor={fontFamilyFieldId}
            className="mly:mb-1 mly:block"
          >
            Font Family
          </FieldLabel>
          <Select
            id={fontFamilyFieldId}
            value={selectedFontFamily?.fontFamily ?? DEFAULT_FONT_FAMILY}
            onValueChange={handleFontFamilyChange}
          >
            <SelectTrigger className="mly:w-full">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectPositioner container={container}>
              <SelectContent className="mly:max-w-(--anchor-width)">
                {fontFamilies.map((font) => (
                  <SelectItem key={font.fontFamily} value={font.fontFamily}>
                    {font.label ?? font.fontFamily}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPositioner>
          </Select>
        </FieldRoot>

        <FieldRoot>
          <FieldLabel
            htmlFor={fontFallbackFieldId}
            className="mly:mb-1 mly:block"
          >
            Fallback
          </FieldLabel>
          <Select
            id={fontFallbackFieldId}
            value={state.fontFallback ?? DEFAULT_FONT_FALLBACK}
            onValueChange={handleFontFallbackChange}
          >
            <SelectTrigger className="mly:w-full">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectPositioner container={container}>
              <SelectContent className="mly:max-w-(--anchor-width)">
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

      <Divider type="horizontal" className="mly:-mx-1 mly:my-2" />

      <div className="mly:grid mly:grid-cols-2 mly:gap-2 mly:p-1.5 mly:pt-0">
        <FieldRoot>
          <FieldLabel htmlFor={fontSizeFieldId} className="mly:mb-1 mly:block">
            Size
          </FieldLabel>
          <UnitField
            id={fontSizeFieldId}
            value={fontSize}
            onValueChange={setFontSize}
            onValueCommitted={handleFontSizeCommit}
            suffix="px"
            min={8}
            max={200}
            presets={[...FONT_SIZE_PRESETS]}
            onSelectPreset={handleFontSizeCommit}
            container={container}
            dragAreaIcon={
              <ALargeSmallIcon className="mly:size-3.5 mly:text-midnight-gray" />
            }
          />
        </FieldRoot>

        <FieldRoot>
          <FieldLabel
            htmlFor={fontWeightFieldId}
            className="mly:mb-1 mly:block"
          >
            Weight
          </FieldLabel>
          <Select
            id={fontWeightFieldId}
            value={String(state.fontWeight ?? fontDefaults.fontWeight)}
            onValueChange={handleFontWeightChange}
          >
            <SelectTrigger className="mly:w-full">
              <SelectValue placeholder="Normal" />
            </SelectTrigger>
            <SelectPositioner container={container}>
              <SelectContent className="mly:max-w-(--anchor-width)">
                {Object.entries(FONT_WEIGHTS).map(([label, value]) => {
                  const formattedLabel = label
                    .split('_')
                    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
                    .join(' ');

                  return (
                    <SelectItem
                      key={value}
                      value={String(value)}
                      className="mly:whitespace-nowrap"
                    >
                      {formattedLabel}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </SelectPositioner>
          </Select>
        </FieldRoot>

        <FieldRoot>
          <FieldLabel htmlFor={fontStyleFieldId} className="mly:mb-1 mly:block">
            Style
          </FieldLabel>
          <Select
            id={fontStyleFieldId}
            value={
              state.fontStyle ?? fontDefaults.fontStyle ?? FONT_STYLES.NORMAL
            }
            onValueChange={handleFontStyleChange}
          >
            <SelectTrigger className="mly:w-full mly:capitalize">
              <SelectValue placeholder="Normal" />
            </SelectTrigger>
            <SelectPositioner container={container}>
              <SelectContent className="mly:max-w-(--anchor-width)">
                {Object.entries(FONT_STYLES).map(([, value]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="mly:capitalize"
                  >
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectPositioner>
          </Select>
        </FieldRoot>

        <FieldRoot>
          <FieldLabel
            htmlFor={lineHeightFieldId}
            className="mly:mb-1 mly:block"
          >
            Line Height
          </FieldLabel>
          <UnitField
            id={lineHeightFieldId}
            value={lineHeight}
            onValueChange={handleLineHeightChange}
            onValueCommitted={handleLineHeightCommit}
            decimal
            step={0.1}
            min={0.5}
            max={3}
            presets={[...LINE_HEIGHT_PRESETS]}
            onSelectPreset={handleLineHeightCommit}
            container={container}
            dragAreaIcon={
              <BaselineIcon className="mly:size-3.5 mly:text-midnight-gray" />
            }
          />
        </FieldRoot>
      </div>
    </div>
  );
}
