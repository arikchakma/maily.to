export function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(Math.max(value, min), max);
}

export function percentage(portion: number, total: number): number {
  return clamp((portion / total) * 100, [0, 100]);
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
}

export function absoluteFromPercentage(
  percentage: number,
  total: number
): number {
  return Math.round((total * percentage) / 100);
}
