import { inject, computed } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
    signalStore,
    withState,
    withComputed,
    withMethods,
    patchState,
    withProps,
} from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { Gefaesstyp } from './gefaesstypen.model';
import { GefaesstypenHttpService } from './gefaesstypen-http.service';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';

interface GefaesstypenState {
    readonly gefaesstypen: Gefaesstyp[];
    readonly isLoading?: boolean;
}

const initialGefaesseState: GefaesstypenState = {
    gefaesstypen: [],
    isLoading: false,
}

// ohne providedIn: 'root' -> nur für die Komponente, die den Store importiert
export const GefaesstypenStore = signalStore(
    withState<GefaesstypenState>(initialGefaesseState),
    withComputed((store) => ({
        anzahlGefaesstypen: computed(() => store.gefaesstypen().length),
    })),
    withProps((_store) => ({
        _gefaesstypenHttpService: inject(GefaesstypenHttpService),
    })),
    withMethods((store) => ({
        loadGefaesstypen: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                switchMap(() =>
                    store._gefaesstypenHttpService.loadGefaesstypen().pipe(
                        tap((gefaesstypen) => patchState(store, { gefaesstypen, isLoading: false })),
                        catchError((error) => {
                            console.error('Fehler beim Laden der Gefäßtypen', error);
                            patchState(store, { isLoading: false });
                            return of([]);
                        })
                    )
                )
            )
        ),
    })),
    withDevtools('GefaesseStore')
);