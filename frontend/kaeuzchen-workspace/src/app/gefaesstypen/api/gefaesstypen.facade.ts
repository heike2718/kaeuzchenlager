import { inject, Injectable } from '@angular/core';
import { fromGefaesstypen, gefaesstypenActions } from '@gefaesstypen/data';
import {
    createInitialGefaesstyp,
    Gefaesstyp,
    GefaesstypConflict,
    GefaesstypDaten,
    GefaesstypUniqueKey,
    TEMP_UUID_PREFIX,
} from '@gefaesstypen/model';
import { Store } from '@ngrx/store';
import { combineLatest, filter, Observable, switchMap, take } from 'rxjs';
import { GefaesstypSelectionService } from './gefaesstyp-selection.service';

@Injectable({
    providedIn: 'root',
})
export class GefaesstypenFacade {
    #store = inject(Store);
    #gefaesstypSelectionService = inject(GefaesstypSelectionService);

    readonly #gefaesstypenSignal = this.#store.selectSignal(fromGefaesstypen.selectGefaesstypen);

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

    public initNewGefaesstyp(): void {
        const neuerGefaesstyp: Gefaesstyp = createInitialGefaesstyp();
        this.#store.dispatch(gefaesstypenActions.neuerGefaesstypInitialized({ neuerGefaesstyp }));
        this.#store.dispatch(gefaesstypenActions.openGefaesstypEditor({ uuid: neuerGefaesstyp.uuid }));
    }

    public saveGefaesstyp(gefaesstyp: Gefaesstyp): void {
        if (gefaesstyp.uuid.startsWith(TEMP_UUID_PREFIX)) {
            const theUuid = gefaesstyp.uuid.substring(5, gefaesstyp.uuid.length);
            const theGefaesstyp: Gefaesstyp = {
                ...gefaesstyp,
                uuid: theUuid,
            };
            this.#store.dispatch(gefaesstypenActions.addGefaesstyp({ gefaesstyp: theGefaesstyp }));
        } else {
            this.#store.dispatch(
                gefaesstypenActions.changeGefaesstyp({ uuid: gefaesstyp.uuid, daten: gefaesstyp.daten })
            );
        }
    }

    public cancelEditGefaesstyp(uuid: string): void {
        this.#store.dispatch(gefaesstypenActions.editGefaesstypCanceled({ uuid }));
    }

    public removeGefaesstyp(uuid: string): void {
        this.#store.dispatch(gefaesstypenActions.removeGefaesstyp({ uuid }));
    }

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

    public isGefaesstypNichtEindeutig(gefaesstypUniqueKey: GefaesstypUniqueKey, uuid: string): boolean {
        const alle = this.#gefaesstypenSignal();
        const andere = alle.filter(g => g.uuid !== uuid);

        return andere.some(
            g =>
                this.#normalizeString(g.daten.name) === this.#normalizeString(gefaesstypUniqueKey.name) &&
                g.daten.volumen === gefaesstypUniqueKey.volumen
        );
    }

    #normalizeString(name: string): string {
        return name.trim().replace(/\s+/g, ' ').toLowerCase();
    }
}
