import { useEditorState } from '@tiptap/react';
import {
  AlignHorizontalSpaceAroundIcon,
  AlignVerticalSpaceAroundIcon,
  LayoutIcon,
  RulerIcon,
  SquareRoundCornerIcon,
} from 'lucide-react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import {
  getBackgroundColorSwatches,
  getTextColorSwatches,
} from '~/utils/color-swatch';

import { Divider } from '../interface/divider';
import { FieldLabel, FieldRoot } from '../interface/field';
import {
  getResolvedShellDeclarations,
  ThemeSettingsColorField,
  ThemeSettingsUnitField,
} from './theme-settings-field';
import { ThemeSettingsPopover } from './theme-settings-popover';

const MAX_PADDING = 100;
const MAX_RADIUS = 999;
const MAX_BORDER_WIDTH = 20;

const ROOT_FONT_SIZE = 16;

const RELATIVE_UNIT_PATTERN = /r?em$/;

function getPixels(value: string | undefined) {
  const parsed = Number.parseFloat(value ?? '') || 0;

  return RELATIVE_UNIT_PATTERN.test(value ?? '')
    ? parsed * ROOT_FONT_SIZE
    : parsed;
}

export function ThemeSettingsLayout() {
  const editor = useEditorInstance();

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      const body = getResolvedShellDeclarations({
        editor: instance,
        type: 'body',
      });
      const container = getResolvedShellDeclarations({
        editor: instance,
        type: 'container',
      });

      return {
        bodyBackgroundColor: body.backgroundColor ?? '',
        bodyPaddingHorizontal: getPixels(body.paddingLeft),
        bodyPaddingVertical: getPixels(body.paddingTop),
        containerBackgroundColor: container.backgroundColor ?? '',
        containerBorderColor: container.borderColor ?? '',
        containerBorderRadius: getPixels(container.borderRadius),
        containerBorderWidth: getPixels(container.borderWidth),
        containerPaddingHorizontal: getPixels(container.paddingLeft),
        containerPaddingVertical: getPixels(container.paddingTop),
      };
    },
  });

  const updateBorderWidth = (value: number) => {
    return editor
      .chain()
      .updateShellTheme({
        container: {
          borderStyle: value > 0 ? 'solid' : null,
          borderWidth: `${value}px`,
        },
      })
      .run();
  };

  return (
    <ThemeSettingsPopover icon={LayoutIcon} label="Layout">
      <ThemeSettingsColorField
        color={state.bodyBackgroundColor}
        items={getBackgroundColorSwatches()}
        label="Body"
        onColorChange={(color) => {
          return editor
            .chain()
            .updateShellTheme({ body: { backgroundColor: color } })
            .run();
        }}
      />

      <FieldRoot>
        <FieldLabel>Padding</FieldLabel>

        <div data-mly-theme-settings-group="">
          <ThemeSettingsUnitField
            dragAreaIcon={<AlignVerticalSpaceAroundIcon size={14} />}
            label="Body Padding Vertical"
            max={MAX_PADDING}
            onValueCommitted={(value) => {
              return editor
                .chain()
                .updateShellTheme({
                  body: {
                    paddingBottom: `${value}px`,
                    paddingTop: `${value}px`,
                  },
                })
                .run();
            }}
            value={state.bodyPaddingVertical}
          />

          <ThemeSettingsUnitField
            dragAreaIcon={<AlignHorizontalSpaceAroundIcon size={14} />}
            label="Body Padding Horizontal"
            max={MAX_PADDING}
            onValueCommitted={(value) => {
              return editor
                .chain()
                .updateShellTheme({
                  body: {
                    paddingLeft: `${value}px`,
                    paddingRight: `${value}px`,
                  },
                })
                .run();
            }}
            value={state.bodyPaddingHorizontal}
          />
        </div>
      </FieldRoot>

      <Divider type="horizontal" />

      <ThemeSettingsColorField
        color={state.containerBackgroundColor}
        items={getBackgroundColorSwatches()}
        label="Container"
        onColorChange={(color) => {
          return editor
            .chain()
            .updateShellTheme({ container: { backgroundColor: color } })
            .run();
        }}
      />

      <FieldRoot>
        <FieldLabel>Padding</FieldLabel>

        <div data-mly-theme-settings-group="">
          <ThemeSettingsUnitField
            dragAreaIcon={<AlignVerticalSpaceAroundIcon size={14} />}
            label="Container Padding Vertical"
            max={MAX_PADDING}
            onValueCommitted={(value) => {
              return editor
                .chain()
                .updateShellTheme({
                  container: {
                    paddingBottom: `${value}px`,
                    paddingTop: `${value}px`,
                  },
                })
                .run();
            }}
            value={state.containerPaddingVertical}
          />

          <ThemeSettingsUnitField
            dragAreaIcon={<AlignHorizontalSpaceAroundIcon size={14} />}
            label="Container Padding Horizontal"
            max={MAX_PADDING}
            onValueCommitted={(value) => {
              return editor
                .chain()
                .updateShellTheme({
                  container: {
                    paddingLeft: `${value}px`,
                    paddingRight: `${value}px`,
                  },
                })
                .run();
            }}
            value={state.containerPaddingHorizontal}
          />
        </div>
      </FieldRoot>

      <FieldRoot>
        <FieldLabel>Radius</FieldLabel>

        <ThemeSettingsUnitField
          dragAreaIcon={<SquareRoundCornerIcon size={14} />}
          label="Container Radius"
          max={MAX_RADIUS}
          onValueCommitted={(value) => {
            return editor
              .chain()
              .updateShellTheme({ container: { borderRadius: `${value}px` } })
              .run();
          }}
          value={state.containerBorderRadius}
        />
      </FieldRoot>

      <Divider type="horizontal" />

      <FieldRoot>
        <FieldLabel>Border</FieldLabel>

        <ThemeSettingsUnitField
          dragAreaIcon={<RulerIcon size={14} />}
          label="Container Border Width"
          max={MAX_BORDER_WIDTH}
          onValueCommitted={updateBorderWidth}
          value={state.containerBorderWidth}
        />
      </FieldRoot>

      <ThemeSettingsColorField
        color={state.containerBorderColor}
        items={getTextColorSwatches()}
        label="Border Color"
        onColorChange={(color) => {
          return editor
            .chain()
            .updateShellTheme({ container: { borderColor: color } })
            .run();
        }}
      />
    </ThemeSettingsPopover>
  );
}
