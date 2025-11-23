import { inject, Injectable } from '@angular/core';
import { gefaesstypenActions } from '@gefaesstypen/data';
import { Gefaesstyp } from '@gefaesstypen/model';
import { Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root',
})
export class GefaesstypSelectionService {
    #store = inject(Store);

    checkAndSelectOrRedirect(uuid: string, gefaesstypen: Gefaesstyp[]): void {
        const filtered = gefaesstypen.filter(gt => uuid === gt.uuid);

        if (filtered.length === 0) {
            this.#store.dispatch(gefaesstypenActions.gefaesstypEditorNavigationFailed());
        } else {
            this.#store.dispatch(gefaesstypenActions.selectGefaesstypByUuid({ uuid }));
        }
    }
}
