import { inject, Injectable } from '@angular/core';
import { fromGefaesstypen, gefaesstypenActions } from '@gefaesstypen/data';
import { createInitialGefaesstyp, Gefaesstyp, GefaesstypConflict, GefaesstypDaten } from '@gefaesstypen/model';
import { Store } from '@ngrx/store';
import { combineLatest, filter, Observable, switchMap, take } from 'rxjs';
import { GefaesstypSelectionService } from './gefaesstyp-selection.service';

@Injectable({
    providedIn: 'root',
})
export class GefaesstypenFacade {
    #store = inject(Store);
    #gefaesstypSelectionService = inject(GefaesstypSelectionService);

    readonly gefaesstypenLoading$: Observable<boolean> = this.#store.select(fromGefaesstypen.selectGefaesstypenLoading);
    readonly gefaesstypenLoaded$: Observable<boolean> = this.#store.select(fromGefaesstypen.selectGefaesstypenLoaded);
    readonly gefaesstypen$: Observable<Gefaesstyp[]> = this.#store.select(fromGefaesstypen.selectGefaesstypen);
    readonly nameNichtEindeutig$: Observable<boolean> = this.#store.select(fromGefaesstypen.selectNameNichtEindeutig);
    readonly volumenNichtEindeutig$: Observable<boolean> = this.#store.select(
        fromGefaesstypen.selectVolumenNichtEindeutig
    );

    readonly selectedGefaesstyp$: Observable<Gefaesstyp | null> = this.#store.select(
        fromGefaesstypen.selectSelectedGefasesstyp
    );

    readonly gefaesstypConflict$: Observable<GefaesstypConflict | null> = this.#store.select(
        fromGefaesstypen.selectGefaesstypConflict
    );

    public loadGefaesstypen(): void {
        this.#store.dispatch(gefaesstypenActions.loadGefaesstypen());
    }

    public initNewGefaesstyp(): void {
        const neuerGefaesstyp: Gefaesstyp = createInitialGefaesstyp();
        this.#store.dispatch(gefaesstypenActions.neuerGefaesstypInitialized({ neuerGefaesstyp }));
        this.#store.dispatch(gefaesstypenActions.openGefaesstypEditor({ uuid: neuerGefaesstyp.uuid }));
    }

    // TODO startEditGefaesstyp(uuid: string) (oder gefaesstyp: Gefaesstyp)

    /**
     * stellt sicher, dass die Gefaesstypen geladen sind und selektiert dann den mit der uuid, falls vorhanden.
     */
    public ensureGefaesstypenLoadedAndSelect(uuid: string) {
        combineLatest([this.gefaesstypenLoaded$, this.gefaesstypenLoading$])
            .pipe(take(1))
            .subscribe(([gefaesstypenLoaded, gefaesstypenLoading]) => {
                if (!gefaesstypenLoaded && !gefaesstypenLoading) {
                    this.#store.dispatch(gefaesstypenActions.loadGefaesstypen());
                }

                this.gefaesstypenLoaded$
                    .pipe(
                        filter(v => v),
                        take(1),
                        switchMap(() => this.gefaesstypen$.pipe(take(1)))
                    )
                    .subscribe(gefaesstypen =>
                        this.#gefaesstypSelectionService.checkAndSelectOrRedirect(uuid, gefaesstypen)
                    );
            });
    }

    public pruefGefaesstypEindeutigkeit(gefaesstypDaten: GefaesstypDaten, uuid: string): void {
        this.#store.dispatch(gefaesstypenActions.pruefGefaesstypEindeutigkeit({ gefaesstypDaten, uuid }));
    }
}
