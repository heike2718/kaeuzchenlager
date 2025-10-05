import {
  Gefaesstyp,
  GefaesstypConflict,
  GefaesstypError,
  sortGefaesstypenByName,
  TEMP_UUID_PREFIX,
} from '@gefaesstypen/model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { gefaesstypenActions } from './gefaesstypen.actions';

export interface GefaesstypenState {
  readonly gefaesstypen: Gefaesstyp[];
  readonly selectedUuid: string | null;
  readonly gefaesstypenLoaded: boolean;
  readonly error: GefaesstypError | null;
  readonly conflict: GefaesstypConflict | null;
}

// exported for tests
export const initialState: GefaesstypenState = {
  gefaesstypen: [],
  selectedUuid: null,
  gefaesstypenLoaded: false,
  error: null,
  conflict: null,
};

export const gefaesstypenFeature = createFeature({
  name: 'gefaesstypen',
  reducer: createReducer(
    initialState,
    on(gefaesstypenActions.gefaesstypenLoaded, (state, action) => {
      return {
        ...state,
        gefaesstypen: action.gefaesstypen,
        gefaesstypenLoaded: true,
        selectedUuid: null,
        error: null,
      };
    }),
    on(gefaesstypenActions.gefaesstypSelected, (state, action) => {
      // diese wird nur getriggert, wenn es die uuid auch im backend gibt
      const newGefaesstypen = state.gefaesstypen.map((gt: Gefaesstyp) =>
        gt.uuid !== action.gefaesstyp.uuid ? gt : action.gefaesstyp
      );

      return {
        ...state,
        gefaesstypen: newGefaesstypen,
        selectedUuid: action.gefaesstyp.uuid,
        error: null,
      };
    }),
    on(gefaesstypenActions.neuerGefaesstypInitialized, (state, action) => {
      return {
        ...state,
        gefaesstypen: sortGefaesstypenByName([...state.gefaesstypen, action.neuerGefaesstyp]),
        selectedUuid: action.neuerGefaesstyp.uuid,
        error: null,
      };
    }),
    on(gefaesstypenActions.editGefaesstypCanceled, (state, action) => {
      if (action.uuid.startsWith(TEMP_UUID_PREFIX)) {
        const gefaesstypen = state.gefaesstypen.filter(gt => gt.uuid !== action.uuid);

        return { ...state, gefaesstypen: [...gefaesstypen], selectedUuid: null, error: null };
      } else {
        return { ...state, selectedUuid: null, error: null };
      }
    }),
    on(gefaesstypenActions.gefaesstypAdded, (state, action) => {
      const neueGefaesstypen = state.gefaesstypen.filter(
        gt => !gt.uuid.startsWith(TEMP_UUID_PREFIX)
      );

      return {
        ...state,
        gefaesstypen: sortGefaesstypenByName([...neueGefaesstypen, action.gefaesstyp]),
        selectedUuid: action.gefaesstyp.uuid,
        error: null,
      };
    }),
    on(gefaesstypenActions.gefaesstypChanged, (state, action) => {
      const changedGefaesstypen = [...state.gefaesstypen].map(gt =>
        gt.uuid !== action.gefaesstyp.uuid ? gt : action.gefaesstyp
      );

      return {
        ...state,
        gefaesstypen: sortGefaesstypenByName(changedGefaesstypen),
        selectedUuid: action.gefaesstyp.uuid,
        error: null,
      };
    }),
    on(gefaesstypenActions.gefaesstypRemoved, (state, action) => {
      const removedGefaesstypen = state.gefaesstypen.filter(gt => gt.uuid === action.uuid);

      return removedGefaesstypen.length === 0
        ? { ...state, selectedUuid: null, error: null }
        : {
            ...state,
            gefaesstypen: state.gefaesstypen.filter(gt => gt.uuid !== action.uuid),
            selectedUuid: null,
            error: null,
          };
    }),
    on(gefaesstypenActions.resetGefaesstypenState, () => initialState)
  ),
});
