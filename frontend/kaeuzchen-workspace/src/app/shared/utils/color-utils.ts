export class ColorFormatError extends Error {
  constructor(input: string) {
    console.error(input + ' ist kein hex');
    super('Invalid hex color');
    this.name = 'ColorFormatError';
  }
}

/**
 *  normalisiert einen hex-String für eine Weiterverarbeitung
 *  throws ColorFormatError
 */
export function normalizeHex(hex: string): string {
  const h = hex.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    return ('#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2]).toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(h)) {
    return ('#' + h).toLowerCase();
  }
  throw new ColorFormatError(hex);
}

/**
 * YIT-Hellingkeit
 * throws ColorFormatError
 */
export function isColorDark(hexColor: string): boolean {
  return internalIsHexColorDark(normalizeHex(hexColor));
}

function internalIsHexColorDark(hexColor: string): boolean {
  const h = hexColor.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
}
