import {
  BORDER_STYLES,
  DEFAULT_BORDER_STYLE,
  getBorderParts,
  getBoxCorners,
  getBoxSides,
  toBoxCorners,
  toBoxSides,
} from '@maily-to/shared';
import { useEditorState } from '@tiptap/react';
import { ScanIcon } from 'lucide-react';
import { useState } from 'react';

import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';
import { getBackgroundColorSwatches } from '~/utils/color-swatch';
import { getNodeStyleState } from '~/utils/theme';

import { ColorPicker } from '../color-picker/color-picker';
import { ColorSwatch } from '../color-picker/color-swatch';
import { CornerIcon } from '../icons/corner-icon';
import { SideIcon } from '../icons/side-icon';
import { Divider } from '../interface/divider';
import {
  CORNER_AXES,
  MultiUnitField,
  SIDE_AXES,
} from '../interface/multi-unit-field';
import { PopoverBack } from '../interface/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '../interface/select';

const RADIUS_PRESETS = [
  { label: 'Sharp', value: 0 },
  { label: 'Smooth', value: 6 },
  { label: 'Round', value: 9999 },
];

const THICKNESS_PRESETS = [
  { label: 'None', value: 0 },
  { label: 'Thin', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'Thick', value: 3 },
];

const STYLE_PRESETS = [
  { label: 'Solid', value: BORDER_STYLES.SOLID },
  { label: 'Dashed', value: BORDER_STYLES.DASHED },
  { label: 'Dotted', value: BORDER_STYLES.DOTTED },
];

export type BorderStyleConfigProps = {
  container: FloatingUIContainer;
  nodeType: string;
  onBack: () => void;
};

export function BorderStyleConfig(props: BorderStyleConfigProps) {
  const { container, nodeType, onBack } = props;

  const editor = useEditorInstance();
  const declarations = useEditorState({
    editor,
    selector: ({ editor: instance }) =>
      getNodeStyleState({ editor: instance, type: nodeType }).resolved,
  });
  const border = getBorderParts(declarations);
  const radiusValues = getBoxCorners(declarations, 'borderRadius');
  const widthValues = getBoxSides(
    border.width && !declarations.borderWidth
      ? { ...declarations, borderWidth: border.width }
      : declarations,
    'borderWidth'
  );

  const updateStyle = (next: Record<string, string | null>) =>
    editor.chain().updateNodeStyle(nodeType, next).run();

  // Writing longhands beside a `border` shorthand leaves two declarations
  // fighting over the same edges, so the shorthand is cleared as soon as any
  // part of the border is edited.
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const updateBorder = (next: Record<string, string | null>) =>
    updateStyle({
      border: null,
      borderColor: border.color ?? null,
      borderStyle: border.style ?? DEFAULT_BORDER_STYLE,
      ...next,
    });

  if (isColorPickerOpen) {
    return (
      <div data-mly-border-style-config="">
        <PopoverBack onClick={() => setIsColorPickerOpen(false)}>
          Back to Border Style
        </PopoverBack>

        <ColorPicker
          color={border.color ?? ''}
          onColorChange={(color) =>
            updateBorder({ borderColor: color || null })
          }
        />
      </div>
    );
  }

  return (
    <div data-mly-border-style-config="">
      <PopoverBack onClick={onBack}>Border</PopoverBack>

      <Divider type="horizontal" />

      <MultiUnitField
        axes={CORNER_AXES}
        axisIcons={{
          bottomLeft: <CornerIcon corner="bottomLeft" />,
          bottomRight: <CornerIcon corner="bottomRight" />,
          topLeft: <CornerIcon corner="topLeft" />,
          topRight: <CornerIcon corner="topRight" />,
        }}
        container={container}
        dragAreaIcon={<ScanIcon size={14} />}
        label="Radius"
        max={9999}
        min={0}
        onValuesChange={(values) =>
          updateStyle(toBoxCorners('borderRadius', values))
        }
        presets={RADIUS_PRESETS}
        suffix="px"
        values={radiusValues}
      />

      <MultiUnitField
        axes={SIDE_AXES}
        axisIcons={{
          bottom: <SideIcon side="bottom" />,
          left: <SideIcon side="left" />,
          right: <SideIcon side="right" />,
          top: <SideIcon side="top" />,
        }}
        container={container}
        dragAreaIcon={<SideIcon side="mixed" />}
        label="Width"
        max={8}
        min={0}
        onValuesChange={(values) =>
          updateBorder(toBoxSides('borderWidth', values))
        }
        presets={THICKNESS_PRESETS}
        suffix="px"
        values={widthValues}
      />

      <div data-mly-style-config-row="">
        <span data-mly-field-label="">Style</span>

        <Select
          items={STYLE_PRESETS}
          onValueChange={(value) =>
            updateBorder({ borderStyle: String(value) })
          }
          value={border.style ?? DEFAULT_BORDER_STYLE}
        >
          <SelectTrigger aria-label="Border Style">
            <SelectValue />
          </SelectTrigger>

          <SelectPositioner align="end" container={container}>
            <SelectContent>
              {STYLE_PRESETS.map((preset) => (
                <SelectItem key={preset.label} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectPositioner>
        </Select>
      </div>

      <div data-mly-style-config-row="" data-align="start">
        <span data-mly-field-label="">Color</span>

        <ColorSwatch
          color={border.color ?? ''}
          container={container}
          items={getBackgroundColorSwatches()}
          onColorClick={(color) => updateBorder({ borderColor: color || null })}
          onCustomColorClick={() => setIsColorPickerOpen(true)}
        />
      </div>
    </div>
  );
}
