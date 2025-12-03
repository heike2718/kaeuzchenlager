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
    readonly gefaesstypenLoading: boolean;
    readonly gefaesstypenLoaded: boolean;
    readonly error: GefaesstypError | null;
    readonly conflict: GefaesstypConflict | null;
}

// exported for tests
export const initialState: GefaesstypenState = {
    gefaesstypen: [],
    selectedUuid: null,
    gefaesstypenLoading: false,
    gefaesstypenLoaded: false,
    error: null,
    conflict: null,
};

export const gefaesstypenFeature = createFeature({
    name: 'gefaesstypen',
    reducer: createReducer(
        initialState,
        on(gefaesstypenActions.loadGefaesstypen, state => {
            return { ...state, gefaesstypenLoading: true };
        }),
        on(gefaesstypenActions.gefaesstypenLoaded, (state, action) => {
            return {
                ...state,
                gefaesstypen: action.gefaesstypen,
                gefaesstypenLoading: false,
                gefaesstypenLoaded: true,
                selectedUuid: null,
                error: null,
                conflict: null,
            };
        }),
        on(gefaesstypenActions.selectGefaesstypByUuid, (state, action) => {
            return { ...state, selectedUuid: action.uuid, error: null, conflict: null };
        }),
        on(gefaesstypenActions.neuerGefaesstypInitialized, (state, action) => {
            return {
                ...state,
                gefaesstypen: sortGefaesstypenByName([...state.gefaesstypen, action.neuerGefaesstyp]),
                selectedUuid: null,
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
            // const tempGefaesstypen = state.gefaesstypen.filter(gt => gt.uuid.startsWith(TEMP_UUID_PREFIX));

            // TODO: muss hier noch geprüft werden, ob die uuid aus der action mit dem suffix aus tempGefaesstypen übereinstimmt?

            const neueGefaesstypen = state.gefaesstypen.filter(gt => !gt.uuid.startsWith(TEMP_UUID_PREFIX));

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
        on(gefaesstypenActions.gefaesstypForConflictDialogLoaded, (state, action) => {
            const conflict: GefaesstypConflict = {
                serverVersion: action.gefaesstypFromServer,
                userInput: action.userInput,
            };

            return { ...state, error: null, conflict: conflict };
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
