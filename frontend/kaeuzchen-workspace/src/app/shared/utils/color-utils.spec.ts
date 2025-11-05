import { normalizeHex, isColorDark, ColorFormatError } from './color-utils';

describe('color-utils', () => {
  describe('nomalize hex', () => {
    it('normalisiert korrekt', () => {
      const expected = '#ccffcc';
      const normalized = normalizeHex('#ccffcc');

      expect(normalized).toBe(expected);
    });

    it('converts to lower case', () => {
      const expected = '#ccffcc';
      const normalized = normalizeHex('#CCFFCC');

      expect(normalized).toBe(expected);
    });

    it('appends #', () => {
      const expected = '#ccffcc';
      const normalized = normalizeHex('ccffcc');

      expect(normalized).toBe(expected);
    });

    it('throws ColorFormatError, wenn nicht korrekt', () => {
      const color = 'hallo';

      try {
        normalizeHex(color);
      } catch (e) {
        expect(e).instanceOf(ColorFormatError);
      }
    });
  });

  describe('isColorDark', () => {
    it('rechnet korrekt, wenn hell', () => {
      const color = '#ccffcc';
      expect(isColorDark(color)).toBeFalsy();
    });
    it('rechnet korrekt, wenn dunkel', () => {
      const color = '#ff0066';
      expect(isColorDark(color)).toBeTruthy();
    });
    it('normalizes first', () => {
      const color = 'hallo';

      try {
        isColorDark(color);
      } catch (e) {
        expect(e).instanceOf(ColorFormatError);
      }
    });
  });
});
