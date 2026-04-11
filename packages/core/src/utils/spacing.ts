import type { UnitFieldPreset } from '~/components/interface/unit-field';

/** Height presets for the spacer bubble menu (XS through XL). */
export const SPACER_SPACING: UnitFieldPreset[] = [
  {
    label: 'Extra Small',
    displayValue: 'XS',
    value: 4,
  },
  {
    label: 'Small',
    displayValue: 'SM',
    value: 8,
  },
  {
    label: 'Medium',
    displayValue: 'MD',
    value: 16,
  },
  {
    label: 'Large',
    displayValue: 'LG',
    value: 32,
  },
  {
    label: 'Extra Large',
    displayValue: 'XL',
    value: 64,
  },
];
