import { FONT_SIZE_PRESETS } from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
import { ALargeSmallIcon, TypeIcon } from 'lucide-react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import { getTextColorSwatches } from '~/utils/color-swatch';

import { Divider } from '../interface/divider';
import { FieldLabel, FieldRoot } from '../interface/field';
import {
  getResolvedThemeDeclarations,
  ThemeSettingsColorField,
  ThemeSettingsUnitField,
} from './theme-settings-field';
import { ThemeSettingsPopover } from './theme-settings-popover';

const MAX_FONT_SIZE = 200;
const MIN_FONT_SIZE = 8;

export function ThemeSettingsText() {
  const editor = useEditorInstance();

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const heading = getResolvedThemeDeclarations({
        editor: instance,
        type: 'heading',
      });
      const paragraph = getResolvedThemeDeclarations({
        editor: instance,
        type: 'paragraph',
      });

      return {
        headingColor: heading.color ?? '',
        paragraphColor: paragraph.color ?? '',
        paragraphFontSize:
          Number.parseFloat(paragraph.fontSize ?? '') || MIN_FONT_SIZE,
      };
    },
  });

  return (
    <ThemeSettingsPopover icon={TypeIcon} label="Text">
      <ThemeSettingsColorField
        color={state.paragraphColor}
        items={getTextColorSwatches()}
        label="Paragraph"
        onColorChange={(color) => {
          return editor.chain().updateNodeTheme({ paragraph: { color } }).run();
        }}
      />

      <FieldRoot>
        <FieldLabel>Size</FieldLabel>

        <ThemeSettingsUnitField
          dragAreaIcon={<ALargeSmallIcon size={14} />}
          label="Paragraph Size"
          max={MAX_FONT_SIZE}
          min={MIN_FONT_SIZE}
          onValueCommitted={(value) => {
            return editor
              .chain()
              .updateNodeTheme({ paragraph: { fontSize: `${value}px` } })
              .run();
          }}
          presets={[...FONT_SIZE_PRESETS]}
          value={state.paragraphFontSize}
        />
      </FieldRoot>

      <Divider type="horizontal" />

      <ThemeSettingsColorField
        color={state.headingColor}
        items={getTextColorSwatches()}
        label="Heading"
        onColorChange={(color) => {
          return editor.chain().updateNodeTheme({ heading: { color } }).run();
        }}
      />
    </ThemeSettingsPopover>
  );
}
