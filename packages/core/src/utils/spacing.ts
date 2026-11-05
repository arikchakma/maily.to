import type { UnitFieldPreset } from '~/components/interface/unit-field';

export const MIN_SPACER_HEIGHT = 1;
export const MAX_SPACER_HEIGHT = 1000;

export const SPACER_SPACING: UnitFieldPreset[] = [
  { displayValue: 'XS', label: 'Extra Small', value: 4 },
  { displayValue: 'SM', label: 'Small', value: 8 },
  { displayValue: 'MD', label: 'Medium', value: 16 },
  { displayValue: 'LG', label: 'Large', value: 32 },
  { displayValue: 'XL', label: 'Extra Large', value: 64 },
];

export const SPACING_PRESETS: UnitFieldPreset[] = [
  { label: 'None', value: 0 },
  { label: 'Small', value: 8 },
  { label: 'Medium', value: 16 },
  { label: 'Large', value: 32 },
];
