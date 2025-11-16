import { inject, Injectable } from '@angular/core';
import { fromGefaesstypen, gefaesstypenActions } from '@gefaesstypen/data';
import { createInitialGefaesstyp, Gefaesstyp, GefaesstypConflict } from '@gefaesstypen/model';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, take } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GefaesstypenFacade {
    #store = inject(Store);

    readonly gefaesstypenLoading$: Observable<boolean> = this.#store.select(fromGefaesstypen.selectGefaesstypenLoading);
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

    public selectExistingGefaesstyp(uuid: string): void {
        this.#store.dispatch(gefaesstypenActions.openGefaesstypEditor({ uuid }));
    }

    public initNewGefaesstyp(): void {
        const neuerGefaesstyp: Gefaesstyp = createInitialGefaesstyp();
        this.#store.dispatch(gefaesstypenActions.neuerGefaesstypInitialized({ neuerGefaesstyp }));
        this.#store.dispatch(gefaesstypenActions.openGefaesstypEditor({ uuid: neuerGefaesstyp.uuid }));
    }

    public ensureGefaesstypenLoadedAndSelect(uuid: string) {
        combineLatest([this.gefaesstypenLoaded$, this.gefaesstypenLoading$])
            .pipe(take(1))
            .subscribe(([gefaesstypenLoaded, gefaesstypenLoading]) => {
                if (!gefaesstypenLoaded && !gefaesstypenLoading) {
                    this.#store.dispatch(gefaesstypenActions.loadGefaesstypen());
                }
                this.#store.dispatch(gefaesstypenActions.selectGefaesstypByUuid({ uuid }));
            });
    }
}
