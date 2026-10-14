import { clampImageWidthPercentage } from '@maily-to/shared';

type WidthPercentageOptions = {
  containerWidth: number;
  pixels: number;
};

export function getWidthPercentage(options: WidthPercentageOptions): number {
  const { containerWidth, pixels } = options;

  return clampImageWidthPercentage(Math.round((pixels / containerWidth) * 100));
}
