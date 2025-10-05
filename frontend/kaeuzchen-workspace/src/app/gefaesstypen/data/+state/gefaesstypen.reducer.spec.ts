import { Action } from '@ngrx/store';
import { gefaesstypenFeature, GefaesstypenState, initialState } from './gefaesstypen.reducer';
import { gefaesstypenActions } from './gefaesstypen.actions';
import { createInitialGefaesstyp, Gefaesstyp, GefaesstypError } from '@gefaesstypen/model';

describe('gefaesstypenFeature', () => {
  const unknownAction = { type: 'UNKNOWN_ACTION' } as Action;

  const navigateTo = 'gefaesstypen/3839';

  const firstGefaesstyp: Gefaesstyp = {
    uuid: '1234',
    daten: {
      anzahl: 4,
      backgroundColor: '#ff0066',
      name: 'Erster Gefäßtyp',
      volumen: 5,
      version: 2,
    },
  };

  const secondGefaesstyp: Gefaesstyp = {
    uuid: '9876',
    daten: {
      anzahl: 3,
      backgroundColor: '#ccffcc',
      name: 'Zweiter Gefäßtyp',
      volumen: 20,
      version: 0,
    },
  };

  const mockedGefaesstypen: Gefaesstyp[] = [firstGefaesstyp, secondGefaesstyp];

  const someError: GefaesstypError = {
    message: 'konnte nicht speichern',
    type: 'CONCURRENT_UPDATE',
    userInput: {
      anzahl: 3,
      backgroundColor: '#ccffcc',
      name: 'Gefäßtyp 2',
      volumen: 20,
      version: 0,
    },
    uuid: '9876',
    serverVersion: {
      anzahl: 3,
      backgroundColor: '#fcffccff',
      name: 'kleine Schraubgläser',
      volumen: 20,
      version: 1,
    },
  };

  const previousState: GefaesstypenState = {
    gefaesstypen: mockedGefaesstypen,
    selectedUuid: '7564',
    gefaesstypenLoaded: true,
    error: someError,
  };

  describe('ngrx sanity checks', () => {
    it('should return the initial state when unknown action and undefined state', () => {
      const state = gefaesstypenFeature.reducer(undefined, unknownAction);
      expect(state.gefaesstypen).toEqual([]);
      expect(state.selectedUuid).toBeNull();
      expect(state.gefaesstypenLoaded).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should return the previous state when unknown action and defined state', () => {
      const state = gefaesstypenFeature.reducer(previousState, unknownAction);
      expect(state).toEqual(previousState);
    });
    it('returns the same reference, when unknown action', () => {
      const previousState: GefaesstypenState = {
        gefaesstypen: mockedGefaesstypen,
        selectedUuid: '7564',
        gefaesstypenLoaded: true,
        error: null,
      };

      const state = gefaesstypenFeature.reducer(previousState, unknownAction);
      expect(state).toBe(previousState);
    });
  });

  describe('gefaesstypenLoaded', () => {
    it('sets the gefaesstypen and the loaded property when initialState', () => {
      const state = gefaesstypenFeature.reducer(
        initialState,
        gefaesstypenActions.gefaesstypenLoaded({ gefaesstypen: mockedGefaesstypen })
      );
      // Sortierung nach name wird vom backend sichergestellt beim Laden
      expect(state.gefaesstypen).toEqual(mockedGefaesstypen);
      expect(state.gefaesstypenLoaded).toBe(true);
      expect(state.selectedUuid).toBeNull();
      expect(state.error).toBeNull();
    });
    it('resets selectedUuid and error when not initialState', () => {
      const state = gefaesstypenFeature.reducer(
        previousState,
        gefaesstypenActions.gefaesstypenLoaded({ gefaesstypen: mockedGefaesstypen })
      );
      // Sortierung nach name wird vom backend sichergestellt beim Laden
      expect(state.gefaesstypen).toEqual(mockedGefaesstypen);
      expect(state.gefaesstypenLoaded).toBe(true);
      expect(state.selectedUuid).toBeNull();
      expect(state.error).toBeNull();
    });
    it('sets loaded when not initialState and response empty', () => {
      const state = gefaesstypenFeature.reducer(
        previousState,
        gefaesstypenActions.gefaesstypenLoaded({ gefaesstypen: [] })
      );
      // Sortierung nach name wird vom backend sichergestellt beim Laden
      expect(state.gefaesstypen).toEqual([]);
      expect(state.gefaesstypenLoaded).toBe(true);
      expect(state.selectedUuid).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('gefaesstypSelected', () => {
    it('sets the selectedUuid and resets error when not initialState and uuid known', () => {
      const state = gefaesstypenFeature.reducer(
        previousState,
        gefaesstypenActions.gefaesstypSelected({ gefaesstyp: secondGefaesstyp, navigateTo })
      );
      expect(state.gefaesstypen).toEqual(mockedGefaesstypen);
      expect(state.gefaesstypenLoaded).toBe(true);
      expect(state.selectedUuid).toBe('9876');
      expect(state.error).toBeNull();
    });
  });

  describe('neuerGefaesstypInitialized', () => {
    it('should add to gefaesstypen, sort and setSelectedUuid', () => {
      const uuid = 'temp-23425';
      const neuerGefaesstyp: Gefaesstyp = { ...createInitialGefaesstyp(), uuid: uuid };

      // gefaesstypenLoaded ist zwar unsinnig, aber es soll sichergestellt sein, dass gefaesstypenLoaded nicht geändert wird
      const state = gefaesstypenFeature.reducer(
        { ...previousState, gefaesstypenLoaded: false },
        gefaesstypenActions.neuerGefaesstypInitialized({ neuerGefaesstyp, navigateTo })
      );

      expect(state.selectedUuid).toBe('temp-23425');
      expect(state.error).toBeNull();
      expect(state.gefaesstypenLoaded).toBe(false);
      expect(state.gefaesstypen.length).toBe(3);
      expect(state.gefaesstypen[0]).toEqual(neuerGefaesstyp);
      expect(state.gefaesstypen[1]).toEqual(firstGefaesstyp);
      expect(state.gefaesstypen[2]).toBe(secondGefaesstyp);
    });
  });

  describe('gefaesstypAdded', () => {
    it('should replace the new gefaesstyp, sort and setSelectedUuid', () => {
      const uuid = 'temp-23425';
      const neuerGefaesstyp: Gefaesstyp = { ...createInitialGefaesstyp(), uuid: uuid };

      const addedGefaesstyp: Gefaesstyp = {
        uuid: '8574',
        daten: {
          name: 'Neuer Gefäßtyp',
          anzahl: 10,
          backgroundColor: '#000000',
          volumen: 100,
          version: 0,
        },
      };

      // gefaesstypenLoaded ist zwar unsinnig, aber es soll sichergestellt sein, dass gefaesstypenLoaded nicht geändert wird
      const state = gefaesstypenFeature.reducer(
        {
          ...previousState,
          gefaesstypen: [...previousState.gefaesstypen, neuerGefaesstyp],
          gefaesstypenLoaded: false,
        },
        gefaesstypenActions.gefaesstypAdded({ gefaesstyp: addedGefaesstyp, navigateTo })
      );

      expect(state.selectedUuid).toBe('8574');
      const tempGefaesstypen = state.gefaesstypen.filter(gt => 'temp-23425' === gt.uuid);
      expect(tempGefaesstypen.length).toBe(0);
      expect(state.error).toBeNull();
      expect(state.gefaesstypenLoaded).toBe(false);
      expect(state.gefaesstypen.length).toBe(3);
      expect(state.gefaesstypen[0]).toEqual(firstGefaesstyp);
      expect(state.gefaesstypen[1]).toEqual(addedGefaesstyp);
      expect(state.gefaesstypen[2]).toBe(secondGefaesstyp);
    });
  });

  describe('gefaesstypChanged', () => {
    it('should update the gefaesstypen and sort', () => {
      const changedGefaesstyp: Gefaesstyp = {
        uuid: '9876',
        daten: {
          anzahl: 7,
          backgroundColor: '#ffffff',
          name: 'Another Gefäßtyp',
          volumen: 20,
          version: 4,
        },
      };

      // gefaesstypenLoaded ist zwar unsinnig, aber es soll sichergestellt sein, dass gefaesstypenLoaded nicht geändert wird
      const state = gefaesstypenFeature.reducer(
        {
          ...previousState,
          gefaesstypenLoaded: false,
        },
        gefaesstypenActions.gefaesstypChanged({ gefaesstyp: changedGefaesstyp, navigateTo })
      );

      expect(state.selectedUuid).toBe('9876');
      expect(state.error).toBeNull();
      expect(state.gefaesstypenLoaded).toBe(false);
      expect(state.gefaesstypen.length).toBe(2);
      expect(state.gefaesstypen[0]).toEqual(changedGefaesstyp);
      expect(state.gefaesstypen[1]).toEqual(firstGefaesstyp);
    });
  });

  describe('editGefaesstypCanceled', () => {
    it('should update array and reset selectedUuid when uuid exists and transient', () => {
      const uuid = 'temp-23425';
      const neuerGefaesstyp: Gefaesstyp = { ...createInitialGefaesstyp(), uuid: uuid };

      // gefaesstypenLoaded ist zwar unsinnig, aber es soll sichergestellt sein, dass gefaesstypenLoaded nicht geändert wird
      const state = gefaesstypenFeature.reducer(
        {
          ...previousState,
          gefaesstypen: [...previousState.gefaesstypen, neuerGefaesstyp],
          gefaesstypenLoaded: false,
        },
        gefaesstypenActions.editGefaesstypCanceled({ uuid, navigateTo })
      );

      expect(state.selectedUuid).toBeNull();
      expect(state.error).toBeNull();
      expect(state.gefaesstypenLoaded).toBe(false);
      expect(state.gefaesstypen.length).toBe(2);
      expect(state.gefaesstypen[0]).toEqual(firstGefaesstyp);
      expect(state.gefaesstypen[1]).toBe(secondGefaesstyp);
    });

    it('should remove error when edit persistet Gefaesstyp', () => {
      // gefaesstypenLoaded ist zwar unsinnig, aber es soll sichergestellt sein, dass gefaesstypenLoaded nicht geändert wird
      const state = gefaesstypenFeature.reducer(
        {
          ...previousState,
          gefaesstypenLoaded: false,
        },
        gefaesstypenActions.editGefaesstypCanceled({ uuid: secondGefaesstyp.uuid, navigateTo })
      );

      expect(state.selectedUuid).toBeNull();
      expect(state.error).toBeNull();
      expect(state.gefaesstypenLoaded).toBe(false);
      expect(state.gefaesstypen.length).toBe(2);
      expect(state.gefaesstypen[0]).toEqual(firstGefaesstyp);
      expect(state.gefaesstypen[1]).toBe(secondGefaesstyp);
    });
  });

  describe('gefaesstypRemoved', () => {
    it('should update the gefaesstypen and selectedUuid when uuid known', () => {
      // gefaesstypenLoaded ist zwar unsinnig, aber es soll sichergestellt sein, dass gefaesstypenLoaded nicht geändert wird
      const state = gefaesstypenFeature.reducer(
        {
          ...previousState,
          gefaesstypenLoaded: false,
        },
        gefaesstypenActions.gefaesstypRemoved({ uuid: firstGefaesstyp.uuid, navigateTo })
      );

      expect(state.selectedUuid).toBeNull();
      expect(state.error).toBeNull();
      expect(state.gefaesstypenLoaded).toBe(false);
      expect(state.gefaesstypen.length).toBe(1);
      expect(state.gefaesstypen[0]).toEqual(secondGefaesstyp);
    });

    it('should not keep the state when uuid unknown', () => {
      // gefaesstypenLoaded ist zwar unsinnig, aber es soll sichergestellt sein, dass gefaesstypenLoaded nicht geändert wird
      const state = gefaesstypenFeature.reducer(
        {
          ...previousState,
          gefaesstypenLoaded: false,
        },
        gefaesstypenActions.gefaesstypRemoved({ uuid: '1212', navigateTo })
      );

      expect(state.selectedUuid).toBeNull();
      expect(state.error).toBeNull();
      expect(state.gefaesstypenLoaded).toBe(false);
      expect(state.gefaesstypen.length).toBe(2);
      expect(state.gefaesstypen[0]).toEqual(firstGefaesstyp);
      expect(state.gefaesstypen[1]).toEqual(secondGefaesstyp);
    });
  });

  describe('resetGefaesstypenState', () => {
    it('should return the initial state when actual state undefined', () => {
      const state = gefaesstypenFeature.reducer(
        undefined,
        gefaesstypenActions.resetGefaesstypenState
      );
      expect(state).toEqual(initialState);
    });
    it('should return the initial and a new reference when actual state defined (immutability)', () => {
      const state = gefaesstypenFeature.reducer(
        previousState,
        gefaesstypenActions.resetGefaesstypenState
      );
      expect(state).toEqual(initialState);
      expect(state).not.toBe(previousState);
    });
  });
});
