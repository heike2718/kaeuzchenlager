import { deepFreeze } from '@testing';
import { assertDeepFrozen } from '@testing';

describe('deep-freeze', () => {
  describe('mutations', () => {
    it('freezes deep structures and blocks mutations', () => {
      const state = { a: { b: [{ c: 1 }] } };
      const frozen = deepFreeze(state);
      assertDeepFrozen(frozen);

      expect(() => {
        (frozen as any).a = 1;
      }).toThrow(TypeError);
      expect(() => {
        (frozen as any).a.b.push({ c: 2 });
      }).toThrow(TypeError);
      expect(() => {
        (frozen as any).a.b[0].c = 9;
      }).toThrow(TypeError);
    });
  });

  describe('cycles', () => {
    it('handles cycles', () => {
      const x: any = { a: 1 };
      x.self = x;
      deepFreeze(x); // kein Crash
      expect(Object.isFrozen(x)).toBe(true);
      expect(() => {
        x.a = 2;
      }).toThrow(TypeError);
    });
  });

  describe('document', () => {
    it('documents Date behavior', () => {
      const obj = { d: new Date(0) };
      deepFreeze(obj);
      // Freeze verhindert keine Methoden-Mutationen auf Date
      obj.d.setTime(1000); // darf NICHT werfen
      expect(obj.d.getTime()).toBe(1000);
    });
  });
});
