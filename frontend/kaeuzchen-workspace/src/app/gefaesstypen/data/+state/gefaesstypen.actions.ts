import { Gefaesstyp, GefaesstypDaten, GefaesstypError } from '@gefaesstypen/model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const gefaesstypenActions = createActionGroup({
    source: 'gefaesstypen',
    events: {
        loadGefaesstypen: emptyProps(),
        gefaesstypenLoaded: props<{ gefaesstypen: Gefaesstyp[] }>(),
        loadGefaesstypForConflictDialog: props<{ uuid: string; userInput: GefaesstypDaten }>(),
        gefaesstypForConflictDialogLoaded: props<{
            gefaesstypFromServer: Gefaesstyp;
            userInput: GefaesstypDaten;
        }>(),
        // TODO: wird noch nirgends verwendet. muss im effect die action loadGefaesstypForConflictDialog triggern
        conflictDetected: props<{ gefaesstypFromServer: Gefaesstyp; userInput: GefaesstypDaten }>(),
        // resolveConflictUseServer: emptyProps(),
        // resolveConflictOverrideServer: emptyProps(),
        // resolveConflictAddNewGefaesstyp: emptyProps(),
        openGefaesstypEditor: props<{ uuid: string }>(),
        selectGefaesstypByUuid: props<{ uuid: string }>(),
        neuerGefaesstypInitialized: props<{ neuerGefaesstyp: Gefaesstyp }>(),
        gefaesstypEditorNavigationFailed: emptyProps(),
        editGefaesstypCanceled: props<{ uuid: string }>(),
        addGefaesstyp: props<{ gefaesstyp: Gefaesstyp }>(),
        gefaesstypAdded: props<{ gefaesstyp: Gefaesstyp }>(),
        changeGefaesstyp: props<{ uuid: string; daten: GefaesstypDaten }>(),
        gefaesstypChanged: props<{ gefaesstyp: Gefaesstyp }>(),
        removeGefaesstyp: props<{ uuid: string }>(),
        gefaesstypRemoved: props<{ uuid: string }>(),
        gefaesstypenServerError: props<{ error: GefaesstypError }>(),
        resetGefaesstypenState: emptyProps(),
    },
});
