type HexObject = {
  r: string;
  g: string;
  b: string;
  a: string;
};

type DecimalObject = {
  r: number;
  g: number;
  b: number;
  a: number;
};

function removeHash(hex: string): string {
  return hex.charAt(0) === '#' ? hex.slice(1) : hex;
}

function parseHex(nakedHex: string) {
  const isShort = nakedHex.length === 3 || nakedHex.length === 4;

  const twoDigitHexR = isShort
    ? `${nakedHex.slice(0, 1)}${nakedHex.slice(0, 1)}`
    : nakedHex.slice(0, 2);
  const twoDigitHexG = isShort
    ? `${nakedHex.slice(1, 2)}${nakedHex.slice(1, 2)}`
    : nakedHex.slice(2, 4);
  const twoDigitHexB = isShort
    ? `${nakedHex.slice(2, 3)}${nakedHex.slice(2, 3)}`
    : nakedHex.slice(4, 6);
  const twoDigitHexA =
    (isShort
      ? `${nakedHex.slice(3, 4)}${nakedHex.slice(3, 4)}`
      : nakedHex.slice(6, 8)) || 'ff';

  return {
    r: twoDigitHexR,
    g: twoDigitHexG,
    b: twoDigitHexB,
    a: twoDigitHexA,
  };
}

function hexToDecimal(hex: string): number {
  return parseInt(hex, 16);
}

function hexesToDecimals({ r, g, b, a }: HexObject) {
  return {
    r: hexToDecimal(r),
    g: hexToDecimal(g),
    b: hexToDecimal(b),
    a: +(hexToDecimal(a) / 255).toFixed(2),
  };
}

function isNumeric(n: any): boolean {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function formatRgb(decimalObject: DecimalObject, parameterA?: string): string {
  const { r, g, b, a: parsedA } = decimalObject;
  const a = isNumeric(parameterA) ? parameterA : parsedA;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function hexToRgba(hex: string, a?: string): string {
  const hashlessHex = removeHash(hex);
  const hexObject = parseHex(hashlessHex);
  const decimalObject = hexesToDecimals(hexObject);

  return formatRgb(decimalObject, a);
}

export function hexToDecimalObject(hex: string): DecimalObject {
  const hashlessHex = removeHash(hex);
  const hexObject = parseHex(hashlessHex);

  return hexesToDecimals(hexObject);
}
