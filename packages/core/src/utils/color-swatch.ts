import { Trash2Icon } from 'lucide-react';

import type { ColorSwatchItem } from '~/components/color-picker/color-swatch';

export const TRANSPARENT_COLOR = 'transparent';

/**
 * Preset color options shown in the highlight/text color picker.
 * Each swatch has a background and text color designed to pair well.
 */
export const DEFAULT_COLOR_SWATCHES = [
  { background: '#F3EEEE', id: 'brown', label: 'Brown', text: '#976D57' },
  { background: '#F8ECDF', id: 'orange', label: 'Orange', text: '#CC782F' },
  { background: '#FAF3DD', id: 'yellow', label: 'Yellow', text: '#C29343' },
  { background: '#EEF3ED', id: 'green', label: 'Green', text: '#548164' },
  { background: '#E9F3F7', id: 'blue', label: 'Blue', text: '#487CA5' },
  { background: '#F6F3F8', id: 'purple', label: 'Purple', text: '#8A67AB' },
  { background: '#F9F2F5', id: 'pink', label: 'Pink', text: '#B35488' },
  { background: '#FAECEC', id: 'red', label: 'Red', text: '#C4554D' },
  { background: '#EEEEF0', id: 'gray', label: 'Gray', text: '#6B6F76' },
  { background: '#E6F4F1', id: 'teal', label: 'Teal', text: '#3D8B7A' },
  { background: '#ECEEF8', id: 'indigo', label: 'Indigo', text: '#5C6BC0' },
  { background: '#F0F4E4', id: 'lime', label: 'Lime', text: '#6E8B3D' },
];

const RESET_SWATCH: ColorSwatchItem = {
  color: '',
  icon: Trash2Icon,
  id: 'reset',
  label: 'Remove Color',
};

const TRANSPARENT_SWATCH: ColorSwatchItem = {
  color: TRANSPARENT_COLOR,
  id: 'transparent',
  label: 'Transparent',
};

export function getBackgroundColorSwatches(): ColorSwatchItem[] {
  return [
    RESET_SWATCH,
    ...DEFAULT_COLOR_SWATCHES.map((swatch) => ({
      color: swatch.background,
      id: swatch.id,
      label: `${swatch.label} Background`,
    })),
    TRANSPARENT_SWATCH,
  ];
}

export function getTextColorSwatches(): ColorSwatchItem[] {
  return [
    RESET_SWATCH,
    ...DEFAULT_COLOR_SWATCHES.map((swatch) => ({
      color: swatch.text,
      id: swatch.id,
      label: `${swatch.label} Text`,
    })),
    TRANSPARENT_SWATCH,
  ];
}
