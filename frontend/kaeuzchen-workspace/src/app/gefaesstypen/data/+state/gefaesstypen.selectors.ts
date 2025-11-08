import { createSelector } from '@ngrx/store';
import { gefaesstypenFeature } from './gefaesstypen.reducer';
import { Gefaesstyp } from '@gefaesstypen/model';

const { selectGefaesstypenState: gefaesstypenState } = gefaesstypenFeature;

export const selectGefaesstypen = createSelector(gefaesstypenState, state => state.gefaesstypen);

export const selectAnzahlGefaesstypen = createSelector(
    selectGefaesstypen,
    (gefaesstypen: Gefaesstyp[]) => gefaesstypen.length
);

export const selectGefaesstypenLoaded = createSelector(gefaesstypenState, state => state.gefaesstypenLoaded);

const selectSelectedUuid = createSelector(gefaesstypenState, state => state.selectedUuid);

export const selectGefaesstypConflict = createSelector(gefaesstypenState, state => state.conflict);

export const selectSelectedGefasesstyp = createSelector(selectGefaesstypen, selectSelectedUuid, (gefaesstypen, uuid) =>
    uuid ? gefaesstypen.find(x => x.uuid === uuid) ?? null : null
);

export const fromGefaesstypen = {
    selectGefaesstypen,
    selectAnzahlGefaesstypen,
    selectGefaesstypenLoaded,
    selectSelectedGefasesstyp,
    selectGefaesstypConflict,
};
