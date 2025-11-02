import { gefaesstypenFeature, GefaesstypenState } from './gefaesstypen.reducer';
import {
  selectAnzahlGefaesstypen,
  selectGefaesstypen,
  selectGefaesstypConflict,
  selectGefaesstypenLoaded,
  selectSelectedGefasesstyp,
} from './gefaesstypen.selectors';
import { deepFreeze, firstGefaesstyp, secondGefaesstyp, thirdGefaesstyp } from '@testing';

describe('GefaesstypenSelectors', () => {
  const initialGefaesstypenState: GefaesstypenState = {
    gefaesstypen: [],
    gefaesstypenLoaded: false,
    selectedUuid: null,
    error: null,
    conflict: null,
  };

  describe('gefaesstypen', () => {
    it('selects empty array when initial state', () => {
      const initialRootState = { [gefaesstypenFeature.name]: initialGefaesstypenState };

      const result = selectGefaesstypen(initialRootState);
      expect(result).toStrictEqual([]);
    });

    it('memoizes with same root reference', () => {
      const initialGefaesstypenState: GefaesstypenState = {
        gefaesstypen: [firstGefaesstyp, secondGefaesstyp],
        gefaesstypenLoaded: true,
        selectedUuid: null,
        error: null,
        conflict: null,
      };

      const initialRootState = { [gefaesstypenFeature.name]: initialGefaesstypenState };

      const result1 = selectGefaesstypen(initialRootState);
      const result2 = selectGefaesstypen(initialRootState);

      expect(result1.length).toBe(2);
      expect(result1[0]).toBe(firstGefaesstyp);
      expect(result1[1]).toBe(secondGefaesstyp);

      expect(result1).toBe(result2);
      expect(result1).toBe(initialGefaesstypenState.gefaesstypen);
      expect(result2).toBe(initialGefaesstypenState.gefaesstypen);
    });

    it('returns same array reference when only unrelated fields change and the array reference stays the same', () => {
      const initialGefaesstypenState: GefaesstypenState = {
        gefaesstypen: [firstGefaesstyp, secondGefaesstyp],
        gefaesstypenLoaded: true,
        selectedUuid: null,
        error: null,
        conflict: null,
      };

      // nur unrelated Feld geändert, Array-REFERENZ unverändert
      const changedGefaesstypenState: GefaesstypenState = {
        ...initialGefaesstypenState,
        selectedUuid: secondGefaesstyp.uuid,
      };

      const initialRootState = { [gefaesstypenFeature.name]: initialGefaesstypenState };
      const changedRootState = { [gefaesstypenFeature.name]: changedGefaesstypenState };

      const result1 = selectGefaesstypen(initialRootState);
      const result2 = selectGefaesstypen(changedRootState);

      // Inhalte
      expect(result1.length).toBe(2);
      expect(result1[0]).toBe(firstGefaesstyp);
      expect(result1[1]).toBe(secondGefaesstyp);
      expect(result2.length).toBe(2);
      expect(result2[0]).toBe(firstGefaesstyp);
      expect(result2[1]).toBe(secondGefaesstyp);

      // gleiche Referenz, weil dieselbe Array-Referenz im State
      expect(result1).toBe(result2);
      expect(result1).toBe(initialGefaesstypenState.gefaesstypen);
      expect(result2).toBe(changedGefaesstypenState.gefaesstypen);
    });

    it('creates a new result reference when the array reference changes (even if contents are equal)', () => {
      const initialGefaesstypenState: GefaesstypenState = {
        gefaesstypen: [firstGefaesstyp, secondGefaesstyp],
        gefaesstypenLoaded: true,
        selectedUuid: null,
        error: null,
        conflict: null,
      };

      // neue Array-REFERENZ mit gleichen Elementen
      const changedGefaesstypenState: GefaesstypenState = {
        ...initialGefaesstypenState,
        gefaesstypen: [...initialGefaesstypenState.gefaesstypen],
      };

      const initialRootState = { [gefaesstypenFeature.name]: initialGefaesstypenState };
      const changedRootState = { [gefaesstypenFeature.name]: changedGefaesstypenState };

      const result1 = selectGefaesstypen(initialRootState);
      const result2 = selectGefaesstypen(changedRootState);

      // Inhalte gleich, Referenz unterschiedlich
      expect(result1).not.toBe(result2);
      expect(result1).toStrictEqual(result2);
      expect(result1).toBe(initialGefaesstypenState.gefaesstypen);
      expect(result2).toBe(changedGefaesstypenState.gefaesstypen);
    });
  });

  describe('anzahl', () => {
    it('returns 0 when initial state', () => {
      const initialGefaesstypenState: GefaesstypenState = {
        gefaesstypen: [],
        gefaesstypenLoaded: false,
        selectedUuid: null,
        error: null,
        conflict: null,
      };

      const initialRootState = { [gefaesstypenFeature.name]: initialGefaesstypenState };

      const result = selectAnzahlGefaesstypen(initialRootState);

      expect(result).toBe(0);
    });

    it('returns 2 when populated with 2 gefaesstypen', () => {
      const populatedGefaesstypenState: GefaesstypenState = {
        gefaesstypen: [firstGefaesstyp, secondGefaesstyp],
        gefaesstypenLoaded: true,
        selectedUuid: null,
        error: null,
        conflict: null,
      };

      const rootState = { [gefaesstypenFeature.name]: populatedGefaesstypenState };

      const result = selectAnzahlGefaesstypen(rootState);

      expect(result).toBe(2);
    });

    it('returns 2 when unrelated field changes', () => {
      const populatedGefaesstypenState: GefaesstypenState = {
        gefaesstypen: [firstGefaesstyp, secondGefaesstyp],
        gefaesstypenLoaded: true,
        selectedUuid: null,
        error: null,
        conflict: null,
      };

      const changedState: GefaesstypenState = {
        ...populatedGefaesstypenState,
        selectedUuid: secondGefaesstyp.uuid,
      };

      const rootState = { [gefaesstypenFeature.name]: changedState };

      const result = selectAnzahlGefaesstypen(rootState);
      expect(result).toBe(2);
    });

    it('returns 2 when neue referenz', () => {
      const populatedGefaesstypenState: GefaesstypenState = {
        gefaesstypen: [firstGefaesstyp, secondGefaesstyp],
        gefaesstypenLoaded: true,
        selectedUuid: null,
        error: null,
        conflict: null,
      };

      const changedGefaesstypenState: GefaesstypenState = {
        ...populatedGefaesstypenState,
        gefaesstypen: [...populatedGefaesstypenState.gefaesstypen],
      };

      const rootState = { [gefaesstypenFeature.name]: populatedGefaesstypenState };
      const changedRootState = { [gefaesstypenFeature.name]: changedGefaesstypenState };

      const result1 = selectAnzahlGefaesstypen(rootState);
      const result2 = selectAnzahlGefaesstypen(changedRootState);

      expect(result1).toBe(2);
      expect(result2).toBe(2);
    });

    it('returns 3 when neuer gefaesstyp', () => {
      const populatedGefaesstypenState: GefaesstypenState = {
        gefaesstypen: [firstGefaesstyp, secondGefaesstyp],
        gefaesstypenLoaded: true,
        selectedUuid: null,
        error: null,
        conflict: null,
      };

      const changedGefaesstypenState: GefaesstypenState = {
        ...populatedGefaesstypenState,
        gefaesstypen: [...populatedGefaesstypenState.gefaesstypen, thirdGefaesstyp],
      };

      const changedRootState = { [gefaesstypenFeature.name]: changedGefaesstypenState };

      const result = selectAnzahlGefaesstypen(changedRootState);

      expect(result).toBe(3);
    });
  });

  describe('mutation smoke test', () => {
    it('should not mutate when state is frozen', () => {
      const state: GefaesstypenState = {
        conflict: { serverVersion: firstGefaesstyp, userInput: secondGefaesstyp.daten },
        error: {
          message: 'uiuiui',
          userInput: secondGefaesstyp.daten,
          type: 'CONCURRENT_UPDATE',
          uuid: firstGefaesstyp.uuid,
          serverVersion: thirdGefaesstyp.daten,
        },
        gefaesstypen: [firstGefaesstyp, secondGefaesstyp],
        gefaesstypenLoaded: true,
        selectedUuid: thirdGefaesstyp.uuid,
      };

      const root = { [gefaesstypenFeature.name]: deepFreeze(state) };

      selectGefaesstypen(root);
      selectAnzahlGefaesstypen(root);
      selectGefaesstypenLoaded(root);
      selectSelectedGefasesstyp(root);
      selectGefaesstypConflict(root);

      expect(root[gefaesstypenFeature.name]).toBe(root[gefaesstypenFeature.name]);
      expect(root[gefaesstypenFeature.name].gefaesstypen).toBe(state.gefaesstypen);
      expect(root[gefaesstypenFeature.name].gefaesstypenLoaded).toBe(state.gefaesstypenLoaded);
      expect(root[gefaesstypenFeature.name].selectedUuid).toBe(state.selectedUuid);
      expect(root[gefaesstypenFeature.name].error).toBe(state.error);
      expect(root[gefaesstypenFeature.name].conflict).toBe(state.conflict);
    });
  });

  describe('selectedGefaesstyp', () => {
    it('returns null when selectedUuid is null', () => {
      const root = { [gefaesstypenFeature.name]: initialGefaesstypenState };

      const result = selectSelectedGefasesstyp(root);

      expect(result).toBeNull();
    });

    it('returns null when selectedUuid is not null, but unknown', () => {
      const populatedGefaesstypenState: GefaesstypenState = {
        gefaesstypen: [firstGefaesstyp, secondGefaesstyp],
        gefaesstypenLoaded: true,
        selectedUuid: '1111111',
        error: null,
        conflict: null,
      };

      const root = { [gefaesstypenFeature.name]: populatedGefaesstypenState };

      const result = selectSelectedGefasesstyp(root);

      expect(result).toBeNull();
    });

    it('returns the gefaesstyp when selectedUuid is not null and known', () => {
      const populatedGefaesstypenState: GefaesstypenState = {
        gefaesstypen: [firstGefaesstyp, secondGefaesstyp],
        gefaesstypenLoaded: true,
        selectedUuid: secondGefaesstyp.uuid,
        error: null,
        conflict: null,
      };

      const root = { [gefaesstypenFeature.name]: populatedGefaesstypenState };

      const result = selectSelectedGefasesstyp(root);

      expect(result).toBe(secondGefaesstyp);
    });
  });
});
