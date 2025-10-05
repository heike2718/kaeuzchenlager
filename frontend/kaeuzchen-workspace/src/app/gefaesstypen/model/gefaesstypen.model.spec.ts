import {
  createInitialGefaesstyp,
  Gefaesstyp,
  GefaesstypDaten,
  sortGefaesstypenByName,
} from './gefaesstypen.model';

describe('gefaesstypen.model', () => {
  describe('createInitialGefaesstyp', () => {
    it('should set the preferred initial values', () => {
      const gefaesstyp = createInitialGefaesstyp();

      expect(gefaesstyp.uuid.substring(0, 5)).toBe('temp-');
      expect(gefaesstyp.uuid.length).toBe(41);

      const daten: GefaesstypDaten = gefaesstyp.daten;
      expect(daten.version).toBeNull();
      expect(daten.volumen).toBe(0);
      expect(daten.name).toBe('');
      expect(daten.backgroundColor).toBe('#ffffff');
      expect(daten.anzahl).toBe(0);
    });
  });

  describe('sort', () => {
    const firstGefaesstyp: Gefaesstyp = {
      uuid: '1234',
      daten: {
        anzahl: 4,
        backgroundColor: '#ff0066',
        name: 'Ärster Gefäßtyp',
        volumen: 5,
        version: 2,
      },
    };

    const secondGefaesstyp: Gefaesstyp = {
      uuid: '9876',
      daten: {
        anzahl: 3,
        backgroundColor: '#ccffcc',
        name: 'arster Gefäßtyp',
        volumen: 20,
        version: 0,
      },
    };

    it('should sort an empty array', () => {
      // act
      const sorted = sortGefaesstypenByName([]);

      // assert
      expect(sorted).toEqual([]);
    });

    it('should sort an array with 1 item', () => {
      // act
      const sorted = sortGefaesstypenByName([firstGefaesstyp]);

      // assert
      expect(sorted.length).toBe(1);
      expect(sorted[0]).toEqual(firstGefaesstyp);
      expect(sorted[0]).toBe(firstGefaesstyp);
    });

    it('should sort an array with more than 1 item', () => {
      // act
      const sorted = sortGefaesstypenByName([firstGefaesstyp, secondGefaesstyp]);

      // assert
      expect(sorted.length).toBe(2);
      expect(sorted[0]).toEqual(secondGefaesstyp);
      expect(sorted[1]).toEqual(firstGefaesstyp);
    });
  });
});
