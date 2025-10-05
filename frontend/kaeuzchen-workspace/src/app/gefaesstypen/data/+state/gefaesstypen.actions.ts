import { Gefaesstyp, GefaesstypDaten, GefaesstypError } from '@gefaesstypen/model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const gefaesstypenActions = createActionGroup({
  source: 'gefaesstypen',
  events: {
    loadGefaesstypen: emptyProps(),
    gefaesstypenLoaded: props<{ gefaesstypen: Gefaesstyp[] }>(),
    loadGefaesstypForConflict: props<{ uuid: string; userInput: GefaesstypDaten }>(),
    gefaesstypForConflictLoaded: props<{
      gefaesstypFromServer: Gefaesstyp;
      userInput: GefaesstypDaten;
    }>(),
    conflictDetected: props<{ gefaesstypFromServer: Gefaesstyp; userInput: GefaesstypDaten }>(),
    selectGefaesstyp: props<{ uuid: string; navigateTo: string }>(),
    gefaesstypSelected: props<{ gefaesstyp: Gefaesstyp; navigateTo: string }>(),
    neuerGefaesstypInitialized: props<{ neuerGefaesstyp: Gefaesstyp; navigateTo: string }>(),
    editGefaesstypCanceled: props<{ uuid: string; navigateTo: string }>(),
    addGefaesstyp: props<{ daten: GefaesstypDaten }>(),
    gefaesstypAdded: props<{ gefaesstyp: Gefaesstyp }>(),
    changeGefaesstyp: props<{ uuid: string; daten: GefaesstypDaten }>(),
    gefaesstypChanged: props<{ gefaesstyp: Gefaesstyp }>(),
    removeGefaesstyp: props<{ uuid: string; navigateTo: string }>(),
    gefaesstypRemoved: props<{ uuid: string; navigateTo: string }>(),
    saveError: props<{ error: GefaesstypError }>(),
    resetGefaesstypenState: emptyProps(),
  },
});
