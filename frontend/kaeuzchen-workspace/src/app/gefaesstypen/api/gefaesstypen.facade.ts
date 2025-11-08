import { inject, Injectable } from '@angular/core';
import { NavigationService } from '@core/services';
import { fromGefaesstypen, gefaesstypenActions } from '@gefaesstypen/data';
import { Gefaesstyp, GefaesstypConflict } from '@gefaesstypen/model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GefaesstypenFacade {
    #store = inject(Store);
    #navigationService = inject(NavigationService);

    readonly gefaesstypenLoaded$: Observable<boolean> = this.#store.select(fromGefaesstypen.selectGefaesstypenLoaded);
    readonly gefaesstypen$: Observable<Gefaesstyp[]> = this.#store.select(fromGefaesstypen.selectGefaesstypen);

    readonly selectedGefaesstyp$: Observable<Gefaesstyp | null> = this.#store.select(
        fromGefaesstypen.selectSelectedGefasesstyp
    );

    readonly gefaesstypConflict$: Observable<GefaesstypConflict | null> = this.#store.select(
        fromGefaesstypen.selectGefaesstypConflict
    );

    public loadGefaesstypen(): void {
        this.#store.dispatch(gefaesstypenActions.loadGefaesstypen());
    }

    public selectGefaesstyp(gefaesstyp: Gefaesstyp): void {
        const navigateTo = this.#navigationService.getRouteGefaesstypEditor();
        this.#store.dispatch(gefaesstypenActions.selectGefaesstyp({ uuid: gefaesstyp.uuid, navigateTo: navigateTo }));
    }
}
