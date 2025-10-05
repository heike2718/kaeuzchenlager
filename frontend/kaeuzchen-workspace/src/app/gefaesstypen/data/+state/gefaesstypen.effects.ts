import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GefaesstypenHttpService } from '../gefaesstypen-http.service';
import { gefaesstypenActions } from './gefaesstypen.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { GefaesstypenHttpErrorService } from '../gefaesstypen-http-error.service';

@Injectable({
  providedIn: 'root',
})
export class GefaesstypenEffects {
  #actions$ = inject(Actions);
  #httpService = inject(GefaesstypenHttpService);
  #errorService = inject(GefaesstypenHttpErrorService);

  addGefaesstyp$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(gefaesstypenActions.addGefaesstyp),
      switchMap(({ daten }) =>
        this.#httpService.insertGefaesstyp(daten).pipe(
          map(gefaesstyp =>
            gefaesstypenActions.gefaesstypAdded({
              gefaesstyp: gefaesstyp,
            })
          ),
          catchError(error =>
            of(
              gefaesstypenActions.saveError({
                error: this.#errorService.toGefaesstypError(error, daten),
              })
            )
          )
        )
      )
    )
  );

  changeGefaesstyp$ = createEffect(() =>
    this.#actions$.pipe(
      ofType(gefaesstypenActions.changeGefaesstyp),
      switchMap(({ uuid: uuid, daten: daten }) =>
        this.#httpService.updateGefaesstyp(uuid, daten).pipe(
          map(gefaesstyp =>
            gefaesstypenActions.gefaesstypChanged({
              gefaesstyp: gefaesstyp,
            })
          ),
          catchError(error =>
            of(
              gefaesstypenActions.saveError({
                error: this.#errorService.toGefaesstypError(error, daten),
              })
            )
          )
        )
      )
    )
  );
}
